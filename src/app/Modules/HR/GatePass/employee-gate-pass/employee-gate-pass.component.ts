import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WebcamImage} from 'ngx-webcam';

@Component({
  selector: 'app-employee-gate-pass',
  templateUrl: './employee-gate-pass.component.html',
  styleUrls: ['./employee-gate-pass.component.css']
})
export class EmployeeGatePassComponent implements OnInit {
  original_url=environment.baseUrl;WorkingDate=new Date();
  isAddNew:any;allData:any={};EmpNo:any;myDate = new Date();gayePassType:any=[];
  isEditable:any;isLoadingResults:any;gatePassForm:any=[];userid:any;token:any;
  newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  mGpData:any={};
  // public webcamImage: WebcamImage = null;
  // handleImage(webcamImage: WebcamImage) {
  // this.webcamImage = webcamImage;
  // }

  constructor(private http: HttpClient, public dialog: MatDialog) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.WorkingDate= new Date(CompanyData['SEVERDATE']);
    this.WorkingDate.setDate(this.WorkingDate.getDate() -4);

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.myDate= new Date(CompanyData['SEVERDATE']);
    this.isAddNew=true;
   }

    ngOnInit() {
      if(this.userid==10004)
      {
        this.WorkingDate.setDate(this.WorkingDate.getDate() -31);
      }
      else
      {
        this.WorkingDate.setDate(this.WorkingDate.getDate() -4);
      }
      this.gayePassType.push({id:0,description:'Factory Work'}) ;
      this.gayePassType.push({id:1,description:'Personal Work'}) ;
    }

    refresh()
    {
      this.newData.EMPNO='';
      this.newData.NAME='';
      this.newData.DESIGNATION='';
      this.newData.INTIME='';
      this.newData.DEPARTMENT='';
      this.newData.REASON='';
      this.newData.OUTTIME='';
      this.newData.GATEPASSTYPE=null;
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.myDate= new Date(CompanyData['WORKINGDATE']);
      this.isAddNew=true;
    }
    validateDetail(mode)
    {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    //debugger;

    console.log("dataravi",this.newData);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.EmpNo==undefined||this.EmpNo=='')
    {flag=false; msg=msg+"<li>Employee code not entred</li>"}
    if(this.newData.NAME==undefined||this.newData.NAME=='' )
    {flag=false; msg=msg+"<li>Employee not exsits</li>"}
    if(this.newData.INTIME==undefined||this.newData.INTIME=='' )
    {flag=false; msg=msg+"<li>Out time not entred</li>"}
    if(this.newData.REASON==undefined||this.newData.REASON=='' )
    {flag=false; msg=msg+"<li>Reason for leave not entred</li>"}
    if(this.newData.GATEPASSTYPE==undefined||this.newData.GATEPASSTYPE==null)
    {flag=false; msg=msg+"<li>Gate pass type not seleected</li>"}
    if((this.newData.OUTTIME==undefined||this.newData.OUTTIME=='') && this.newData.GATEPASSTYPE==1 )
    {flag=false; msg=msg+"<li>In time not entred</li>"}  
    
    var startDate = new Date(this.newData.OUTTIME).getTime();
    var endDate = new Date(this.newData.INTIME).getTime();

    if(startDate<endDate)
    {flag=false; msg=msg+"<li>In time should not be less than out time</li>"} 
    var milisecondsDiff =startDate- endDate ;
    milisecondsDiff=milisecondsDiff/ (1000 * 60 )
    console.log("Time today ", milisecondsDiff);
    console.log("Time Previous ", parseInt( this.mGpData.TTIME));
    if(milisecondsDiff>510 && this.newData.GATEPASSTYPE==0 )
    {flag=false; msg=msg+"<li>Gate pass not allowed for more then 8.5 hrs</li>"} 
    milisecondsDiff=milisecondsDiff+parseInt( this.mGpData.TTIME);
    if(milisecondsDiff>120 && this.newData.GATEPASSTYPE==1 )
    {flag=false; msg=msg+"<li>Personal Gate-pass allowed for only 2 hrs in a Month</li>"} 

    if(parseInt( this.mGpData.NOOFGP)>3 && this.newData.GATEPASSTYPE==1)
    {
      {flag=false; msg=msg+"<li>Only 3 Personal Gate-pass allowed in a Month</li>"} 
    }
