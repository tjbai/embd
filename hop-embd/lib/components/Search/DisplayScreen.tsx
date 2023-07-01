import styles from "./styles.module.css";

import { SearchResponse } from "@/lib/types";
import Factoid from "./Factoid";
import QueryItem from "./QueryItem";
import SearchBar from "./SearchBar";

export default function DisplayScreen({
  query,
  start,
  end,
  queryResults,
}: {
  query: string;
  start: string | undefined;
  end: string | undefined;
  queryResults: SearchResponse;
}) {
  return (
    <section className={styles.pageWrapper}>
      <SearchBar />
      <section className={styles.resultsWrapper}>
        <Factoid
          queryResults={queryResults}
          query={query}
          start={start}
          end={end}
        />
        <ul>
          {queryResults.courses.map((courseWrapper, index) => (
            <QueryItem courseWrapper={courseWrapper} key={courseWrapper.id} />
          ))}
        </ul>
      </section>
    </section>
  );
}
