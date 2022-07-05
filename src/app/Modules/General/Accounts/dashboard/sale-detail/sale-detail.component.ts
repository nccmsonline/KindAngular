import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';

import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SaleBillComponent } from './../sale-bill/sale-bill.component';
@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;fromDate:any;toDate:any;PartyName:any;
  fieldArray = new MatTableDataSource<SaleDetail>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private http:HttpClient,
    @Inject('BASE_URL') private original_url : string) {
      var datePipe = new DatePipe("en-US");
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      this.fromDate=data.fromDate; 
      this.toDate=data.toDate; 
      this.http.get(this.original_url+"/Accounts/Payments/getSaleDetail?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid +"&fromDate="+this.fromDate+"&toDate="+this.toDate)
      .subscribe((res) => {
        console.log("res",res);
       // this.data=res;
        this.itemDisplay=res;
        this.fieldArray=this.itemDisplay.Table;
        console.log("this.chart",this.itemDisplay);
     });
    }
    openDialog(invno:any) {
      const dialogRef = this.dialog.open(SaleBillComponent, {
        data: {
                invno:invno        }
      });
    }
    showDetail(data)
    {
    this.openDialog(data.INVNO);
    }
  ngOnInit() {
  }

}
export class SaleDetail
{
  BILLSERIESDESC:string;
  INVNO:number;
  INVDATE:string;
  NAME:string;
  TOTALQTY:number;
  NETWT:number;
  TOTALAMT:number;
}