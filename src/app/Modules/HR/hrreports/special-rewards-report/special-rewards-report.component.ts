import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-special-rewards-report',
  templateUrl: './special-rewards-report.component.html',
  styleUrls: ['./special-rewards-report.component.css']
})
export class SpecialRewardsReportComponent implements OnInit {
  original_url=environment.baseUrl;
 
  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;userid:any;token:any; 
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;empid:any;
  Address:any;reportname:any;itemDisplay:any;
  constructor(private http: HttpClient) {
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.CompanyName=this.companyData['COMPANYNAME'];
    this.Address=this.companyData['ADDRESS'];
    this.Address=this.Address+' '+this.companyData['ADDRESS1'];
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    


let currentUser = sessionStorage.getItem("currentUser");
currentUser = JSON.parse(currentUser);

this.token = currentUser['TOKEN'];
this.userid = currentUser['USERID'];
    var filterData= sessionStorage.getItem("otfilter");
    filterData=JSON.parse(filterData);
    
    this.fromDate=filterData["fromDate"];
    this.toDate=filterData["toDate"];
    if (filterData["empid"]!=undefined)
    {
      this.empid=filterData["empid"];
    }
    else
    {
      this.empid='';
    }
    this.mydata='Food Expenses List for ' +  this.fromDate;
    this.gatLoadData();
  }

  ngOnInit() {
  }
  gatLoadData()
  {
    this.http.get(this.original_url+"/HR/HR/getOTRewardsList?dated="+this.fromDate+"&empid="+this.empid+"&token="+this.token).subscribe((res)=>{
    this.itemDisplay=res;
     console.log("header",this.itemDisplay);
     this.isLoadingResults=false;
    });
  }
}
