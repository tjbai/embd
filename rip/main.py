import argparse
import json
import pickle
from datetime import datetime
from typing import List
import re

import requests
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

from db import DB
from models import Course, CourseWrapper, Semester
from secret import API_KEY

SCHOOLS = ["Krieger School of Arts and Sciences", "Whiting School of Engineering"]
API_BASE = "https://sis.jhu.edu/api"
THRESHOLD = 10



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
MODEL.max_seq_length = 256


def compute_course_embeddings(courses: List[Course]) -> List[List[int]]:
    descriptions = [f"{course.title}\n\n{course.description}" for course in courses]
    print("\n")
    return MODEL.encode(descriptions, show_progress_bar=True).tolist()


def compute_query_embeddings(queries: List[str]) -> List[List[int]]:
    return MODEL.encode(queries).tolist()


def unpack(courses, embeddings):
    with DB("./gen.db") as db:
        for course, embedding in tqdm(zip(courses, embeddings)):
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
        print(f"\n>>> inserted courses {datetime.now()}\n")


THRESHOLD = 10
def squash():
    with DB('./gen.db') as db:
        db.execute('''DELETE FROM CourseWrappers''')
        db.conn.commit()

        courses = db.execute(
            f'''
            SELECT * FROM Courses
            WHERE LENGTH(description) - LENGTH(REPLACE(description, ' ', '')) + 1 > {THRESHOLD}
            '''
        )

        # sanitize whitespace characters
        sanitized_courses = []
        for c in courses:
            des = c[4]
            des = des.strip()
            des = re.sub(r'\s', ' ', des)
            sanitized_tup = tuple(list(c[:4]) + [des] + list(c[5:]))
            sanitized_courses.append(sanitized_tup)

        courses = sanitized_courses # set anew

        # sort by description, then by year, then by semester
        courses.sort(key=lambda r: (r[4], r[3], -r[2], r[1]))

        # walk the courses, "squashing" similar courses
        course_wrappers: CourseWrapper = []
        for course in courses:
            if (len(course_wrappers) > 0
                and course[4] == course_wrappers[-1].description
                and course[3] == course_wrappers[-1].title
            ):
                course_wrappers[-1].semesters.append(
                    Semester(
                        term=course[1], 
                        yr=course[2]
                    )
                )
            
            else:
                course_wrappers.append(
                        CourseWrapper(
                            semesters=[Semester(term=course[1], yr=course[2])], 
                            title=course[3], 
                            description=course[4],
                            departments=course[5],
                            instructors=course[6],
                            school=course[7],
                            writing_intensive=course[8],
                            credits=course[9],
                            areas=course[10],
                            embedding=course[11]
                        )
                    )

        # insert into CourseWrappers table
        for course_wrapper in course_wrappers:
            db.execute(
                '''
                INSERT INTO CourseWrappers 
                (semesters, title, description, departments,
                instructors, school, writing_intensive,
                credits, areas, embedding)
                VALUES 
                (?,?,?,?,?,?,?,?,?,?)
                ''',
                params=(
                    ', '.join([semester.__str__() for semester in course_wrapper.semesters]),
                    course_wrapper.title,
                    course_wrapper.description,
                    course_wrapper.departments,
                    course_wrapper.instructors,
                    course_wrapper.school,
                    course_wrapper.writing_intensive,
                    course_wrapper.credits,
                    course_wrapper.areas,
                    course_wrapper.embedding
                )
            )

        print(f'\n>>> Inserted {len(course_wrappers)} rows')



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--term", '-t')
    parser.add_argument("--year", '-y')
    parser.add_argument("--limit", default=None)
    parser.add_argument("--load", action="store_true")
    parser.add_argument('--embd', action='store_true')
    parser.add_argument('--squash', action='store_true')
    args = parser.parse_args()

    if args.squash: 
        squash()
        exit(0)

    if args.embd:
        with open(f'pickles/{args.term}_{args.year}.pkl', 'rb') as fin:
            courses = pickle.load(fin)

            embeddings = compute_course_embeddings(courses)
            print(f"\n>>> computed embeddings {datetime.now()}")
            with open(f"pickles/{args.term}_{args.year}_embd.pkl", "wb") as fout:
                pickle.dump(embeddings, fout)
        exit(0)

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

    if args.year and args.term:
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
