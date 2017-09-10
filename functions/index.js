const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

/*
exports.DatabaseOnTaskModified = functions.database.ref('/tasks/{taskId}')
  .onUpdate(event => {
    var current = {
        priority: event.data.current.child('priority').val()
      , name: event.data.current.child('name').val()
      , dueDate: event.data.current.child('dueDate').val()
    };
    var previous = {
      priority: event.data.previous.child('priority').val()
      , name: event.data.previous.child('name').val()
      , dueDate: event.data.previous.child('dueDate').val()
    }
    if (JSON.stringify(previous)!==JSON.stringify(current)) {
      var timestamp = new Date().getTime();
      return event.data.ref.update({
        modified: timestamp
        , created: event.data.previous.child('created').val()
        , id: event.data.previous.child('id').val()
      });
    } else {
      return;
    }
  });
*/

/*
exports.DatabaseOnUserModified = functions.database.ref('/users/{userId}')
  .onUpdate(event => {
    var current = {
      email: event.data.current.child('email').val()
      , checklists: event.data.current.child('checklists').val()
    };
    var previous = {
      email: event.data.previous.child('email').val()
      , checklists: event.data.previous.child('checklists').val()
    }
    if (JSON.stringify(previous)!==JSON.stringify(current)) {
      var timestamp = new Date().getTime();
      return event.data.ref.update({
        modified: timestamp
        , created: event.data.previous.child('created').val()
        , id: event.data.previous.child('id').val()
      });
    } else {
      return;
    }
  });
*/

exports.DatabaseOnUserModified = functions.database.ref('/users/{userId}')
  .onUpdate(event => {
    const userId = event.params.userId;
    if (
      !event.data.current.child('id').val()
      || event.data.current.child('id').val() !== userId
    ) {
      admin.database().ref('users/'+userId+'/id').set(userId);
    }
    return;
  });

exports.DatabaseOnChecklistCreated = functions.database.ref('/checklist/{checklistId}')
  .onCreate(event => {
    var timestamp = new Date().getTime();
    return event.data.ref.update({created: timestamp, modified: timestamp, id: event.params.checklistId});
  });

exports.DatabaseOnTaskCreated = functions.database.ref('/tasks/{taskId}')
  .onCreate(event => {
    var timestamp = new Date().getTime();
    return event.data.ref.update({created: timestamp, modified: timestamp, id: event.params.taskId});
  });

exports.DatabaseOnTaskModified = functions.database.ref('/tasks/{taskId}')
  .onUpdate(event => {
    const taskId = event.params.taskId;
    if (
      !event.data.current.child('id').val()
      || event.data.current.child('id').val() !== taskId
    ) {
      admin.database().ref('tasks/'+taskId+'/id').set(taskId);
    }
    return;
  });

exports.DatabaseOnChecklistModified = functions.database.ref('/checklists/{checklistId}')
  .onUpdate(event => {
    const checklistId = event.params.checklistId;
    if (
      !event.data.current.child('id').val()
      || event.data.current.child('id').val() !== checklistId
    ) {
      admin.database().ref('checklists/'+checklistId+'/id').set(checklistId);
    }
    return;
  });

exports.AuthOnUserCreated = functions.auth.user()
  .onCreate(event => {
    const user = event.data;
    const today = new Date();
    const userData = {
      created: (new Date().getTime())
      , modified: (new Date().getTime())
      , email: user.email
    };
    const defaultCheklist = {
      created: (new Date().getTime())
      , modified: (new Date().getTime())
      , name: 'My Checklist'
      , owner: user.uid
    };
    const defaultFirstTask = {
      created: (new Date().getTime())
      , modified: (new Date().getTime())
      , owner: user.uid
      , completed: false
      , name: 'My first task'
      , priority: 2
      , dueDate: ""+(today.getYear()+1900)+"-"+(today.getMonth()+1)+"-"+today.getDate()
    }
    admin.database().ref('users/'+user.uid).set(userData).then(userResult => {
      admin.database().ref('checklists/').push(defaultCheklist).then(checklistResult => {
        userData.checklists = {
          0: { id: checklistResult.key }
        };
        defaultFirstTask.checklist = checklistResult.key;
        admin.database().ref('users/'+user.uid).set(userData);
        admin.database().ref('tasks/').push(defaultFirstTask).then(taskResult => {
          defaultCheklist.tasks = {
            0: { id: taskResult.key }
          };
          admin.database().ref('checklists/'+checklistResult.key).set(defaultCheklist);
        });
      });
    });
    return;
  });
