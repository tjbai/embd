from dataclasses import dataclass
import sqlite3


@dataclass
class Course:
    term: str
    yr: int
    title: str
    description: str
    departments: str
    instructors: str
    school: str
    writing_intensive: bool
    credits: str
    areas: str


@dataclass
class CourseWrapper:
    semesters: str
    title: str
    description: str
    departments: str
    instructors: str
    school: str
    writing_intensive: bool
    credits: str
    areas: str

@dataclass 
class CourseQuery:
    id: str


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
