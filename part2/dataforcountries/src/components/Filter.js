import React from "react";

const Filter = ({ filterValue, changeHandler }) => {
  return <input value={filterValue} onChange={changeHandler} />;
};

export default Filter;
