from dataclasses import dataclass
from typing import List


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
class Semester:
    term: str
    yr: int

    def __str__(self):
        return f"{self.term} {self.yr}"


@dataclass
class CourseWrapper:
    semesters: List[Semester]
    title: str
    description: str
    departments: str
    instructors: str
    school: str
    writing_intensive: bool
    credits: str
    areas: str
    embedding: str
