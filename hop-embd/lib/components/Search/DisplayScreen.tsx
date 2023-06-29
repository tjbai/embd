import styles from "./styles.module.css";

import { SearchResponse } from "@/lib/types";
import QueryItem from "./QueryItem";
import SearchBar from "./SearchBar";
import Factoid from "./Factoid";

export default function DisplayScreen({
  query,
  queryResults,
}: {
  query: string;
  queryResults: SearchResponse;
}) {
  return (
    <section className={styles.pageWrapper}>
      <div className={styles.resultsWrapper}>
        <SearchBar />
        <Factoid queryResults={queryResults} query={query} />
        <ul>
          {queryResults.courses.map((courseWrapper, index) => (
            <QueryItem courseWrapper={courseWrapper} key={courseWrapper.id} />
          ))}
        </ul>
      </div>
    </section>
  );
}
