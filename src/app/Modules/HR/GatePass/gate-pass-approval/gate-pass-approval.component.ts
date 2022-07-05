import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FormControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { isError } from 'util';

@Component({
  selector: 'app-gate-pass-approval',
  templateUrl: './gate-pass-approval.component.html',
  styleUrls: ['./gate-pass-approval.component.css']
})
export class GatePassApprovalComponent implements OnInit {

  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;datePipe = new DatePipe("en-US");
  boid : any;empid:any; isCEO:any;empWiseGatePass:Array<any>=[];
  userid:any;ListToSave : Array<any>=[]; datetype: Array<any>=[];token;any;flag:any;
  //rateAppDetail: RateApprovalModel[] = [];
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = ['PASS','DELETE', 'EMPNO','NAME','DEPTNAME','DATED','OUTTIME','INTIME','PURPOSE','REASON','TOTALGP'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog,) { 
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
    this.token = currentUser['TOKEN'];
    this.isCEO= currentUser['ISCEO'];
    this.empid= currentUser['EMPID'];
    
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
          
          if(event.url == '/Gate-pass-approval/A')
          {
            this.gatDataGatePassList();
          }
          else if(event.url == '/Gate-pass-approval/G')
          {
            this.gatDataGatePassList();
          }
          else if(event.url == '/Gate-pass-approval/H')
          {
            this.gatDataGatePassList();
          }
        }
      });


   // this.isLoadingResults=false;
  }

  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
  }
  onChange(event, data)
  {
    if(event.checked == true)
    {
    //this.ListToSave.push(data);
     data.delete=false;
    }
    // else
    // {
    //   this.ListToSave.splice (this.ListToSave.indexOf(data),1);
    // }
  }
  onDelete(event, data)
  {
    if(event.checked == true)
    {
      data.checked=false;
    }
   
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
  updateInfo()
  {
    var savelist : Array<any>=[]; 
    this.fieldArray.data.forEach((el)=>{
     let data:any={};
      data.id=el.ID;
      var pdate =new Date(el.INTIME);
      debugger;
      if(el.INTIME!=null && this.flag=="G")
      {
        data.INTIME="To_Date('"+ formatDate(pdate, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530')+ "', 'dd-Month-yyyy HH24:MI')"; 
      }
      
      pdate =new Date(el.OUTTIME);
      if(el.OUTTIME!=null && this.flag=="G")
      {
        data.OUTTIME="To_Date('"+ formatDate(pdate, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530')+ "', 'dd-Month-yyyy HH24:MI')";// data.OUTTIME; 
      }
     
      savelist.push(data);
      
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
    
    .set('flag', "G1")
    .set('mode', "NEW")
    .set('token', this.token)
    .set('IsCEO', this.isCEO)
    .set('empid', this.empid)
    .set('detail', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/updateGatePassInfo", params.toString(), {
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
      this.fieldArray.data.forEach((el)=>{
        var pdate =new Date(el.INTIME);
        if(el.INTIME!=null)
        {
          el.INTIME=pdate;
        }
        
        pdate =new Date(el.OUTTIME);
        //el.OUTTIME=pdate;
        if(el.OUTTIME!=null)
        {
          el.OUTTIME=pdate;
        }
      }); 
       console.log("res",res);
       this.ListToSave=[];
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
   
  }

  saveData()
  {
    var savelist : Array<any>=[]; 
    var isError=false;
    this.fieldArray.data.forEach((el)=>{
      let data:any={};
       data.id=el.ID;
       var pdate =new Date(el.INTIME);
      if(el.checked==true)
      {
            if(el.INTIME!=null && this.flag=="G")
            {
              data.INTIME="To_Date('"+ formatDate(pdate, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530')+ "', 'dd-Month-yyyy HH24:MI')"; 
            }
            pdate =new Date(el.OUTTIME);
            if(el.OUTTIME!=null && this.flag=="G")
            {
              data.OUTTIME="To_Date('"+ formatDate(pdate, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530')+ "', 'dd-Month-yyyy HH24:MI')";// data.OUTTIME; 
            }

            if((el.OUTTIME==null || el.INTIME==null) && this.flag=="G")
            {
             isError=true;
            }

            savelist.push(data);
      }
      else if(el.delete==true)
      {
        data.delete=true;
        savelist.push(data);
      }

     }); 
   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else if( isError)
   {
     this.WrongDetailDialog('In or Out Time not entred.');
   }
   else
   {
    this.isLoadingResults=true;
    this.TodayDay=this.datePipe.transform(this.TodayDay, 'dd-MMM-yyyy') ;
  
    const params = new  HttpParams()
   
    .set('flag', this.flag)
    .set('mode', "NEW")
    .set('token', this.token)
    .set('isCEO', this.isCEO)
    .set('empid', this.empid)
    .set('detail', JSON.stringify(savelist));

    this.http.post(this.original_url+"/hr/hr/updateGatePassInfo", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      this.isLoadingResults=false;
      if (res=="Ravinder")
      {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Something went wrong, Login again or connect to System Admin'
          }
        });
      }
      else
      {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'sucess'
            }
          });
          this.data=res;
          this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay.Table;
          this.fieldArray.data = this.itemDisplay;
          this.fieldArray.data.forEach((el)=>{
          var pdate =new Date(el.INTIME);
          if(el.INTIME!=null)
          {
            el.INTIME=pdate;
          }
          pdate =new Date(el.OUTTIME);
          if(el.OUTTIME!=null)
          {
            el.OUTTIME=pdate;
          }
          }); 
          console.log("res",res);
          this.ListToSave=[];
          this.isLoadingResults=false;
      }
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
   
   console.log("this.other", this.ListToSave);
  }
  gatDataGatePassList()
  {
    this.ListToSave=[];
    this.isLoadingResults=true;
    this.TodayDay=this.datePipe.transform(this.TodayDay, 'dd-MMM-yyyy') ;
    const params = new  HttpParams()
    .set('flag', this.flag)
    .set('mode', "VIEW")
    .set('token', this.token)
    .set('IsCEO', this.isCEO)
    .set('empid', this.empid)
    .set('detail', JSON.stringify(this.ListToSave));
    this.http.get(this.original_url+"/hr/hr/updateGatePassInfo?" +params.toString())
    .subscribe((res) => {
      debugger;
     this.isLoadingResults=false;
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.fieldArray.data.forEach((el)=>{
        var pdate =new Date(el.INTIME);
        if(el.INTIME!=null)
        {
          el.INTIME=pdate;
        }
        
        pdate =new Date(el.OUTTIME);
        //el.OUTTIME=pdate;
        if(el.OUTTIME!=null)
        {
          el.OUTTIME=pdate;
        }
      }); 
       console.log("res",res);
       this.ListToSave=[];
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
    // this.isLoadingResults=true;
    // this.http.get(this.original_url+"/hr/hr/getEmployeeGatePassList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&empid="+ this.empid+"&flag="+this.flag+"&userid="+this.userid+"&token="+this.token+"&isCEO="+this.isCEO+"&empid="+this.empid).subscribe((res)=>{
    // this.data=res;
    // this.itemDisplay=res;
    // this.itemDisplay=this.itemDisplay.Table;
    // this.fieldArray.data = this.itemDisplay;
    // this.fieldArray.data.forEach((el)=>{
    //   var pdate =new Date(el.INTIME);
    //   if(el.INTIME!=null)
    //   {
    //     el.INTIME=pdate;
    //   }
      
    //   pdate =new Date(el.OUTTIME);
    //    if(el.OUTTIME!=null)
    //   {
    //     el.OUTTIME=pdate;
    //   }
    // }); 
    //  console.log("res",res);
    //  this.isLoadingResults=false;
    // });
  }
  showTotalGatePass(data)
  {
    var mhtml="";
    var Today= formatDate(data.GPDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/ShowEmployeeWiseGatePass?empid="+data.EMPID+"&flag="+this.flag+"&token="+this.token+"&date="+Today+"&purposecode="+data.PURPOSECODE).subscribe((res)=>{
        this.data=res;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.empWiseGatePass = this.itemDisplay;
        mhtml="<table border=1>"
        mhtml=mhtml+"<tr><th  style='width: 10px;text-align: right;'>Dated</th><th style='width: 90px;text-align: right;'>Out Time</th><th style='width: 90px;text-align: right;'>In Time</th> <th>Reason</th><tr>";

        this.empWiseGatePass.forEach((el)=>{
          //mhtml=mhtml+"<tr><td style='width: 90px;text-align: right;'>"+ formatDate(data.GPDATE, 'dd-MMM-yyyy', 'en-US', '+0530') +"</td><td style='width: 90px;text-align: right;'>"+formatDate(el.INTIME, 'HH:mm tt', 'en-US', '+0530')+"</td><td style='width: 90px;text-align: right;'>"+formatDate(el.OUTTIME, 'HH:mm t', 'en-US', '+0530')+"</td><td>"+el.REASON+"</td></tr>";
          mhtml=mhtml+"<tr><td style='width: 100px;text-align: right;'>"+ formatDate(el.GPDATE, 'dd-MM-yyyy', 'en-US', '+0530') + 
                    "</td><td style='width: 90px;text-align: right;'>"+formatDate(el.INTIME, 'HH:mm', 'en-US', '+0530')+
                    "</td><td style='width: 90px;text-align: right;'>"+formatDate(el.OUTTIME, 'HH:mm', 'en-US', '+0530')+
                    "</td><td style='width: 190px;'>"+el.REASON+"</td></tr>";
        });
        mhtml=mhtml+"</table>"
        this.isLoadingResults=false;
        console.log("res",res);
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'validation',
            displayMsg:mhtml
          }
        });
        
        
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
     this.isLoadingResults=false;});
  }
}