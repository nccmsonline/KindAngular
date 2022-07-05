import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-over-time-amendment-approval',
  templateUrl: './over-time-amendment-approval.component.html',
  styleUrls: ['./over-time-amendment-approval.component.css']
})
export class OverTimeAmendmentApprovalComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;datePipe = new DatePipe("en-US");
  boid : any;empid:any; myDate = new Date();nextDate:Date;
  userid:any;OTListToSave : Array<any>=[]; datetype: Array<any>=[];
  //rateAppDetail: RateApprovalModel[] = [];
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'EMPNO','NAME','DEPTNAME','DATED','PASSEDOT','OTHRS','REMARKS','HEADNAME','PASSEDOTHRS'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor(private http: HttpClient,  public dialog: MatDialog,) { 
    //this.isLoadingResults=true;
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
    this.empid=10195;
    this.TodayDay=this.datePipe.transform(this.myDate, 'dd-MMM-yyyy') ;
    this.gatDataOTList();
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.newData.OTDATE=this.myDate;
   // this.isLoadingResults=false;
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
      // if(this.newData.datetype=="K")
      // {
      //     this.TodayDay=this.datePipe.transform(this.nextDate , 'dd-MMM-yyyy') ;
      // }
      // else
      // {
      //     this.TodayDay=this.datePipe.transform(this.myDate , 'dd-MMM-yyyy') ;
      // }
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
  saveData()
  {
    var savelist : Array<any>=[]; var flag:boolean;
    flag=false;
    this.OTListToSave.forEach((el)=>{
     
      if(el.PASSEDOTHRS>0 )
      {
        savelist.push(el);
      }
    }); 

   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else
   {
    this.isLoadingResults=true;
    this.TodayDay=this.datePipe.transform(this.TodayDay, 'dd-MMM-yyyy') ;

    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('empid', this.empid)
    .set('userid', this.userid)
    .set('flag', 'AA')
    .set('otdetail', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/EmployeeListOTPassing", params.toString(), {
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
       this.fieldArray.data.forEach((el)=>{
        el.checked=true;
        el.PASSEDOTHRS=el.OTHRS;
        this.OTListToSave.push(el);
      }); 

       this.isLoadingResults=false;
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
    });
   }
   
   console.log("this.other", this.OTListToSave);
  }
  gatDataOTList()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/getEmployeeListOT?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&empid="+ this.empid+"&dated="+this.TodayDay+"&IsConfirmed=AA").subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
    this.fieldArray.data.forEach((el)=>{
     el.checked=true;
     el.PASSEDOTHRS1=el.PASSEDOTHRS;
      el.PASSEDOTHRS=el.AMENDEDOT;
      
      this.OTListToSave.push(el);
    }); 
     console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}