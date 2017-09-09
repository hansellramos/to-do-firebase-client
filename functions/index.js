const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.onUserCreated = functions.database.ref('/users/{userId}').onCreate(event => {
  var timestamp = new Date().getTime();
  return event.data.ref.update({created: timestamp, updated: timestamp, id: event.params.userId});
});

exports.onTaskCreated = functions.database.ref('/tasks/{taskId}').onCreate(event => {
  var timestamp = new Date().getTime();
  return event.data.ref.update({created: timestamp, updated: timestamp, id: event.params.taskId});
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

exports.onCreateUser = functions.auth.user().onCreate(event => {
  const user = event.data;
  const userData = {
    created: (new Date().getTime()),
    modified: (new Date().getTime()),
    email: user.email,
    id: user.uid
  };
  admin.database().ref('users/'+user.uid).push(userData)
});

