const async = require('async');
const DarkSky = require('dark-sky');
const https = require('https');

const forecast = new DarkSky(process.env.DARKSKY_SECRET);
const stocks = ['JBLU', 'HA', 'LUV', 'BCS', 'RBS', 'INSY']
const robinhoodCreds = {
    username: process.env.ROBINHOOD_USERNAME,
    password: process.env.ROBINHOOD_PASSWORD
};

var robinhoodStocks = [];

var viewData = {};

const googleSecret = process.env.GOOGLEDISTANCE_SECRET;
const homeAddress = '1111+East+Carson+Street+Pittsburgh,+PA+15203';
const workAddress = '40+24+Street+Pittsburgh+PA+15222';

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

/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
  async.parallel({
    weather: function(callback) {
      var weather = forecast
        .latitude('40.4406')
        .longitude('-79.9959')
        .exclude('minutely,hourly,')
        .get()
        .then(res => {
            callback(null, res.currently);
        })
        .catch(err => {
            console.log(err)
        });
    },
    currentDate: function(callback) {
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

      callback(null, {
        hour: hour,
        minutes: minutes,
        seconds: seconds,
        dayOfWeek: dayOfWeek,
        date: date,
        month: month,
        year: year
      });
    },
    biking: function(callback) {
      var biking = https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+homeAddress+'&destinations='+workAddress+'&mode=bicycling&units=imperial&key='+googleSecret+'', function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          viewData.biking = body;
          callback(null, JSON.parse(body.toString()));
          // ...and/or process the entire body here.
        });
      });
    },
    driving: function(callback) {
      var driving = https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+homeAddress+'&destinations='+workAddress+'&mode=bicycling&units=imperial&key='+googleSecret+'', function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          viewData.driving = body;
          callback(null, JSON.parse(body.toString()));
          // ...and/or process the entire body here.
        });
      });
    },
    robinhood: function(callback) {
      var Robinhood = require('robinhood')(robinhoodCreds, function(){
        //Robinhood is connected and you may begin sending commands to the api.
        for (var i = 0, len = stocks.length; i < len; i++) {
          Robinhood.quote_data(stocks[i], function(error, response, body) {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            console.log(body.results);
            robinhoodStocks.push(body.results);
          });
        }
      }, callback(null, robinhoodStocks));
    }

  }, function(err, results) {
      // results is now equals to: {one: 1, two: 2}
      console.log('results', results);
      // res.render('home', { title: 'Home', date: results.currentDate, weather: weather});
      if (err) { return next(err); }
      res.render('home', {
        title: 'Home',
        title: 'Home',
        date: results.currentDate,
        weather: results.weather,
        robinhoodStocks: robinhoodStocks
      });
  });
};
