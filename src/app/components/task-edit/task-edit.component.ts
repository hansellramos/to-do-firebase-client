import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {UserService} from '../../services/user.service';
import {Task} from 'app/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<boolean>();

  @Input('task')
  public task: Task;
  public editableTask: Task;

  constructor(
    private taskService: TaskService
    , private userService: UserService
  ) {
  }

  ngOnInit() {
    this.editableTask = JSON.parse(JSON.stringify(this.task));
  }

  save() {
    this.taskService.update(this.editableTask)
      .then(result => {
        this.cancel();
      })
      .catch(error => {
        alert('Error');
        console.log(error);
      })
  }

  cancel() {
    this.onCancel.emit(true);
  }

}
