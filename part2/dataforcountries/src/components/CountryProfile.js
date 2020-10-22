import React from "react";

const CountryProfile = ({ country, weather }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>Spoken Languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={country.flag} alt={country.name} height="112px"></img>
      <h2>Weather in {country.capital}</h2>
      <div>
        <b>temperature:</b> {weather.current.temperature} Celsius
      </div>
      <img src={weather.current.weather_icons} alt="weather icon" />
      <div>
        <b>wind:</b> {weather.current.wind_speed} mph direction{" "}
        {weather.current.wind_dir}
      </div>
    </div>
  );
};

export default CountryProfile;
