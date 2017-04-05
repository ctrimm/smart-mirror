const async = require('async');
const DarkSky = require('dark-sky');
const https = require('https');

const forecast = new DarkSky(process.env.DARKSKY_SECRET);
const myStocks = ['JBLU', 'HA', 'LUV', 'BCS', 'RBS', 'INSY']
const robinhoodCreds = {
    username: process.env.ROBINHOOD_USERNAME,
    password: process.env.ROBINHOOD_PASSWORD
};

var robinhoodStocks = [];
var stocks = [];

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

var d = new Date();
const today = days[d.getDay()];

const googleSecret = process.env.GOOGLEDISTANCE_SECRET;
const homeAddress = '1111+East+Carson+Street+Pittsburgh,+PA+15203';
const workAddress = '40+24+Street+Pittsburgh+PA+15222';

/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
  async.parallel({
    biking: function(callback) {
      var biking = https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+workAddress+'&destinations='+homeAddress+'&mode=bicycling&units=imperial&key='+googleSecret+'', function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          callback(null, JSON.parse(body.toString()));
          // ...and/or process the entire body here.
        });
      });
    },
    driving: function(callback) {
      var driving = https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+workAddress+'&destinations='+homeAddress+'&mode=driving&units=imperial&key='+googleSecret+'', function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          callback(null, JSON.parse(body.toString()));
          // ...and/or process the entire body here.
        });
      });
    },
    // walking: function(callback) {
    //   var walking = https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+workAddress+'&destinations='+homeAddress+'&mode=walking&units=imperial&key='+googleSecret+'', function(res) {
    //     // Buffer the body entirely for processing as a whole.
    //     var bodyChunks = [];
    //     res.on('data', function(chunk) {
    //       // You can process streamed parts here...
    //       bodyChunks.push(chunk);
    //     }).on('end', function() {
    //       var body = Buffer.concat(bodyChunks);
    //       callback(null, JSON.parse(body.toString()));
    //       // ...and/or process the entire body here.
    //     });
    //   });
    // },
    robinhood: function(callback) {
      var Robinhood = require('robinhood')(robinhoodCreds, function(){
        //Robinhood is connected and you may begin sending commands to the api.
        for (var i = 0, len = myStocks.length; i < len; i++) {
          if(robinhoodStocks.length > 0) { robinhoodStocks = []; }
          Robinhood.quote_data(myStocks[i], function(error, response, body) {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            robinhoodStocks.push(body.results);
          });
        }

        if (typeof robinhoodStocks === 'undefined' && robinhoodStocks.length === 0) {
          // the array is undefined or empty... sleep a bit...
          setTimeout(function() {}, 2000);
        }

      }, callback(null, robinhoodStocks));
    },
    weather: function(callback) {
      var weather = forecast
        .latitude('40.4406')
        .longitude('-79.9959')
        .exclude('minutely,hourly,')
        .get()
        .then(res => {
            callback(null, res);
        })
        .catch(err => {
            console.log(err)
        });
    }
  }, function(err, results) {
      // console.log('results', results);
      if (err) { return next(err); }

      dailyData = results.weather.daily.data;
      todaysWeather = dailyData.filter(function(day){
        d = new Date(0);
        d.setUTCSeconds(day.time);
        return days[d.getDay()] === today;
      });

      currentTemp = Math.round(results.weather.currently.temperature);
      todayMaxTemp = Math.round(todaysWeather[0].temperatureMax);
      todayMinTemp = Math.round(todaysWeather[0].temperatureMin);
      weatherIcon = todaysWeather[0].icon;
      bikingTime = results.biking.rows[0].elements[0].duration.text;
      drivingTime = results.driving.rows[0].elements[0].duration.text;
      // walkingTime = results.walking.rows[0].elements[0].duration.text;

      if(stocks.length > 0) { stocks = []; }

      // Async waterfall in order to load in all robinhood stock data
      async.waterfall([
          pushRobinHoodStocks,
          renderHome,
      ], function (err, result) {
          // result now equals 'done'
      });

      function pushRobinHoodStocks(callback) {
        robinhoodStocks.forEach(function(stock) {
          stocks.push(stock[0]);
        });
        callback(null);
      }
      function renderHome(callback) {
        res.render('home', {
          title: 'Home',
          title: 'Home',
          biking: bikingTime,
          driving: drivingTime,
          // walking: walkingTime,
          currentTemp: currentTemp,
          weatherIcon: weatherIcon,
          weatherMax: todayMaxTemp,
          weatherMin: todayMinTemp,
          stocks: stocks
        });
        callback(null);
      }
  });
};
