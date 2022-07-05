import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  dataPrint: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ValidationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log("data", data);
    this.dataPrint = data.msg;
  }

  ngOnInit() {
  }

  closeDialog()
  {
    this.dialogRef.close();
  }

}
