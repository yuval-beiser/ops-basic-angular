import { Component, OnInit, Injectable, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Router, ActivatedRoute } from '@angular/router';


import { IStudent } from './../../../models/student';
import { SpinerService } from '../../../services/spiner.service';
import { StudentService } from '../../../services/student.service';
import { RemoveModalComponent } from '../students-list/removemodal.component';
import { SendModalComponent } from '../../share/send/sendmodal.component';
import { UploadImageModalComponent } from '../../share/upload-image-modal/upload-image-modal.component';
import { IGrade } from '../../../models/grade';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Utils from '../../../utils/utils';


@Component({
  selector: 'student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

 
  id: string;
  student: IStudent;
  birthdate: Date;
  avgGrades: number = 0;
  submitted: boolean = false;
  studentForm: FormGroup;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private studentService: StudentService,
    private spinerService: SpinerService,
    private route: ActivatedRoute) {
    this.isMobile = Utils.checkIsmobile();
  }

  async ngOnInit() {
    this.studentForm = new FormGroup({
      id: new FormControl(''),
      fullname: new FormControl('', Validators.maxLength(60)),
      birthdate: new FormControl(''),
      phone: new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.maxLength(200)]),
      graduationScore: new FormControl('', [Validators.min(30), Validators.max(110)]),
      satScore: new FormControl('', [Validators.min(100), Validators.max(800)]),
    });

    this.id = this.route.snapshot.paramMap.get('id')
    this.getStudent(+this.id);

 
  }

  // convenience getter for easy access to form fields
  get f() { return this.studentForm.controls; }

  setValues() {
    this.studentForm.controls['id'].setValue(this.student.id);
    this.studentForm.controls['fullname'].setValue(this.student.fullname);
    this.studentForm.controls['birthdate'].setValue(this.student.birthDate);
    this.studentForm.controls['email'].setValue(this.student.email);
    this.studentForm.controls['phone'].setValue(this.student.phone);
    this.studentForm.controls['graduationScore'].setValue(this.student.graduationScore);
    this.studentForm.controls['satScore'].setValue(this.student.satScore);
  }

  getStudent(id: number) {
    this.studentService.getStudent(id).subscribe((res) => {
      this.student = res;
      if (this.student?.studentGrades?.length) {
        this.onUpdateGrades(this.student.studentGrades);
      }
      if (typeof this.student.birthDate === 'string') {
        this.birthdate = new Date(this.student.birthDate);
      }
      else {
        this.birthdate = this.student.birthDate;
      }
      this.setValues();
    })
  }


  onDeleteStudent(): void {
    let context = [this.student];
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
        this.onClose();
      }, error => {
          this.onClose();
        console.error(error)
        this.spinerService.setSpinerEvent(false);
      });
    }
  }

  onChangeDetails() {
    if (this.birthdate) {
      this.student.birthDate = this.formatDate(this.birthdate);
      this.studentForm.controls['birthdate'].setValue(this.student.birthDate);
    }
  }

  onClose() {
    this.router.navigateByUrl(`/students-list`);
  }

  formatDate(d){
    //let d = new Date(date);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    return [year, month, day].join('-');
  }

  onSend(type: string): void {
    const isSms = type === 'sms' ? true : false
    const dialogRef = this.dialog.open(SendModalComponent, {
      width: '800px',
      height: '650px',
      panelClass: `send-dialog_${isSms ? 'sms' : 'email'}`,
      data: {
        isSms: isSms,
        students: [this.student]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
 
    });
  }

  onSendWhatsapp() {
    window.open(`https://api.whatsapp.com/send?phone=${this.student.phone}`, '_blank');
  }

  onChangePicture() {
    const dialogRef = this.dialog.open(UploadImageModalComponent, {
      width: '920px',
      height: '530px',
      panelClass: 'upload-dialog',
      data: this.student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.student.profilePicture = result.profilePicture;
      }
    });
  }

  onUpdateProfile() {
    this.submitted = true;

    if (this.studentForm.invalid) {
      return;
    }

    this.spinerService.setSpinerEvent(true);
    const student = {
      id: this.f.id.value,
      fullname: this.f.fullname.value,
      birthDate: this.f.birthdate.value,
      email: this.f.email.value,
      phone: this.f.phone.value,
      graduationScore: this.f.graduationScore.value,
      satScore: this.f.satScore.value
    }
    this.studentService.updateStudent(student).subscribe(result => {
      this.spinerService.setSpinerEvent(false);
      }, error => {
        console.error(error)
        this.spinerService.setSpinerEvent(false);
      });
    
  }

  onUpdateGrades(grades: IGrade[]) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < grades.length; i++) {
      sum += +grades[i].courseScore;
      if (grades[i].courseName && grades[i].courseScore > -1) {
        count++;
      }
    }
    this.avgGrades = isNaN(sum / count) ? 0 : sum / count;
  }
  
}
