
import { Component, OnInit, Inject, ElementRef ,ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import * as jspdf from 'jspdf';  
// import html2canvas from 'html2canvas';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-print-voucher',
  templateUrl: './print-voucher.component.html',
  styleUrls: ['./print-voucher.component.css']
})
export class PrintVoucherComponent implements OnInit {

  original_url = environment.baseUrl;
  companyname: any;
  unitaddress:any;
  Address2:any;
  token:any;
  voucherno:any;
  vouchertype:any;
  voucherArray:Array<any>=[];
  allCommonData:any={};
  vouchertitle:any;
  newData:any={};
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
    ) {
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.companyname=CompanyData['COMPANYNAME'];
      this.unitaddress=CompanyData['ADDRESS'];
      this.Address2 = CompanyData['ADDRESS1'];
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.voucherno = this.route.snapshot.paramMap.get("id");
      this.vouchertype = this.route.snapshot.paramMap.get("type");
      this.vouchertitle="GST VOUCHER";
   
    this.http.get(this.original_url+"/Accounts/Accounts/getVoucherForPrint?token="+this.token+"&voucherno="+this.voucherno+"&voucherType="+this.vouchertype)
    .subscribe((res: any[]) => {
      this.allCommonData = res;
        this.voucherArray = this.allCommonData.Table; 
        let header:any={};
        header= this.allCommonData.Table1[0];
        this.newData=header;
       
    });
   }

  ngOnInit() {
  }

}
