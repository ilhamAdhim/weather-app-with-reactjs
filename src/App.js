import React, { useEffect, useState } from 'react';
import './App.css';
import City from './City'

function App() {


	let APP_ID = 'b4f8399cb8eeb31e0a395d99e6478e6f';
	const [info, setInfos] = useState([])
	const [search, setSearch] = useState('')
	const [city, setCity] = useState('Malang')

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

	function splitTimeFromAPI(data, index, units) {
		const str = data.list[index].dt_txt;
		const completeDays = str.split(" ", 2)[0];
		const dates = completeDays.split("-");

		const result = (units === "dd") ? dates[2] : (units === "mm") ? dates[1] : dates[0]
		return result;
	}


	const updateSearch = e => {
		setSearch(e.target.value)
	}


	const getSearch = e => {
		e.preventDefault()
		setCity(search)
	}

	const getWeatherData = async () => {
		const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${APP_ID}`);
		const dataAPI = await response.json();
		console.log(dataAPI);

		let rawInfos = []
		if (dataAPI.message === "city not found") {
			console.log("City not found")
		}
		else {
			for (let index = 0; index < dataAPI.list.length; index += 8) {
				const day = splitTimeFromAPI(dataAPI, index, 'dd');
				const month = splitTimeFromAPI(dataAPI, index, 'mm');
				const year = splitTimeFromAPI(dataAPI, index, 'yy');

				//Change data API to fix with custom js object  
				updateData(dataAPI, index, day, month, year);
				rawInfos.push(data)
			}

		}

		setInfos(rawInfos)
	};

	useEffect(() => {
		getWeatherData();
	}, [city]);


	return (
		<div className="App" >

			<form className="search-form" onSubmit={getSearch}>
				<input type="text" placeholder="City name or Zipcode" value={search} onChange={updateSearch} />
				<button className="btn btn-info" type="submit">
					Search
            	</button>
			</form>

			<h1 > Weather in: {city}
			</h1>
			<br />
			{info.map(info => (
				<City key={info.key}
					date={info.date}
					weather={info.weather.main}
					temp={info.temp - 273} />
			))}
		</div>);
}

export default App;