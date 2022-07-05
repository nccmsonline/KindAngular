import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-movement-slip',
  templateUrl: './print-movement-slip.component.html',
  styleUrls: ['./print-movement-slip.component.css']
})
export class PrintMovementSlipComponent implements OnInit {
  token:any;  original_url = environment.baseUrl;datePipe = new DatePipe("en-US");
  isLoadingResults=false;fendDate:any;allData:any={};
  dayArray:Array<any>=[];
  nightArray:Array<any>=[];
  title:any;telephone:any;GSTIn:any;PlanNo:any;printFor="";
  repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;fax:any; email:any;pan:any;
  daytotal: any;
  nighttotal:any;
  alltotal:any;
  constructor(public dialog: MatDialog,  private http: HttpClient, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any) 
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
     this.http.get(this.original_url+"/Production/DieAndTools/getMaterialMovementSlipPrint?pdate="+this.fendDate+"&ptype="+this.printFor+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      let alldata:Array<any>=[]
      alldata=this.allData.Table;
      this.dayArray = alldata.filter(x => x.SHIFT == 'Day');
      this.nightArray = alldata.filter(x => x.SHIFT == 'Night');
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
