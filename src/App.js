import React,{useState,useEffect} from 'react';
import './App.css';
import {MenuItem,FormControl,Select,Card,CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './sort';
import Graph from './Graph';
import 'leaflet/dist/leaflet.css';
function App() {

const [countries,setCountries] = useState([]); 
const [country,setCountry] = useState("worldwide");
const [countryInfo,setCountryInfo] = useState({});
const [tableData,setTableData] = useState([]);
const [mapCenter,setMapCenter] = useState({ lat:34.80746, lng: -40.4796});
const [mapZoom,setMapZoom] = useState(3);
const [mapCountries,setMapCountries] =useState([]);

useEffect(()=>{
    fetch( "https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data =>{
        setCountryInfo(data);
      })
},[])
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
        
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
        });
      };
      getCountriesData();
    },[]);
  
  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;   // here we get the code like AR,UK
    setCountry(countryCode);
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data)=>{
        setCountry(countryCode);     // here so full name is set resectivet to the code or name is set corresponding to value
        // data of selected country response
        setCountryInfo(data);
        if(countryCode ==="worldwide")
          setMapCenter({lat:34.80746, lng: -40.4796});
        else
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log("country info -->",countryInfo);
  return (
    <div className="app">
      
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange}value={country} >
              <MenuItem value="worldwide">Worldwide</MenuItem>
            {
            countries.map(country => (
              <MenuItem value={country.value}>{country.name} </MenuItem> 
            ))}     
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
              <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
              <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
              <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
             
        </div>
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3> Live cases by country</h3>
          <Table countries={tableData} />
          <h3> Worldwide new cases</h3>
          <Graph/>
        </CardContent>
      </Card>
     
    </div>
  );
}

export default App;
