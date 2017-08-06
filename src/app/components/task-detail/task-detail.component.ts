import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from '../../services/task.service';

import {Task} from 'app/models';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  get nextToDue(): boolean {
    if (this.task) {
      const dueDate = new Date(this.task.dueDate);
      return !this.task.completed
        && (new Date()).getTime() + (7 * 24 * 60 * 60 * 1000) >= dueDate.getTime();
    } else {
      return false;
    }
  }

  @Input('task')
  public task: Task;

  @Output() onSelected = new EventEmitter<boolean>();

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit() {
  }

  select() {
    this.onSelected.emit(true);
  }

  updateTask() {
    this.taskService.update(this.task);
  }

}
