import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.css']
})
export class CustomerOrderComponent implements OnInit {
  original_url = environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;SaleOrder: FormGroup;isLoadingResults:boolean;
  displayedColumns: string[] = ['ordertype','orderno', 'orderdate', 'customer', 'billtocustomer', 'customerpo', 'print'];
  customerOrderArray = new MatTableDataSource<any>();
  itemDisplay: any;companyData:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  fstartDate:any;userid:any;token:any;
  fendDate:any;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  constructor( private router: Router, private fb: FormBuilder,private http: HttpClient) { 
    this.createForm();  
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    this.fendDate=  this.companyData['FINANCIALYEARENDDATE'] ;
    this.fstartDate= this.companyData['FINANCIALYEARSTARTDATE'] ;
     


  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);

  this.token = currentUser['TOKEN'];
  this.userid = currentUser['USERID'];

    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);
    this.dateToControl.setValue(currentDate);
    this.ShowOrderList();
  }
  ShowOrderList()
  {
    var FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy');
    var ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy');
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/sop/SaleOrder/getSaleOrderList?fromdate="+FromDate+"&todate="+ToDate+"&userid="+this.userid+"&token="+this.token).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.customerOrderArray.data = this.itemDisplay;
      this.isLoadingResults=false
      });
  }
  ngOnInit() {
    this.customerOrderArray.sort = this.sort;
    this.customerOrderArray.paginator=this.paginator;
  
  }
  onToDateChanged1()
  {
    console.log("ravi");
    this.ShowOrderList();
  }
  applyFilter(filterValue: string) {
    console.log("data",filterValue.trim().toUpperCase());
    this.customerOrderArray.filter = filterValue.trim().toLowerCase();
    console.log("list", this.customerOrderArray.data);
  }
  createForm() {
    this.SaleOrder = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
  SaleOrderFunction(oaid)
  {
    this.router.navigate(['/add-new-customer-order/'+oaid+'/edit'], { queryParams:  filter, skipLocationChange: true});
  }
  printOrder(orderno)
  {
    let data:any={};
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/SOP/SaleOrder/printOrderDetail?orderno="+orderno+"&token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      console.log("Mrir Load", res);
      this.itemDisplay=this.itemDisplay.Table;
      data.header=this.itemDisplay[0];
      this.itemDisplay=res;
      data.detail=this.itemDisplay.Table1;
      
      data.title="Customer Order";
      data.backto='/customer-order';
       sessionStorage.setItem('order', JSON.stringify(data));
      this.router.navigate(['/print-customer-order'], {skipLocationChange:true});
      this.isLoadingResults=false;
     },
     error=>{
       this.isLoadingResults=false;
     });  
  }
}
