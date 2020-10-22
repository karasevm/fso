import React from "react";

const Persons = ({ persons, removeHandler }) => {
  return persons.map((person) => (
    <Person
      key={person.name}
      person={person}
      removeHandler={() => {
        removeHandler(person);
      }}
    />
  ));
};

const Person = ({ person, removeHandler }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={removeHandler}>delete</button>
    </div>
  );
};

export default Persons;
