import React from "react";

const PersonForm = ({
  submitHandler,
  nameChangeHandler,
  numberChangeHandler,
  nameValue,
  numberValue,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <div>
        name: <input value={nameValue} onChange={nameChangeHandler} />
      </div>
      <div>
        number: <input value={numberValue} onChange={numberChangeHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
