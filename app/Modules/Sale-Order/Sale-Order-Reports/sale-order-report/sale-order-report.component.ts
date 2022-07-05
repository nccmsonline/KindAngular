import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RecieveCustomerOrderComponent } from './../recieve-customer-order/recieve-customer-order.component';
@Component({
  selector: 'app-sale-order-report',
  templateUrl: './sale-order-report.component.html',
  styleUrls: ['./sale-order-report.component.css']
})
export class SaleOrderReportComponent implements OnInit {
  billseriesList:any=[];userid:any;itemDisplay:any;dateToControl = new FormControl(new Date());dateFormControl = new FormControl(new Date());
  FYUSER:any;ServerIP:any;boid : any;customerList:any=[];curDate:any;fstartDate:any;SaleOrderReport: FormGroup;newData:any={};datePipe = new DatePipe("en-US");
  constructor( private fb: FormBuilder,private router: Router, private http: HttpClient, @Inject('BASE_URL') private original_url : string,  private activatedRoute: ActivatedRoute, public dialog: MatDialog) { 
    this.createForm();
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];;
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];;
   
    this.fstartDate=  CompanyData['FINANCIALYEARSTARTDATE'] ;
    this.curDate= CompanyData['WORKINGDATE'] ;

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid =1;


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
    this.router.navigate(['/received-customer-order-report']);
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
       this.router.navigate(['/pending-customer-order-report']);
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
       this.router.navigate(['/despatched-customer-order-report']);
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
      this.router.navigate(['/despatched-customer-order-report']);
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
      this.router.navigate(['/despatched-customer-order-report']);
 }
 gatLoadData()
 {
   this.http.get(this.original_url+"/SOP/SaleOrder/getOrderLoadEvent?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid).subscribe((res)=>{
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
 createForm() {
  this.SaleOrderReport = this.fb.group({
  
    fromdate :  ['', Validators.required ],
    todate :  ['', Validators.required ],
    
  });
}
}
