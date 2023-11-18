import json

import matplotlib.pyplot as plt
import mplcursors
import numpy as np
from sklearn.manifold import TSNE
from tqdm import tqdm

from db import DB
from models import CourseWrapper

with DB("./gen.db") as db:
    rows = db.execute("""SELECT * FROM CourseWrappers""")

course_wrappers = [CourseWrapper(*tup[1:]) for tup in rows]
embeddings = np.array([json.loads(tup[-1]) for tup in rows])
print("\n>>> pulled stuff")

tsne = TSNE(
    n_components=2,
    learning_rate="auto",
    init="random",
    perplexity=3,
    early_exaggeration=30,
)
embeddings_2d = tsne.fit_transform(embeddings)
print("\n>>> calculated 2d embeddings")


def deps_from_string(s: str):
    deps = []

    def is_breakpoint(i: int) -> bool:
        things = {"EN", "AS", "ME", "MI"}
        return s[i : i + 2] in things

    l, r = 0, 0
    while l < len(s):
        if is_breakpoint(l):
            r = l + 1
            while r < len(s) and not is_breakpoint(r):
                r += 1
            if r == len(s):
                deps.append(s[l:r])
            else:
                deps.append(s[l : r - 2])
            l = r

        else:
            l += 1

    assert l == r == len(s)
    return deps


dep_to_course = {}
dep_to_embd = {}
for i, course in enumerate(course_wrappers):
    deps = deps_from_string(course.departments)
    for d in deps:
        if d not in dep_to_course:
            dep_to_course[d] = []
            dep_to_embd[d] = []
        dep_to_course[d].append(course)
        dep_to_embd[d].append(embeddings_2d[i])
print("\n>>> broke things up by department")

fig, ax = plt.subplots(figsize=(10, 6))

scatter_plots = []
for department in tqdm(dep_to_embd):
    points = dep_to_embd[department]
    x_points = [p[0] for p in points]
    y_points = [p[1] for p in points]

    scatter = ax.scatter(x_points, y_points, label=department, s=1)
    scatter_plots.append(scatter)

    # center_x = sum(x_points) / len(x_points)
    # center_y = sum(y_points) / len(y_points)

    # r = max(max([abs(p[0] - center_x), abs(p[1] - center_y)]) for p in points)
    # circle = Circle((center_x, center_y), radius=r, facecolor="none")
    # ax.add_patch(circle)
print("\n>>> plotted ts")

cursor = mplcursors.cursor(scatter_plots, hover=True)

plt.title("t-SNE visualization by department")
plt.show()
