import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ConfirmationDialogService} from '../confirmation-dialog/confirmation-dialog.service'

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {

  wrongMessage : any;
  displayMsg : any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    private messageService: ConfirmationDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.wrongMessage = data.wrongData;
    if(this.wrongMessage=='wrongData')
    {
      this.displayMsg=data.displayMsg;
    }else if(this.wrongMessage=='validation')
    {
      this.displayMsg=data.displayMsg;
    }
    
  }

  ngOnInit() {
  }

  allClose():void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage('success');
    this.dialogRef.close();
}

}
