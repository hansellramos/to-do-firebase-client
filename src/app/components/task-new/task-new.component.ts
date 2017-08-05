import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {

  @Output() onCancel = new EventEmitter<boolean>();

  task: Task;

  constructor(
    private taskService: TaskService
    , private userService: UserService
  ) {
    this.clear();
  }

  ngOnInit() {
  }

  save() {
    this.taskService.create(this.task)
      .then((savedItem: any) => {
        this.task.id = savedItem.key;
        this.userService.one(localStorage.uid).take(1).toPromise()
          .then((remoteUser) => {
            if (remoteUser) {
              const tasks = remoteUser.tasks ? remoteUser.tasks : [];
              tasks.push({id: savedItem.key});
              this.userService.update(localStorage.uid, {tasks: tasks})
                .then(() => {
                  this.clear();
                })
                .catch(() => {
                  alert('Error to create user');
                });
            }
          })
          .catch((error) => { alert('error'); console.log(error); })
      })
      .catch((error) => {
        alert('error');
        console.log(error);
      });
  }

  clear() {
    this.task = new Task('', localStorage.uid);
  }

  cancel() {
    this.clear();
    this.onCancel.emit(true);
  }

}
