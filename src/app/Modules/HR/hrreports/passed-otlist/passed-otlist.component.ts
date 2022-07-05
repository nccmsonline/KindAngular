import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-passed-otlist',
  templateUrl: './passed-otlist.component.html',
  styleUrls: ['./passed-otlist.component.css']
})
export class PassedOTListComponent implements OnInit {

  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;empid:any;
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
    this.mydata='Passed O.T. List for ' +  this.fromDate;
    this.gatLoadData();
  }

  ngOnInit() {
  }
  gatLoadData()
  {
    
    this.http.get(this.original_url+"/HR/HR/getOTList?serverip="+this.ServerIP+
                 "&fyuser="+this.FYUSER+"&boid="+this.boid+"&dated="+this.fromDate+"&empid="+this.empid).subscribe((res:any[])=>{
    this.itemDisplay=res;
     console.log("header",this.itemDisplay);
     this.isLoadingResults=false;
    });
  }
}
