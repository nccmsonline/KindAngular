
import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator, MatDialogRef } from '@angular/material';
import { HttpClient } from "@angular/common/http";
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
//import { ChartDetailComponent} from './chart-detail/chart-detail.component';
@Component({
  selector: 'app-payment1-chart',
  templateUrl: './payment-chart1.component.html',
  styleUrls: ['./payment-chart1.component.css']
})
export class PaymentChart1Component implements OnInit {
  @ViewChild(MatSort) sort: MatSort;  datePipe = new DatePipe("en-US");
  @ViewChild(MatPaginator) paginator:MatPaginator;
  MyCalendar: MyCalendar[] = [];newData:any;FYUSER:any;ServerIP:any; boid : any;  myDate = new Date();dateFormControl = new FormControl(new Date());calMonth:any;calYear:any;
  fieldArray = new MatTableDataSource<MyCalendar>(this.MyCalendar);transtype:any;
  displayedColumns: string[] = ['SUN','MON','TUE','WED','THU','FRI','SAT'];monthNameDisplay:any;
  monthName: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<PaymentChart1Component>,
    private http: HttpClient,@Inject('BASE_URL') private original_url : string,
     @Inject(MAT_DIALOG_DATA) public data: any
     ) { 
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
     this.transtype=data.transtype;
  }

  openDialog(date:any) {
    console.log("transtype",this.transtype);
      this.dialogRef.close(date);
     
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
  });
 }
 getCalDetail(day)
 {
  
   var mDate:string;
   mDate=day+ "-"+this.monthNameDisplay+"-"+this.calYear;
   var currDate=new Date();
   var selectedDate=new Date(mDate);
   selectedDate.setHours(selectedDate.getHours() + 23);
   if(selectedDate>=currDate)
      this.openDialog(mDate);
   else
      alert("Please select current date or future date");
   //console.log("mdate",selectedDate);
   //console.log("currDate",currDate);
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