import React from "react";

const CountryList = ({ countries, buttonHandler }) => {
  return countries.map((country) => (
    <Country
      key={country.name}
      country={country}
      buttonHandler={buttonHandler}
    />
  ));
};

const Country = ({ country, buttonHandler }) => {
  return (
    <div>
      {country.name}{" "}
      <button onClick={() => buttonHandler(country.name)}>show</button>
    </div>
  );
};

export default CountryList;
