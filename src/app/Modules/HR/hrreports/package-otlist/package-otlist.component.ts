import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {ExcelService} from '../../../../services/excel/excel.service';

import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-package-otlist',
  templateUrl: './package-otlist.component.html',
  styleUrls: ['./package-otlist.component.css']
})
export class PackageOTListComponent implements OnInit {

  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");
  repeatHeaders = true;isLoadingResults:boolean;empid:any;
  Address:any;reportname:any;itemDisplay:any;apiData:any; userid:any;token:any; 
  constructor( private http: HttpClient,private excelService:ExcelService) {
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
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);

    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.fromDate=filterData["fromDate"];
    this.toDate=filterData["toDate"];

    this.mydata='Employee Absent list From ' +  this.fromDate + " To " + this.toDate ;
    this.gatLoadData();
  }

  ngOnInit() {
  }
  exportToExcel() {
    debugger;
    var data:Array<any>=[];
   // data.push(this.Header);
    // this.Detail.forEach(element => {
    //   data.push(element);
    // });
    this.excelService.exportAsExcelFile(this.itemDisplay, 'absentlist');
    
    }
  gatLoadData()
  {
    
    this.http.get(this.original_url+"/HR/HR/getPackageOTEmpList?fromdate="+this.fromDate+"&todate="+this.toDate+"&token="+this.token).subscribe((res:any[])=>{
    this.apiData=res;
    this.itemDisplay=this.apiData.Table;
     console.log("header",this.itemDisplay);
     this.isLoadingResults=false;
    });
  }
}