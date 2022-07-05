import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RecieveCustomerOrderComponent } from './../recieve-customer-order/recieve-customer-order.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
//import { error } from 'console';
import { environment } from 'src/environments/environment';
import { DespatchedCustomerOrdersComponent } from '../despatched-customer-orders/despatched-customer-orders.component';
import { PendingCustomerOrdersComponent } from '../pending-customer-orders/pending-customer-orders.component';
import { PeningOrderReportABCCatComponent } from '../pening-order-report-abccat/pening-order-report-abccat.component';
@Component({
  selector: 'app-sale-order-report',
  templateUrl: './sale-order-report.component.html',
  styleUrls: ['./sale-order-report.component.css']
})
export class SaleOrderReportComponent implements OnInit {
   original_url = environment.baseUrl;companyName:any;Address2:any;Address1:any;
  orderHeader:any={};OrderDetail:Array<any>=[]; isLoadingResults=false;
  billseriesList:any=[];userid:any;itemDisplay:any;dateToControl = new FormControl(new Date());dateFormControl = new FormControl(new Date());token:any;
  FYUSER:any;ServerIP:any;boid : any;customerList:any=[];curDate:any;fstartDate:any;SaleOrderReport: FormGroup;newData:any={};datePipe = new DatePipe("en-US");
  constructor( private fb: FormBuilder,private router: Router, private http: HttpClient,  private activatedRoute: ActivatedRoute, public dialog: MatDialog) { 
    this.createForm();
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];;
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];;
    this.companyName=CompanyData['COMPANYNAME'];
    this.Address1=CompanyData['ADDRESS'];
    this.Address2 = CompanyData['ADDRESS1'];

    this.fstartDate=  CompanyData['FINANCIALYEARSTARTDATE'] ;
    this.curDate= CompanyData['WORKINGDATE'] ;

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];

    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.curDate);
    this.dateToControl.setValue(currentDate);

  }

  ngOnInit() {
  }
  ngAfterContentInit() {
    this.gatLoadData();
 }
 printRecievedOrder()
 {
   console.log("this.dateToControl",this.dateToControl.value);
   var CUSTOMERID:any;
   var BILLSERIESID:any;
   CUSTOMERID=0;BILLSERIESID=0;
   if(this.newData.CUSTOMERID!=undefined&&this.newData.CUSTOMERID!='')
      CUSTOMERID=this.newData.CUSTOMERID;
   if(this.newData.BILLSERIESID!=undefined&&this.newData.BILLSERIESID!='')
      BILLSERIESID=this.newData.BILLSERIESID;

    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    customerId:CUSTOMERID, 
    billSeriesId:BILLSERIESID};
    sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
    //this.router.navigate(['/received-customer-order-report']);
    
    const dialogRef = this.dialog.open(RecieveCustomerOrderComponent, {
    }
    );
 }

 printPeningOrder()
 {
   console.log("this.dateToControl",this.dateToControl.value);
   var CUSTOMERID:any;
   var BILLSERIESID:any;
   CUSTOMERID=0;BILLSERIESID=0;
   if(this.newData.CUSTOMERID!=undefined&&this.newData.CUSTOMERID!='')
      CUSTOMERID=this.newData.CUSTOMERID;
   if(this.newData.BILLSERIESID!=undefined&&this.newData.BILLSERIESID!='')
      BILLSERIESID=this.newData.BILLSERIESID;
 
       var orderfilter:any={};
       orderfilter={
       fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
       toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
       customerId:CUSTOMERID, 
       billSeriesId:BILLSERIESID};
       sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
      // this.router.navigate(['/pending-customer-order-report']);
      
      const dialogRef = this.dialog.open(PendingCustomerOrdersComponent, {
      }
      );
 }
 printPendingOrderABCClassWise()
 {
   console.log("this.dateToControl",this.dateToControl.value);
   var CUSTOMERID:any;
   var BILLSERIESID:any;
   CUSTOMERID=0;BILLSERIESID=0;
   if(this.newData.CUSTOMERID!=undefined&&this.newData.CUSTOMERID!='')
      CUSTOMERID=this.newData.CUSTOMERID;
   if(this.newData.BILLSERIESID!=undefined&&this.newData.BILLSERIESID!='')
      BILLSERIESID=this.newData.BILLSERIESID;
 
       var orderfilter:any={};
       orderfilter={
       fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
       toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
       customerId:CUSTOMERID, 
       billSeriesId:BILLSERIESID};
       sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
      // this.router.navigate(['/pending-order-report-ABC-classwise']);
     const dialogRef = this.dialog.open(PeningOrderReportABCCatComponent, {
    }
    );
     
 }
 prinDespatchedCustomerOrder()
 {
   console.log("this.dateToControl",this.dateToControl.value);
   var CUSTOMERID:any;
   var BILLSERIESID:any;
   CUSTOMERID=0;BILLSERIESID=0;
   if(this.newData.CUSTOMERID!=undefined&&this.newData.CUSTOMERID!='')
      CUSTOMERID=this.newData.CUSTOMERID;
   if(this.newData.BILLSERIESID!=undefined&&this.newData.BILLSERIESID!='')
      BILLSERIESID=this.newData.BILLSERIESID;
 
       var orderfilter:any={};
       orderfilter={
       fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
       toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
       customerId:CUSTOMERID, 
       billSeriesId:BILLSERIESID,
       orderno:0,customerpo:''};
       sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
       const dialogRef = this.dialog.open(DespatchedCustomerOrdersComponent, {
       }
       );
       //this.router.navigate(['/despatched-customer-order-report']);
 }
 
 prinDespatchedByOACustomerOrder()
 {
  console.log("this.dateToControl OA",this.dateToControl.value);
  var CUSTOMERID:any;
  var BILLSERIESID:any;
  CUSTOMERID=0;BILLSERIESID=0;
  if(this.newData.CUSTOMERID!=undefined&&this.newData.CUSTOMERID!='')
     CUSTOMERID=this.newData.CUSTOMERID;
  if(this.newData.BILLSERIESID!=undefined&&this.newData.BILLSERIESID!='')
     BILLSERIESID=this.newData.BILLSERIESID;

      var orderfilter:any={};
      orderfilter={
      fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
      toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
      customerId:CUSTOMERID, 
      billSeriesId:BILLSERIESID,
      orderno:this.newData.OANO,customerpo:''};
      sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
     // this.router.navigate(['/despatched-customer-order-report']);
     const dialogRef = this.dialog.open(DespatchedCustomerOrdersComponent, {
    }
    );
 }
 prinDespatchedByPOCustomerOrder()
 {
  console.log("this.dateToControl PO",this.dateToControl.value);
  var CUSTOMERID:any;
  var BILLSERIESID:any;
  CUSTOMERID=0;BILLSERIESID=0;
  if(this.newData.CUSTOMERID!=undefined&&this.newData.CUSTOMERID!='')
     CUSTOMERID=this.newData.CUSTOMERID;
  if(this.newData.BILLSERIESID!=undefined&&this.newData.BILLSERIESID!='')
     BILLSERIESID=this.newData.BILLSERIESID;

      var orderfilter:any={};
      orderfilter={
      fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
      toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
      customerId:CUSTOMERID, 
      billSeriesId:BILLSERIESID,
      orderno:0,customerpo:this.newData.CustomerPO};
      sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
      //this.router.navigate(['/despatched-customer-order-report']);
      const dialogRef = this.dialog.open(DespatchedCustomerOrdersComponent, {
      }
      );
 }
 gatLoadData()
 {
   this.http.get(this.original_url+"/SOP/SaleOrder/getOrderLoadEvent?token="+this.token).subscribe((res)=>{
   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table;
   this.customerList= this.itemDisplay;
  //  this.itemDisplay=res;
  //  this.itemDisplay=this.itemDisplay.Table2;
  //  this.transportModeList= this.itemDisplay; 
   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table1;
   this.billseriesList= this.itemDisplay; 
  console.log("res",res);
   });
 }
 prinSaleOrder()
 {
    if((this.newData.ORDERNO==undefined || this.newData.ORDERNO=='') && (this.newData.IPONO==undefined||this.newData.IPONO==''))
    {
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
         data: {
           wrongData: 'wrongData',
           displayMsg:'Please enter Order No./IPO No.'
         }
       });
       return;
    }
    
    this.showOrderDetail();
    
 }
 async showOrderDetail()
 {
    this.isLoadingResults=true;
   this.itemDisplay=await this.http.get(this.original_url+"/SOP/SaleOrder/printOrderDetail?orderno="+this.newData.ORDERNO+"&IPONO="+this.newData.IPONO+"&token="+this.token).toPromise();
     this.orderHeader=this.itemDisplay.Table[0];
     this.OrderDetail= this.itemDisplay.Table1;
     
     await this.waitForOneSecond();
     //this.newData.Ravi=1;
   //  let myhtml=document.getElementById('ravinderpal').innerHTML;
     this.newData.Ravi=0;
     this.isLoadingResults=false;
     let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
     virtualWindow.document.write('<html><head><title>Print</title>  '); 
     virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
     virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
     virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
     virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
     
     virtualWindow.document.write('<style type="text/css"> body { font: 12pt Georgia, "Times New Roman", Times, serif; line-height: 1.3; padding-top: 50px; } div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; }</style>');
     virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
     
     virtualWindow.document.close(); 
   
 }

 waitForOneSecond() {
   return new Promise(resolve => {
     setTimeout(() => {
       resolve("I promise to return after one second!");
     }, 2000);
   });
 }

 printOrder()
 {
   let data:any={};
   this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleOrder/printOrderDetail?orderno="+this.newData.ORDERNO+"&IPONO="+this.newData.IPONO+"&token="+this.token).subscribe((res)=>{
     this.itemDisplay=res;
     console.log("Mrir Load", res);
     this.itemDisplay=this.itemDisplay.Table;
     data.header=this.itemDisplay[0];
     this.itemDisplay=res;
     data.detail=this.itemDisplay.Table1;
     
     data.title="Customer Order";
     data.backto='/customer-order-reports';
      sessionStorage.setItem('order', JSON.stringify(data));
     this.router.navigate(['/print-customer-order']), {skipLocationChange:true};
     this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    });  
 }

 createForm() {
  this.SaleOrderReport = this.fb.group({
  
    fromdate :  ['', Validators.required ],
    todate :  ['', Validators.required ],
    
  });
}
}
