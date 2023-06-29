import { ReactNode } from "react";
import styles from "./styles.module.css";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return <section className={styles.pageWrapper}>{children}</section>;
}
