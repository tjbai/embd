import { ReactNode } from "react";
import styles from "./styles.module.css";

export default function ResultsWrapper({ children }: { children: ReactNode }) {
  return <div className={styles.resultsWrapper}>{children}</div>;
}
