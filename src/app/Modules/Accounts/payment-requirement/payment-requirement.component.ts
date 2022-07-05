import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient,HttpParams } from '@angular/common/http';  
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-payment-requirement',
  templateUrl: './payment-requirement.component.html',
  styleUrls: ['./payment-requirement.component.css']
})
export class PaymentRequirementComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;fendDate:any;fstartDate:any;
  datePipe = new DatePipe("en-US");
  @ViewChild('closeBtn') closeBtn: ElementRef;
  isLoading=false;
  displayedColumns: string[] = ['reqno', 'reqdate', 'name','paymenttype','amounttopay','passedamt','remarks'];
  PaymentArray = new MatTableDataSource<any>();
  isLoadingResults = true;
  allData: any={};
  token:any;
  CompanyData:any={};
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
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
   
   }

  ngOnInit() {
    this.PaymentArray.sort=this.sort;
    this.paymentRefresh();
  }
  editPaymentRequirement(data)
  {
    var paymentid=data.REQID;
    let today= new Date ( this.CompanyData['WORKINGDATE']) ;
    let Dated=new Date (data.REQDATE);
    if(data.CONFIRMED == 'N' &&  this.datePipe.transform( today, 'dd/MMM/yyyy')== this.datePipe.transform( Dated, 'dd/MMM/yyyy'))
    {
      this.router.navigate(['/add-payment-requirment/'+paymentid+'/edit/'+data.ACCOUNTID], {skipLocationChange:true});
    }
    else 
    {
      this.router.navigate(['/add-payment-requirment/'+paymentid+'/view/'+data.ACCOUNTID], {skipLocationChange:true});
    }
    
  }
  applyFilter(filterValue: string) {
    this.PaymentArray.filter = filterValue.trim().toLowerCase();
  }
  paymentRefresh()
  {
    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/Accounts/Payments/getPaymentList?fromdate="+sDate+"&todate="+eDate+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.PaymentArray.data=this.allData.Table;
      this.isLoadingResults=false;
     });   
  }

}
