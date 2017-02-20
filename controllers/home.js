const async = require('async');
const DarkSky = require('dark-sky');
const forecast = new DarkSky(process.env.DARKSKY_SECRET);
const googleSecret = process.env.GOOGLEDISTANCE_SECRET;
const homeAddress = '1111+East+Carson+Street+Pittsburgh,+PA+15203';
const workAddress = '40+24+Street+Pittsburgh+PA+15222';
const https = require('https');

var req = https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=1111+East+Carson+Street+Pittsburgh,+PA+15203&destinations=40+24th+street+Pittsburgh+PA&mode=bicycling&key=AIzaSyCSgIGkC1lrz1xdvWct1joe3rp1sBxEvtw', function(res) {
  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    console.log('BODY: ' + body);
    // ...and/or process the entire body here.
  })
});

var weather = forecast
  .latitude('40.4406')
  .longitude('-79.9959')
  .exclude('minutely,hourly,')
  .get()
  .then(res => {

      console.log(res.currently);
  })
  .catch(err => {
      console.log(err)
  });

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

var currentDate = [];

var d = new Date();
var hour = d.getHours();
var minutes = d.getMinutes();
var seconds = d.getSeconds();
var dayOfWeek = days[d.getDay()];
var date = d.getDate();
var month = months[d.getMonth()];
var year = d.getFullYear();

if(minutes < 10) {
    minutes = '0'+minutes;
}

currentDate = {
  hour: hour,
  minutes: minutes,
  seconds: seconds,
  dayOfWeek: dayOfWeek,
  date: date,
  month: month,
  year: year
};

console.log('weather - ', weather.currently);

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home',
    date: currentDate,
    weather: weather
  });
};
