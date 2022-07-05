import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ConfirmationDialogService} from './confirmation-dialog.service'
import { HttpClient } from '@angular/common/http';
import {MyserviceService} from '../../myservice.service';
import { parseNumber } from '@progress/kendo-angular-intl';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  dailogType="";
  msg:any;
  OTP="";
  sendOTP=0;
  errormsg="";
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private messageService: ConfirmationDialogService,
    private myserviceService:MyserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { 
      this.dailogType=data.dailogType;
      this.msg=data.msg;
      console.log("cosn otp", this.dailogType);
     
      if(this.dailogType=="OTP")
      {
      // this.sendOTP=  myserviceService.sendOTP(this.msg ,"9876604040");
       myserviceService.sendNewSMS(this.msg).subscribe(res=>{
          let ot=res;
          this.sendOTP=parseNumber( ot);
          myserviceService.sendOTP(this.msg ,ot);
       });
      }
    }
  ngOnInit() {
  }
  resendotp()
  {
   // this.sendOTP=  this.myserviceService.sendOTP(this.msg ,"9876604040");
   this.myserviceService.sendNewSMS(this.msg).subscribe(res=>{
    let ot=res;
    this.sendOTP=parseNumber( ot);
    });
    console.log("resend otp");
  }
  onChange()
  {
    this.errormsg="";
  }
  allClose():void {
      // send message to subscribers via observable subject
      if(this.dailogType!="OTP")
      {
        this.messageService.sendMessage('ok');
        this.dialogRef.close();
      }
      else if(parseInt(this.OTP) ==this.sendOTP)
      {
        this.messageService.sendMessage('ok');
        this.dialogRef.close('ok');
      }
      else
      {
        this.errormsg="Invalide OTP";
      }
  }
    
    
  
}


