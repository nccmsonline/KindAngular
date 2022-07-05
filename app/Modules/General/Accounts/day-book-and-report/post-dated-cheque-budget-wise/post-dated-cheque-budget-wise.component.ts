import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-post-dated-cheque-budget-wise',
  templateUrl: './post-dated-cheque-budget-wise.component.html',
  styleUrls: ['./post-dated-cheque-budget-wise.component.css']
})
export class PostDatedChequeBudgetWiseComponent implements OnInit {

  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;openingBalance:number;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;
  Address:any;reportname:any;itemDisplay:any;
  constructor(@Inject('BASE_URL') private original_url : string, private http: HttpClient) {
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
  
    this.mydata='Post dated Cheque Ledger From ' +  this.fromDate;
    this.gatLoadData();
  }

  ngOnInit() {
  }
  gatLoadData()
  {
    var data:any=[];
    this.http.get(this.original_url+"/Accounts/Payments/printPDCChequeDetialBudgetWise?serverip="+this.ServerIP+
                 "&fyuser="+this.FYUSER+"&boid="+this.boid+"&pdate="+this.fromDate).subscribe((res:any[])=>{
    this.itemDisplay=res;
  
   
     console.log("header",data);
     this.isLoadingResults=false;
    });
  }
}
