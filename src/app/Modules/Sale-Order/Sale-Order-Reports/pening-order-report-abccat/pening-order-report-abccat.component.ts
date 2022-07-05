import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//import { GroupByCustomerPipe } from './mypipefilter';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-pening-order-report-abccat',
  templateUrl: './pening-order-report-abccat.component.html',
  styleUrls: ['./pening-order-report-abccat.component.css']
})
export class PeningOrderReportABCCatComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;customerId:any;billSeriesId:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  repeatHeaders = true;isLoadingResults:boolean;userid:any;token:any; 
  Address:any;reportname:any;newData:any={};itemDisplay:any;orderData:any=[];orderHeaderData:any=[];
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
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    var filterData= sessionStorage.getItem("orderfilter");
    filterData=JSON.parse(filterData);
    
    this.fromDate=filterData["fromDate"];
    this.toDate=filterData["toDate"];
    this.customerId=filterData["customerId"];
    this.billSeriesId=filterData["billSeriesId"];
    this.mydata='Pending Customer Order From ' +  this.fromDate+' To '+this.toDate;
    this.gatLoadData();
   }

  ngOnInit() {
  }
  gatLoadData()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleOrder/PendingCustomerOrderABCClass?fromdate="+this.fromDate+"&toDate="+this.toDate+
                 "&partyId="+this.customerId+"&billSeriesId="+this.billSeriesId+"&userid="+this.userid+"&token="+this.token).subscribe((res)=>{
    this.itemDisplay=res;
   // this.itemDisplay=this.itemDisplay.;
    this.orderData= this.itemDisplay;
    console.log("detail",this.orderData);
    // this.itemDisplay=res;
    // this.itemDisplay=this.itemDisplay.Table1;
    // this.orderHeaderData= this.itemDisplay;
    // console.log("header",this.orderHeaderData);
    this.isLoadingResults=false;
    });
  }
  public print(): void 
  { 
    
    let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
    virtualWindow.document.write('<html><head><title>Print</title>  '); 
    virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
    virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3; } div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}  .border-lb {border: 2px solid #191818f8; border-width:  2px 0 2px 0;} .border-t {border: 2px solid #191818f8; border-width:  0 0 2px 0;}</style>');
    //font: 12pt Georgia, "Times New Roman", Times, serif;
    virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
    
    virtualWindow.document.close(); 
    virtualWindow.focus(); 
        // necessary for IE >= 10 
    setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  }
}
