var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (context) {
  var Job = context.models.Job
    , Project = context.models.Project
    , items = []

  return new Promise(function (resolve, reject) {
    Project.find({}, 'name branches.name').exec(function (err, projects) {
      if (err) return reject(err);
      Job.find({}, 'project ref.branch test_exitcode deploy_exitcode').exec(function (err, jobs) {
        if (err) return reject(err);
        _.each(projects, function (project) {
          items.push({
            project: project.name,
            branches: _.map(project.branches, function (branch) {
              var status = null;
              var job = _.find(jobs, function (j) {
                return j.ref.branch === branch.name
              });
              if (job) {
                status = {
                  test_exitcode: job.test_exitcode,
                  deploy_exitcode: job.deploy_exitcode
                }
              }
              return {
                name: branch.name,
                status: status
              }
            })
          })
        });
        return resolve(items)
      })
    })
  })
}
