import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-post-dated-cheque-budget-wise',
  templateUrl: './post-dated-cheque-budget-wise.component.html',
  styleUrls: ['./post-dated-cheque-budget-wise.component.css']
})
export class PostDatedChequeBudgetWiseComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;openingBalance:number;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;
  Address:any;reportname:any;itemDisplay:any;userid:any;token:any; 
  constructor( private http: HttpClient, public dialog: MatDialog) {
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.CompanyName=this.companyData['COMPANYNAME'];
    this.Address=this.companyData['ADDRESS'];
    this.Address=this.Address+' '+this.companyData['ADDRESS1'];
   
    this.boid = this.companyData['BRANCHID'];
    var filterData= sessionStorage.getItem("orderfilter");
    filterData=JSON.parse(filterData);
    
    this.fromDate=filterData["fromDate"];
    this.toDate=filterData["toDate"];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);

    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.mydata='Post dated Cheque Ledger From ' +  this.fromDate;
    this.gatLoadData();
  }

  ngOnInit() {
  }
  gatLoadData()
  {
    var data:any=[];
    this.http.get(this.original_url+"/Accounts/Payments/printMonthChequeDetialBudgetWise?pdate="+this.fromDate+"&token="+this.token+"&ptoDate="+this.toDate).subscribe((res)=>{
        if(res=="Ravinder")
        {
          this.ShowMessageDialog("wrongData","Some thing went Wrong");
        }
        else
        {
            this.itemDisplay=res;
            console.log("header",data);
            this.isLoadingResults=false;
        }
    });
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
