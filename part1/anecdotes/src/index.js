import React, { useState } from "react";
import ReactDOM from "react-dom";

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(
    new Array(props.anecdotes.length).fill(0)
  );
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{props.anecdotes[selected]}</div>
      <div>Has {points[selected]} votes</div>
      <div>
        <Button
          text="vote"
          handleClick={() => {
            const copy = [...points];
            copy[selected] += 1;
            setPoints(copy);
          }}
        />
        <Button
          text="next anecdote"
          handleClick={() =>
            setSelected(Math.floor(Math.random() * props.anecdotes.length))
          }
        />
        <h1>Anecdote with most votes</h1>
        <div>{props.anecdotes[indexOfMax(points)]}</div>
        <div>Has {points[indexOfMax(points)]} votes</div>
      </div>
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
