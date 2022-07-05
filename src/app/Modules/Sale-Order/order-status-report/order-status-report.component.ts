import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { environment } from '../../../../environments/environment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-order-status-report',
  templateUrl: './order-status-report.component.html',
  styleUrls: ['./order-status-report.component.css'],
  
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class OrderStatusReportComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  datePipe = new DatePipe("en-US");
  original_url = environment.baseUrl;
  GST: FormGroup;
  searchDateValue: FormControl;
  report_period = new FormControl(moment());
  miniDate=new Date();maxDate=new Date();
  userid:any;token:any;
  customerList:Array<any>=[];
  itemList:Array<any>=[];
  CUSTOMERID=0;
  allData:any={};isLoadingResults=false;
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = ['sr' ,'itemCode', 'grade', 'productWeight', 'Order', 'Despatch', 'balancepcs', 'balancewt'];
  constructor(private fb: FormBuilder, private http: HttpClient) {
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.miniDate = new Date( CompanyData['FINANCIALYEARSTARTDATE']);
      this.maxDate = new Date( CompanyData['FINANCIALYEARENDDATE']);
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.userid = currentUser['USERID'];
      this.token = currentUser['TOKEN'];
   }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/Master/getAccountList?flag=C&search=&token="+this.token).subscribe((res)=>{
      console.log("ravi", res);
      this.allData=res;
      this.customerList=this.allData.Table;
      
      this.isLoadingResults=false;
      });
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.report_period.value;
    ctrlValue.year(normalizedYear.year());
    this.report_period.setValue(ctrlValue);
    console.log("Date", this.report_period);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.report_period.value;
    ctrlValue.month(normalizedMonth.month());
    this.report_period.setValue(ctrlValue);
    datepicker.close();
    console.log("Date", this.report_period);
  }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  onCustomerChange(id){
    console.log("id", id);
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleOrder/printOrderFile?partyid="+id+"&pdate=01/"+this.datePipe.transform(this.report_period.value, 'MMM/yyyy')+"&token="+this.token).subscribe((res)=>{
      console.log("ravi", res);
      this.allData=res;
      this.itemList=this.allData;
      this.fieldArray.data=this.allData;
      this.isLoadingResults=false;
      });
  }
}
