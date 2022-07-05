import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SaleBillComponent } from '../sale-bill/sale-bill.component';
@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;fromDate:any;toDate:any;PartyName:any;
  fieldArray = new MatTableDataSource<SaleDetail>();userid:any;token:any; 
  isLoadingResults=true;
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
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
    
      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
      this.http.get(this.original_url+"/Accounts/Payments/getSaleDetail?fromDate="+this.fromDate+"&toDate="+this.toDate+"&token="+this.token)
      .subscribe((res) => {
        console.log("res",res);
        if(res=="Ravinder")
        {
          this.ShowMessageDialog("wrongData","Some thing went Wrong");
        }
        else
        {
        this.itemDisplay=res;
        this.fieldArray=this.itemDisplay.Table;
        }
        this.isLoadingResults=false;
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
  BILLSERIESDESC:string;
  INVNO:number;
  INVDATE:string;
  NAME:string;
  TOTALQTY:number;
  NETWT:number;
  TOTALAMT:number;
}