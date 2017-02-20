const DarkSky = require('dark-sky')
const forecast = new DarkSky(process.env.DARKSKY_SECRET)

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
