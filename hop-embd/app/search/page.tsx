import DisplayScreen from "@/lib/components/Search/DisplayScreen";
import LoadingScreen from "@/lib/components/Search/LoadingScreen";
import { redirect } from "next/navigation";
import { isArray } from "util";

const fetchQueryResults = async (
  query: string,
  start: string | undefined,
  end: string | undefined
) => {
  let res;
  if (start && end) {
    res = await fetch(
      `${process.env.API_URL}/search?q=${query}&s=${start}&e=${end}`
    );
  } else {
    res = await fetch(`${process.env.API_URL}/search?q=${query}`);
  }
  return res.json();
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q, s, e } = searchParams;
  if (!q || isArray(q) || isArray(s) || isArray(e)) redirect("/");

  const queryResults = await fetchQueryResults(q as string, s, e);

  return (
    <DisplayScreen
      queryResults={queryResults}
      query={q}
      start={s as string}
      end={e as string}
    />
  );
}
