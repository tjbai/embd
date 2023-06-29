import { SearchResponse } from "@/lib/types";
import PageWrapper from "../Common/PageWrapper";
import ResultsWrapper from "../Common/ResultsWrapper";
import Factoid from "./Factoid";
import QueryItem from "./QueryItem";
import SearchBar from "./SearchBar";

export default function DisplayScreen({
  query,
  queryResults,
}: {
  query: string;
  queryResults: SearchResponse;
}) {
  return (
    <PageWrapper>
      <SearchBar />
      <ResultsWrapper>
        <Factoid queryResults={queryResults} query={query} />
        <ul>
          {queryResults.courses.map((courseWrapper, index) => (
            <QueryItem courseWrapper={courseWrapper} key={courseWrapper.id} />
          ))}
        </ul>
      </ResultsWrapper>
    </PageWrapper>
  );
}
