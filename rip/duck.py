import duckdb
from db import DB
from models import CourseWrapper

ORIGIN_PATH = "./data/gen.db"
DEST_PATH = "./data/duck.db"


def migrate():
    with DB(ORIGIN_PATH) as db:
        res = db.execute("""SELECT * FROM CourseWrappers""")
        courses = [CourseWrapper(*tup[1:]) for tup in res]

    con = duckdb.connect(DEST_PATH)
    con.sql(
        """CREATE TABLE CourseWrappers (
            id INTEGER PRIMARY KEY,
            semesters TEXT,
            title TEXT,
            description TEXT,
            departments TEXT,
            instructors TEXT,
            school TEXT,
            writing_intensive BOOLEAN,
            credits TEXT,
            areas TEXT,
            embedding TEXT
        )"""
    )

    for course in courses:
        con.sql('''
        
        ''')


if __name__ == "__main__":
    migrate()
