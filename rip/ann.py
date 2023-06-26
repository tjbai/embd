import json
from datetime import datetime
from typing import List, Dict

from annoy import AnnoyIndex
from sentence_transformers import CrossEncoder
from tqdm import tqdm

from db import DB
from main import compute_query_embeddings, Course

INDEX_TREES = 10


def gen_index():
    with DB("../gen.db") as db:
        rows = db.execute(
            """
        SELECT id, embedding FROM Courses 
        """
        )

        embeddings = [json.loads(r[1]) for r in rows]
        indices = [int(r[0]) for r in rows]

        t = AnnoyIndex(len(embeddings[0]), "dot")
        for index, embedding in tqdm(zip(indices, embeddings)):
            t.add_item(index, embedding)

        print(f"\n>>> built index {datetime.now()}")

        t.build(INDEX_TREES)
        t.save("test.ann")


def pull(ids: List[int]) -> Dict[int, Course]:
    str_ids = [str(id) for id in ids]
    with DB("../gen.db") as db:
        rows = db.execute(
            f"""
            SELECT * 
            FROM Courses
            WHERE id in ({', '.join(str_ids)})
        """
        )

    assert len(rows) == len(ids)
    return {row[0]: Course(description=row[4]) for row in rows}


def semantic_search(prompts: List[str]) -> List[Dict[int, Course]]:
    query_embds = compute_query_embeddings(prompts)
    print(f"\n>>> calculated query embeddings {datetime.now()}")

    u = AnnoyIndex(len(query_embds[0]), "dot")
    u.load("test.ann")

    hit_maps = []
    for query_embedding in query_embds:
        hits = u.get_nns_by_vector(query_embedding, 100)
        hit_maps.append(pull(hits))
    return hit_maps


def lexical_search(prompts: List[str]):
    pass


def retrieve_rerank(prompts: List[str]):
    cross_encoder = CrossEncoder("cross-encoder/ms-marco-TinyBERT-L-2")
    hit_maps: List[Dict[int, Course]] = semantic_search(prompts)

    for prompt, hit_map in zip(prompts, hit_maps):
        cross_input = [(prompt, hit_map[id].description) for id in hit_map]
        cross_scores = cross_encoder.predict(cross_input)

        # todo:
        return None


if __name__ == "__main__":
    prompts = [
        "What is a good course on modern feminism, the suffrage movement, and underrepresented minorities?",
        "Feminism, suffrage, minorities, marginalization, history, literature",
        "Show me courses on feminism and suffrage",
    ]

    retrieve_rerank(prompts=prompts)
