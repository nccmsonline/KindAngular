import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
//import {ExcelService} from '../../../../../services/excel/excel.service';
import {ExcelService} from '../../../../services/excel/excel.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ot-sumary',
  templateUrl: './ot-sumary.component.html',
  styleUrls: ['./ot-sumary.component.css']
})
export class OTSumaryComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;customerId:any;billSeriesId:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");empid:any;
  repeatHeaders = true;isLoadingResults:boolean;backto:any;
  Address:any;reportname:any;newData:any={};itemDisplay:any;orderData:any=[];otData:any=[];
  constructor( private router: Router, private excelService: ExcelService, private http: HttpClient) {
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
    this.backto=filterData["source"];
    this.mydata='Department wise O.T. Summary from ' +  this.fromDate +" to " + this.toDate;
    this.gatLoadData();
  }
  ngOnInit() {
  }
  exportToExcel() {

    // this.accountGroupMasterService.getalldata()
    // .subscribe((response) => {
    //  this.allGetZone = response;
    //  this.allGetZone = this.allGetZone.Table;
    //  this.exportarray= this.allGetZone;
     this.excelService.exportAsExcelFile(this.otData, 'Account-master');
    // });
    }
  gatLoadData()
  {
    this.http.get(this.original_url+"/hr/hr/getOTSummary?serverip="+this.ServerIP+
                 "&fyuser="+this.FYUSER+"&boid="+this.boid+"&fromdate="+this.fromDate+"&toDate="+this.toDate+
                 "&empid="+this.empid).subscribe((res:any[])=>{
    this.itemDisplay=res;
    this.otData= this.itemDisplay;
   
     console.log("header",this.otData);
     this.isLoadingResults=false;
    });
  }
  backtoSource()
  {
    alert(this.backto);
    this.router.navigate(['/hr-reports']);
  }
}