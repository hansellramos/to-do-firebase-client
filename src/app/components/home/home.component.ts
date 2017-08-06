import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';

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
  public filters: any;

  constructor(
    private authService: AuthService
    , private userService: UserService
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
          this.user = new User(user.uid, remoteUser.email, remoteUser.tasks);
          localStorage.setItem('uid', user.uid);
          this.getUserTasks();
        }
      });
    } else {
      this.user = null;
      localStorage.removeItem('uid');
    }
  }

  getUserTasks() {
    if (this.user.tasks && this.user.tasks.length > 0) {
      for (const task of this.user.tasks) {
        this.taskService.one(task.id)
          .subscribe((item: Task) => {
            this.replaceProject(task.id, item);
          });
      }
    }
  }

  private replaceProject(id: string, task: Task) {
    for (const index in this.user.tasks) {
      if (this.user.tasks[index].id === id) {
        this.user.tasks[index] = task;
      }
    }
  }

  deleteTask(item: Task) {
    this.user.tasks.splice(this.user.tasks.indexOf(item), 1);
    const tasks = this.user.tasks.map((value: Task) => {
      return { id: value.id };
    });
    this.userService.update(this.user.id, {tasks: tasks});
  }

  showNewTaskForm() {
    this.showingNewTaskForm = true;
  }

  hideNewTaskForm() {
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
