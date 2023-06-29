import DisplayScreen from "@/lib/components/Search/DisplayScreen";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:8000";

const fetchQueryResults = async (query: string) => {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  return res.json();
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q } = searchParams;
  if (!q) redirect("/");

  const queryResults = await fetchQueryResults(q as string);

  return <DisplayScreen queryResults={queryResults} />;
}
