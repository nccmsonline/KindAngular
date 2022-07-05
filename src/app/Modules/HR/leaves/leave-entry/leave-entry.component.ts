import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-leave-entry',
  templateUrl: './leave-entry.component.html',
  styleUrls: ['./leave-entry.component.css']
})
export class LeaveEntryComponent implements OnInit {
  original_url=environment.baseUrl;
isAddNew:any;allData:any={};EmpNo:any;myDate = new Date();
isEditable:any;isLoadingResults:any;leaveform:any=[];userid:any;token:any;
newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
constructor(private http: HttpClient, public dialog: MatDialog) {
  let currentBranch = sessionStorage.getItem("currentBranch");
  var CompanyData = JSON.parse(currentBranch);
  this.ServerIP=CompanyData['SERVERIP'];
  this.FYUSER=CompanyData['FYUSER'];
  this.boid = CompanyData['BRANCHID'];
  this.token = CompanyData['TOKEN'];
  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);
  this.userid = currentUser['USERID'];

  this.myDate= new Date(CompanyData['WORKINGDATE']);
  this.isAddNew=true;
 }
  ngOnInit() {
  }

  validateDetail(mode)
  {
  var flag:boolean;
  flag=true;
  var mdate = new Date();
  var msg:any;

 // //console.log("dataravi",data);
  msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
  if(this.EmpNo==undefined||this.EmpNo=='')
  {flag=false; msg=msg+"<li>Employee code not entred</li>"}
  if(this.newData.NAME==undefined||this.newData.NAME=='' )
  {flag=false; msg=msg+"<li>Employee not exsits</li>"}
  if(this.newData.LEAVEFROM==undefined||this.newData.LEAVEFROM=='' )
  {flag=false; msg=msg+"<li>Leave require from date not entred</li>"}
  if(this.newData.LEAVETO==undefined||this.newData.LEAVETO=='' )
  {flag=false; msg=msg+"<li>Leave require update  date not entred</li>"}
  if(this.newData.REASONFORLEAVE==undefined||this.newData.REASONFORLEAVE=='' )
  {flag=false; msg=msg+"<li>Reason for leave not entred</li>"}
  if(this.newData.ADDRESS==undefined||this.newData.ADDRESS=='' )
  {flag=false; msg=msg+"<li>Address on while leave not entred</li>"}


     msg=msg+"</ul>";
     if(flag==false)
     {
      //console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     }
    else
    {
      this.saveLeaveRecord(mode)
    }
    //console.log("1", this.newData);
}

saveLeaveRecord(mode)
{
  var savedata:any={};
  var saveList:any=[];
  var msg:any,mId:any;
  if(mode=='add')
  {
    msg="Saved sucessfully";
    mId="-1";
  }
  else
  {
    msg="updated sucessfully";
    mId=this.newData.ID;
    //console.log("2", this.newData);
  }
  
//  savedata.EMPNO=this.newData.EMPNO;
  
  if(mode=='add')
  {
    savedata.Id=":a"; 
    savedata.DATED=":b"; 
    savedata.BRANCHID=this.boid;
    savedata.USERID=this.userid;
    savedata.EMPID=this.newData.EMPID;
    //console.log("3", this.newData);
  }
  else
  {
    savedata.MDATE=":b"; 
  }
  savedata.LEAVEFROM=  formatDate(this.newData.LEAVEFROM, 'dd-MMM-yyyy', 'en-US', '+0530'); 
  savedata.LEAVETO=  formatDate(this.newData.LEAVETO, 'dd-MMM-yyyy', 'en-US', '+0530'); 
  savedata.REASONFORLEAVE=this.newData.REASONFORLEAVE;
  savedata.ADDRESS=this.newData.ADDRESS;
  //console.log("4", this.newData);

  saveList.push(savedata);

  const  params = new  HttpParams()
  .set('fyuser', this.FYUSER)
  .set('serverip', this.ServerIP)
  .set('boid', this.boid)
  .set('id', mId)
  .set('empno', this.EmpNo)
  .set('token', this.token)
  .set('leavedata', JSON.stringify(saveList));
  this.isLoadingResults=true;
this.http.post(this.original_url+"/hr/hr/saveLeaveForm", params.toString(), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
.subscribe((res) => {
  this.allData=res;
  this.leaveform=this.allData.Table;
  this.newData={};
  if (this.leaveform!=undefined)
  {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'sucess',
              displayMsg:msg
            }
          });
  }
  else
  {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'wrongData',
                displayMsg:'Somthing went wrong'
              }
            });
  }
  this.isLoadingResults=false;
},
error=>{
  var erroremsg:any;
  erroremsg=error.message;
  ////console.log("1212",erroremsg);
 const dialogRef = this.dialog.open(SuccessDialogComponent, {
   data: {
     wrongData: 'wrongData',
     displayMsg:erroremsg
   }
 });
 this.isLoadingResults=false;}
 );

}
showLeaveRecord(data)
{
  this.newData=data;
  //console.log("5", this.newData);
  debugger;
  if(data.APPROVEDBYAUTHORITY=="N")
  {
    this.newData.ID= data.ID; 
    this.newData.LEAVEFROM= data.LEAVEFROM; 
    this.newData.LEAVETO=  data.LEAVETO; 
    this.newData.REASONFORLEAVE=data.REASONFORLEAVE;
    this.newData.ADDRESS=data.ADDRESS;
    this.isAddNew=false;
  }
  else
  {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'You cannot modified approved application'
      }
    });
  }

  debugger;
}
 showData()
 {
  this.isLoadingResults=true;
  this.http.get(this.original_url+"/HR/HR/getEmployeeLeaveFormList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&empno="+this.EmpNo).subscribe((res: any[])=> {
    this.allData=res;
   this.newData=this.allData.Table[0];
    this.leaveform=this.allData.Table1;
    this.isLoadingResults=false;
  },errr=>{
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'Please check you internet coneectivity'
      }
      
    });
    this.isLoadingResults=false;
  }
  );
 }
}
