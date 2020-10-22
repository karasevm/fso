interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescrition extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartWithDescrition {
  name: 'Fundamentals';
}

interface CoursePartTwo extends CoursePartBase {
  name: 'Using props to pass data';
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartWithDescrition {
  name: 'Deeper type usage';
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartWithDescrition {
  name: 'Using Typescript with React';
  groupProjectCount: number;
}

export type CoursePart =
  | CoursePartOne
  | CoursePartTwo
  | CoursePartThree
  | CoursePartFour;
