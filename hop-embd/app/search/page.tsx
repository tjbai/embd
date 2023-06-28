import { redirect } from "next/navigation";

const fetchQueryResults = async () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({});
    }, 1000);
  });
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q } = searchParams;
  if (!q) redirect("/");

  const queryResults = await fetchQueryResults();

  return <div>{q}</div>;
}
