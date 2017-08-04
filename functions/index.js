const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   return admin.database().ref('/users/YOCjhrpAXyYnc3JnMfqlNNh4ISB2').once('value').then(data => {
//     console.log(JSON.stringify(data));
//     response.send("Hola");
//   })
//   .catch(error => {
//     response.send('Error hansel');
//   });
// });

exports.onUserCreated = functions.database.ref('/users/{userId}').onCreate(event => {
  var timestamp = new Date().getTime();
  return event.data.ref.update({created: timestamp, updated: timestamp});
});

// exports.onUserUpdate = functions.database.ref('/users/{userId}').onWrite(event => {
//   var timestamp = new Date().getTime();
//   return event.data.ref.update({updated: timestamp});
// });

exports.onTaskCreated = functions.database.ref('/tasks/{taskId}').onCreate(event => {
  var timestamp = new Date().getTime();
  return event.data.ref.update({created: timestamp, updated: timestamp});
});

exports.onTaskUpdate = functions.database.ref('/tasks/{taskId}').onUpdate(event => {
  var current = {
      priority: event.data.current.child('priority').val()
    , name: event.data.current.child('name').val()
    , dueDate: event.data.current.child('name').val()
  };
  var previous = {
    priority: event.data.previous.child('priority').val()
    , name: event.data.previous.child('name').val()
    , dueDate: event.data.previous.child('name').val()
  }
  if (JSON.stringify(previous)!==JSON.stringify(current)) {
    var timestamp = new Date().getTime();
    return event.data.ref.update({updated: timestamp});
  } else {
    return;
  }
});

