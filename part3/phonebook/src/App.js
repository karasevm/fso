import React, { useState, useEffect } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setNewSearchTerm] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(null);
  useEffect(() => {
    personService
      .getAll()
      .then((receivedPersons) => setPersons(receivedPersons));
  }, []);

  const showMessage = (message, success) => {
    setNotificationMessage(message);
    setNotificationSuccess(success);
    setTimeout(() => {
      setNotificationMessage(null);
      setNotificationSuccess(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();
    console.log(persons.map((person) => person.name));
    const oldPerson = persons.find((person) => person.name === newName);

    if (oldPerson) {
      //Update existing entry
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const newPerson = { ...oldPerson, number: newNumber };
        personService
          .update(newPerson.id, newPerson)
          .then((receivedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== newPerson.id ? person : receivedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            if (error.response.status === 404) {
              showMessage(
                `Information of ${newPerson.name} has already been removed from server`,
                false
              );
              setPersons(
                persons.filter((person) => person.id !== newPerson.id)
              );
            } else {
              showMessage(error.response.data.error, false);
            }
          });
      }
    } else {
      //Add new entry
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personService
        .create(newPerson)
        .then((receivedPerson) => {
          setPersons(persons.concat(receivedPerson));
          showMessage(`Added ${receivedPerson.name}`, true);
        })
        .catch((error) => {
          showMessage(error.response.data.error, false);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setNewSearchTerm(event.target.value);
  };

  const removePersonFromList = (personToRemove) => {
    if (window.confirm(`Delete ${personToRemove.name}?`))
      personService
        .remove(personToRemove.id)
        .then((receivedData) =>
          setPersons(
            persons.filter((person) => person.id !== personToRemove.id)
          )
        );
  };
  const personsToDisplay =
    searchTerm === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        success={notificationSuccess}
      />
      <Filter filterValue={searchTerm} changeHandler={handleSearchTermChange} />
      <h3>Add a new</h3>
      <PersonForm
        submitHandler={addPerson}
        nameChangeHandler={handleNameChange}
        numberChangeHandler={handleNumberChange}
        nameValue={newName}
        numberValue={newNumber}
      />
      <h3>Numbers</h3>
      <Persons
        persons={personsToDisplay}
        removeHandler={removePersonFromList}
      />
    </div>
  );
};

export default App;
