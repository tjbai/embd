import sqlite3


class DB:
    def __init__(self, db_file):
        self.db_file = db_file
        self.conn = sqlite3.connect(self.db_file)
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.conn.commit()
        self.conn.close()

    def execute(self, sql, params=()):
        self.cursor.execute(sql, params)
        return self.cursor.fetchall()

    def reset(self):
        self.execute("""DROP TABLE Courses""")
        self.execute("""DROP TABLE CourseWrappers""")


if __name__ == "__main__":
    with DB("./gen.db") as db:
        db.execute(
            """
        CREATE TABLE Courses (
            id INTEGER PRIMARY KEY,
            term TEXT,
            year INTEGER,
            title TEXT,
            description TEXT,
            departments TEXT,
            instructors TEXT,
            school TEXT,
            writing_intensive BOOLEAN,
            credits TEXT,
            areas TEXT,
            embedding TEXT
        )
            """
        )

        db.execute(
            """
        CREATE TABLE CourseWrappers (
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
        )
            """
        )
