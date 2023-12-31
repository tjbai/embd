import { ReactNode } from "react";
import styles from "./styles.module.css";

export default function QuestionAnswer({
  question,
  answer,
}: {
  question: string;
  answer: string | ReactNode;
}) {
  return (
    <section className={styles.wrapper}>
      <text className={styles.question}>{question}</text>
      <text className={styles.answer}>{answer}</text>
    </section>
  );
}
