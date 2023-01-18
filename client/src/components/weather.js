import { useEffect, useState } from 'react';
import { Row, Col, Table } from 'reactstrap';
import './weather.css'

function Weather(props){
    const [forecast, setForecast] = useState([]);
    const [hourly, setHourly] = useState([]);

    const fetchData = async () => {
        let response = await fetch("/data", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                query: props.query
            })
        })
        let data = await response.json()

        let currentData = {
            "city": data.current.name,
            "high": data.current.main.temp_max,
            "low": data.current.main.temp_min,
            "icon": `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`,
            "short": data.current.weather[0].main,
            "description": data.current.weather[0].description,
            "sunrise": processTime(data.current.sys.sunrise),
            "sunset": processTime(data.current.sys.sunset),
            "photo": data.photo.results[0].urls.small
        }
        let hourlyData = []
        data.forecast.list.map((entry) => {
            const processedEntry = {
                "dt": processDateTime(entry.dt),
                "icon": `http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
                "weather": entry.weather[0].main,
                "min": entry.main.temp_max,
                "max": entry.main.temp_min,
                "description": entry.weather[0].description   
            }
            return hourlyData.push(processedEntry)
        })
        setForecast(currentData)
        setHourly(hourlyData)
    }

    const processDateTime = (data) => {
        var date = new Date(data * 1000);
        let newdate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute:'numeric' }).format(date)
        return newdate
    }

    const processTime = (data) => {
        var date = new Date(data * 1000);
        let newdate = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute:'numeric' }).format(date)
        return newdate
    }

    const forecastTable = (item) => {  
       return (
            <tr key={item.dt}>
                <th scope='row'> {item.dt}</th>
                <td><img src={item.icon} alt='icon' />{item.weather}</td>
                <td>{item.max}&#8457;</td>
                <td>{item.min}&#8457;</td>
                <td>{item.description}</td>
            </tr>
            )  
        }

    useEffect(() => {
        fetchData();
    }, [props.query]);

    return(
        <div className='weatherdata'>
            <div className='today-hero'>
                <h2>Today's Weather</h2>
                <Row className='today-data rounded bg-warning shadow-sm bg-opacity-75' xs="2">
                    <Col>
                        <img className="thumb" src={forecast.photo} alt='city'/> <br />
                        <strong>Sunrise:</strong> {forecast.sunrise} <br />
                        <strong>Sunset:</strong> {forecast.sunset} <br />
                    </Col>
                    <Col>
                        <h3>{forecast.city}</h3>
                        <img className='weather-icon' src={forecast.icon} alt="icon" /> <span className="fs-4">{forecast.short} </span> <br />
                        <strong>High:</strong> {forecast.high}  <strong>Low:</strong> {forecast.low} <br />
                        <strong>Conditions:</strong> {forecast.description} <br />
                    </Col>
                </Row>
            </div>
            <h2>Next Few Days</h2>
            <div className='forecast-data'>
                <Row className='rounded bg-warning shadow-sm bg-opacity-50'>
                    <Col>
                        <Table>
                            <thead>
                                <tr>
                                <th>Time</th>
                                <th>Forecast</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                            {hourly.map((item) => forecastTable(item))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default Weather;