import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

//import {PrintPOComponent}from './add-new-purchase-order/add-new-purchase-order.component';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;fendDate:any;
  newData:any={};isLoadingResults:any;
  userid:any;token:any;  original_url = environment.baseUrl;
  fstartDate:any;CompanyData:any={};allData:any={};
  WorkingDate:any;datePipe = new DatePipe("en-US");
  mrirArrayList = new MatTableDataSource<any>();flag:any;
  displayedColumns: string[] = ['potype','pono',  'dated','gstin', 'party','amount', 'user1','user2',  'status', 'print'];

  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,  private http: HttpClient, private router: Router,private upload:FileDownloadUploadService) 
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
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
        
        this.refreshList();
      }
    });
   }

  ngOnInit() {
    this.mrirArrayList.sort=this.sort;
    //this.refreshList();
  }
  applyFilter(filterValue: string) {
    this.mrirArrayList.filter = filterValue.trim().toLowerCase();
  }
  refreshList()
  {
    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getPOList?fromdate="+sDate+"&todate="+eDate+"&token="+this.token+"&flag="+this.flag).subscribe((res)=>{
      this.allData=res;
      this.mrirArrayList.data=this.allData.Table;
      this.isLoadingResults=false;
     });   
  }
  ShowMRIRDetail(data)
  {
    if(data.CONFIRMATION=='Y')
    {
      this.router.navigate(['/addNew-purchaseOrder/'+data.ORDERID+'/edit/'+this.flag], { queryParams:  filter, skipLocationChange: true});
    }
   else
   {
    this.router.navigate(['/addNew-purchaseOrder/'+data.ORDERID+'/view/'+this.flag], { queryParams:  filter, skipLocationChange: true});
   }
  }
  printPO(orderid)
  {
    let data:any={};
    this.isLoadingResults=true;
    this.upload.downloadPDF(this.original_url+ '/admin/InventoryPDF/PrintPurchaseOrder?token='+this.token+"&orderid="+orderid).subscribe(res => {
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
    //  this.http.get(this.original_url+"/PurachaseAndStore/Purchase/printPurchaseOrder?orderid="+orderid+"&token="+this.token).subscribe((res)=>{
    //   this.allData=res;
     
    //   this.allData=this.allData.Table;
    //   data.header=this.allData[0];
    //   this.allData=res;
    //   data.detail=this.allData.Table1;
      
    //   if(this.flag=='N')
    //   {data.title="P u r c h a s e  O r d e r";}
    //   else
    //   {data.title="P u r c h a s e  O r d e r : J o b W o r k";}
    //   data.backto='/purchase-order';
    //   sessionStorage.setItem('order', JSON.stringify(data));
    //   this.router.navigate(['/purchase-print']);
      
    //   this.isLoadingResults=false;
    //  },
    //  error=>{
    //    this.isLoadingResults=false;
    //  });  
     }
}
