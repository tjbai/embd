from datetime import datetime

from fastapi import FastAPI

from lib.compute import retrieve_rerank, quick_retrieve

app = FastAPI()


@app.get("/test/")
def read_root():
    return {
        "Field1": "Test",
        "Field2": ["1", "2", "3"],
        "Field3": {"Sub1": "a", "Sub2": "b"},
    }


@app.get("/search/")
def search(q: str = None):
    if q is None:
        return {"Error": "Query not provided"}

    start_t = datetime.now()
    courses = retrieve_rerank([q])[0]
    end_t = datetime.now()

    return {"Time": end_t - start_t, "Courses": courses}


@app.get("/quick-search/")
def quick_search(q: str = None):
    if q is None:
        return {"Error": "Query not provided"}

    start_t = datetime.now()
    courses = quick_retrieve(q)
    end_t = datetime.now()

    return {"Time": end_t - start_t, "Courses": courses}
