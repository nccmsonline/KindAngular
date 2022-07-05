import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
//import { GroupByCustomerPipe } from './mypipefilter';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-pending-customer-orders',
  templateUrl: './pending-customer-orders.component.html',
  styleUrls: ['./pending-customer-orders.component.css']
})
export class PendingCustomerOrdersComponent implements OnInit {
  CompanyName:any; companyData:any;fromDate:any;toDate:any;customerId:any;billSeriesId:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  repeatHeaders = true;isLoadingResults:boolean;
  Address:any;reportname:any;newData:any={};itemDisplay:any;orderData:any=[];orderHeaderData:any=[];
  constructor(@Inject('BASE_URL') private original_url : string, private http: HttpClient) {
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.CompanyName=this.companyData['COMPANYNAME'];
    this.Address=this.companyData['ADDRESS'];
    this.Address=this.Address+' '+this.companyData['ADDRESS1'];
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
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
    this.http.get(this.original_url+"/SOP/SaleOrder/PendingCustomerOrder?serverip="+this.ServerIP+
                 "&fyuser="+this.FYUSER+"&boid="+this.boid+"&fromdate="+this.fromDate+"&toDate="+this.toDate+
                 "&partyId="+this.customerId+"&billSeriesId="+this.billSeriesId).subscribe((res)=>{
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.orderData= this.itemDisplay;
    console.log("detail",this.orderData);
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table1;
    this.orderHeaderData= this.itemDisplay;
    console.log("header",this.orderHeaderData);
    this.isLoadingResults=false;
    });
  }
}

// @Pipe({ name: 'groupByCustomer' })
// @Injectable()
// export class GroupByCustomerPipe implements PipeTransform {
//   transform(allOrders: any[], field: string, value: string):any[] {
//     if (!allOrders) return [];
//     return allOrders.filter(it => it[field] == value);
//   }
// }