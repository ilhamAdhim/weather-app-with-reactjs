import React, { useEffect, useState } from 'react';
import './App.css';
import City from './City'

function App() {

  let data = {
    key: undefined,
    date: undefined,
    specificDate: {
      dd: undefined,
      mm: undefined,
      yy: undefined,
    },
    weather: {
      main: undefined,
      description: undefined,
      icon: undefined,
    },
    temp: undefined,
    humidity: undefined,
    windspeed: undefined,
  }

  function splitTimeFromAPI(data, index, units) {
    const str = data.list[index].dt_txt;
    const completeDays = str.split(" ", 2)[0];
    const dates = completeDays.split("-");

    const result = (units == "dd") ? dates[2] : (units == "mm") ? dates[1] : dates[0]
    return result;
  }


  function updateData(dataAPI, index, day, month, year) {
    data = {
      key: dataAPI.list[index].dt,
      date: dataAPI.list[index].dt_txt.split(" ")[0],
      specificDate: {
        dd: day,
        mm: month,
        yy: year
      },
      weather: {
        main: dataAPI.list[index].weather[0].main,
        description: dataAPI.list[index].weather[0].description,
        icon: dataAPI.list[index].weather[0].icon,
      },
      temp: dataAPI.list[index].main.temp,
      humidity: dataAPI.list[index].main.humidity,
      windspeed: dataAPI.list[index].wind.speed,
    };
  }

  let APP_ID = 'b4f8399cb8eeb31e0a395d99e6478e6f';
  const [info, setInfos] = useState([])
  const [city, setCity] = useState()

  const getWeatherData = async () => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=Mecca&APPID=${APP_ID}`);
    const dataAPI = await response.json();

    console.log(dataAPI);

    setCity(dataAPI.city.name)

    let rawInfos = []
    for (let index = 0; index < dataAPI.list.length; index += 8) {
      const day = splitTimeFromAPI(dataAPI, index, 'dd');
      const month = splitTimeFromAPI(dataAPI, index, 'mm');
      const year = splitTimeFromAPI(dataAPI, index, 'yy');

      //update data
      updateData(dataAPI, index, day, month, year);

      rawInfos.push(data)
    }
    //Remove duplicated days in Array rawInfos[]
    console.log(rawInfos)

    setInfos(rawInfos)
  };

  useEffect(() => {
    getWeatherData();
  }, []);


  return (
    <div className="App">
      <form className="search-form">
        <input className="search-bar" type="text" placeholder="City name or Zipcode" />
        <button className="btn btn-info"> Search </button>
      </form>

      <h1>Weather in : {city}</h1>
      <br />
      {info.map(info => (
        <City
          key={info.key}
          date={info.date}
          weather={info.weather.main}
          temp={info.temp - 273} />
      ))}
    </div>
  );
}

export default App;
