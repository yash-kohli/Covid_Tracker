import React,{useState,useEffect} from 'react';
import './App.css';
import {MenuItem,FormControl,Select,} from '@material-ui/core';

function App() {

const [countries,setCountries] = useState([""]); 

useEffect(() =>{
  const getCountriesData = async () =>{
    // async => send a request,await to wait for the data,fetch to fetch data from server
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)  => response.json())
      .then((data) =>{
        const countries = data.map((country) =>(
         {
            name : country.country, // full name of country
            value : country.countryInfo.iso2 // AF,AR,In,FR
          }));
        setCountries(countries);
        });
      };
      getCountriesData();
    },[]);
  return (
    <div className="app">
      
      <div className="app__header">
        <h1>Covid-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc" >
            <MenuItem value="worldwide">Worldwide</MenuItem>
          {
          countries.map(country => (
            <MenuItem value={country.value}>{country.name} </MenuItem> 
          ))}     
          </Select>
        </FormControl>
      </div>
  
      {/* Header */}
      
      {/* Title + drowdown field */}
      {/* Infobox */}
      {/* Infobox */}
      {/* Infobox */}

      {/* Table */}
      {/* graph */}

      {/* Map*/}
    </div>
  );
}

export default App;
