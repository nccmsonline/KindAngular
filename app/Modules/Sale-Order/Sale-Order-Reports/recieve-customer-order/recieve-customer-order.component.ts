import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
//import { GroupByCustomerPipe } from './mypipefilter';
import { Pipe, PipeTransform } from '@angular/core';
@Component({
  selector: 'app-recieve-customer-order',
  templateUrl: './recieve-customer-order.component.html',
  styleUrls: ['./recieve-customer-order.component.css']
})
export class RecieveCustomerOrderComponent implements OnInit {
  isLoadingResults:boolean;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;customerId:any;billSeriesId:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;repeatHeaders=true;
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


    // this.mydata='';
    // this.fromDate=data.fromDate;
    // this.toDate=data.toDate;
    // this.customerId=data.customerId;
    // this.billSeriesId=data.billSeriesId;
    var filterData= sessionStorage.getItem("orderfilter");
    filterData=JSON.parse(filterData);
    
    this.fromDate=filterData["fromDate"];
    this.toDate=filterData["toDate"];
    this.customerId=filterData["customerId"];
    this.billSeriesId=filterData["billSeriesId"];
    this.mydata='Received Customer Order From ' +  this.fromDate+' To '+this.toDate;
    
    this.gatLoadData();
   }

  ngOnInit() {
  }
  gatLoadData()
 {
   this.http.get(this.original_url+"/SOP/SaleOrder/CustomerOrderRecieved?serverip="+this.ServerIP+
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


@Pipe({ name: 'groupByCustomer' })
@Injectable()
export class GroupByCustomerPipe implements PipeTransform {
  transform(allOrders: any[], field: string, value: string):any[] {
    if (!allOrders) return [];
    return allOrders.filter(it => it[field] == value);
  }
}

// @Pipe({name: 'groups'})
// export class GroupsPipe implements PipeTransform {
//   transform(value, args:string[]) : any {
//     var groups = {};
//     value.forEach(function(o) {
//       var group = o.NAME;
//       groups[group] = groups[group] ? groups[group] : { name: group, resources: [] };
//       groups[group].resources.push(o);  
//     });
        
//     return Object.keys(groups).map(function (key) {return groups[key]});
//   }
// }

// @Pipe({name: 'groupBy'})
// export class GroupByPipe implements PipeTransform {
//     transform(collection: Array<any>, property: string): Array<any> {
//         // prevents the application from breaking if the array of objects doesn't exist yet
//         if(!collection) {
//             return null;
//         }

//         const groupedCollection = collection.reduce((previous, current)=> {
//             if(!previous[current[property]]) {
//                 previous[current[property]] = [current];
//             } else {
//                 previous[current[property]].push(current);
//             }

//             return previous;
//         }, {});

//         // this will return an array of objects, each object containing a group of objects
//         return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
//     }
// }