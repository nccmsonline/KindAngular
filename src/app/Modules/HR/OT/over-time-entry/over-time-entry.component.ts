import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { EmployeeProfileComponent } from './../../../HR/employee-profile/employee-profile.component';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-over-time-entry',
  templateUrl: './over-time-entry.component.html',
  styleUrls: ['./over-time-entry.component.css']
})
export class OverTimeEntryComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};WorkingDate=new Date();
  coid : any;datePipe = new DatePipe("en-US");
  boid : any;empid:any; myDate = new Date();nextDate:Date;
  userid:any;OTListToSave : Array<any>=[]; datetype: Array<any>=[];token:any;
  //rateAppDetail: RateApprovalModel[] = [];
  isSave=true;
  fieldArray = new MatTableDataSource<any>();isLoadingResults:boolean;
  displayedColumns: string[] = [ 'EMPNO','NAME','DEPTNAME','DATED','OTHRS','REMARKS'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any;dated:any;isdisabled=false;
  itemDisplay: any;dateFormControl = new FormControl(new Date());
  constructor(private router: Router,private http: HttpClient,  public dialog: MatDialog,) { 
    //
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.empid = currentUser['EMPID'];
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['SEVERDATE']);
    this.WorkingDate.setDate(this.WorkingDate.getDate() -4);
    
    //var TodayDate = new FormControl(CompanyData['WORKINGDATE']);
    //this.empid=10195;

    this.dated=CompanyData['WORKINGDATE'];
    this.TodayDay=this.datePipe.transform(this.myDate, 'dd-MMM-yyyy') ;
    //this.TodayDay=this.datePipe.transform(CompanyData['WORKINGDATE'], 'dd-MMM-yyyy') ;
    this.gatDataOTList();
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    //this.isLoadingResults=false;
    this.newData.OTDATE=this.myDate;
    
  }

  ngOnInit() {
    this.datetype.push({id:'A',description:'Today'}) ;
    this.datetype.push({id:'K',description:'Tommorrow'}) ;
    this.nextDate = new Date();
    this.nextDate.setDate( this.nextDate.getDate() + 1 );
    this.newData.datetype="A";
  }
  onChange(event, indent)
  {
   
  if(event.checked == true)
    {
    this.OTListToSave.push(indent);
    }
    else
    {
      this.OTListToSave.splice (this.OTListToSave.indexOf(indent),1);
    }
  }
  radioChange()
  {
    if(this.WorkingDate>this.newData.OTDATE && this.empid!=10195 )
    {
      this.isSave=false;
    }
    else
    {
      this.isSave=true;
    }
    console.log("date changed");
    this.TodayDay=this.datePipe.transform(this.newData.OTDATE, 'dd-MMM-yyyy');
    this.gatDataOTList();
  }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  WrongDetailDialog(pmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pmsg
      }
    });
  }
  openDialog(data): void {
    
    // var empid= data.EMPID;
    // console.log("empid",empid);
    // const dialogRef = this.dialog.open(EmployeeProfileComponent, {
    //   data: {empid: empid}
    // });
  }

  passedOTList()
  {
    var orderfilter:any={};
    orderfilter={
     source:'/OTEntry',
    fromDate:this.datePipe.transform(this.newData.OTDATE, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.newData.OTDATE, 'dd-MMM-yyyy'),
    empid:this.empid};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/passed-ot-list-report'], {skipLocationChange:true});
  }

  passedOTsummary()
  {
    var pdate =new Date(this.dated);
    //var y=this.dated.getFullYear(),m=this.dated.getMonth();
    var y=pdate.getFullYear(),m=pdate.getMonth();
    var firstDate=new Date(y,m,1);
    var secondDate=new Date(y,m+1,0);
    debugger;
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(firstDate, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(secondDate, 'dd-MMM-yyyy'),
    empid:this.empid,
    source:'/OTEntry'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/passed-ot-list-summary'], {skipLocationChange:true});
  }

  EmployeeAbsentList()
  {
    var pdate =new Date(this.TodayDay);
    var y=pdate.getFullYear(),m=pdate.getMonth();
    var firstDate=new Date(y,m,1);
    var secondDate=new Date(y,m+1,0);
    debugger
    if(secondDate>pdate)
    {
      secondDate=this.TodayDay ;
    }
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(firstDate, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(secondDate, 'dd-MMM-yyyy'),
    empid:this.empid,
    source:'/OTEntry'};
  
    sessionStorage.setItem('otfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/employee-absent-list'], {skipLocationChange:true});
  }
  saveData()
  {
    this.isLoadingResults=true;
    var savelist : Array<any>=[]; var flag:boolean;
    flag=false;
  
   this.fieldArray.data.forEach((el)=>{
      if(el.checked==true)
      {
        if((el.REMARKS==''||el.REMARKS==undefined) && el.OTHRS>0)
        {
          flag=true;
        }
        if(el.OTHRS>0 && el.ISCONFIRMED=="N")
        {
          el.DATED=this.datePipe.transform(el.DATED, 'dd-MMM-yyyy') ;
          el.EDATE=this.datePipe.transform(this.myDate, 'dd-MMM-yyyy') ;
          savelist.push(el);
        }
      }
    });
   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
     this.isLoadingResults=false;
   }
   else if( flag)
   {
     this.WrongDetailDialog('Sorry,OT reason not entred');
     this.isLoadingResults=false;
   }
   else
   {
    
    this.isdisabled=true;
    const params = new  HttpParams()
   
    .set('empid', this.empid)
    .set('token', this.token)
    .set('dated', this.TodayDay)
    .set('otdetail', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/OTEntryData", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
     this.isLoadingResults=false;
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'sucess'
       }
     });
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
       console.log("res",res);
       this.OTListToSave=[];
       this.isLoadingResults=false;
       this.isdisabled=false;
    },
    error=>{
      var erroremsg:any;
      erroremsg=error.message;
      //console.log("1212",erroremsg);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:erroremsg
       }
     });
     this.isLoadingResults=false;
     this.isdisabled=false;
    });
   }
   console.log("this.other", this.OTListToSave);
  }
  gatDataOTList()
  {
    // this.http.get(this.original_url+"").subscribe((res)=>{

    // });
    this.isLoadingResults=true;
    console.log("sdskdjks k",this.original_url+"/hr/hr/getEmployeeListOT?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&empid="+ this.empid+"&dated="+this.TodayDay);
    this.http.get(this.original_url+"/hr/hr/getEmployeeListOT?empid="+ this.empid+"&dated="+this.TodayDay+"&token="+this.token).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
    console.log("res",res);

    //    this.fieldArray.data.forEach((element) => {
    //   if(this.newData.datetype=="K")
    //   {
    //     element.DATED=this.datePipe.transform(this.TodayDay , 'dd-MMM-yyyy') ;
    //   }
     
    // });
     this.isLoadingResults=false;
    });
  }
}
