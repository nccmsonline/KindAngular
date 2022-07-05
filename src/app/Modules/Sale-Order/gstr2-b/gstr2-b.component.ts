import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {ExcelService} from '../../../services/excel/excel.service';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Global } from 'src/app/Global';
import { DatePipe } from '@angular/common';
import { anyChanged } from '@progress/kendo-angular-common';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
//////////////////////=====================================

@Component({
  selector: 'app-gstr2-b',
  templateUrl: './gstr2-b.component.html',
  styleUrls: ['./gstr2-b.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class GSTR2BComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  searchDateValue: FormControl; expandedElement='';
  ret_period = new FormControl(moment());
  fieldArray = new MatTableDataSource<any>();
  fieldArrayNoMatched = new MatTableDataSource<any>();

  fieldArrayNoMatchedbillno = new MatTableDataSource<any>();
  fieldArrayNoMatchedbilldate = new MatTableDataSource<any>();
  fieldArrayNoMatchedamt = new MatTableDataSource<any>();
  
  

  fieldArraySummary = new MatTableDataSource<any>();
  Summary = new MatTableDataSource<any>();
  itemDisplay: any={};datePipe = new DatePipe("en-US");
  isLoadingResults: boolean=false;subDetail:Array<any>=[];
  opt:any;miniDate=new Date();maxDate=new Date();allData:any={};
  displayedColumns: string[] = ['gstin','party','taxble','cgst','sgst','igst','totalinv'];
  displayedColumnsNoMatch: string[] = ['gstin','party','billno','billdate','taxble','cgst','sgst','igst','totalinv'];


  displayedColumnAmt: string[] = ['gstin','party','billno','billdate','taxble','gstamt','gstinbook','totalinv'];
  displayedColumnNo: string[] = ['gstin','party','billno' ,'billdateinbook','billdate','taxble','gstamt','totalinv'];
  displayedColumnDate: string[] = ['gstin','party','billno','billdate','billdateinbook','taxble','gstamt','totalinv'];
  displayedColumnsSummary: string[] = ['year','month','cgst','sgst','igst'];
  dataMode='Download';
  selectedTabIndex:any;
  constructor(private fb: FormBuilder, private http: HttpClient,public AppUser:Global,  public dialog: MatDialog,private excelService:ExcelService) 
  {
    
    this.miniDate = new Date( AppUser.FinancialYearStartDate);
    this.maxDate = new Date( AppUser.FinancialYearEndDate);
   }
   ProcessData()
   {
     var retYear="",retMonth="";
     retYear=this.datePipe.transform(this.ret_period.value, 'yyyy');
     retMonth=this.datePipe.transform(this.ret_period.value, 'MM');
     this.isLoadingResults=true;
     let mOTP=0;
    
     if(this.opt!=undefined&&this.opt!='')
     {
       mOTP= this.opt;
     }
     this.http.get(this.original_url+"/sop/GSTR2B/processGSTR2BData?period="+retMonth+retYear+"&token="+this.AppUser.Token).subscribe((res: any[])=> {
       console.log("ts",res);
       this.itemDisplay=res;
       this.allData=res;
       if(this.itemDisplay=="-1")
       {
         const dialogRef = this.dialog.open(SuccessDialogComponent, {
           data: {
             wrongData: 'wrongData',
             displayMsg:'Error in Download!'
           }
         });
       }
       else
       {
        this.dataMode='Process';
       
        this.fieldArrayNoMatched.data=this.allData.Table;
        this.fieldArraySummary.data=this.allData.Table1;
        
        console.log("this.fieldArraySummary.data",this.fieldArraySummary.data);

        this.fieldArrayNoMatchedamt.data=this.allData.Table2;
        this.fieldArrayNoMatchedbillno.data=this.allData.Table3;
        this.fieldArrayNoMatchedbilldate.data=this.allData.Table4;
       }
       this.isLoadingResults=false;
       }, 
       error=>{
         const dialogRef = this.dialog.open(SuccessDialogComponent, {
           data: {
             wrongData: 'wrongData',
             displayMsg:'Somthing went wrong'
           }
         });
         this.isLoadingResults=false;
       });
   
   }
   showMonthDetail(data)
   {
    var retYear="",retMonth="";
    retYear=this.datePipe.transform(this.ret_period.value, 'yyyy');
    retMonth=this.datePipe.transform(this.ret_period.value, 'MM');
    this.isLoadingResults=true;
    let tmp:Array<any>=[];
    this.http.get(this.original_url+"/sop/GSTR2B/GSTR2BDataForMonths?period="+retMonth+retYear+"&token="+this.AppUser.Token+"&gstin="+this.AppUser.GSTIn+"&month="+data.MONTH+"&YEAR="+data.YEAR).subscribe((res: any[])=> {
      console.log("Detail",res);
      this.itemDisplay=res;
      tmp=this.itemDisplay.Table;
      let msg="", i:number=1;
      msg="Following invoice are missing :-"+'<br><br><table><tr><th> GSTin</th><th>Party </th> <th>Bill No </th><th>Bill Date </th><th>IGST </th><th>CGST </th><th>SGST </th><tr>';
      tmp.forEach((el)=>{
            msg=msg+"<tr><td>"+el.GSTIN+"</d><td>"+el.PARTY+"</d><td>"+el.BILLNO+"</d><td>"+el.BILLDATE+"</d><td>"+el.IGST+"</d><td>"+el.CGST+"</d><td>"+el.SGST+"</d></tr>"
      });
      msg=msg+"</table>"
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'validation',
          displayMsg:msg
        }
      });
   
      this.isLoadingResults=false;
    },
    error=>{
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'Somthing went wrong'
        }
      });
      this.isLoadingResults=false;
    }); 
   }
   downloadGSTR2B()
   {
     var retYear="",retMonth="";
     retYear=this.datePipe.transform(this.ret_period.value, 'yyyy');
     retMonth=this.datePipe.transform(this.ret_period.value, 'MM');
     this.isLoadingResults=true;
     let mOTP=0;
    
     if(this.opt!=undefined&&this.opt!='')
     {
       mOTP= this.opt;
     }
     this.http.get(this.original_url+"/sop/GSTR2B/getGSTR2BData?period="+retMonth+retYear+"&token="+this.AppUser.Token+"&gstin="+this.AppUser.GSTIn+"&OTP="+mOTP).subscribe((res: any[])=> {
       console.log("ts",res);
       this.itemDisplay=res;
       this.allData=res;
       if(this.itemDisplay=="-1")
       {
         const dialogRef = this.dialog.open(SuccessDialogComponent, {
           data: {
             wrongData: 'wrongData',
             displayMsg:'Error in Download!'
           }
         });
       }
       else
       {
        this.dataMode='Download';
        this.itemDisplay=this.itemDisplay.data;
       // console.log("itemDisplay-1",this.itemDisplay);
        this.itemDisplay=this.itemDisplay.cpsumm;
       // console.log("itemDisplay-2",this.itemDisplay);
        this.itemDisplay=this.itemDisplay.b2b;
     //   console.log("itemDisplay-3",this.itemDisplay);
        this.allData=this.allData.data;
        this.allData=this.allData.docdata;
        this.allData=this.allData.b2b;
        this.fieldArray.data=this.itemDisplay;
       }
       this.isLoadingResults=false;
       }, 
       error=>{
         const dialogRef = this.dialog.open(SuccessDialogComponent, {
           data: {
             wrongData: 'wrongData',
             displayMsg:'Somthing went wrong'
           }
         });
         this.isLoadingResults=false;
       });
   
   }
   showDetail(gstin)
   {
     if(this.expandedElement=='')
     {
        this.subDetail=this.subDetail.find(x=>x.ctin==gstin).inv;
        this.expandedElement=gstin;  
     }
     else
     {
      this.expandedElement='';
     }
   }
   applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
   }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
    //this.partiallyMatchedArray=this.partiallysort;
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.ret_period.value;
    ctrlValue.year(normalizedYear.year());
    this.ret_period.setValue(ctrlValue);
    console.log("Date", this.ret_period);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.ret_period.value;
    ctrlValue.month(normalizedMonth.month());
    this.ret_period.setValue(ctrlValue);
    datepicker.close();
    console.log("Date", this.ret_period);
  }
  GenerateOTP()
  {
    this.http.get(this.original_url+"/sop/GSTR2A/sendOTPtoUser?gstin="+this.AppUser.GSTIn).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      if(this.itemDisplay=="-1")
      {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Error!'
          }
        });
      }
      else
      {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'validation',
              displayMsg:'<h3>OTP sent on register Mobile.</h>'
            }
          });
      }
      this.isLoadingResults=false;
      });
  }
  
  exportToExcelNotMatched()
  {
    var data:Array<any>=[];
    this.fieldArrayNoMatched.data.forEach((el)=>{
      data.push({
        'GSTIn': el.GSTIN,
        'Party Name':el.PARTY ,
        'Bill No': el.BILLNO,
        'Bill Date':this.datePipe.transform(el.BILLDATE, 'dd/MMM/yyyy') ,
        'Taxable':el.TAXABLE,
        'CGST': el.CGST,
        'SGST': el.SGST,
        'IGST': el.IGST,
        'Bill Amt': el.INVAMOUNT
      });
    });
    this.excelService.exportAsExcelFile(data, 'Bill Not Matched');
  }
  exportToExcelBillDateNotMatched()
  {
    var data:Array<any>=[];
    this.fieldArrayNoMatched.data.forEach((el)=>{
      data.push({
        'GSTIn': el.GSTIN,
        'Party Name':el.PARTY ,
        'Bill No': el.BILLNO,
        'Bill Date':this.datePipe.transform(el.BILLDATE, 'dd/MMM/yyyy') ,
        'Bill Date in Book':this.datePipe.transform(el.BILLDATEINBOOK, 'dd/MMM/yyyy'),
        'Taxable':el.TAXABLE,
        'GST Amt': el.GSTAMT,
        'Bill Amt': el.INVAMOUNT
      });
    });
    this.excelService.exportAsExcelFile(data, 'Bill Date Not Matched');
  }
  exportToExcelBillNoNotMatched()
  {
    var data:Array<any>=[];
    this.fieldArrayNoMatched.data.forEach((el)=>{
      data.push({
        'GSTIn': el.GSTIN,
        'Party Name':el.PARTY ,
        'Bill No': el.BILLNO,
        'Bill No in Book':this.datePipe.transform(el.BILLNOINBOOK, 'dd/MMM/yyyy'),
        'Bill Date':this.datePipe.transform(el.BILLDATE, 'dd/MMM/yyyy') ,
        'Taxable':el.TAXABLE,
        'GST Amt': el.GSTAMT,
        'Bill Amt': el.INVAMOUNT
      });
    });
    this.excelService.exportAsExcelFile(data, 'Bill No Not Matched');
  }
  exportToExcelTaxAmtNotMatched()
  {
    var data:Array<any>=[];
    this.fieldArrayNoMatched.data.forEach((el)=>{
      data.push({
        'GSTIn': el.GSTIN,
        'Party Name':el.PARTY ,
        'Bill No': el.BILLNO,
        'Bill Date':this.datePipe.transform(el.BILLDATE, 'dd/MMM/yyyy') ,
        'Taxable':el.TAXABLE,
        'GST Amt': el.GSTAMT,
        'GST Amt in Book':el.BILLDATEINBOOK,
        'Bill Amt': el.INVAMOUNT
      });
    });
    this.excelService.exportAsExcelFile(data, 'Tax Amt Not Matched');
  }
  GSTB2AReco()
  {

  }
}
