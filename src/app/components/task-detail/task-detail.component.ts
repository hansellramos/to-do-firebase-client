import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from '../../services/task.service';

import {Task} from 'app/models';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  @Input('task')
  public task: Task;

  @Output() onSelected = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  select() {
    this.onSelected.emit(true);
  }

}
