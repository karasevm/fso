import React, { useState } from "react";
import ReactDOM from "react-dom";

const Header = (props) => <h1>{props.text}</h1>;

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);
const Statistics = (props) => {
  let amountAll = props.amountGood + props.amountNeutral + props.amountBad;
  if (amountAll === 0) return <div>No feedback given</div>;
  return (
    <table>
      <tbody>
        <Statistic text="good" value={props.amountGood} />
        <Statistic text="neutral" value={props.amountNeutral} />
        <Statistic text="bad" value={props.amountBad} />
        <Statistic text="all" value={amountAll} />
        <Statistic
          text="average"
          value={(props.amountGood - props.amountBad) / amountAll}
        />
        <Statistic
          text="positive"
          value={(props.amountGood * 100) / amountAll + " %"}
        />
      </tbody>
    </table>
  );
};
const Statistic = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
);
const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics amountGood={good} amountNeutral={neutral} amountBad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
