from fastapi import FastAPI

app = FastAPI()


@app.get("/test")
def read_root():
    return {
        "Field1": "Test",
        "Field2": ["1", "2", "3"],
        "Field3": {"Sub1": "a", "Sub2": "b"},
    }
