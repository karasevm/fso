import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";
import CountryProfile from "./components/CountryProfile";
function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [content, setContent] = useState();
  const api_key = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setAllCountries(response.data);
    });
  }, []);

  useEffect(() => {
    const filteredCountries = allCountries.filter((country) =>
      country.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (filteredCountries.length > 10) {
      setContent("Too many matches, specify another filter");
    } else if (filteredCountries.length === 1) {
      axios
        .get(
          `http://api.weatherstack.com/current?access_key=${api_key}&query=${filteredCountries[0].capital}`
        )
        .then((result) => {
          console.log(result);
          setContent(
            <CountryProfile
              country={filteredCountries[0]}
              weather={result.data}
            />
          );
        });
    } else {
      setContent(
        <CountryList
          countries={filteredCountries}
          buttonHandler={listItemClickHandler}
        />
      );
    }
  }, [searchValue, api_key, allCountries]);

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  const listItemClickHandler = (name) => {
    setSearchValue(name);
  };

  return (
    <div className="App">
      <div>
        find countries
        <Filter
          filterValue={searchValue}
          changeHandler={handleSearchValueChange}
        />
      </div>
      {content}
    </div>
  );
}

export default App;
