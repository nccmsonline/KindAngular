import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
//import {ExcelService} from '../../../../../services/excel/excel.service';
import {ExcelService} from '../../../../services/excel/excel.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print-neft-format',
  templateUrl: './print-neft-format.component.html',
  styleUrls: ['./print-neft-format.component.css']
})
export class PrintNeftFormatComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;customerId:any;billSeriesId:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");empid:any;tempdata:any;
  repeatHeaders = true;isLoadingResults:boolean;backto:any;totalamount:number;BankName:any;
  Address:any;reportname:any;newData:any={};itemDisplay:any;orderData:any=[];otData:any=[];
  Header:any={};Detail:Array<any>=[];
  constructor( private router: Router,private activatedRoute: ActivatedRoute, private excelService: ExcelService, private http: HttpClient) {
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.CompanyName=this.companyData['COMPANYNAME'];
    this.Address=this.companyData['ADDRESS'];
    this.Address=this.Address+' '+this.companyData['ADDRESS1'];
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    var filterData= sessionStorage.getItem("neftPrintfilter");
    filterData=JSON.parse(filterData);
    
    this.tempdata=filterData["Header"];
    this.Header= this.tempdata[0];
    this.Detail=filterData["Detail"];
    this.totalamount=filterData["TotalAmt"];
    this.BankName=filterData["BankName"];
    console.log("Header",this.Header);
    console.log("Detail",this.Detail);


    this.backto ="/" + this.activatedRoute.snapshot.paramMap.get('backto');
    // this.fromDate=filterData["fromDate"];
    // this.toDate=filterData["toDate"];
    console.log("res",filterData);
    if (filterData["empid"]!=undefined)
    {
      this.empid=filterData["empid"];
    }
    else
    {
      this.empid='';
    }
    
    this.mydata='';
    this.isLoadingResults=false;
  }
  ngOnInit() {
  }
  exportToExcel() {
    debugger;
    var data:Array<any>=[];
    data.push(this.Header);

    this.Detail.forEach(element => {
      data.push(element);
    });
    this.excelService.exportAsExcelFile(data, 'neftdetail');
    
    }
  gatLoadData()
  {
    // this.http.get(this.original_url+"/hr/hr/getOTSummary?serverip="+this.ServerIP+
    //              "&fyuser="+this.FYUSER+"&boid="+this.boid+"&fromdate="+this.fromDate+"&toDate="+this.toDate+
    //              "&empid="+this.empid).subscribe((res:any[])=>{
    // this.itemDisplay=res;
    // this.otData= this.itemDisplay;
   
    //  console.log("header",this.otData);
    //  this.isLoadingResults=false;
   // });
  }
  backtoSource()
  {
   
    this.router.navigate(['/rtgs-clearing']);
  }
}