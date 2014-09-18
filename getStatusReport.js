var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (context) {
  var Job = context.models.Job
    , items = []

  return new Promise(function (resolve, reject) {
    var command = {
      map: map,
      reduce: reduce,
      finalize: finalize,
      query: {},
      sort: { 'finished': 1 },
      out: { inline: 1 }
    }

    Job.mapReduce(command, function(err, results) {
      if (err) { reject(err); }
      return resolve(_.map(results,'value'));
    });
  })
}

function map() {
  emit(this.project, {
    branch: this.ref.branch,
    finished: this.finished,
    data: {
      test_exitcode: this.test_exitcode,
      deploy_exitcode: this.deploy_exitcode,
      plugin_data: this.plugin_data
    }
  });
}

function reduce(project, values) {
  var branches = [],
      jobs = {};

  for(var i = 0; i < values.length; i++) {
    if (! jobs[values[i].branch]) { jobs[values[i].branch] = []; }
    jobs[values[i].branch].push(values[i]);
  }

  for (var key in jobs) {
    print(jobs[key]);
    branches.push({
      name: key,
      status: jobs[key].sort(function(x,y) {
        return x.finished == y.finished;
      })[jobs[key].length - 1].data
    });
  }

  return {
    project: project,
    branches: branches
  }
}

function finalize(key, reduced) {
  var result = [];
  for(var i = 0; i < reduced.length; i++) {
    result.push(reduced[i].value);
  }
  return reduced;
}
