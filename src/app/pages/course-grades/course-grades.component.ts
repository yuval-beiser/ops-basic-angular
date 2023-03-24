import { Component, OnInit, Injectable, Inject, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { IStudent } from './../../models/student';
import { SpinerService } from '../../services/spiner.service';
import { StudentGradeService } from '../../services/student.grades.service';
import { IGrade } from '../../models/grade';


@Component({
  selector: 'app-course-grades',
  templateUrl: './course-grades.component.html',
  styleUrls: ['./course-grades.component.scss']
})
export class CourseGradesComponent implements OnInit {

  grades: IGrade[] = [];
  @Input() student: IStudent;
  @Output() courseGrades = new EventEmitter();

  constructor(
    private studentGradeService: StudentGradeService,
    private spinerService: SpinerService) {

  }

  async ngOnInit() {

    this.getGrades();
   
  }

  getGrades() {
    if (this.student?.studentGrades?.length) {
      this.grades = [];
      this.student?.studentGrades.forEach((data: any, index) => {
        this.grades.push({ courseName: data.courseName, courseScore: data.courseScore, id: data.id, isAdded: index !== this.student.studentGrades.length - 1 });
      });
    }
    if (!this.grades.length) {
      this.addNewGrade();
    }

  }

  addNewGrade() {
    this.grades.push({ courseName: '', courseScore: 0 })
  }

  onAddGrade(data:any, event) {
    if (!data.courseName && !data.courseScore) {
      return;
    } else {
      data.isAdded = true;  
      if (!data.id) {
        this.onInsertStudentGrade(data);
      }
    }
  }

  onChangeGrade(data) {
    if (data.courseName && data.courseScore && data.id) {
      this.onUpdateStudentGrade(data);
    }
  }

  onChangeCourseName(data) {
    if (data.courseName && data.courseScore && data.id) {
      this.onUpdateStudentGrade(data);
    }
  }

  onRemoveGrade(data: IGrade, index) {
    this.grades.splice(index, 1);
    this.spinerService.setSpinerEvent(true);
    this.studentGradeService.deleteStudentGrade(this.student.id, data.id).subscribe(result => {
      this.spinerService.setSpinerEvent(false);
      this.updateGrades();
    }, error => {
        console.error(error);
        this.updateGrades();
      this.spinerService.setSpinerEvent(false);
    });
  }

  public onInsertStudentGrade(data: IGrade) {
    this.spinerService.setSpinerEvent(true);
    this.studentGradeService.insertStudentGrade(this.student.id, data).subscribe(result => {
      data.id = result.id;
      this.spinerService.setSpinerEvent(false);
      this.updateGrades();
    }, error => {
      console.error(error)
      this.spinerService.setSpinerEvent(false);
    });
    this.addNewGrade();
  }

  public onUpdateStudentGrade(data: IGrade) {
    this.spinerService.setSpinerEvent(true);
    this.studentGradeService.updateStudentGrade(this.student.id, data.id, data).subscribe(result => {
      this.spinerService.setSpinerEvent(false);
      this.updateGrades();
    }, error => {
      console.error(error)
      this.spinerService.setSpinerEvent(false);
    });
  }

  updateGrades() {
    this.courseGrades.emit(this.grades);
  }

}
