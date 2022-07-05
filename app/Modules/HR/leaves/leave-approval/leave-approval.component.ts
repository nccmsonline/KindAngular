import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
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

 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;
  boid : any;
  userid:any;LeaveListToSave : Array<any>=[]; 
  original_url=environment.baseUrl;flag:any
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'EMPNO','NAME','DEPTNAME','LEAVEFROM','LEAVETO','REASONFORLEAVE','ADDRESS'];
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
   
   
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
        
        this.gatDataLeaveList();
      }
    });
    
   // this.isLoadingResults=false;
  }

  ngOnInit() {
    
  }
  onChange(event, indent)
  {
    if(event.checked == true)
    {
    this.LeaveListToSave.push(indent);
    }
    else
    {
      this.LeaveListToSave.splice (this.LeaveListToSave.indexOf(indent),1);
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
    
    this.LeaveListToSave.forEach((el)=>{
        savelist.push({'APPROVEDBYAUTHORITY':'Y','ID':el.ID});
    }); 

   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else
   {
    this.isLoadingResults=true;
    

    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('userid', this.userid)
    .set('flag', this.flag)
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
    this.http.get(this.original_url+"/hr/hr/LeaveListForApproval?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&flag="+this.flag).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;

     console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}