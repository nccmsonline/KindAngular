import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Global } from 'src/app/Global';

@Component({
  selector: 'app-gstinvoice',
  templateUrl: './gstinvoice.component.html',
  styleUrls: ['./gstinvoice.component.css']
})
export class GSTInvoiceComponent implements OnInit {
  token: any;
  userid: any;
  routeID: any;
  companyData:any={};
  headerData:any={};
  isLoadingResults: boolean;
  allData: any={};
  original_url = environment.baseUrl;
  detail:Array<any>=[];
  paymentDt:Array<any>=[];
  printCopyFor="";
  repeatHeaders=true;
  constructor(  private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient,public AppUser:Global) { 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.printCopyFor = this.activatedRoute.snapshot.paramMap.get('copy');

    // this.companyData.CompanyName="KAPSONS INDUSTRIES PVT LTD (UNIT-2)";
    // this.companyData.CompanyAddress="G.T. Road Suranussi, Jalandhar(Punjab)-144027";
    // this.companyData.Telephone="Tel. :0181-5066370, 5066265, 5066261 FAX:0181-5066308";
    // this.companyData.CompanyGSTIn="GSTIn:03AAACF0610J3ZA";
    // this.companyData.CompanyEmail ="E-mail:ravinderpal@kapsonsindustries.com";
    // this.companyData.CompanyPAN="PAN:AAACF0610J";
    
    
    
    
   

    this.getDetail();

  }

  ngOnInit() {
  }
  getDetail()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleInvoice/PrintInvoice?invid="+this.routeID+"&token="+this.token+"&continued=Y").subscribe((res)=>{
      this.allData=res;
      console.log("inv detail",res);
      this.allData=this.allData.Table1;
      this.headerData=this.allData[0];
      this.allData=res;
      this.detail=this.allData.Table2;
      this.paymentDt=this.allData.Table3;
      this.isLoadingResults=false;
     
