var getStatusReport = require('./getStatusReport')


module.exports = {
  globalRoutes: function (app, context) {
    // /ext/status-report/jobs
    app.get('/jobs', function (req, res) {
      function errback(err) {
        console.error(err);
        res.send(500, err)
      }
      getStatusReport(context).then(function (data) {
        res.send(200, data);
      }).error(errback).catch(errback)
    })
  }
}
