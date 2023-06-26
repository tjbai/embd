import argparse
import json
import pickle
from dataclasses import dataclass
from datetime import datetime
from typing import List

import requests
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

from db import DB
from secret import API_KEY

SCHOOLS = ["Krieger School of Arts and Sciences", "Whiting School of Engineering"]
API_BASE = "https://sis.jhu.edu/api"


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


def rip(term: str, yr: int, limit: int = None) -> List[Course]:
    print(f"Initiated rip for {term} {yr}")
    courses = []
    for school in SCHOOLS:
        all_course_response = requests.get(
            f"{API_BASE}/classes/{school}/{term} {yr}/?key={API_KEY}"
        )

        if all_course_response.status_code != 200:
            print(f"Error: {term} {yr}")
            exit(1)

        course_dict = {
            course["Title"]: f"{course['OfferingName']}.{course['SectionName']}"
            for course in json.loads(all_course_response.content)
        }

        for course_title in tqdm(course_dict):
            course_response = requests.get(
                f"{API_BASE}/classes/{''.join(course_dict[course_title].split('.'))}/"
                f"{term} {yr}/?key={API_KEY}"
            )

            if (
                course_response.status_code != 200
                or len(json.loads(course_response.content)) == 0
            ):
                print(f"Error: {course_title} in {term} {yr}")
                exit(1)

            course = json.loads(course_response.content)[0]
            section_details = course["SectionDetails"][0]

            courses.append(
                Course(
                    term=term,
                    yr=yr,
                    title=course_title,
                    areas=course["Areas"],
                    instructors=course["Instructors"],
                    school=course["CoursePrefix"],
                    writing_intensive=course["IsWritingIntensive"],
                    credits=section_details["Credits"],
                    description=section_details["Description"],
                    departments=section_details["Departments"],
                )
            )

            if limit is not None and len(courses) == limit:
                return courses

    return courses


MODEL = SentenceTransformer("msmarco-distilbert-base-tas-b")
MODEL.max_seq_length = 200


def compute_course_embeddings(courses: List[Course]) -> List[List[int]]:
    descriptions = [f"{course.title}\n\n{course.description}" for course in courses]
    return MODEL.encode(descriptions).tolist()


def compute_query_embeddings(queries: List[str]) -> List[List[int]]:
    return MODEL.encode(queries).tolist()


def unpack(courses, embeddings):
    with DB("../gen.db") as db:
        for course, embedding in zip(courses, embeddings):
            db.execute(
                """
                INSERT INTO Courses
                    (term, year, title, description, departments, instructors, 
                    school, writing_intensive, credits, areas, embedding)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                params=(
                    course.term,
                    course.yr,
                    course.title,
                    course.description,
                    course.departments,
                    course.instructors,
                    course.school,
                    course.writing_intensive,
                    course.credits,
                    course.areas,
                    json.dumps(list(embedding)),
                ),
            )
        print(f"\n>>> inserted courses {datetime.now()}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("term")
    parser.add_argument("year")
    parser.add_argument("--limit", default=None)
    parser.add_argument("--load", action="store_true")
    args = parser.parse_args()

    if args.load:
        course_fin = open(f"pickles/{args.term}_{args.year}.pkl", "rb")
        embd_fin = open(f"pickles/{args.term}_{args.year}_embd.pkl", "rb")

        courses = pickle.load(course_fin)
        embeddings = pickle.load(embd_fin)
        assert len(courses) == len(embeddings)

        unpack(courses, embeddings)

        course_fin.close()
        embd_fin.close()
        exit(0)

    courses = rip(
        args.term, args.year, limit=int(args.limit) if args.limit is not None else None
    )
    print(f"\n>>> pulled all courses {datetime.now()}")
    with open(f"pickles/{args.term}_{args.year}.pkl", "wb") as fout:
        pickle.dump(courses, fout)

    embeddings = compute_course_embeddings(courses)
    print(f"\n>>> computed embeddings {datetime.now()}")
    with open(f"pickles/{args.term}_{args.year}_embd.pkl", "wb") as fout:
        pickle.dump(embeddings, fout)


if __name__ == "__main__":
    main()
