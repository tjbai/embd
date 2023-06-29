from datetime import datetime
from typing import List, Union
from typing_extensions import Annotated

from fastapi import FastAPI, Query

from lib.compute import fetch_courses, quick_retrieve, retrieve_rerank

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

    return {
        "time": end_t - start_t,
        "courses": [{"id": tup[0], "course": tup[1]} for tup in courses],
    }


@app.get("/quick-search/")
def quick_search(q: str = None):
    if q is None:
        return {"Error": "Query not provided"}

    start_t = datetime.now()
    courses = quick_retrieve(q)
    end_t = datetime.now()

    return {
        "time": end_t - start_t,
        "courses": [{"id": tup[0], "course": tup[1]} for tup in courses],
    }


@app.get("/course")
def course(ids: Annotated[Union[List[str], None], Query()] = None):
    print(ids)

    if ids is None:
        return {"Error": "IDs not provided"}

    courses = fetch_courses(ids)
    return {"courses": courses}
