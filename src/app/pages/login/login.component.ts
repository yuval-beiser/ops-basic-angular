import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

import { IStudent } from './../../models/student';
import { UserService } from '../../services/user.service';
import { SpinerService } from '../../services/spiner.service';
import { StudentService } from '../../services/student.service';
import Utils from './../../utils/utils'
import { IUser } from '../../models/user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  errorMsg: string;
  errorStatus: number;
  isMobile: boolean = false;


  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    public router: Router,
    private userService: UserService,
    private studentService: StudentService,
    private spinerService: SpinerService) {
    this.isMobile = Utils.checkIsmobile();
  	}

	
  ngOnInit(): void {
    window.sessionStorage.clear();
    this.loginForm = new FormGroup({ 
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
	}

  private handleError(error: HttpErrorResponse) {
    this.errorStatus = error.status;

	  if (error.error instanceof ErrorEvent) {
	    // A client-side or network error occurred. Handle it accordingly.
	    console.error('An error occurred:', error.error.message);
	  } else {
	    console.error(
	      `Backend returned code ${error.status}, ` +
	      `body was: ${error.error}`);
    }
    
	  // Return an observable with a user-facing error message.
    return throwError({
      status: this.errorStatus, msg: 'Something bad happened; please try again later.' });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onLogin() {
    this.errorMsg = "";
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.spinerService.setSpinerEvent(true);
    return this.userService.autentication(this.f.username.value, this.f.password.value)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        sessionStorage.setItem('token', res.token);
        this.userService.getuserDetails().subscribe((res: IUser) => {
          this.userService.setUserDetailsData(res);
        }) 
        this.router.navigateByUrl('/students-list');
      })
  }
}
