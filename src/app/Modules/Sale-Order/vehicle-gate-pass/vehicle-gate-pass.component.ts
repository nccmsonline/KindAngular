import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { error } from '@angular/compiler/src/util';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { filter } from 'rxjs/operators';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-vehicle-gate-pass',
  templateUrl: './vehicle-gate-pass.component.html',
  styleUrls: ['./vehicle-gate-pass.component.css']
})
export class VehicleGatePassComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;fendDate:any;
  newData:any={};isLoadingResults:any;
  userid:any;token:any;  original_url = environment.baseUrl;
  fstartDate:any;CompanyData:any={};allData:any={};
  WorkingDate:any;datePipe = new DatePipe("en-US");
  vehiclegpArrayList = new MatTableDataSource<any>();
  displayedColumns: string[] = ['dated','customer', 'transpoter', 'vehicleno', 'drivername','mobileno', 'weight','intime','outtime', 'print'];

  constructor(public dialog: MatDialog,  private http: HttpClient, private router: Router,private upload:FileDownloadUploadService,private excelService:ExcelService) 
  {
    let currentBranch = sessionStorage.getItem("currentBranch");
    this.CompanyData = JSON.parse(currentBranch);
    this.fstartDate=   this.CompanyData['WORKINGDATE'] ;
    var currentDate: Date = new Date( this.fstartDate);
    var y=currentDate.getFullYear(),m=currentDate.getMonth();
    this.fstartDate=new Date(y,m,1);
    this.fendDate= new Date ( this.CompanyData['WORKINGDATE']) ;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
   }

  ngOnInit() {
    this.vehiclegpArrayList.sort=this.sort;
    this.refreshVEHICLEGPList();
  }
  applyFilter(filterValue: string) {
    this.vehiclegpArrayList.filter = filterValue.trim().toLowerCase();
  }
  refreshVEHICLEGPList()
  {
    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/SOP/SaleInvoice/GetVehicleGPList?fromdate="+sDate+"&todate="+eDate+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.isLoadingResults=false;
      this.vehiclegpArrayList.data=this.allData.Table;
     },
     error=>{
      this.isLoadingResults=false;
     });   
  }
  ShowGPDetail(data)
  {
    if(data.OUTTIME===undefined||data.OUTTIME===''||data.OUTTIME===null )
    {
      this.router.navigate(['/add-Vehicle-GP/'+data.ID+'/edit'], { queryParams:  filter, skipLocationChange: true});
    }
    else
    {
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'You can not edit this Vehicle Gate-Pass.'
        }
      });
    }
  }
  exportToExcelNotInReturn()
  {
    this.isLoadingResults=true;
    var data:Array<any>=[];
    
    this.vehiclegpArrayList.data.forEach((el)=>{
      data.push({
        'Dated': this.datePipe.transform(el.DATED, 'dd/MMM/yyyy'),
        'Vehicle No.': el.VEHICLENO,
        'Driver Name': el.DRIVERNAME,
        'Mobile No.': el.MOBILENO,
        'Transporter Name':el.TRANSPORTNAME ,
        'Purpose of visit': el.PURPOSEOFVISIT,
        'Customer Name':el.CUSTOMERNAME,
        'Material': el.MATERIAL,
        'Destination': el.DISTINATION,
        'Weight(Ton)': el.WEIGHT ,
        'LR No.': el.LRNO,
        'In-Time': el.INTIME,
        'Out-Time': el.OUTTIME ,
        'Remarks': el.REMARKS
             });
    });
    this.excelService.exportAsExcelFile(data, 'Vehicle Gate-Pass');
    this.isLoadingResults=false;
  }

  print(id)
  {
   
    this.isLoadingResults=true;
    this.upload.downloadPDF(this.original_url+ '/admin/CreatePDF/PrintVehicleGatePass?token='+this.token+"&id="+id).subscribe(res => {
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
}