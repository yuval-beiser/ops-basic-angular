import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IStudent } from './../../../models/student';

@Component({
  selector: 'app-removemodal',
  templateUrl: './removemodal.component.html',
  styleUrls: ['./removemodal.component.css']
})
export class RemoveModalComponent implements OnInit {

  title: string;
  content: string;

  constructor(
    public dialogRef: MatDialogRef<RemoveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStudent[]) { }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.title = "";
    const content = this.data.length === 1 ? `Are you sure you want to delete?` : `Delete selected (${this.data.length})  Records?`;
    this.content = content;
  }

  onDelete() {
    this.dialogRef.close(this.data)
  }
}
