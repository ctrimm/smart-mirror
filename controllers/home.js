const DarkSky = require('dark-sky')
const forecast = new DarkSky('44256f903bb244724e13b4b44774c9d7')

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  var weather = forecast
    .latitude('40.4406')
    .longitude('-79.9959')
    .get()
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    }).then(function() {
        res.render('home', {
        title: 'Home'
      });
    });
};
