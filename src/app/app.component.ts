import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SpinerService } from './services/spiner.service';
import { AuthService } from './services/auth.service';
import { DOCUMENT } from '@angular/common';
import { IStudent } from './models/student';
// import * as $ from 'jquery';
import { StudentService } from './services/student.service';
import { UserService } from './services/user.service';
import { IUser } from './models/user';
import Utils from './utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webapp';
  subscription: Subscription;
  tostMessage: string;
  loading: boolean = false;
  sideBarIsOpen: boolean = true;
  isExpanded = true;
  isShowing = false;
  user: IUser;
  terms: string;
  isDarkMode: boolean = false;
  isMobile: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router,
    private spinerService: SpinerService,
    private authService: AuthService,
    private userService: UserService,
    private studentService: StudentService) {
    this.isMobile = Utils.checkIsmobile();
  }

  ngOnInit() {
    this.spinerService.getEventListner().subscribe(isLoading => {
      this.loading = isLoading;
    })
    this.getUserProfile();
  }

  getUserProfile() {
    this.userService.getUserDetailsData().subscribe((res) => {
      this.user = res;
    })
  }

  onSearch() {
    this.studentService.setTerms(this.terms);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/students-list']));
  }

  isUserLogedIn() {
    const isAutenticated = this.authService.isAuthenticated();
    return isAutenticated;
  }

  onLogout() {
    window.sessionStorage.clear();
    this.document.location.href = '/';
  }

  changeDark() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    }
    else {
      document.body.classList.remove('dark');
    }
  }
}
