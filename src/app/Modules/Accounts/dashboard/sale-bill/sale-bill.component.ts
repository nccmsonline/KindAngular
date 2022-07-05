import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';

import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sale-bill',
  templateUrl: './sale-bill.component.html',
  styleUrls: ['./sale-bill.component.css']
})
export class SaleBillComponent implements OnInit {
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;invno:any;Header:any;userid:any;token:any; 
  fieldArray = new MatTableDataSource<SaleDetail>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog,
  private http:HttpClient,
  @Inject('BASE_URL') private original_url : string) {  
  var datePipe = new DatePipe("en-US");
  let currentBranch = sessionStorage.getItem("currentBranch");
  var CompanyData = JSON.parse(currentBranch);
  this.ServerIP=CompanyData['SERVERIP'];
  this.FYUSER=CompanyData['FYUSER'];
  this.boid = CompanyData['BRANCHID'];
  this.invno=data.invno; 
  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);

  this.token = currentUser['TOKEN'];
  this.userid = currentUser['USERID'];

  this.http.get(this.original_url+"/Accounts/Payments/getSaleBill?invno="+this.invno+"&token="+this.token)
  .subscribe((res) => {
    console.log("res",res);
   // this.data=res;
   if(res=="Ravinder")
   {
     this.ShowMessageDialog("wrongData","Some thing went Wrong");
   }
   else
   {
    this.itemDisplay=res;
    this.fieldArray=this.itemDisplay.Table;
    this.Header=this.itemDisplay.Table[0];
   } 
    console.log("this.Header",this.Header);
 });
}

  ngOnInit() {
  }
  ShowMessageDialog(msgtype, textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: msgtype,
        displayMsg:textmsg
      }
    });
  }
}
export class SaleDetail
{
  ITEMNAME:string;
  CUSTOMERPO:string;
  RATEPER:string;
  RATE:number;
  WEIGHT:number;
  QUANTITY:number;
  GSTGOODSAMT:number;
  IGSTAMT:number;
  SGSTAMT:number;
  CGSTAMT:number;
}