import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { TaskNewComponent } from './components/task-new/task-new.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

import { AuthGuard } from './guards/auth.guard';

import { Error404Component } from './components/errors/error404/error404.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [ AuthGuard ] }
  , { path: 'signup', component: SignUpComponent }
  , { path: 'signin', component: SignInComponent }
  , { path: 'task/new', component: TaskNewComponent }
  , { path: 'task/:id', component: TaskDetailComponent }
  , { path: '', redirectTo: '/signin', pathMatch: 'full' }
  , { path: '**', component: Error404Component }
];

export const Routing = RouterModule.forRoot(routes);
