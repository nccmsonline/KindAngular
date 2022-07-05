import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


import { MatDialog } from '@angular/material/dialog';
import { SalarySlipComponent } from '../salary-slip/salary-slip.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { environment } from 'src/environments/environment';
// import * as _moment from 'moment';
// import {default as _rollupMoment, Moment} from 'moment';
// 
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
//import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

//import {MatDatepicker} from '@angular/material/datepicker';

// const moment = _rollupMoment || _moment;

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
@Component({
  selector: 'app-hrreports',
  templateUrl: './hrreports.component.html',
  styleUrls: ['./hrreports.component.css'],
//   providers: [
//   {
//     provide: DateAdapter,
//     useClass: MomentDateAdapter,
//     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//   },

//   {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
// ]
})
export class HRReportsComponent implements OnInit {
  searchDateValue: FormControl;
  original_url=environment.baseUrl;
  ret_period = new FormControl(new Date());
  empno:any;
  userid:any;itemDisplay:any;dateToControl = new FormControl(new Date());dateFormControl = new FormControl(new Date());
  FYUSER:any;ServerIP:any;boid : any;curDate:any;fstartDate:any;DayBooKReport: FormGroup;newData:any={};datePipe = new DatePipe("en-US");token:any; 
  constructor(private fb: FormBuilder,public dialog: MatDialog,private router: Router, private http: HttpClient,  private activatedRoute: ActivatedRoute) { 
    this.createForm( );
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];;
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];;
   
    this.fstartDate=  CompanyData['WORKINGDATE'] ;
    this.curDate= CompanyData['WORKINGDATE'] ;

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];

    var currentDate: Date = new Date( this.fstartDate);

    var y=currentDate.getFullYear(),m=currentDate.getMonth();
    var firstDate=new Date(y,m,1);
    
    // debugger;
    // var orderfilter:any={};
    // orderfilter={
    // fromDate:this.datePipe.transform(firstDate, 'dd-MMM-yyyy'),
    
    this.dateFormControl.setValue(firstDate);
   // this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.curDate);
    this.dateToControl.setValue(currentDate);
  }
lastDate()
{
  var pdate =new Date(this.dateFormControl.value);
  var y=pdate.getFullYear(),m=pdate.getMonth();
  var firstDate=new Date(y,m,1);
  var secondDate=new Date(y,m+1,0);
  this.dateToControl.setValue(secondDate) ;
}
// chosenYearHandler(normalizedYear: Moment) {
//   const ctrlValue = this.ret_period.value;
//   ctrlValue.year(normalizedYear.year());
//   this.ret_period.setValue(ctrlValue);
//   console.log("Date", this.ret_period);
// }

// chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
//   const ctrlValue = this.ret_period.value;
//   ctrlValue.month(normalizedMonth.month());
//   this.ret_period.setValue(ctrlValue);
//   datepicker.close();
//   console.log("Date", this.ret_period);
// }

  ngOnInit() {
  }
  passedOTList()
  {
    var orderfilter:any={};
    orderfilter={
      source:'/hr-reports',
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy')};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/passed-ot-list-report'], {skipLocationChange:true});
  }
  createForm() {
    this.DayBooKReport = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
  PackageEmployeeOTList()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/package-employee-ot-list'], {skipLocationChange:true});
  }
  OTWithGateList()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/ot-with-gatepass'], {skipLocationChange:true});
  }
  passedOTsummary()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports',
    flag:'O'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/passed-ot-list-summary'], {skipLocationChange:true});
  }
  workingHrsSummary()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports',
    flag:'W'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/passed-ot-list-summary'], {skipLocationChange:true});
  }
  EmployeeAbsentList()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/employee-absent-list'], {skipLocationChange:true});
  }
  employeeGatePassList()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/employee-gatepass-list'], {skipLocationChange:true});
  }

  
  employeeLeavList()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports',
    reporttype:'L'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/employee-leave-report'], {skipLocationChange:true});
  }
  rejectedLeaves()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports',
    reporttype:'R'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/employee-leave-report'], {skipLocationChange:true});
  }
  employeeTourList()
  {
    var orderfilter:any={};
    orderfilter={
      fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
      toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy'),
      source:'/hr-reports',
      reporttype:'T'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/employee-leave-report'], {skipLocationChange:true});
  }
  specialRewards()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    source:'/hr-reports'};
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/special-ot-rewards'], {skipLocationChange:true});
  }
  showSalarySlip()
  {
    if(this.empno==undefined||this.empno==null||this.empno=='')
    {
       const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:'Employee No.'
       }
     });
     
    }
    else
    {
      
      const dialogRef = this.dialog.open(SalarySlipComponent, {
        // width: '600px',
         data: {empid: 0,
          empno: this.empno,
           year:this.datePipe.transform(this.ret_period.value, 'yyyy'),
           month:this.datePipe.transform(this.ret_period.value, 'MM'),
           monthname:this.datePipe.transform(this.ret_period.value, 'MMM') }
       });
    }

  }
  
}
//