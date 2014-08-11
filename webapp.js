// var getStatusReport = require('./getStatusReport')

module.exports = {
  routes: function (app) {
    app.get('/api/status', function (req, res) {
      return res.send(200,["Hello everybody"])
      // getStatusReport( function (err, statusReport) {
      //   if (err) {
      //     console.error(err)
      //     return res.send(500, 'Error getting status report')
      //   }
      //   return res.send(200,statusReport)
      // })
    })
  }
}
