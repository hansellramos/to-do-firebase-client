import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DataTableModule } from 'angular2-datatable';

import { environment } from '../environments/environment';

import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { Error404Component } from './components/errors/error404/error404.component';

import { Routing } from './app.routing';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TaskService } from './services/task.service';
import { TaskNewComponent } from './components/task-new/task-new.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';

@NgModule({
  declarations: [
      AppComponent
    , HomeComponent
    , SignInComponent
    , SignUpComponent
    , TaskNewComponent, TaskDetailComponent, TaskEditComponent
    , Error404Component, ForgotPasswordComponent
  ],
  imports: [
      BrowserModule
    , FormsModule
    , Routing
    , AngularFireModule.initializeApp(environment.firebase)
    , AngularFireAuthModule
    , AngularFireDatabaseModule
    , DataTableModule
  ],
  providers: [
      AuthService
    , UserService
    , TaskService
    , AuthGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
