const express = require('express');
const path = require('path');
const logger = require('morgan');
const request = require('request');
const bodyparser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


//MIDDLEWARES
///////////////
app.use(logger('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyparser.urlencoded({ //to ready the req body of post method
  extended: true
}));

//REQUETES
////////////
app.get('/', (req, res) => {
  res.render('home');
});

app.post('/result', (req, result) => {
  const city = req.body.city;

  request(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}`, (error, res, body) => {
    const latitude = JSON.parse(body).results[0].geometry.location.lat;
    const longitude = JSON.parse(body).results[0].geometry.location.lng;
    const cityName = JSON.parse(body).results[0].formatted_address;

    request(`https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${latitude},${longitude}`, (err, res, body) => {
      const tempF = JSON.parse(body).currently.temperature;
      const tempC = Math.round((tempF - 32) / 1.8);

      result.render('weather', {
        temperature: `${tempC}`,
        city: `${cityName}`
      });

    });
  });
})


app.listen(3000, () => console.log('OK, listening to port 3000'));
