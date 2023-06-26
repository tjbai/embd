from datetime import datetime
from typing import Dict, List, Tuple

from annoy import AnnoyIndex
from sentence_transformers import SentenceTransformer, CrossEncoder

from lib.models import DB, Course

MODEL = SentenceTransformer("msmarco-distilbert-base-tas-b")
MODEL.max_seq_length = 256
DB_PATH = "./lib/gen.db"
INDEX_PATH = "./lib/test.ann"

CANDIDATE_POOL_SIZE = 100


def compute_course_embeddings(courses: List[Course]) -> List[List[int]]:
    descriptions = [f"{course.title}\n\n{course.description}" for course in courses]
    print("\n")
    return MODEL.encode(descriptions, show_progress_bar=True).tolist()


def compute_query_embeddings(queries: List[str]) -> List[List[int]]:
    return MODEL.encode(queries).tolist()


def create_hit_map(ids: List[int]) -> Dict[int, Course]:
    str_ids = [str(id) for id in ids]
    with DB(DB_PATH) as db:
        rows = db.execute(
            f"""
            SELECT * 
            FROM Courses
            WHERE id in ({', '.join(str_ids)})
        """
        )

    return {row[0]: Course(*(row[1:-1])) for row in rows}


def semantic_search(prompts: List[str]) -> List[Dict[int, Course]]:
    query_embds = compute_query_embeddings(prompts)
    print(f"\n>>> calculated query embeddings {datetime.now()}")

    u = AnnoyIndex(len(query_embds[0]), "dot")
    u.load(INDEX_PATH)

    hit_maps = []
    for query_embedding in query_embds:
        hits = u.get_nns_by_vector(query_embedding, CANDIDATE_POOL_SIZE)
        hit_maps.append(create_hit_map(hits))

    return hit_maps


# def retrieve(prompts: List[str]) -> List[Tuple[int, Course]]:
#     query_embds = compute_query_embeddings(prompts)
#     print(f"\n>>> calcualted query embeddings {datetime.now()}")

#     u = AnnoyIndex(len(query_embds[0]), "dot")
#     u.load(INDEX_PATH)

#     id_lists = [
#         u.get_nns_by_vector(query_embedding, QUICK_POOL_SIZE)
#         for query_embedding in query_embds
#     ]

#     id_lists_strs = [", ".join(str(num) for num in sublist) for sublist in id_lists]
#     with DB(DB_PATH) as db:
#         rows = db.execute()


def retrieve_rerank(prompts: List[str]) -> List[List[Tuple[int, Course]]]:
    cross_encoder = CrossEncoder("cross-encoder/ms-marco-TinyBERT-L-2")
    semantic_cands: List[Dict[int, Course]] = semantic_search(prompts)
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

    ids, distances = u.get_nns_by_vector(query_embedding, CANDIDATE_POOL_SIZE)
    id_to_dist = {id: dist for id, dist in zip(ids, distances)}

    with DB(DB_PATH) as db:
        res = db.execute(
            f"""
            SELECT *
            FROM Courses
            WHERE id IN ({[str(id) for id in ids]})
        """
        )

    res.sort(key=lambda x: id_to_dist[x[0]])

    return None
