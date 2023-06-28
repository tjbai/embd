import { redirect } from "next/navigation";
import axios from "axios";
import { SearchResponse } from "@/lib/types";

const API_URL = "http://localhost:8000";

const fetchQueryResults = async (query: string) => {
  const { data } = await axios.get(`${API_URL}/search?q=${query}`);
  return data as SearchResponse;
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q } = searchParams;
  if (!q) redirect("/");

  const queryResults = await fetchQueryResults(q as string);

  return (
    <div>
      <ul>
        {queryResults.courses.map((courseWrapper, i) => (
          <li key={courseWrapper.id}>
            <div>{i + courseWrapper.course.title}</div>
            <div style={{ marginBottom: "20px" }}>
              {courseWrapper.course.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
