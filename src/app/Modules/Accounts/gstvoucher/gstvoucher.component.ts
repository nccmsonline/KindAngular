import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { SuccessDialogComponent } from '.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gstvoucher',
  templateUrl: './gstvoucher.component.html',
  styleUrls: ['./gstvoucher.component.css']
})
export class GSTVoucherComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;
  boid : any;
  userid:any;LeaveListToSave : Array<any>=[]; 
  original_url=environment.baseUrl;flag:any;token:any;
  fieldArray = new MatTableDataSource<any>();datePipe = new DatePipe("en-US");
  displayedColumns: string[] = ['voucherno', 'voucherdate','party','billno','billdate','amount', 'print'];
  data:any;FYUSER:any;ServerIP:any;fendDate:any;fstartDate:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor( private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, public dialog: MatDialog,) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
   this.fstartDate=  CompanyData['WORKINGDATE'] ;
    var currentDate: Date = new Date( this.fstartDate);
    var y=currentDate.getFullYear(),m=currentDate.getMonth();
    this.fstartDate=new Date(y,m,1);
    this.fendDate= new Date (CompanyData['WORKINGDATE']) ;
     console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
   


    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
        
        this.voucherListRefresh();
      }
    });
    
   // this.isLoadingResults=false;
  }

  ngOnInit() {
    this.fieldArray.sort=this.sort;
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  showVoucher(row)
  {
    this.router.navigate(['/add-gst-voucher/'+row.VOUCHERNO1+'/edit'], {skipLocationChange:true});
  }
  WrongDetailDialog(pmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pmsg
      }
    });
  }
  printVoucher(vno)
  {
    this.router.navigate(['/print-voucher/'+vno+'/JE'], {skipLocationChange:true});
  }
  voucherListRefresh()
  {

    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/Accounts/Accounts/getDirectVoucherList?fromdate="+sDate+"&todate="+eDate+"&token="+this.token).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;

     console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}