console.log("milisecondsDiff",milisecondsDiff/ (1000 * 60 ));
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
  onDateChange()
  {
   // let mGpData:any={};
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/HR/HR/getOutOnGatePassDetail?empno="+this.EmpNo+"&dated="+formatDate(this.myDate, 'dd-MMM-yyyy', 'en-US', '+0530')+"&token="+this.token).subscribe((res)=> {
      this.allData=res;
      this.mGpData=this.allData.Table[0];
      console.log("ravinder",this.mGpData);
      this.isLoadingResults=false;
    });
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
      savedata.GPDATE=  formatDate(this.myDate, 'dd-MMM-yyyy', 'en-US', '+0530');
      savedata.EDATE=":b"; 
      savedata.BRANCHID=this.boid;
      savedata.USERID=this.userid;
      savedata.EMPID=this.newData.EMPID;
      //console.log("3", this.newData);
   }
   else
   {
      savedata.GPDATE=  formatDate(this.myDate, 'dd-MMM-yyyy', 'en-US', '+0530');
      savedata.EDATE=":a"; 
   }
    savedata.INTIME=  formatDate(this.newData.INTIME, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530'); 
    if(this.newData.OUTTIME==undefined||this.newData.OUTTIME=='' )
    {
      savedata.OUTTIME= "";
    }
    else
    {
      savedata.OUTTIME=  formatDate(this.newData.OUTTIME, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530');     
    }
    savedata.REASON=this.newData.REASON;
    savedata.PurposeCode=this.newData.GATEPASSTYPE;
    console.log("4", savedata);
  
    saveList.push(savedata);
  
    const  params = new  HttpParams()
   
    .set('id', mId)
    .set('empno', this.EmpNo)
    .set('token', this.token)
    .set('data', JSON.stringify(saveList));
    this.isLoadingResults=true;
  this.http.post(this.original_url+"/hr/hr/saveGatePassForm", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    this.allData=res;
    this.gatePassForm=this.allData.Table;
    
    debugger;
    if (this.gatePassForm!=undefined)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:msg
              }
            });
            this.newData={};
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
   
   // alert(this.newData.OUTTIME);
    console.log("5", data);
    debugger;
    if(data.APPROVEDBYAUTHORITY=="N")
    {
   //   this.newData=data;

   Object.assign(this.newData, {
    EMPID:data.EMPID, 
    NAME:data.NAME, 
    DESIGNATION:data.DESIGNATION, 
    DEPARTMENT:data.DEPARTMENT, 
   });
      this.newData.ID= data.ID; 
      var pdate =new Date(data.INTIME);
      
      if(data.INTIME!=null)
      {
        this.newData.INTIME= pdate; 
      }
      else
      {
        this.newData.INTIME='';
      }
      pdate =new Date(data.OUTTIME);
      if(data.OUTTIME!=null)
      {
        this.newData.OUTTIME= pdate;// data.OUTTIME; 
      }
      else
      {
        this.newData.OUTTIME='';
      }

      this.newData.REASON=data.REASON;
      this.myDate=data.GPDATE;
      if(data.PURPOSE=='Factory Work')
      {this.newData.GATEPASSTYPE=0;}
      else
      {this.newData.GATEPASSTYPE=1;}
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
    this.http.get(this.original_url+"/HR/HR/getEmployeeGatePassList?empno="+this.EmpNo+"&userid="+this.userid+"&token="+this.token).subscribe((res)=> {
      this.allData=res;
     //his.newData=
     console.log("Gp data",res);
     this.allData=this.allData.Table[0];


     Object.assign(this.newData, {
      EMPID:this.allData.EMPID, 
      NAME:this.allData.NAME, 
      DESIGNATION:this.allData.DESIGNATION, 
      DEPARTMENT:this.allData.DEPARTMENT, 
      OUTTIME: '',
      INTIME:  '',
      REASON:'',
      GATEPASSTYPE:null
   
     });
     this.allData=res;
      this.gatePassForm=this.allData.Table; 
      //this.allData=res;
      this.mGpData=this.allData.Table1[0];
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
  