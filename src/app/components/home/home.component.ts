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
          this.user = new User(user.uid, remoteUser.email);
          this.getUserTasks();
        }
      });
    } else {
      this.user = null;
    }
  }

  public getUserTasks() {
    if (this.user.tasks && this.user.tasks.length > 0) {
      for (const p of this.user.tasks) {
        this.taskService.one(p.id)
          .subscribe((task: Task) => {
            this.replaceProject(task.id, task);
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

  public logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

}
