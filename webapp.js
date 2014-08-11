// var getStatusReport = require('./getStatusReport')

module.exports = {
  // will be namespaced under /:org/:repo/api/status-report
  routes: function (app) {
    app.get('/hello', function (req, res) {
      return res.send(200,["Hello everybody"])
      // getStatusReport( function (err, statusReport) {
      //   if (err) {
      //     console.error(err)
      //     return res.send(500, 'Error getting status report')
      //   }
      //   return res.send(200,statusReport)
      // })
    })
  },
  // namespaced to /ext/status-report
  globalRoutes: function (app, context) {
    app.get('/hello', function (req, res) {
      return res.send(200,["Hello everybody"])
    })
  }
}
