import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.css']
})
export class ConfirmAlertComponent implements OnInit {

  dataPrint: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log("data", data);
    this.dataPrint = data.msg;
  }

  ngOnInit() {
  }

  closeDialog(data)
  {
    this.dialogRef.close(data);
  }

}
