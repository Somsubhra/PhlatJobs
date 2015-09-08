Jobs = new Mongo.Collection("jobs");

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Starting PhlatDownload");
  });

  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  Api.addRoute('jobs/:nodeName', {authRequired: false}, {
    get: function() {
      return Jobs.find({
        $and: [
          { node: this.urlParams.nodeName },
          { status: "pending" }
        ]
      }).fetch();
    },
    post: function() {
      var status = this.queryParams.status;
      var jobId = this.queryParams.id;
      Jobs.update(
        {_id: jobId},
        {$set: {
          status: status
        }}
      );
      return Jobs.find({_id: jobId}).fetch();
    }
  });

  Meteor.publish("jobs", function() {
    return Jobs.find({creator: this.userId});
  })
}

if (Meteor.isClient) {
  Meteor.subscribe("jobs");

  Template.jobs.helpers({
    jobs: function() {
      return Jobs.find({}, {sort: {creationTime: -1}});
    }
  });

  Template.job.helpers({
    trClass: function(status) {
      switch(status) {
        case 'pending':
          return 'warning';
        case 'running':
          return 'info';
        case 'failed':
          return 'danger';
        case 'finished':
          return 'success';
        default:
          return 'active';
      }
    }
  });

  Template.jobForm.events({
    "submit .new-job": function(event) {
      event.preventDefault();
      var jobInp = $("#job");
      var nodeInp = $("#node");
      Meteor.call("addJob", jobInp.val(), nodeInp.val());
      jobInp.val("");
      nodeInp.val("");
    }
  });
}

Meteor.methods({
  addJob: function(job, node) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("forbidden");
    }

    if(job == "" || node == "") {
      throw new Meteor.Error("invalid-job");
    }

    Jobs.insert({
      job: job,
      node: node,
      creator: Meteor.userId(),
      status: "pending",
      creationTime: new Date()
    });
  }
});