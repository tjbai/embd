import json
from datetime import datetime
from typing import List, Dict
import argparse

from annoy import AnnoyIndex
from sentence_transformers import CrossEncoder
from tqdm import tqdm

from db import DB
from main import compute_query_embeddings, Course

INDEX_TREES = 100
THRESHOLD = 10


def gen_index(file_name: str):
    with DB("./gen.db") as db:
        rows = db.execute(
            f"""
        SELECT id, embedding FROM Courses 
        WHERE LENGTH(description) - LENGTH(REPLACE(description, ' ', '')) + 1 > {THRESHOLD}
        """
        )

        embeddings = [json.loads(r[1]) for r in rows]
        ids = [int(r[0]) for r in rows]

        t = AnnoyIndex(len(embeddings[0]), "dot")
        for id, embedding in tqdm(zip(ids, embeddings)):
            t.add_item(id, embedding)
        print(f"\n>>> added all items {datetime.now()}")

        build_start_t = datetime.now()
        t.build(INDEX_TREES)
        built_end_t = datetime.now()
        print(
            f">>> built index with {INDEX_TREES}"
            f" trees in {built_end_t - build_start_t}"
        )

        t.save(f"{file_name}.ann")


def create_hit_map(ids: List[int]) -> Dict[int, Course]:
    str_ids = [str(id) for id in ids]
    with DB("../gen.db") as db:
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
    u.load("test.ann")

    hit_maps = []
    for query_embedding in query_embds:
        hits = u.get_nns_by_vector(query_embedding, 100)
        hit_maps.append(create_hit_map(hits))

    return hit_maps


def lexical_search(prompts: List[str]):
    pass


def retrieve_rerank(prompts: List[str]):
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


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("fname")
    args = parser.parse_args()
    gen_index(args.fname)
