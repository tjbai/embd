from annoy import AnnoyIndex
from main import compute_query_embeddings
from tqdm import tqdm
from db import DB
import json

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

        t.build(INDEX_TREES)
        t.save("test.ann")


def test_index():
    sentences = [
        "I want to learn about history and Johns Hopkins and literature",
        "I want to learn about mathematics and engineering",
    ]
    query_embds = compute_query_embeddings(sentences)
    exit(1)
    u = AnnoyIndex(len(query_embds[0]), "dot")
    u.load("test.ann")

    for query in query_embds:
        print(query)
        continue
        print(u.get_nns_by_vector(query))


if __name__ == "__main__":
    # gen_index()
    test_index()
