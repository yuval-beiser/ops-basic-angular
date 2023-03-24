import { Component, OnInit, Injectable, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { IStudent } from './../../models/student';
import { SpinerService } from '../../services/spiner.service';
import { StudentService } from '../../services/student.service';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dialogData: IStudent;

  isAuthenticated: boolean;
  direction: string;
  msg: string;
  sucessMsg: string;
  fieldTextType: boolean;
  memberForm: any;
  isCreated: boolean = false;
  studentDetails: IStudent;
  userObj: any;
  isMobile = false;
  title: string = "יעף ניהול עובדים";
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'idNumber', 'phoneNumber', 'email', 'location', 'role', 'actions'];



  constructor(
    private router: Router,
    private dialog: MatDialog,
    private studentService: StudentService,
    private spinerService: SpinerService) {

  }

  async ngOnInit() {

  }

  onRefresh() {
    location.reload();
  }

  
}
