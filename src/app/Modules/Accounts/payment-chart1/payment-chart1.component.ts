
import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from "@angular/common/http";
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
//import { ChartDetailComponent} from './chart-detail/chart-detail.component';
import { environment } from '../../../../environments/environment';
import { ChartDetailComponent} from '../payment-chart/chart-detail/chart-detail.component';
@Component({
  selector: 'app-payment1-chart',
  templateUrl: './payment-chart1.component.html',
  styleUrls: ['./payment-chart1.component.css']
})
export class PaymentChart1Component implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort) sort: MatSort;  datePipe = new DatePipe("en-US");
  @ViewChild(MatPaginator) paginator:MatPaginator;
  paymentSchedule:Array<any>=[];isCEO:any;
  MyCalendar: MyCalendar[] = [];newData:any;FYUSER:any;ServerIP:any; boid : any;  myDate = new Date();dateFormControl = new FormControl(new Date());calMonth:any;calYear:any;
  fieldArray = new MatTableDataSource<MyCalendar>(this.MyCalendar);transtype:any;userid:any;token:any; 
  displayedColumns: string[] = ['SUN','MON','TUE','WED','THU','FRI','SAT'];monthNameDisplay:any;
  monthName: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<PaymentChart1Component>,
    private http: HttpClient,
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
     let currentUser = sessionStorage.getItem("currentUser");
     currentUser = JSON.parse(currentUser);
   
      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
      this.isCEO = currentUser['ISCEO'];
      console.log("Chart 1");
debugger;
   
     this.transtype=data.transtype;
     this.paymentSchedule=data.payments;
     this.getMonthCalenderdata();
  }

  openDialog(date:any, Amount:any) {

    console.log("transtype",this.transtype);
     
    const dialogRef1 = this.dialog.open(ChartDetailComponent, {
      data: {
        pDate:date ,  
        isButton:'Yes'     }
    });
    dialogRef1.afterClosed().subscribe(res=>{
          if(res=="ok")
          {
            console.log("transtype",this.transtype);
            let data:any={};
            data.date=date;
            data.amount=Amount;
           // this.dialogRef.close(date);
            this.dialogRef.close(data);
          }
    });
    
    }

 getMonthCalenderdata()
 {
  
  this.http.get(this.original_url+"/Accounts/Payments/GetCalendar?month="+this.calMonth+"&year="+this.calYear+"&userid="+this.userid+"&token="+this.token+"&mode=New&list="+JSON.stringify(this.paymentSchedule))
  .subscribe((res) => {
     this.newData = res;
     this.newData=this.newData.Table;
     this.fieldArray = this.newData;
    console.log("this.newData1", this.fieldArray.data);
    this.monthNameDisplay=this.monthName[this.calMonth-1];
  });
 }
 getCalDetail(day, Amount, id)
 {

   var mDate:string;
   mDate=day+ "-"+this.monthNameDisplay+"-"+this.calYear;
   var currDate=new Date();
   var selectedDate=new Date(mDate);
   selectedDate.setHours(selectedDate.getHours() + 23);
   console.log("row ",id);
   if(id==2 || id==4)
   {
    this.showMgs("You can't be issue cheque in 2nd and 4th Friday.");
      if(this.isCEO=='Y')
      {
        this.openDialog(mDate, Amount);
      }
   }
   else if(selectedDate>=currDate)
   {
          if(day!=20 && day!=26 && day>10)
          {
             
              if(parseFloat(Amount)>350000)
              {
                this.showMgs("cheques limit 3,50,000 crossed.");
                if(this.isCEO=='Y')
                {
                  this.openDialog(mDate, Amount);
                }
              }
              else
              {
                this.openDialog(mDate, Amount);
              }
          }
          else
          {
            this.showMgs("These dates are reserved for Salary and Legal Dues.");
              if(this.isCEO=='Y')
              {
                this.openDialog(mDate, Amount);
              }
          }
   }
   else
   this.showMgs("Please select current date or future date");
   //console.log("mdate",selectedDate);
   //console.log("currDate",currDate);
 }
 showMgs(msgBox)
 {
  const dialogRef = this.dialog.open(SuccessDialogComponent, {
    data: {
      wrongData: 'validation',
      displayMsg:msgBox
    }
   });
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