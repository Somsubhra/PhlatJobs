Jobs = new Mongo.Collection("jobs");

if (Meteor.isClient) {

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