import { Component, OnInit, Injectable, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

import { IStudent } from './../../../models/student';
import { IPagination } from './../../../models/pagination';
import { StudentService } from '../../../services/student.service';
import { SpinerService } from '../../../services/spiner.service';

import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { IFilter } from '../../../models/filter';
import { RemoveModalComponent } from './removemodal.component';
import { SendModalComponent } from '../../share/send/sendmodal.component';
import { UploadImageModalComponent } from '../../share/upload-image-modal/upload-image-modal.component';
import { utils } from 'protractor';
import Utils from '../../../utils/utils';

export const TOTAL = 10;

@Component({
  selector: 'students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  
  dialogData: IStudent;

  students: IStudent[] = [{}];
  selectedStudent: IStudent;
  pagination: IPagination = {
    count: TOTAL,
    page: 1,
    sort: "id",
    sortDirection: "asc"
  };

  filters: IFilter;

  totalPages: number[] = [];
  currentPage: number = 0;


  memberForm: any;
  isCreated: boolean = false;
  userDetails: IStudent;
  userObj: any;
  isMobile: boolean = false;
  isShowFilter: boolean = false;
  countSelectedStudents: number = 0;
  sortDirection: string = "asc" || "desc";
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  totalStudents: number = 0;

  contextMenuPosition = { x: '0px', y: '0px' };

  terms?: string = "";

  constructor(private router: Router,
    private dialog: MatDialog,
    private studentService: StudentService,
    private spinerService: SpinerService) {
    this.isMobile = Utils.checkIsmobile();
}


  ngOnInit(): void {
    this.terms = this.studentService.getTerms();
    this.getAllStudents();
  }

  onRefresh() {
    location.reload();
  }

  onAddStudent() {

  }

  onEditStudent(id: number) {
    this.router.navigateByUrl(`/student-profile/${id}`);
  }
  getSelectedStudents() {
    return this.students.filter(s => s.checked );
  }

  onDeleteStudent(data?: IStudent): void {
    let context = Array.isArray(data) ? data : data ? [data] : this.getSelectedStudents();
    const dialogRef = this.dialog.open(RemoveModalComponent, {
      width: '558px',
      height: '240px',
      panelClass: 'remove-dialog',
      data: context
    });

    dialogRef.afterClosed().subscribe(result => {
    
      if (result) {
        this.deleteClient(result);
      }
    });
  }

  deleteClient(student: IStudent[]) {
    this.spinerService.setSpinerEvent(true);
    for (let i = 0; i < student.length; i++) {
      this.studentService.deleteStudent(student[i].id).subscribe(result => {
        this.getAllStudents();
      }, error => {
        this.getAllStudents();
        console.error(error)
        this.spinerService.setSpinerEvent(false);
      });
    }
  }

  fillFilters(params: any, filters?: IFilter) {
    if (filters?.name || this.terms) {
      params.fullName = filters?.name || this.terms
    }
    if (filters?.fromDate) {
      params.fromDate = filters.fromDate
    }
    if (filters?.toDate) {
      params.toDate = filters.toDate
    }
    if (filters?.fromSat) {
      params.fromSatScore = filters.fromSat
    }
    if (filters?.toSat) {
      params.toSatScore = filters.toSat
    }
    if (filters?.fromAvg) {
      params.fromAvgScore = filters.fromAvg
    }
    if (filters?.toAvg) {
      params.toAvgScore = filters.toAvg
    }
    return params;
  }

  getAllStudents() {
    this.spinerService.setSpinerEvent(true);
    let dataParams = {
      count: TOTAL,
      page: this.pagination.page,
      sort: this.pagination.sort,
      sortDirection: this.pagination.sortDirection, 
    }
    dataParams = this.fillFilters(dataParams, this.filters);
    this.studentService.getStudents(dataParams).subscribe(result => {
      this.students = result.data;
      this.pagination = result.pagination;
      this.totalStudents = this.pagination.count;
      this.totalPages = [];
     
      const totalPages = Math.ceil(this.totalStudents / TOTAL);
      for (let i = 0; i < totalPages; i++) {
        this.totalPages.push(i);
      }

      this.totalPages.fill(0, totalPages);

      if (!this.currentPage) {
        this.currentPage = 1;
      }
     
      this.spinerService.setSpinerEvent(false);
    }, error => { 
      this.spinerService.setSpinerEvent(false);
      /*setTimeout(() => {
        this.router.navigateByUrl('login');
      }, 3000);*/
    });
  }

  onNextPage(page) {
    this.currentPage = page;
    this.pagination.page = page;
    this.getAllStudents();
  }

  onPreviusPage(page) {
    this.currentPage = page;
    this.pagination.page = page;
    this.getAllStudents();
  }

  onClickPage(page: number) {
    /*if (this.currentPage < page) {
      this.onNextPage();
    }
    else if (this.currentPage > page) {
      this.onPreviusPage();
    }*/
    this.currentPage = page + 1;
    this.pagination.page = page + 1;
    this.getAllStudents();
  }

  checkAllCheckBox(ev: any) {
    this.students.forEach(s => s.checked = ev.target.checked)
    this.countSelectedStudents = this.students.filter(s => s.checked).length;
  }

  isAllCheckBoxChecked(ev:any) {
    return this.students.every(s => s.checked);
  }

  onChecked(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.target.checked) {
      this.countSelectedStudents++;
    }
    else {
      this.countSelectedStudents--;
    }
  }

  onSelectedStudent(selected) {
    if (selected) {
      this.countSelectedStudents++;
    }
    else {
      this.countSelectedStudents--;
    }
  }

  sortOn(column) {
    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    this.pagination.sort = column;
    this.pagination.sortDirection = this.sortDirection;
    this.getAllStudents();
  }

  onApply(filters: IFilter) {
    this.filters = filters;
    this.getAllStudents();
  }

  onClearAll(filters) {
    this.filters = filters;
    this.getAllStudents();
  }

  onSend(type: string, student: IStudent): void {

    let students = student ? [student] : this.getSelectedStudents();
    const isSms = type === 'sms' ? true : false
    const dialogRef = this.dialog.open(UploadImageModalComponent, {
      width: '800px',
      height: '650px',
      panelClass: `send-dialog_${isSms ? 'sms' : 'email'}`,
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onChangePicture(student: IStudent) {
    this.selectedStudent = student;
    const dialogRef = this.dialog.open(UploadImageModalComponent, {
      width: '920px',
      height: '530px',
      panelClass: 'upload-dialog',
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedStudent.profilePicture = result.profilePicture;
      }
    });
  }

}
