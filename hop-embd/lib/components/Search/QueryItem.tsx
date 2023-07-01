import { CourseWrapper } from "@/lib/types";
import Link from "next/link";
import styles from "./styles.module.css";

export default function QueryItem({
  courseWrapper,
}: {
  courseWrapper: CourseWrapper;
}) {
  return (
    <Link href={`/course/${courseWrapper.id}`}>
      <li className={styles.queryItemWrapper}>
        <text className={styles.courseTitle}>{courseWrapper.course.title}</text>
        <div className={styles.metadataContainer}>
          <text className={styles.creditsMetadata}>
            {courseWrapper.course.credits}
          </text>
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
    </Link>
  );
}
