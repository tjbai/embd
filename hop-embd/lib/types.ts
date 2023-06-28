export interface Course {
  term: string;
  year: number;
  title: string;
  description: string;
  departments: string;
  instructors: string;
  school: string;
  writing_intensive: boolean;
  credits: string;
  areas: string;
}

export interface CourseWrapper {
  id: number;
  course: Course;
}

export interface SearchResponse {
  time: number;
  courses: CourseWrapper[];
}
