import { Course } from "@/lib/types";
import PageWrapper from "../Common/PageWrapper";
import ResultsWrapper from "../Common/ResultsWrapper";
import styles from "./styles.module.css";

export default function Course({ course }: { course: Course }) {
  return (
    <PageWrapper>
      <ResultsWrapper>
        <div className={styles.courseWrapper}>
          <text className={styles.title}>{course.title}</text>
          <text className={styles.metadata}>
            <b>Departments:</b> {course.departments}
          </text>
          <text className={styles.metadata}>
            <b>Offered:</b> {course.semesters}
          </text>
          <text className={styles.metadata}>
            <b>Credits:</b> {course.credits}
          </text>
          <text className={styles.metadata}>
            <b>Areas:</b> {course.areas}
          </text>
          <text className={styles.metadata}>
            <b>Writing Intensive: </b> {course.writing_intensive}
          </text>
          <section className={styles.description}>
            <i>{`"${course.description}"`}</i>
          </section>
        </div>
      </ResultsWrapper>
    </PageWrapper>
  );
}
