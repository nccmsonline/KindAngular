import { Component, OnInit, PipeTransform, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { formatDate, DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-new-gate-entry',
  templateUrl: './add-new-gate-entry.component.html',
  styleUrls: ['./add-new-gate-entry.component.css']
})
export class AddNewGateEntryComponent implements OnInit {
  filterPipe =new GrdFilterPipe;
  original_url = environment.baseUrl;
  newData:any={};isLoadingResults:any;WorkingDate:any;miniInwardDate:any;
  token: any;
  userid: any;
  routeID: string;
  routeAction: string;
  dropDownListFor="";
  allData:any={};
  partyNameList:Array<any>=[];
  filteredcategoryList:Array<any>=[];
  filteredvehicleList:Array<any>=[];
  categoryList:Array<any>=[];
  vehicleList:Array<any>=[];
  
  constructor(public dialog: MatDialog,   private router: Router,  private activatedRoute: ActivatedRoute, private http: HttpClient) {
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.newData.GINDT= new Date(CompanyData['WORKINGDATE']);
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.miniInwardDate= new Date(CompanyData['WORKINGDATE']);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');

   }

  ngOnInit() {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Store/getGateEntryLoad?ginid="+this.routeID+"&token="+this.token).subscribe((res)=>{
     this.allData=res;
     console.log("Mrir Load", res);
     this.categoryList=this.allData.Table;
     this.vehicleList=this.allData.Table2;
     
     if(this.routeAction!='new')
     {
      this.allData=this.allData.Table3;
      this.newData=this.allData[0];
      if(this.newData.POREQUIRED=='Y')
      {this.getPOList();}
      this.newData.GINTIME =new Date(this.newData.GINTIME);
     }
     else
     {
      this.allData=this.allData.Table1;
      this.newData.GINNO=this.allData[0].GOODSINCOMINGNO;
     }
     
     this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    });  
  }
  getPOList()
  {

  }
  searchMRIRCategory(term, flag)
  {
    if(term !== '' || flag=='A')
    {
      if(flag=='A')
      {
        this.filteredcategoryList=this.categoryList;  
        if(this.dropDownListFor=='MRIRCATEGORY')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='MRIRCATEGORY';
        }
      }
      else
      {
        this.dropDownListFor='MRIRCATEGORY';
        this.filteredcategoryList=this.filterPipe.transform(this.categoryList,term, 'GROUPNAME');  
      }
    }
    else
    {
      this.filteredcategoryList = [];
      this.dropDownListFor='';
    }
  }
  onChangeOfCategory(row, data)
  {
    data.GROUPNAME=row.GROUPNAME;  
    data.ITEMGROUPID=row.ITEMGROUPID;
    data.SHORTNAME=row.SHORTNAME;
    data.POREQUIRED=row.POREQUIRED;
    data.NAME='';
    this.dropDownListFor='';
  }
  searchTransport(term, flag)
  {
    if(term !== '' || flag=='A')
    {
      if(flag=='A')
      {
        this.filteredvehicleList=this.vehicleList;  
        if(this.dropDownListFor=='TRANSPORT')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='TRANSPORT';
        }
      }
      else
      {
        this.dropDownListFor='TRANSPORT';
        this.filteredvehicleList=this.filterPipe.transform(this.vehicleList,term, 'VEHICLETYPE');  
      }
    }
    else
    {
      this.filteredvehicleList = [];
      this.dropDownListFor='';
    }
  }
  onChangeOfTransport(row, data)
  {
    console.log("Data",data);
    console.log("row",row);
    data.VECHICLETYPEID=row.VEHICLETYPEID;  
    data.VECHICLETYPE=row.VEHICLETYPE;
   
    this.dropDownListFor='';
  }
  searchParty(term, flag)
  {
    
    if(term !== '' )
    {
      let cusSup='S';
      if(this.newData.SHORTNAME=='CMR'||this.newData.SHORTNAME=='REJ')
      {cusSup='C'}
      if(flag=='A')
      {
        if(this.dropDownListFor=='PARTYNAME')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='PARTYNAME';
        }
      }
      else
      {
        this.dropDownListFor='PARTYNAME';
      }
      this.http.get(this.original_url+"/Master/getAccountList?flag="+cusSup+"&search="+term+"&token="+this.token).subscribe((res)=>{
        this.allData=res;
        this.partyNameList=this.allData.Table;
        this.isLoadingResults=false;
        },
        error=>{
          this.isLoadingResults=false;
        });   
      
    }
    else
    {
      this.newData.PARTYID=0;
      this.partyNameList = [];

      this.dropDownListFor='';
    }
  }
  onChangeOfParty(row, data)
  {
    data.NAME=row.NAME;  
    data.PARTYID=row.CUSTOMERID;
    data.STATEID=row.STATEID;
    data.WITHINSTATE=row.WITHINSTATE;
    data.ADDRESS1=row.ADDRESS1;
    data.ADDRESS2=row.ADDRESS2;
    data.CITYDESC=row.CITYDESC;
    data.GSTNO=row.GSTNO;
     this.dropDownListFor='';
    if(this.newData.POREQUIRED=='Y')
    {this.getPOList();}
    
    console.log("Party", row);
  }

  refreshDates()
  {
    this.newData.BILLDT='';
    this.newData.CHALLANDT='';
    this.newData.GRDATE='';
  }
  saverecord(mode)
  {
    this.isLoadingResults=true;
    let header:Array<any>=[], detail:Array<any>=[];
        if(!this.validateData())
        {
          this.isLoadingResults=false;
          return;
        }
       

       
        let tmp:any={};

        tmp.PARTYID=this.newData.PARTYID;
       
      
       
       
        tmp.VehicleNo=this.newData.VEHICLENO;
        tmp.DriverName=this.newData.DRIVERNAME;
        tmp.POId=0;
        tmp.BillNo=this.newData.BILLNO;
        if(this.newData.BILLDT!=undefined&&this.newData.BILLDT!='')
        {tmp.BILLDT=formatDate(this.newData.BILLDT, 'dd-MMM-yyyy', 'en-US', '+0530'); }
        tmp.ChallanNo=this.newData.CHALLANNO;
        if(this.newData.CHALLANDT!=undefined&&this.newData.CHALLANDT!='')
        {tmp.CHALLANDT=formatDate(this.newData.CHALLANDT, 'dd-MMM-yyyy', 'en-US', '+0530');}
        tmp.GINTIME=  formatDate(this.newData.GINTIME, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530');     

        tmp.VECHICLETYPE=this.newData.VECHICLETYPE;
        tmp.VECHICLETYPEID=this.newData.VECHICLETYPEID;
        tmp.GRNo=this.newData.GRNO;
        if(this.newData.GRDATE!=undefined&&this.newData.GRDATE!='')
        {tmp.GRDate=formatDate(this.newData.GRDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); }

 

        if(mode=='Insert')
        {
          tmp.CompanyId=1;
          tmp.ITEMGROUPID=this.newData.ITEMGROUPID;
          tmp.GINNo=':A';
          tmp.GINId=':B';
          tmp.GINDt=':C';
          tmp.BranchId=':D';
          tmp.Userid=':E';
          tmp.Edate=':F';

        }
        else
        {
          tmp.Mdate=":A";
        }
        header.push(tmp);
        let mrirno:any;
        const  params = new  HttpParams()
        .set('GINId', this.routeID)
        .set('action', mode)
        .set('token', this.token)
        .set('data', JSON.stringify(header));
        
        
      this.http.post(this.original_url+"/PurachaseAndStore/Store/SaveGateEntry", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        mrirno=res;
        if (parseInt(mrirno)>0)
        {
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'sucess',
                    displayMsg:'Data Saved'
                  }
                });
               this.newData={};
               
               this.router.navigate(['/gate-entry']);
        }
        else
        {
                  const dialogRef = this.dialog.open(SuccessDialogComponent, {
                    data: {
                      wrongData: 'wrongData',
                      displayMsg:'Somthing went wrong'
                    }
                  });
        }
        this.isLoadingResults=false;
      },
      error=>{
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Somthing went wrong'
          }
        });
        this.isLoadingResults=false;
      });

  }
  validateData()
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
       try
       {
            if(this.newData.ITEMGROUPID==undefined||this.newData.ITEMGROUPID==0||this.newData.ITEMGROUPID==''||this.newData.GROUPNAME=='' )
            {flag=false; msg=msg+"<li> Inward Category not selected.</li>"}
            if(this.newData.PARTYID==undefined||this.newData.PARTYID==0||this.newData.PARTYID==''|| this.newData.NAME=='')
            {flag=false; msg=msg+"<li> Party not selected.</li>"}
            if(this.newData.VECHICLETYPEID==undefined||this.newData.VECHICLETYPEID==0||this.newData.VECHICLETYPEID==''||this.newData.VECHICLETYPE=='' )
            {flag=false; msg=msg+"<li> Mode of Transport not select.</li>"}
            if(this.newData.BILLNO!=undefined&&this.newData.BILLNO!=0&&this.newData.BILLNO!=''&&(this.newData.BILLDT==undefined||this.newData.BILLDT==''))
            {flag=false; msg=msg+"<li> Bill date not entred.</li>"}
            if(this.newData.CHALLANNO!=undefined&&this.newData.CHALLANNO!=0&&this.newData.CHALLANNO!=''&&(this.newData.CHALLANDT==undefined||this.newData.CHALLANDT==''))
            {flag=false; msg=msg+"<li> Challan date not entred.</li>"}
            if((this.newData.BILLNO==undefined||this.newData.BILLNO==0||this.newData.BILLNO=='')&&(this.newData.CHALLANNO==undefined||this.newData.CHALLANNO==0||this.newData.CHALLANNO==''))
            {flag=false; msg=msg+"<li> Document no not mentioned.</li>"}
            if(this.newData.GRNO!=undefined&&this.newData.GRNO!=0&&this.newData.GRNO!=''&&(this.newData.GRDATE==undefined||this.newData.GRDATE==0||this.newData.GRDATE==''))
            {flag=false; msg=msg+"<li> GRN date not entred.</li>"}
            if(this.newData.GINTIME==undefined||this.newData.GINTIME=='' )
            {flag=false; msg=msg+"<li>Goods incomming time not entred.</li>"}
       }
       catch(error)
       {
        flag=false;
        msg=msg+"* Some Error occured<br/>"
       }
               
       if(flag==false) 
       {
         this.isLoadingResults=false;
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
       }
     return flag;
  }
  print()
  {
    ;
    const dialogRef = this.dialog.open(gateEntryPrintComponent, {
      data:{GINID:this.routeID}
    }
    );
  }
}
export class GrdFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchOn: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    
    searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it[searchOn].toLowerCase().includes(searchText);
        });
   } 
}
@Component({
  selector: 'gateEntryPrint',
  templateUrl: './gateEntryPrint.html',
  styleUrls: ['./add-new-gate-entry.component.css']
})
export class gateEntryPrintComponent implements OnInit {
  token:any;  original_url = environment.baseUrl;datePipe = new DatePipe("en-US");
  isLoadingResults=false;lGinId:any;allData:any={};newData:any={};
  title:any;telephone:any;GSTIn:any;PlanNo:any;printFor="";
  repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;fax:any; email:any;pan:any;
  constructor(public dialog: MatDialog,  private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.lGinId=data.GINID;
    
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Store/getGateEntryLoad?ginid="+this.lGinId+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.allData=this.allData.Table3;
      this.newData=this.allData[0];
      console.log("rr",this.newData);
      
      this.isLoadingResults=false;
     });  
  }
  ngOnInit() {

  }
  public print(): void 
{ 
  
  // let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  // virtualWindow.document.write('<html><head><title>Print</title>  '); 
  // virtualWindow.document.write('<style id="defaultCSS" type="text/css">@media print {#content, #page {width: 100%; margin: 0; float: none;}@page { margin: 0.75cm; } body {font: 12pt Georgia, "Times New Roman", Times, serif;line-height: 1.3;background: #fff !important;color: #000;} h1 {font-size: 24pt;} h2, h3, h4 {font-size: 14pt;margin-top: 25px;}a {    page-break-inside:avoid} h1, h2, h3, h4, h5, h6 { page-break-after:avoid; page-break-inside:avoid } img { page-break-inside:avoid;      page-break-after:avoid; } blockquote {    page-break-inside: avoid;} table, pre { page-break-inside:auto ; font-size: 12px; font-weight: 400; font-family: sans-serif;}ul, ol, dl  { page-break-before:avoid }a:link, a:visited, a {background: transparent;color: #520;font-weight: bold;text-decoration: underline;text-align: left;}a {    page-break-inside:avoid}a[href^=http]:after {      content:" <" attr(href) "> ";}$a:after > img {   content: "";}article a[href^="#"]:after {   content: "";}a:not(:local-link):after {   content:" <" attr(href) "> ";}.entry iframe, ins {    display: none;    width:  !important;    height: 0 !important;    overflow: hidden !important;    line-height: 0pt !important;    white-space: nowrap;}.embed-youtube, .embed-responsive {  position: absolute;  height: 0;  overflow: hidden;}#header-widgets, nav, aside.mashsb-container, .sidebar, .mashshare-top, .mashshare-bottom, .content-ads, .make-comment, .author-bio, .heading, .related-posts, #decomments-form-add-comment, #breadcrumbs, #footer, .post-byline, .meta-single, .site-title img, .post-tags, .readability {display: none;}.entry:after {content: "\ ";color: #999 !important;font-size: 1em;padding-top: 30px;}#header:before {content: "\";color: #777 !important;font-size: 1em;padding-top: 30px;text-align: center !important;    } p, address, li, dt, dd, blockquote {font-size: 100%}code, pre { font-family: "Courier New", Courier, mono} ul, ol {list-style: square; margin-left: 18pt;margin-bottom: 20pt;    }li {line-height: 1.6em;}        } div.header { display: block; text-align: center; position: running(header); width: 100%; }</style> ');
   
  // console.log(document.getElementById('ravinderpal').innerHTML);
  // virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
  
  // virtualWindow.document.close(); 
  // virtualWindow.focus(); 
     
  // setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  virtualWindow.document.write('<html><head><title>Print</title>  '); 
  virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
  virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3; } footer {position: fixed;bottom: 30px;} div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}</style>');
  virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
  virtualWindow.document.close(); 
  virtualWindow.focus(); 
  setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   

}
}
