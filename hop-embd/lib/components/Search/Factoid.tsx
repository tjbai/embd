import { SearchResponse } from "@/lib/types";
import styles from "./styles.module.css";

export default function Factoid({
  query,
  start,
  end,
  queryResults,
}: {
  query: string;
  start?: string;
  end?: string;
  queryResults: SearchResponse;
}) {
  if (start && end) {
    return (
      <div className={styles.factoidWrapper}>
        <text className={styles.factoid}>
          {`Fetched ${queryResults.courses.length} courses between ${start} and ${end}` +
            ` in ${queryResults.time} seconds"`}
        </text>
      </div>
    );
  }

  return (
    <div className={styles.factoidWrapper}>
      <text className={styles.factoid}>
        {`Fetched ${queryResults.courses.length} courses` +
          ` in ${queryResults.time} seconds"`}
      </text>
    </div>
  );
}
