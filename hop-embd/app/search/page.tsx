import DisplayScreen from "@/lib/components/Search/DisplayScreen";
import { redirect } from "next/navigation";
import { isArray } from "util";

const fetchQueryResults = async (query: string) => {
  const res = await fetch(`${process.env.API_URL}/search?q=${query}`);
  return res.json();
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q } = searchParams;
  if (!q || isArray(q)) redirect("/");

  const queryResults = await fetchQueryResults(q as string);

  return <DisplayScreen queryResults={queryResults} query={q} />;
}
