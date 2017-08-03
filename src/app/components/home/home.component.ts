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

  constructor(
    private authService: AuthService
    , private userService: UserService
    , private taskService: TaskService
    , private router: Router
  ) { }

  ngOnInit() {
    this.authService.afAuth.auth.onAuthStateChanged(user => {
        this.isAuthenticated = !!user;
        this.updateCurrentUserInfo();
      }
    );
  }

  public updateCurrentUserInfo() {
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

  public getUserTasks() {
    if (this.user.tasks && this.user.tasks.length > 0) {
      for (const task of this.user.tasks) {
        this.taskService.one(task.key)
          .subscribe((item: Task) => {
            this.replaceProject(task.key, item);
          });
      }
    }
  }

  private replaceProject(key: string, task: Task) {
    for (const index in this.user.tasks) {
      if (this.user.tasks[index].key === key) {
        task.key = key;
        this.user.tasks[index] = task;
      }
    }
  }

  private deleteTask(item: Task) {
    this.user.tasks.splice(this.user.tasks.indexOf(item), 1);
    const tasks = this.user.tasks.map((value: Task) => {
      return { key: value.key };
    })
    this.userService.update(this.user.id, {tasks: tasks});
  }

  public showNewTaskForm() {
    this.showingNewTaskForm = true;
  }

  public hideNewTaskForm() {
    this.showingNewTaskForm = false;
  }

  public logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

}
