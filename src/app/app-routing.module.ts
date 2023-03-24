import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { StudentsListComponent } from './pages/students/students-list/students-list.component';
import { StudentProfileComponent } from './pages/students/student-profile/student-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from '../app/@core/services/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full' 
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'students-list',
    component: StudentsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-profile/:id',
    component: StudentProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
