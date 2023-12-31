import json
from datetime import datetime
from typing import Dict, List, Tuple, Union

import numpy as np
from annoy import AnnoyIndex
from sentence_transformers import CrossEncoder, SentenceTransformer

from lib.models import DB, Course, CourseWrapper

MODEL = SentenceTransformer("msmarco-distilbert-base-tas-b")
MODEL.max_seq_length = 256
DB_PATH = "./lib/gen.db"
INDEX_PATH = "./lib/v7_squashed.ann"

CANDIDATE_POOL_SIZE = 100
QUICK_SEARCH_POOL_SIZE = 20


def compute_course_embeddings(courses: List[Course]) -> List[List[int]]:
    descriptions = [f"{course.title}\n\n{course.description}" for course in courses]
    print("\n")
    return MODEL.encode(descriptions, show_progress_bar=True).tolist()


def compute_query_embeddings(queries: List[str]) -> List[List[int]]:
    return MODEL.encode(queries).tolist()


def create_hit_map(ids: List[int]) -> Dict[int, CourseWrapper]:
    str_ids = [str(id) for id in ids]
    with DB(DB_PATH) as db:
        rows = db.execute(
            f"""
            SELECT * 
            FROM CourseWrappers
            WHERE id in ({', '.join(str_ids)})
        """
        )

    return {row[0]: CourseWrapper(*(row[1:-1])) for row in rows}


def semantic_search(
    prompts: List[str], start: int = None, end: int = None
) -> List[Dict[int, CourseWrapper]]:
    query_embds = compute_query_embeddings(prompts)
    print(f"\n>>> calculated query embeddings {datetime.now()}")

    hit_maps = []

    # very slow
    if start and end:
        matching_semesters = {
            f"{term} {yr}"
            for term in ["Fall", "Intersession", "Spring"]
            for yr in range(start, end + 1)
        }

        with DB(DB_PATH) as db:
            courses = db.execute("""SELECT * FROM CourseWrappers""")

        matching_courses = []
        matching_embeddings = []
        for course in courses:
            terms = course[1].split(", ")
            for t in terms:
                if t in matching_semesters:
                    matching_courses.append((course[0], CourseWrapper(*course[1:-1])))
                    matching_embeddings.append(np.array(json.loads(course[-1])))

        np_matching_embeddings = np.array(matching_embeddings)
        for query_embedding in query_embds:
            np_query_embedding = np.array(query_embedding)
            inner_products = np.dot(np_matching_embeddings, np_query_embedding)
            closest_indices = np.argsort(inner_products)[-100:]
            hit_maps.append(
                {
                    matching_courses[index][0]: matching_courses[index][1]
                    for index in closest_indices
                }
            )

    else:
        u = AnnoyIndex(len(query_embds[0]), "dot")
        u.load(INDEX_PATH)

        for query_embedding in query_embds:
            hits = u.get_nns_by_vector(query_embedding, CANDIDATE_POOL_SIZE)
            hit_maps.append(create_hit_map(hits))

    return hit_maps


def retrieve_rerank(
    prompts: List[str], start: int = None, end: int = None
) -> List[List[Tuple[int, CourseWrapper]]]:
    cross_encoder = CrossEncoder("cross-encoder/ms-marco-TinyBERT-L-2")
    semantic_cands: List[Dict[int, CourseWrapper]] = semantic_search(
        prompts, start=start, end=end
    )
    print(f"\n>>> retrieved hits {datetime.now()}")

    res = []
    for prompt, cand_map in zip(prompts, semantic_cands):
        cross_input = [(prompt, cand_map[id].description) for id in cand_map]
        cross_scores = cross_encoder.predict(cross_input)

        hits_with_scores = [
            (score, id, cand_map[id]) for score, id in zip(cross_scores, cand_map)
        ]
        res.append(sorted(hits_with_scores, reverse=True))

    print(f"\n>>> cross evaluated hits {datetime.now()}")
    return [[(tup[1], tup[2]) for tup in hit_list] for hit_list in res]


def quick_retrieve(prompt: str) -> List[Tuple[int, Course]]:
    query_embedding = compute_query_embeddings([prompt])[0]

    u = AnnoyIndex(len(query_embedding), "dot")
    u.load(INDEX_PATH)

    ids, distances = u.get_nns_by_vector(
        query_embedding, QUICK_SEARCH_POOL_SIZE, include_distances=True
    )
    id_to_dist = {id: dist for id, dist in zip(ids, distances)}

    with DB(DB_PATH) as db:
        res = db.execute(
            f"""
            SELECT *
            FROM Courses
            WHERE id IN ({', '.join([str(id) for id in ids])})
        """
        )

    res.sort(key=lambda x: id_to_dist[x[0]])
    return [(tup[0], Course(*tup[1:-1])) for tup in res]


def fetch_courses(ids: List[str]) -> Union[List[Course], None]:
    with DB(DB_PATH) as db:
        res = db.execute(
            f"""
            SELECT *
            FROM CourseWrappers
            WHERE id in ({', '.join(ids)})
            """
        )

        if len(res) == 0:
            return None

        return [CourseWrapper(*tup[1:-1]) for tup in res]
