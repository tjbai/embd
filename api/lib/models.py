from dataclasses import dataclass
import sqlite3


@dataclass
class Course:
    term: str = None
    yr: int = None
    title: str = None
    description: str = None
    departments: str = None
    instructors: str = None
    school: str = None
    writing_intensive: bool = None
    credits: str = None
    areas: str = None


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
