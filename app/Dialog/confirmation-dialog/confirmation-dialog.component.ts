import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmationDialogService} from './confirmation-dialog.service'

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private messageService: ConfirmationDialogService
    ) { }

  ngOnInit() {
  }
  allClose():void {
   
    
      // send message to subscribers via observable subject
      this.messageService.sendMessage('ok');
      this.dialogRef.close();
  }
    
    
  
}