      if(this.AppUser.CommpanyId==2||this.AppUser.CommpanyId==3)
      {
        this.headerData.MaterialDesRemarks="";
        if(this.AppUser.BranchId==2)
        {this.headerData.MaterialDesRemarks="Material to be Despatched from manufacturer premises M/S Kapsons Industries Pvt. Ltd., Jalandhar-Punjab(INDIA)"}
        else if(this.AppUser.BranchId==4)
        {this.headerData.MaterialDesRemarks="Material to be Despatched from manufacturer premises M/S Kapsons Insulation Pvt. Ltd., Jalandhar-Punjab(INDIA)"}
        else if(this.AppUser.BranchId==5)
        {this.headerData.MaterialDesRemarks="Material to be Despatched from manufacturer premises M/S Kapsons Industries Pvt. Ltd.(PDC Div.), Jalandhar-Punjab(INDIA)"}
        else if(this.AppUser.BranchId==7)
        {this.headerData.MaterialDesRemarks="Material to be Despatched from manufacturer premises M/S Kapsons Industries Pvt. Ltd., Pune-Maharashtra(INDIA)"}
       console.log("this.headerData.MaterialDesRemarks",this.headerData.MaterialDesRemarks);
       console.log("his.AppUser.BranchId",this.AppUser.BranchId);
      }
      if(this.printCopyFor=="O")
      {this.headerData.Original=true;}
      else if(this.printCopyFor=="D")
      {this.headerData.Duplicate=true;}
      else if(this.printCopyFor=="T")
      {this.headerData.Triplicate=true;}
      else
      {this.headerData.Extra=true;}
     });  
  }
  public print(): void 
  { 
    // let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
    // virtualWindow.document.write('<html><head><title>Print</title>  '); 
    // virtualWindow.document.write('<style id="defaultCSS" type="text/css">@media print {#content, #page {width: 100%; margin: 0; float: none;}@page { margin: 0.1cm; } body {font: 12pt Georgia, "Times New Roman", Times, serif;line-height: 1.3;background: #fff !important;color: #000;} h1 {font-size: 24pt;} h2, h3, h4 {font-size: 14pt;margin-top: 25px;}a {    page-break-inside:avoid} h1, h2, h3, h4, h5, h6 { page-break-after:avoid; page-break-inside:avoid } img { page-break-inside:avoid;      page-break-after:avoid; } blockquote {    page-break-inside: avoid;} table, pre { page-break-inside:auto ; font-size: 12px; font-weight: 400; font-family: sans-serif;}ul, ol, dl  { page-break-before:avoid }a:link, a:visited, a {background: transparent;color: #520;font-weight: bold;text-decoration: underline;text-align: left;}a {    page-break-inside:avoid}a[href^=http]:after {      content:" <" attr(href) "> ";}$a:after > img {   content: "";}article a[href^="#"]:after {   content: "";}a:not(:local-link):after {   content:" <" attr(href) "> ";}.entry iframe, ins {    display: none;    width:  !important;    height: 0 !important;    overflow: hidden !important;    line-height: 0pt !important;    white-space: nowrap;}.embed-youtube, .embed-responsive {  position: absolute;  height: 0;  overflow: hidden;}#header-widgets, nav, aside.mashsb-container, .sidebar, .mashshare-top, .mashshare-bottom, .content-ads, .make-comment, .author-bio, .heading, .related-posts, #decomments-form-add-comment, #breadcrumbs, #footer, .post-byline, .meta-single, .site-title img, .post-tags, .readability {display: none;}.entry:after {content: "\ ";color: #999 !important;font-size: 1em;padding-top: 30px;}#header:before {content: "\";color: #777 !important;font-size: 1em;padding-top: 30px;text-align: center !important;    } p, address, li, dt, dd, blockquote {font-size: 100%}code, pre { font-family: "Courier New", Courier, mono} ul, ol {list-style: square; margin-left: 18pt;margin-bottom: 20pt;    }li {line-height: 1.6em;}        } div.header { display: block; text-align: center; position: running(header); width: 100%; }  .emt-container {    position: relative;    width: 100%;    height: 110px;    border-bottom: 1px solid;  }  .top-right {    position: absolute;    top: 8px;    right: 16px;  }  .bottom-right {    position: absolute;    bottom: 8px;    right: 16px;  }  .InvoiceTypek {    position: absolute;    top: 10px;    left: 50%;    font-size: 14px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .gstno {    position: absolute;    top: 35px;    left: 50%;    width: 100%;    text-align: center;    font-size: 14px ;   font-weight: 800;    transform: translate(-50%, -50%);  }  .companyname {    position: absolute;    top: 60px;    left: 50%;    font-size: 32px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .centered2 {    position: absolute;    top: 60px;    left: 50%;    font-size: 28px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .CompanyAddress {    position: absolute;    top: 88px;    left: 50%;    font-size: 12px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .Telephone {    position: absolute;    top: 102px;    left: 50%;    font-size: 12px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .head-container2 {    position: relative;    width: 100%;    border-bottom: 1px solid;    display: flex;  }  .gstrule  {    position: relative;    font-size: 10px ;    text-align: center;    font-weight: 800;    width: 74%;    border-right: 1px solid;  }  .companyStateCode  {     position: relative;    font-size: 10px ;    padding-left: 4px;    text-align: left;    font-weight: 800;    width: 26%;  }   .paddress  {    position: relative;    font-size: 12px ;    padding-left: 4px;    text-align: left;    font-weight: 800;    width: 37%;    height: 200px;    border-right: 1px solid;  }  .invinfo  {    position: relative;    font-size: 12px ;    padding-left: 4px;    text-align: left;    font-weight: 800;    width: 26%;    height: 200px;  }  .invno{    position: relative;    font-size: 14px ;    font-weight: 800;    background-color:#0e0e6e;    color: white;    width: 120px;  }  .invno1{    position: relative;    font-size: 14px ;    font-weight: 800;  }  .add-container {    position: relative;    width: 100%;    font-size: 12px ;    padding-left: 4px;    display: flex;  }  .container50 {    position: relative;    width: 50%;  } </style> ');
    // console.log(document.getElementById('ravinderpal').innerHTML);
    // virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
    let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
    virtualWindow.document.write('<html><head><title>Print</title>  '); 
    virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
    virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3;-webkit-print-color-adjust: exact !important; }  @page {margin: 0.5cm; } .emt-container {position: relative;  font-family: Arial, Helvetica, sans-serif;  width: 100%;    height: 145px;    border-bottom: 1px solid;  }  .top-right {    position: absolute;    top: 8px;    right: 16px;  }  .bottom-right {    position: absolute;    bottom: 8px;    right: 16px;  }  .InvoiceType {    position: absolute;    top: 10px;    left: 50%;    font-size: 17px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .gstno {    position: absolute;    top: 35px;    left: 50%;    width: 100%;    text-align: center;    font-size: 20px ;   font-weight: 800;    transform: translate(-50%, -50%);  }  .companyname {  font-family: Arial, Helvetica, sans-serif;  position: absolute;    top: 68px;    left: 50%;    font-size: 32px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .centered2 {    position: absolute;    top: 60px;    left: 50%;    font-size: 28px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .CompanyAddress {    position: absolute;    top: 97px;    left: 50%;    font-size: 18px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .Telephone {    position: absolute;    top: 125px;    left: 50%;    font-size: 18px ;    font-weight: 800;    width: 100%;    text-align: center;    transform: translate(-50%, -50%);  }  .head-container2 {    position: relative;    width: 100%;    border-bottom: 1px solid;    display: flex;  }  .gstrule  {  display: flex;  position: relative;    font-size: 14px ;    text-align: center;    font-weight: 800;    width: 74%;    border-right: 1px solid;  }  .companyStateCode  {     position: relative;    font-size: 14px ;    padding-left: 4px;    text-align: left;  vertical-align:middle;  font-weight: 800;    width: 26%;  }   .paddress{position: relative; font-size:12px; padding-left:4px; text-align: left; font-weight: 800; width:37%; height:180px;border-right: 1px solid;}  .invinfo{position:relative;font-size:12px; padding-left:4px; text-align:left;font-weight: 800; width:26%;height:180px;}  .invno{position:relative;font-size: 14px;font-weight: 800;background-color:#0e0e6e;color: white;width: 130px;}  .invno1{position:relative; font-size:14px;    font-weight: 800;  }  .add-container {    position: relative;    width: 100%;    font-size: 12px ;    padding-left: 4px;    display: flex;  }  .container60 {position: relative;width: 60%;} .container40{position: relative;width: 40%;}');
    virtualWindow.document.write('.detail-container {position: relative;width: 100%;border-bottom: 1px solid;height: 720px;display: flex;}');
    virtualWindow.document.write('table, pre { page-break-inside:auto ; font-size: 13px; font-weight: 800;font-family: Arial, Helvetica, sans-serif;}.bottom1{position: absolute;width:100% ;}');
    virtualWindow.document.write('.calc {border-bottom: 1px solid;border-left: 1px solid;height: 225px;font-size: 14px ;font-weight: 800;}.top-left {position: absolute;top: 8px;left: 16px;}.bottom-left {position: absolute;bottom: 8px;left: 16px;}');
    virtualWindow.document.write('.container20 {position: relative;width: 20%;} .container80 {position: relative;width: 80%;}  .billCopy{font-size:16px;font-weight:800;}');
    virtualWindow.document.write('.container25{position: relative;width: 25%;vertical-align: middle;font-size: 13px;}');
    virtualWindow.document.write('</style>');
    virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
    virtualWindow.document.close(); 
    //virtualWindow.focus(); 
    setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   

    
    
    

  }
  backToView()
  {
    
    this.router.navigate(['proforma-list/P'], {skipLocationChange:true});
  }
}
