import React from "react";

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

const Header = (props) => <h2>{props.course}</h2>;

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      <b>
        total of {parts.reduce((sum, currPart) => sum + currPart.exercises, 0)}{" "}
        exercises
      </b>
    </p>
  );
};

export default Course;
