import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-post-dated-cheque-ledger',
  templateUrl: './post-dated-cheque-ledger.component.html',
  styleUrls: ['./post-dated-cheque-ledger.component.css']
})
export class PostDatedChequeLedgerComponent implements OnInit {
  original_url=environment.baseUrl;flag:any;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;openingBalance:number;userid:any;token:any; 
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;
  Address:any;reportname:any;itemDisplay:any;
  constructor( private http: HttpClient, public dialog: MatDialog) {
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.CompanyName=this.companyData['COMPANYNAME'];
    this.Address=this.companyData['ADDRESS'];
    this.Address=this.Address+' '+this.companyData['ADDRESS1'];
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    var filterData= sessionStorage.getItem("orderfilter");
    filterData=JSON.parse(filterData);
    
    this.fromDate=filterData["fromDate"];
    this.toDate=filterData["toDate"];
    this.flag=filterData["flag"];
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
    this.http.get(this.original_url+"/Accounts/Payments/printPDCChequeDetial?pdate="+this.fromDate+"&token="+this.token+"&flag="+this.flag).subscribe((res)=>{
        if(res=="Ravinder")
        {
          this.ShowMessageDialog("wrongData","Some thing went Wrong");
        }
        else
        {               
            this.itemDisplay=res;
            data =this.itemDisplay[0].detail;
            console.log("header",res);
            console.log("data",data);
            this.openingBalance=parseFloat(data[0].BALANCE) -parseFloat(data[0].TOTAL);
        }     
     this.isLoadingResults=false;
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

