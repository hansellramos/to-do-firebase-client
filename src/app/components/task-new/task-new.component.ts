import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {UserService} from '../../services/user.service';
import {Checklist} from '../../models/checklist';
import {ChecklistService} from '../../services/checklist.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {
  get data() {
    return JSON.stringify(this.checklist);;
  }
  get currentTask() {
    return JSON.stringify(this.task);
  }

  @Output() onCancel = new EventEmitter<boolean>();

  @Input() checklist: Checklist;

  public task: Task;

  constructor(
    private taskService: TaskService
    , private checklistService: ChecklistService
  ) {
    this.clear();
  }

  ngOnInit() {
    this.task.checklist = this.checklist.id;
  }

  save() {
    this.taskService.create(this.task)
      .then((savedTask: any) => {
        this.task.id = savedTask.key;
        this.checklistService.one(this.checklist.id).take(1).toPromise()
          .then((remoteChecklist) => {
            if (remoteChecklist) {
              const tasks = remoteChecklist.tasks ? remoteChecklist.tasks : [];
              tasks.push({id: savedTask.key});
              this.checklistService.update(remoteChecklist)
                .then(() => {
                  // TODO: Set id in home selectedChecklist tasks when a new task is created
                  this.onCancel.emit(true);
                  this.cancel();
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
    this.onCancel.emit(false);
  }

}
