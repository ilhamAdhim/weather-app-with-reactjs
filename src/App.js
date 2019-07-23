import React, { useEffect, useState } from 'react'
import './App.css'
import City from './City'

function App() {
	const APP_ID = 'b4f8399cb8eeb31e0a395d99e6478e6f'
	const [info, setInfos] = useState([])
	const [search, setSearch] = useState('')
	const [city, setCity] = useState('Malang')

	let data = {
		key: undefined,
		date: undefined,
		day: undefined,
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
		temp: 0,
		humidity: undefined,
		windspeed: undefined,
	}


	const updateData = (dataAPI, index, day, month, year, dayName) => {
		data = {
			key: dataAPI.list[index].dt,
			date: dataAPI.list[index].dt_txt.split(" ")[0],
			day: dayName,
			specificDate: {
				dd: day,
				mm: month,
				yy: year
			},
			weather: {
				main: dataAPI.list[index].weather[0].main,
				description: dataAPI.list[index].weather[0].description,
				icon: "http://openweathermap.org/img/wn/" + dataAPI.list[index].weather[0].icon + ".png"
			},
			temp: dataAPI.list[index].main.temp,
			humidity: dataAPI.list[index].main.humidity,
			windspeed: dataAPI.list[index].wind.speed,
		}
	}

	const splitTimeFromAPI = (data, index, units) => {
		const str = data.list[index].dt_txt
		const completeDays = str.split(" ", 2)[0]
		const dates = completeDays.split("-")

		const result = (units === "dd") ? dates[2] : (units === "mm") ? dates[1] : dates[0]
		return result
	}

	const updateSearch = e => setSearch(e.target.value)

	const getSearch = e => {
		e.preventDefault()
		setCity(search)
	}

	const getWeatherData = async () => {
		const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${APP_ID}`)
		const dataAPI = await response.json()
		let rawInfos = []
		if (dataAPI.message === "city not found") {
			console.log("City not found")
		}
		else {
			console.log("New city : " + city + ". Here is the API Response :")
			console.log(dataAPI)
			for (let index = 0; index < dataAPI.list.length; index += 8) {
				const day = splitTimeFromAPI(dataAPI, index, 'dd')
				const month = splitTimeFromAPI(dataAPI, index, 'mm')
				const year = splitTimeFromAPI(dataAPI, index, 'yy')

				//Get name of the day from the date
				const dayName = getDayName(dataAPI, index);

				//Change data API to fix with custom js object  
				updateData(dataAPI, index, day, month, year, dayName)
				rawInfos.push(data)
			}
			console.log(rawInfos)
			//Calculate average temperature
			const avgTemp = countAvgTemp(rawInfos)
			console.log("Average temperature is : " + avgTemp)

		}
		setInfos(rawInfos)
	}

	//Get weather data when the city changes
	useEffect(() => {
		getWeatherData()
	}, [city])

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
			<div className="weather-data">
				{info.map(info => (
					<City key={info.key}
						day={info.day}
						weather={info.weather.main}
						temp={info.temp - 273}
						icon={info.weather.icon} />
				))}
			</div>
		</div>)
}

export default App

const getDayName = (dataAPI, index) => {
	//new date object to convert dates to day
	const daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const indexDay = new Date(dataAPI.list[index].dt_txt.split(" ")[0]);
	const dayName = daysList[indexDay.getDay()];
	return dayName;
}


const countAvgTemp = (rawInfos) => {
	let totalTemp = 0
	for (let index = 0; index < rawInfos.length; index++)
		totalTemp += (rawInfos[index].temp - 273)
	return (totalTemp / rawInfos.length).toPrecision(3)
}
