import { SearchResponse } from "@/lib/types";

export default function DisplayScreen({
  queryResults,
}: {
  queryResults: SearchResponse;
}) {
  return (
    <h1 className="text-3xl font-bold underline">
      {JSON.stringify(queryResults)}
    </h1>
  );
}
