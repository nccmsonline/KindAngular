import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-post-dated-cheque-ledger',
  templateUrl: './post-dated-cheque-ledger.component.html',
  styleUrls: ['./post-dated-cheque-ledger.component.css']
})
export class PostDatedChequeLedgerComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;openingBalance:number;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;
  Address:any;reportname:any;itemDisplay:any;
  constructor( private http: HttpClient) {
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
    this.http.get(this.original_url+"/Accounts/Payments/printPDCChequeDetial?serverip="+this.ServerIP+
                 "&fyuser="+this.FYUSER+"&boid="+this.boid+"&pdate="+this.fromDate).subscribe((res:any[])=>{
    this.itemDisplay=res;
  
   
    data =this.itemDisplay[0].detail;
    console.log("header",res);
    console.log("data",data);
   this.openingBalance=parseFloat(data[0].BALANCE) -parseFloat(data[0].TOTAL);
     
     this.isLoadingResults=false;
    });
  }
}
