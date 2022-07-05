import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';
@Component({
  selector: 'app-advance-status',
  templateUrl: './advance-status.component.html',
  styleUrls: ['./advance-status.component.css']
})
export class AdvanceStatusComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;fendDate:any;fstartDate:any;
  datePipe = new DatePipe("en-US");
  copanyName:any;Address1:any; Address2:any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  isLoading=false;
  displayedColumns: string[] = ['reqno', 'reqdate','empno', 'name','paymenttype','passedamt','installment','paidamt','status'];
  PaymentArray = new MatTableDataSource<any>();
  isLoadingResults = true;
  allData: any={};
  token:any;LoginUser:any;
  CompanyData:any={};
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog, private upload:FileDownloadUploadService
  ) {
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
    this.LoginUser = currentUser['NAMEOFUSER'];
    this.copanyName = this.CompanyData['COMPANYNAME'];
    this.Address1 = this.CompanyData['ADDRESS'];
    this.Address2 = this.CompanyData['ADDRESS1'];

   }

  ngOnInit() {
    this.PaymentArray.sort=this.sort;
    this.paymentRefresh();
  }
 
  applyFilter(filterValue: string) {
    this.PaymentArray.filter = filterValue.trim().toLowerCase();
  }
  paymentRefresh()
  {
    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/HR/HR/AdanceStatus?fromdate="+sDate+"&todate="+eDate+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.PaymentArray.data=this.allData.Table;
      this.isLoadingResults=false;
     });   
  }
  ShowItemDetail(data)
  {
    var mhtml="";
    let listArray:Array<any>=[];
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/AdvancePaidModeList?reqId="+data.REQID+"&token="+this.token).subscribe((res)=>{
        this.allData=res;
        listArray=this.allData.Table;
        mhtml="<table border=1>"
        mhtml=mhtml+"<tr><th style='width: 150px;'> Mode of Payment </th><th style='width: 100px;text-align: right;'>Amount</th><tr>";

        listArray.forEach((el)=>{
          //mhtml=mhtml+"<tr><td style='width: 90px;text-align: right;'>"+ formatDate(data.GPDATE, 'dd-MMM-yyyy', 'en-US', '+0530') +"</td><td style='width: 90px;text-align: right;'>"+formatDate(el.INTIME, 'HH:mm tt', 'en-US', '+0530')+"</td><td style='width: 90px;text-align: right;'>"+formatDate(el.OUTTIME, 'HH:mm t', 'en-US', '+0530')+"</td><td>"+el.REASON+"</td></tr>";
          mhtml=mhtml+"<tr><td style='width: 100px;'>"+ el.PAYMENTMODE + 
                    "</td><td style='width: 100px;text-align: right;'>"+el.PASSEDAMT +"</td></tr>";
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
  openRectPrintDialog(data)
  {
    // this.isLoadingResults=true;
    // this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/PrintAdvanceSlip?token='+this.token+"&pReqID=0&ApvNo="+data.ID).subscribe(res => {
    //   console.log(res);
    //    var newBlob = new Blob([res], { type: "application/pdf" });
    //    console.log("ravi",res);
    //    var newurl = window.URL.createObjectURL(newBlob);
    //    window.open(newurl);
     
    

    //    this.isLoadingResults=false;
    // }, error => {
    //   this.isLoadingResults=false
    //   console.log(error);
  //  });

      var advanceSlipPrint:any={};
      advanceSlipPrint={
      companyName:this.copanyName,
      Address1:this.Address1,
      Address2:this.Address2,
      name:data.NAME,
      description:data.ADVANCETYPE + ' for ' + data.REASON,
      amountInWords:data.TRANAMTINWORD,
      amount:data.PASSEDAMT,
      advanceamt:data.ADVANCEAMT,
      empno:data.EMPNO,
      designation:data.DESIGNATION,
      depthead:data.DEPTHEAD,
      flag:'R',
      LoginUser:this.LoginUser,
      dated:  this.datePipe.transform(Date(), 'dd-MM-yyyy'),
      backto:'ADVSTATUS',
      installment:data.INSTALLMENTAMT};
      sessionStorage.setItem('chequeprint', JSON.stringify(advanceSlipPrint));
      this.router.navigate(['/print-advance-slip'], {skipLocationChange:true});
   
  }
 

}
