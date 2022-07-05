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
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';

@Component({
  selector: 'app-tour-intimation',
  templateUrl: './tour-intimation.component.html',
  styleUrls: ['./tour-intimation.component.css']
})
export class TourIntimationComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;
  boid : any;
  userid:any;LeaveListToSave : Array<any>=[]; 
  original_url=environment.baseUrl;flag:any;token:any;
  fieldArray = new MatTableDataSource<any>();datePipe = new DatePipe("en-US");
  displayedColumns: string[] = ['DATED', 'EMPNO','NAME','DEPTNAME','TOURSTARTDATE','TOURENDDATE','ADDRESS','REASON','APPROVED','print'];
  data:any;FYUSER:any;ServerIP:any;fendDate:any;fstartDate:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor( private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, public dialog: MatDialog, private upload:FileDownloadUploadService) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate=this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'] , 'dd/MMM/yyyy');
    
    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
   
   
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
        
        this.getSavedTourList();
      }
    });
    
   // this.isLoadingResults=false;
  }

  ngOnInit() {
    
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  showmytour(row)
  {
    if(row.CONFIRMEDBYMD!='Y')
    {
      this.router.navigate(['/add-tour-intimation/'+row.TOURID+'/edit/tour-intimation-form'], {skipLocationChange:true});
    }
    else{
      this.router.navigate(['/add-tour-intimation/'+row.TOURID+'/view/tour-intimation-form'], {skipLocationChange:true});
    }
  }
  WrongDetailDialog(pmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pmsg
      }
    });
  }
  printTourForm(tourId)
  {
       this.isLoadingResults=true;
    this.upload.downloadPDF(this.original_url+ '/admin/CreatePDF/PrintTourForm?token='+this.token+"&tourId="+tourId).subscribe(res => {
      console.log(res);
       var newBlob = new Blob([res], { type: "application/pdf" });
       console.log("ravi",res);
       var newurl = window.URL.createObjectURL(newBlob);
       window.open(newurl);
       this.isLoadingResults=false;
    }, error => {
      this.isLoadingResults=false
      console.log(error);
   });
  }
  getSavedTourList()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/getTourIntimationList?fromdate="+this.fstartDate+"&todate="+this.fendDate+"&token="+this.token).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;

     console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}