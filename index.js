const express = require('express')
const app = express()
const PORT = process.env.PORT || 3010
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('*', (req, res) => {
  res.sendFile(
      path.resolve(__dirname, 'client', 'build', 
  'index.html')
  );
});

app.post('/data', async (req, res) => {
  const query = req.body.query
  const country = "US"
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query},${country}&limit=1&appid=${process.env.OW_APIKEY}`)
  const data = await response.json()
  const lat = data[0].lat
  const lon = data[0].lon
  const weatherData = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.OW_APIKEY}`)
  const weatherDataResponse = await weatherData.json()
  const currentData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.OW_APIKEY}`)
  const currentDataResponse = await currentData.json()
  const photo = await fetch(`https://api.unsplash.com/search/photos?&query=${query}&page=1&per_page=1&orientation=landscape&client_id=${process.env.UNS_APIKEY}`)
  const photoData = await photo.json()
  const compiledData = {
    "current": currentDataResponse,
    "forecast": weatherDataResponse,
    "photo": photoData
  }
  res.send(compiledData)

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

