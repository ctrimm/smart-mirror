const async = require('async');
const DarkSky = require('dark-sky')
const forecast = new DarkSky(process.env.DARKSKY_SECRET)

// var weather = forecast
//     .latitude('40.4406')
//     .longitude('-79.9959')
//     .exclude('minutely,hourly,')
//     .get()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err)
//     });

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

function setDateInfo() {
    var d = new Date();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var dayOfWeek = days[d.getDay()];
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();

    currentDate = {
      hour: hour,
      minutes: minutes,
      seconds: seconds,
      dayOfWeek: dayOfWeek,
      date: date,
      month: month,
      year: year
    };
    console.log('called');

    setTimeout(setDateInfo, 30000);
}

setDateInfo();

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {

  res.render('home', {
    title: 'Home',
    date: currentDate
  });
};
