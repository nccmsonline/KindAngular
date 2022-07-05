import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-over-time-passing-for-more-than2',
  templateUrl: './over-time-passing-for-more-than2.component.html',
  styleUrls: ['./over-time-passing-for-more-than2.component.css']
})
export class OverTimePassingForMoreThan2Component implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;datePipe = new DatePipe("en-US");isSelected=false;
  boid : any;empid:any; myDate = new Date();nextDate:Date;
  userid:any;OTListToSave : Array<any>=[]; datetype: Array<any>=[];token;any;
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = ['PASS', 'DELETE', 'EMPNO','NAME','DEPTNAME','DATED','OTHRS','REMARKS','HEADNAME','PASSEDOTHRS'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor(private http: HttpClient, public dialog: MatDialog,) { 
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
    this.empid=10195;
    this.TodayDay=this.datePipe.transform(this.myDate, 'dd-MMM-yyyy') ;
    this.gatDataOTList();
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.newData.OTDATE=this.myDate;
 }

  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
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
      indent.PASSEDOTHRS=indent.OTHRS;
      indent.delete=false;
    }
    else
    {
      indent.PASSEDOTHRS=0;
    }
  }
  onDelete(event, indent)
  {
    console.log("event",event);
    console.log("Row1",indent);
    if(event.checked == true)
    {
      indent.checked=false;
      indent.PASSEDOTHRS=0;
    }
    console.log("Row after ",indent);
  }
  PrevDate()
  {
    var data = new Date(this.newData.OTDATE);
    data.setHours( this.newData.OTDATE.getHours() - 24);
    this.newData.OTDATE = '';
    this.newData.OTDATE = data;
     this.radioChange();
  }
  NextDate()
  {
    var data = new Date(this.newData.OTDATE);
    data.setHours( this.newData.OTDATE.getHours() + 24);
    this.newData.OTDATE = '';
    this.newData.OTDATE = data;
     this.radioChange();
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
    this.isLoadingResults=true;
    var savelist : Array<any>=[]; var flag:boolean;
    flag=false;
   
    this.fieldArray.data.forEach((el)=>{
      var tmp:any={};
      if(el.PASSEDOTHRS>0 && el.checked==true && el.FLAG!='A')
      {
        tmp.PASSEDOTHRS=el.PASSEDOTHRS;
        tmp.ISCONFIRMED='Y'
        tmp.ID=el.ID;
        savelist.push(tmp);
      }
      else if(el.PASSEDOTHRS>0 && el.checked==true && el.FLAG=='A')
      {
        tmp.PASSEDOTHRS=el.PASSEDOTHRS;
        tmp.AMENDMENTAPPROVED='Y'
        tmp.ID=el.ID;
        savelist.push(tmp);
      }
      else if( el.delete==true)
      {
        tmp.PASSEDOTHRS=0;
        tmp.ISCONFIRMED='R'
        tmp.ID=el.ID;
        savelist.push(tmp);
      }
    });

    console.log("savelist", savelist);
   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
     this.isLoadingResults=false;
   }
   else
   {
    
    this.TodayDay=this.datePipe.transform(this.TodayDay, 'dd-MMM-yyyy') ;
    
    const params = new  HttpParams()
   
    .set('empid', this.empid)
    .set('token', this.token)
    .set('dated', this.TodayDay)
    .set('list', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/PassingSpecialOT", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      debugger;
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
  selectData(d_h_Name, flag)
  {
    this.OTListToSave=[];
    this.isSelected = !this.isSelected;
    this.fieldArray.data.forEach((el)=>{
    
     if(this.isSelected && el.HEADNAME==d_h_Name &&  el.FLAG==flag)
     {
      el.checked=this.isSelected;
      el.PASSEDOTHRS=el.OTHRS;
      this.OTListToSave.push(el);
     }
     else if(this.isSelected==false)
     {
      el.checked=this.isSelected;
      el.PASSEDOTHRS=0;
     }
    }); 
  }
  gatDataOTList()
  {
    this.OTListToSave=[];
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/getEmployeeListOT?empid="+ this.empid+"&dated="+this.TodayDay+"&IsConfirmed=BB"+"&token="+this.token).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
    console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}
