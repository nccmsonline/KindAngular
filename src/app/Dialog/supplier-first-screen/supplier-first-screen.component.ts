import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import {ConfirmationDialogService} from './confirmation-dialog.service'
import { HttpClient } from '@angular/common/http';
import {MyserviceService} from '../../myservice.service';

@Component({
  selector: 'app-supplier-first-screen',
  templateUrl: './supplier-first-screen.component.html',
  styleUrls: ['./supplier-first-screen.component.css']
})
export class SupplierFirstScreenComponent implements OnInit {
  Mobile="";
  GSTIn="";
  dailogType="";
  msg:any;
  OTP="";
  sendOTP=0;
  errormsg="";
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SupplierFirstScreenComponent>,
   // private messageService: ConfirmationDialogService,
    private myserviceService:MyserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { 
      this.dailogType=data.dailogType;
      this.msg=data.msg;
      console.log("cosn otp", this.dailogType);
    }
  ngOnInit() {
  }
  resendotp()
  {
    this.sendOTP=  this.myserviceService.sendSupplierOTP(this.msg,this.Mobile);
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
        this.dialogRef.close();
      }
      else if(parseInt(this.OTP) ==this.sendOTP&&this.GSTIn.length==15)
      {
        let tmp:any={};
        tmp.gstin=this.GSTIn;
        tmp.mobile=this.Mobile;
        tmp.cl='ok';
        this.dialogRef.close(tmp);
      }
      else if(this.GSTIn.length!=15)
      {
        this.errormsg="Invalide GSTIn";
      }
      else
      {
        this.errormsg="Invalide OTP";
      }
  }
    
    
  
}
