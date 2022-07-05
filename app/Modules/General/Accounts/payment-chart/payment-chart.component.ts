
import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator, MatDialogRef } from '@angular/material';
import { HttpClient } from "@angular/common/http";
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChartDetailComponent} from './chart-detail/chart-detail.component';
@Component({
  selector: 'app-payment-chart',
  templateUrl: './payment-chart.component.html',
  styleUrls: ['./payment-chart.component.css']
})
export class PaymentChartComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;  datePipe = new DatePipe("en-US");
  @ViewChild(MatPaginator) paginator:MatPaginator;isLoadingResults:boolean;
  MyCalendar: MyCalendar[] = [];newData:any;FYUSER:any;ServerIP:any; boid : any;  myDate = new Date();dateFormControl = new FormControl(new Date());calMonth:any;calYear:any;
  fieldArray = new MatTableDataSource<MyCalendar>(this.MyCalendar);transtype:any;
  displayedColumns: string[] = ['SUN','MON','TUE','WED','THU','FRI','SAT'];monthNameDisplay:any;
  monthName: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  constructor(public dialog: MatDialog,
    private http: HttpClient,@Inject('BASE_URL') private original_url : string
     ) { 
      this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.calMonth=parseInt(this.datePipe.transform(this.dateFormControl.value, 'MM')) ;
    this.calYear=parseInt(this.datePipe.transform(this.dateFormControl.value, 'yyyy')) ;
     console.log("calMonth",this.calMonth);
     console.log("calYear",this.calYear);
     console.log("displayedColumns",this.displayedColumns[this.calMonth-1]);
     
     this.getMonthCalenderdata();
     
  }

  openDialog(date:any) {
    console.log("transtype",this.transtype);
     
          const dialogRef = this.dialog.open(ChartDetailComponent, {
            data: {
              pDate:date        }
          });
}

 getMonthCalenderdata()
 {
  
  this.http.get(this.original_url+"/Accounts/Payments/GetCalendar?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&month="+this.calMonth+"&year="+this.calYear+"")
  .subscribe((res) => {
     this.newData = res;
     this.newData=this.newData.Table;
     this.fieldArray = this.newData;
    console.log("this.newData1", this.fieldArray.data);
    this.monthNameDisplay=this.monthName[this.calMonth-1];
    this.isLoadingResults=false;
  });
 }
 getCalDetail(day)
 {
   var mDate:string;
   mDate=day+ "-"+this.monthNameDisplay+"-"+this.calYear;
   this.openDialog(mDate);
   console.log("mdate",mDate);
 }
 prevMonth()
 {
  this.calMonth--;
   if(this.calMonth<1)
   {
     this.calMonth=12;
     this.calYear--;
   }
   this.getMonthCalenderdata();
 }
 nextMonth()
 {
  this.calMonth++;
   if(this.calMonth>12)
   {
     this.calMonth=1;
     this.calYear++;
   }
   this.getMonthCalenderdata();
 }
  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

}
export class MyCalendar
{
  MONTH:number;
  YEAR:number;
  SUN:number;
  MON:number;
  TUE:number;
  WED:number;
  THU:number;
  FRI:number;
  SAT:number;
}