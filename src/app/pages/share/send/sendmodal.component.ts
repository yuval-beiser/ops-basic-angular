import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMessage } from '../../../models/message';
import { SpinerService } from '../../../services/spiner.service';
import { StudentService } from '../../../services/student.service';
import { IStudent } from '../../../models/student';
import { ToasterService } from '../../../@core/services/toaster.service';



@Component({
  selector: 'app-sendmodal',
  templateUrl: './sendmodal.component.html',
  styleUrls: ['./sendmodal.component.css']
})

export class SendModalComponent implements OnInit {

  title: string;
  subTitle: string;
  sendMessage: IMessage;
  isSms: boolean = false;
  students: IStudent[];

  constructor(
    public dialogRef: MatDialogRef<SendModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentService: StudentService,
    private spinerService: SpinerService) { }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.isSms = this.data.isSms;
    this.students = this.data.students;
    this.initTitles();
    this.sendMessage = {
      subject: "",
      message:""
    }
  }

  initTitles() {
    this.title = this.isSms ? 'Send SMS' : 'Send Email';
    this.subTitle = this.isSms ? 'Or Email' : 'Or SMS';
  }

  /*onChangeType() {
    this.isSms = !this.isSms;
    this.data.isSms = this.isSms;
    this.initTitles();
  }*/

  onSend() {
  
    let ids = this.students.map((s) => { return s.id });
    //this.spinerService.setSpinerEvent(true);
    if (this.isSms) {
      this.studentService.sendSms(this.sendMessage.message, ids).subscribe((result) => {
        this.spinerService.setSpinerEvent(false);
      });
    }
    else {
      this.studentService.sendEmail(this.sendMessage.subject, this.sendMessage.message, ids).subscribe((result) => {
        this.spinerService.setSpinerEvent(false);
      });
    }
  }
}
