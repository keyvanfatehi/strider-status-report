var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (context) {
  var Job = context.models.Job,
      Project = context.models.Project,
      items = [];

  return new Promise(function (resolve, reject) {
    Project.find({}, 'name branches.name').exec(function(err, projects) {
      if (err) { reject(err); }

      var command = {
        map: map,
        reduce: reduce,
        finalize: finalize,
        query: {
          "project": {$in: _.map(projects, 'name')},
          "archived": {$exists: false}
        },
        sort: { 'finished': 1 },
        out: { inline: 1 }
      }

      Job.mapReduce(command, function(err, results) {
        if (err) { reject(err); }
        return resolve(_.map(results,'value'));
      });
    });
  })
}

function map() {
  var branches = {};
  branches[this.ref.branch] = {
    name: this.ref.branch,
    finished: this.finished,
    data: {
      test_exitcode: this.test_exitcode,
      deploy_exitcode: this.deploy_exitcode,
      plugin_data: this.plugin_data
    }
  };

  emit(this.project, {
    project: this.project,
    branches: branches
  });
}

function reduce(project, values) {
  var out = {
        project: project,
        branches: {}
      };

  for (var i = 0; i < values.length; i++) {
    for (var branchName in values[i].branches) {
      var outBranch = out.branches[branchName];
      var branch = values[i].branches[branchName]
      if (!outBranch || branch.finished > outBranch.finished) {
        out.branches[branchName] = branch;
      }
    }
  }

  return out;
}

function finalize(project, reducedValue) {
  var branches = [];
  for (var branch in reducedValue.branches) {
    branches.push(reducedValue.branches[branch]);
  }
  return {
    project: project,
    branches: branches
  };
}
