import React from 'react';
import { CoursePart } from '../types';

interface PartProps {
  course: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part: React.FC<PartProps> = props => {
  switch (props.course.name) {
    case 'Fundamentals':
      return (
        <p>
          {props.course.name} {props.course.description}{' '}
          {props.course.exerciseCount}
        </p>
      );
    case 'Using props to pass data':
      return (
        <p>
          {props.course.name} {props.course.exerciseCount}{' '}
          {props.course.groupProjectCount}
        </p>
      );
    case 'Deeper type usage':
      return (
        <p>
          {props.course.name} {props.course.description}{' '}
          {props.course.exerciseCount}{' '}
          <a href={props.course.exerciseSubmissionLink}>
            {props.course.exerciseSubmissionLink}
          </a>
        </p>
      );
    case 'Using Typescript with React':
      return (
        <p>
          {props.course.name} {props.course.description}{' '}
          {props.course.exerciseCount} {props.course.groupProjectCount}
        </p>
      );
    default:
      return assertNever(props.course);
  }
};

export default Part;
