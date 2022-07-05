import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.css']
})
export class CustomerOrderComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;SaleOrder: FormGroup;isLoadingResults:boolean;
  displayedColumns: string[] = ['ordertype','orderno', 'orderdate', 'customer', 'billtocustomer', 'customerpo', 'print'];
  customerOrderArray = new MatTableDataSource<any>();
  itemDisplay: any;companyData:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  fstartDate:any;
  fendDate:any;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  constructor(@Inject('BASE_URL') private original_url : string, private router: Router, private fb: FormBuilder,private http: HttpClient) { 
    this.createForm();  
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    this.fendDate=  this.companyData['FINANCIALYEARENDDATE'] ;
    this.fstartDate= this.companyData['FINANCIALYEARSTARTDATE'] ;
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
    this.http.get(this.original_url+"/sop/SaleOrder/getSaleOrderList?serverip="+this.ServerIP+
    "&fyuser="+this.FYUSER+"&boid="+this.boid+"&fromdate="+FromDate+"&todate="+ToDate).subscribe((res: any[])=> {
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
    this.router.navigate(['/add-new-customer-order/'+oaid+'/edit']);
  }
}
