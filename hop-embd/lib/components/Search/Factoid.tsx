import { SearchResponse } from "@/lib/types";
import styles from "./styles.module.css";

export default function Factoid({
  query,
  queryResults,
}: {
  query: string;
  queryResults: SearchResponse;
}) {
  return (
    <div className={styles.factoidWrapper}>
      <text
        className={styles.factoid}
      >{`Fetched ${queryResults.courses.length} courses in ${queryResults.time} seconds for "${query}"`}</text>
    </div>
  );
}
