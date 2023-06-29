import Course from "@/lib/components/Course";
import { CoursesResponse } from "@/lib/types";

const fetchCourse = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/course?ids=${id}`);
  const { courses } = (await res.json()) as CoursesResponse;
  return courses[0];
};

export default async function Page({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await fetchCourse(params.courseId);

  return <Course course={course} />;
}
