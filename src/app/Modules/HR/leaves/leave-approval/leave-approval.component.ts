import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {

 
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;
  boid : any;
  empid:any;
  userid:any;LeaveListToSave : Array<any>=[]; 
  original_url=environment.baseUrl;flag:any;token:any;
  leaveTitle:any="";isCEO:any;
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'PASS', 'DELETE', 'DATED','EMPNO','NAME','DEPTNAME','LEAVEFROM','LEAVETO','REASONFORLEAVE','EL','SL','CL'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor( private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, public dialog: MatDialog,) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
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
        
        this.gatDataLeaveList();
        if(this.flag=="A")
        {
          this.leaveTitle="Leave Enjoyed";
        }
        else if(this.flag=="H")
        {
          this.leaveTitle="Balance Leave";
        }
        else
        {
          this.leaveTitle="";
        }
      }
    });
  
   // this.isLoadingResults=false;
  }

  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   }
 
  // onChange(event, indent)
  // {
  //   if(event.checked == true)
  //   {
  //   this.LeaveListToSave.push(indent);
  //   }
  //   else
  //   {
  //     this.LeaveListToSave.splice (this.LeaveListToSave.indexOf(indent),1);
  //   }
  // }
  onChange(event, data)
  {
    if(event.checked == true)
    {
     data.delete=false;
    }
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
  saveData()
  {
    var savelist : Array<any>=[];
    
    this.fieldArray.data.forEach((el)=>{
      if(this.flag=="A" && el.checked==true)
      {
        savelist.push({'APPROVEDBYAUTHORITY':'Y','ID':el.ID});
      }
      else if(this.flag=="A" && el.delete==true)
      {
        savelist.push({'APPROVEDBYAUTHORITY':'R','ID':el.ID});
      }
      else if(this.flag=="H" && el.checked==true)
      {
        savelist.push({'APPROVEDBYHR':'Y','ID':el.ID});
      }
      else if(this.flag=="H" && el.delete==true)
      {
        savelist.push({'APPROVEDBYHR':'R','ID':el.ID});
      }
    }); 

   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else
   {
    this.isLoadingResults=true;
    

    const params = new  HttpParams()
   
    .set('token', this.token)
    .set('flag', this.flag)
    .set('IsCEO', this.isCEO)
    .set('empid', this.empid)
    .set('list', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/EmployeeLeavePassing", params.toString(), {
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
       this.LeaveListToSave=[];
       this.isLoadingResults=false;
    },
    error=>{
      var erroremsg:any;
      erroremsg=error.message;
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:erroremsg
       }
     });
     this.isLoadingResults=false;
    });
   }
   
   console.log("this.other", this.LeaveListToSave);
  }
  gatDataLeaveList()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/LeaveListForApproval?flag="+this.flag+"&token="+this.token+"&isCEO="+this.isCEO+"&empid="+this.empid).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
     console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}