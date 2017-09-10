import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {Checklist} from '../../models/checklist';
import {ChecklistService} from '../../services/checklist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ ]
})

export class HomeComponent implements OnInit {

  public user: User;
  public isAuthenticated = false;
  public showingNewTaskForm = false;
  public selectedTask: Task;
  public selectedChecklist: Checklist;
  public filters: any;

  constructor(
    private authService: AuthService
    , private userService: UserService
    , private checklistService: ChecklistService
    , private taskService: TaskService
    , private router: Router
  ) { }

  ngOnInit() {
    this.filters = {
      closeToExpire: false
    };
    this.authService.auth.auth.onAuthStateChanged(user => {
        this.isAuthenticated = !!user;
        this.updateCurrentUserInfo();
      }
    );
  }

  updateCurrentUserInfo() {
    if (this.isAuthenticated) {
      const user = this.authService.getCurrentUser();
      this.userService.one(user.uid).subscribe(remoteUser => {
        if (remoteUser) {
          this.user = new User(user.uid, remoteUser.email, remoteUser.checklists, remoteUser.created, remoteUser.modified);
          localStorage.setItem('uid', user.uid);
          this.getUserChecklists();
        }
      });
    } else {
      this.user = null;
      localStorage.removeItem('uid');
    }
  }

  getUserChecklists() {
    if (this.user.checklists && this.user.checklists.length > 0) {
      for (const checklist of this.user.checklists) {
        this.checklistService.one(checklist.id)
          .subscribe((item: Checklist) => {
            this.replaceChecklist(checklist.id, item);
            this.setLastSelectedChecklist();
          });
      }
    }

  }

  private replaceChecklist(id: string, checklist: Checklist) {
    for (const index in this.user.checklists) {
      if (this.user.checklists[index].id === id) {
        this.user.checklists[index] = checklist;
      }
    }
  }

  private setLastSelectedChecklist() {
    if (this.user.checklists && this.user.checklists.length > 0) {
      const selected = this.user.checklists[0];
      if (selected.owner) {
        this.selectedChecklist = selected;
        this.getChecklistsTasks();
      }
    }
  }

  getChecklistsTasks() {
    if (this.selectedChecklist.tasks && this.selectedChecklist.tasks.length > 0) {
      for (const task of this.selectedChecklist.tasks) {
        this.taskService.one(task.id)
          .subscribe((item) => {
            this.replaceSelectedChecklistTask(task.id, item);
          });
      }
    }
  }

  private replaceSelectedChecklistTask(id: string, task) {
    for (const index in this.selectedChecklist.tasks) {
      if (this.selectedChecklist.tasks[index].id === id) {
        if (task.id === '') {
          task.id = task.$key;
        }
        this.selectedChecklist.tasks[index] = task;
      }
    }
  }

  deleteTask(item: Task) {
    this.selectedChecklist.tasks.splice(this.selectedChecklist.tasks.indexOf(item), 1);
    const tasks = this.selectedChecklist.tasks.map((value: Task) => {
      return new Task(value.id);
    });
    this.selectedChecklist.tasks = tasks;
    this.checklistService.update(this.selectedChecklist);
  }

  showNewTaskForm() {
    this.showingNewTaskForm = true;
  }

  hideNewTaskForm(event) {
    if (event) {
      this.getChecklistsTasks();
    }
    this.showingNewTaskForm = false;
  }

  editTask(task: Task) {
    this.selectedTask = task;
  }

  cancelEditTask() {
    this.selectedTask = null;
  }

  signOut() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/signin']);
      });
  }

  checkFilter(item: Task): boolean {
    if (this.filters.closeToExpire && this.isTaskNextToDue(item)) {
      return true;
    }
    return !this.filters.closeToExpire;
  }

  public isTaskNextToDue(task: Task): boolean {
    if (task) {
      const dueDate = new Date(task.dueDate);
      return !task.completed
        && (new Date()).getTime() + (7 * 24 * 60 * 60 * 1000) >= dueDate.getTime();
    } else {
      return false;
    }
  }

}
