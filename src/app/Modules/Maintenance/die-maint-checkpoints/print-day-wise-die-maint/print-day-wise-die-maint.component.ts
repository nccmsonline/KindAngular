import { Global } from 'src/app/Global';
import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-day-wise-die-maint',
  templateUrl: './print-day-wise-die-maint.component.html',
  styleUrls: ['./print-day-wise-die-maint.component.css']
})
export class PrintDayWiseDieMaintComponent implements OnInit {

    token:any;  original_url = environment.baseUrl;datePipe = new DatePipe("en-US");
    isLoadingResults=false;fendDate:any;allData:any={};
    dayArray:Array<any>=[];
    nightArray:Array<any>=[];
    title:any;telephone:any;GSTIn:any;PlanNo:any;printFor="";
    repeatHeaders=true;
    companyName:any;Address1:any;Address2:any;fax:any; email:any;pan:any;
    daytotal: any;
    AllData:Array<any>=[]
    nighttotal:any;
    alltotal:any;
    todate:any

    constructor(public dialog: MatDialog,  private http: HttpClient, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any,private globalVar: Global,) 
    {
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.companyName=CompanyData['COMPANYNAME'];
      this.Address1=CompanyData['ADDRESS'];
      this.Address2 = CompanyData['ADDRESS1'];
      this.GSTIn = CompanyData['COMPANYGSTNO'];
      this.telephone = CompanyData['TELEPHONE'];
      this.fax = CompanyData['FAX'];
      this.email = CompanyData['EMAIL'];
      this.pan = CompanyData['COMPANYPAN'];
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.fendDate=data.pdate;
      this.printFor=data.printFor;
      this.isLoadingResults=true;
      this.todate=this.data.toDate
      let todate = formatDate(this.data.toDate, 'dd-MMM-yyyy', 'en-US') 
       this.http.get(this.original_url+"/Maintenance/DieMaint/getdiemaintreportdaywise?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.UserId+"&todate="+todate)
       .subscribe((res :any[])=>{
        this.AllData = res;
        // this.dayArray = alldata.filter(x => x.SHIFT == 'Day');
        // this.nightArray = alldata.filter(x => x.SHIFT == 'Night');
        // this.dayArray=this.allData.Table;
        // this.nightArray=this.allData.Table;
       this.isLoadingResults=false
       this.getTotal();
       });  
      
    }
  
    getTotal() {
      var daytotal: number = 0;
      var nighttotal: number = 0;
  
      if (this.dayArray.length > 0) {
        this.isLoadingResults = true
        this.dayArray.forEach((data) => {
          if (data.WEIGHT == "" || data.WEIGHT == undefined || data.WEIGHT == null || data.WEIGHT == NaN) { data.WEIGHT = 0; } else { data.WEIGHT = data.WEIGHT; }
  
          daytotal = daytotal + parseFloat(data.WEIGHT);
        });
        this.daytotal = daytotal.toFixed(2);
  
        this.PlanNo = this.dayArray[0].DIEPLANNINGNO;
        this.isLoadingResults = false;
      } 
      
      
      if (this.nightArray.length > 0) {
        this.isLoadingResults = true
        this.nightArray.forEach((data) => {
          if (data.WEIGHT == "" || data.WEIGHT == undefined || data.WEIGHT == null || data.WEIGHT == NaN) { data.WEIGHT = 0; } else { data.WEIGHT = data.WEIGHT; }
  
          nighttotal = nighttotal + parseFloat(data.WEIGHT);
        });
        this.nighttotal = nighttotal.toFixed(2);
        this.isLoadingResults = false;
        this.alltotal = daytotal + nighttotal
      }
      
      
      else {
        this.isLoadingResults = false;
      }
    }
    ngOnInit() {
  
    }
    public print(): void 
  { 
    
    let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
    virtualWindow.document.write('<html><head><title>Print</title>  '); 
    virtualWindow.document.write('<style id="defaultCSS" type="text/css">@media print {#content, #page {width: 100%; margin: 0; float: none;}@page { margin: 0.75cm;size: portrait; } body {font: 12pt Georgia, "Times New Roman", Times, serif;line-height: 1.3;background: #fff !important;color: #000;} h1 {font-size: 24pt;} h2, h3, h4 {font-size: 14pt;margin-top: 25px;}a {    page-break-inside:avoid} h1, h2, h3, h4, h5, h6 { page-break-after:avoid; page-break-inside:avoid } img { page-break-inside:avoid;      page-break-after:avoid; } blockquote {    page-break-inside: avoid;} table, pre { page-break-inside:auto ; font-size: 12px; font-weight: 400; font-family: sans-serif;}ul, ol, dl  { page-break-before:avoid }a:link, a:visited, a {background: transparent;color: #520;font-weight: bold;text-decoration: underline;text-align: left;}a {    page-break-inside:avoid}a[href^=http]:after {      content:" <" attr(href) "> ";}$a:after > img {   content: "";}article a[href^="#"]:after {   content: "";}a:not(:local-link):after {   content:" <" attr(href) "> ";}.entry iframe, ins {    display: none;    width:  !important;    height: 0 !important;    overflow: hidden !important;    line-height: 0pt !important;    white-space: nowrap;}.embed-youtube, .embed-responsive {  position: absolute;  height: 0;  overflow: hidden;}#header-widgets, nav, aside.mashsb-container, .sidebar, .mashshare-top, .mashshare-bottom, .content-ads, .make-comment, .author-bio, .heading, .related-posts, #decomments-form-add-comment, #breadcrumbs, #footer, .post-byline, .meta-single, .site-title img, .post-tags, .readability {display: none;}.entry:after {content: "\ ";color: #999 !important;font-size: 1em;padding-top: 30px;}#header:before {content: "\";color: #777 !important;font-size: 1em;padding-top: 30px;text-align: center !important;    } p, address, li, dt, dd, blockquote {font-size: 100%}code, pre { font-family: "Courier New", Courier, mono} ul, ol {list-style: square; margin-left: 18pt;margin-bottom: 20pt;    }li {line-height: 1.6em;}        } div.header { display: block; text-align: center; position: running(header); width: 100%; }</style> ');
     
    console.log(document.getElementById('ravinderpal').innerHTML);
    virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
    
    virtualWindow.document.close(); 
    virtualWindow.focus(); 
        // necessary for IE >= 10 
    setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  }
  
  }
  