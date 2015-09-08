Jobs = new Mongo.Collection("jobs");

if (Meteor.isClient) {
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

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Starting PhlatDownload");
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
      creator: Meteor.user().username,
      status: "pending",
      creationTime: new Date()
    });
  }
});