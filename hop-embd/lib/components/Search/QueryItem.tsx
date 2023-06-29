import { CourseWrapper } from "@/lib/types";
import styles from "./styles.module.css";

export default function QueryItem({
  courseWrapper,
}: {
  courseWrapper: CourseWrapper;
}) {
  return (
    <li className={styles.queryItemWrapper}>
      <text className={styles.courseTitle}>{courseWrapper.course.title}</text>
      <div className={styles.metadataContainer}>
        <text className={styles.metadata}>{courseWrapper.course.credits}</text>
        <div className={styles.bar} />
        <text className={styles.metadata}>{courseWrapper.course.areas}</text>
        <div className={styles.bar} />
        <text className={styles.metadata}>
          {courseWrapper.course.semesters}
        </text>
      </div>
      <div className={styles.descriptionContainer}>
        <text className={styles.description}>
          {courseWrapper.course.description}
        </text>
      </div>
    </li>
  );
}
