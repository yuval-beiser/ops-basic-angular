import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMessage } from '../../../models/message';
import { SpinerService } from '../../../services/spiner.service';
import { StudentService } from '../../../services/student.service';
import { IStudent } from '../../../models/student';
import { ToasterService } from '../../../@core/services/toaster.service';



@Component({
  selector: 'app-upload-image-modal',
  templateUrl: './upload-image-modal.component.html',
  styleUrls: ['./upload-image-modal.component.css']
})

export class UploadImageModalComponent implements OnInit {

  files: File[] = [];
  student: IStudent;

  constructor(
    public dialogRef: MatDialogRef<UploadImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStudent,
    private studentService: StudentService,
    private spinerService: SpinerService) { }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.student = this.data;
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpdatePicture() {
    this.spinerService.setSpinerEvent(true);
    this.studentService.updateStudentImage(this.student.id, this.files[0]).subscribe((res) => {
      this.spinerService.setSpinerEvent(false);
      this.dialogRef.close(res);
    })
  }
}
