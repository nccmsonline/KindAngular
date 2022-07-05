import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';

/////////////================ use for Year and month selection only
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {ExcelService} from '../../../../services/excel/excel.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
  selector: 'app-gstr2-a',
  templateUrl: './gstr2-a.component.html',
  styleUrls: ['./gstr2-a.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GSTR2AComponent implements OnInit {

  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort, { static: true }) partiallysort: MatSort;
  @ViewChild(MatPaginator) partiallypaginator:MatPaginator;
  GST: FormGroup;
  selectedTabIndex:any;
  searchDateValue: FormControl;
  ret_period = new FormControl(moment());
  userinfo : any; newData:any={};
  coid : any;datePipe = new DatePipe("en-US");
  boid : any;token:any;
  userid:any;
  COMPANYGSTIN:any;
  opt:any;
  header:any={};
  fieldArray = new MatTableDataSource<any>();
  partiallyMatchedArray = new MatTableDataSource<any>();
  differenceInGstArray = new MatTableDataSource<any>();
  diffInGstInArray = new MatTableDataSource<any>();
  diffInBillNoArray = new MatTableDataSource<any>();
  diffInBillDateArray = new MatTableDataSource<any>();
  billsNotInBooksArray = new MatTableDataSource<any>();
  billsNotInReturnsArray = new MatTableDataSource<any>();
  billsNotInCurrentRetArray = new MatTableDataSource<any>();
  summaryArray:Array<any>=[];
  recoArray:Array<any>=[];filterTypes:Array<any>=[];
  displayedColumns: string[] = ['sr' ,'gstin','party','billno','date','taxable','tax','amount'];
  partially_displayedColumns: string[] = ['sr' , 'gstin','party','billno','date','taxable','tax','booktax','diff'];
  diffGSTIndisplayedColumns: string[] = [ 'sr' ,'gstin','bgstin','party','billno','date','taxable','tax','amount'];
  diffBillNodisplayedColumns: string[] = ['sr' ,'branch', 'gstin','party','billno','bbillno','date','taxable','tax','amount'];
  diffBillDatedisplayedColumns: string[] = ['sr' , 'branch','gstin','party','billno','date','bdate','taxable','tax','amount'];
  notinReturndisplayedColumns: string[] = [ 'sr' ,'branch','gstin','party','billno','date','taxable','tax','amount'];
  notinCurrentRetDispColumns: string[] = [ 'sr' ,'month','gstin','party','billno','date','taxable','tax','amount'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any; fstartDate:any;fendDate:any;miniDate=new Date();maxDate=new Date();
  itemDisplay: any={};dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor(private fb: FormBuilder, private http: HttpClient,  public dialog: MatDialog,private excelService:ExcelService) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.COMPANYGSTIN= CompanyData['COMPANYGSTNO'];

    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.fendDate=  CompanyData['WORKINGDATE'] ;
    this.fstartDate= CompanyData['WORKINGDATE'] ;
    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);

    this.miniDate = new Date( CompanyData['FINANCIALYEARSTARTDATE']);
    this.maxDate = new Date( CompanyData['FINANCIALYEARENDDATE']);
    this.header.VIEWRETURN="M";
    this.dateToControl.setValue(currentDate);
    // this.searchDateValue = new FormControl(this.searchDate);
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.filterTypes.push({id:'2',description:'First Quarter'});
    this.filterTypes.push({id:'3',description:'Second Quarter'});
    this.filterTypes.push({id:'4',description:'Third Quarter'}) ;
    this.filterTypes.push({id:'1',description:'Fourth Quarter'}) ;
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
    this.http.get(this.original_url+"/sop/GSTR2A/sendOTPtoUser?gstin="+this.COMPANYGSTIN).subscribe((res: any[])=> {
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
  
  onToDateChanged1()
  {
    console.log("ravi");
   // this.getInvoiceList();
  }
  updategstin()
  {
    let list:Array<any>=[];
    this.diffInGstInArray.data.forEach(el => {
      list.push({RET_GSTIN:el.RET_GSTIN, BOOK_GSTIN:el.BOOK_GSTIN});
    });
    this.updateData(list,"G");
  }
  updateBillNO(el)
  {
    let list:Array<any>=[];
   // this.diffInBillNoArray.data.forEach(el => {
     this.isLoadingResults=true;
      list.push({RET_INVOICE:el.RET_INVOICE, INWARDID:el.INWARDID,BRANCHID:el.BRANCHID,VOUCHERNO:el.VOUCHERNO});
      this.diffInBillNoArray.data.splice (this.diffInBillNoArray.data.indexOf(el),1);
  //  });
  
    this.updateData(list,"B");
  }
  updateBillDate(el)
  {
    let list:Array<any>=[];
   // this.diffInBillDateArray.data.forEach(el => {
    this.isLoadingResults=true;
      list.push({RET_INVOICEDATE:this.datePipe.transform(el.RET_INVOICEDATE, 'dd/MMM/yyyy'), INWARDID:el.INWARDID,BRANCHID:el.BRANCHID,VOUCHERNO:el.VOUCHERNO});
   // });
    this.updateData(list,"D");
  }
  updateData(savelist, flag)
  {
    const params = new  HttpParams()
    
    .set('flag', flag)
    .set('token', this.token)
    .set('list', JSON.stringify(savelist));
   this.isLoadingResults=true;
    this.http.post(this.original_url+"/SOP/GSTR2A/updateGSTR2AData", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      console.log("data",res);
      this.isLoadingResults=false;
      if (res=="Ravinder")
      {
      
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Something went wrong, Login again or connect to System Admin'
          }
        });
      }
      else
      {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'sucess',
            displayMsg:''
          }
        });
      }
      this.isLoadingResults=false;
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
     this.isLoadingResults=false;
    });
   
  }
  exportToExcelNotInBooks()
  {
    var data:Array<any>=[];
    this.billsNotInBooksArray.data.forEach((el)=>{
      data.push({
        'GSTIn': el.RET_GSTIN,
        'Party Name':el.PARTYNAME ,
        'Bill No': el.RET_INVOICE,
        'Bill Date':this.datePipe.transform(el.RET_INVOICEDATE, 'dd/MMM/yyyy') ,
        'GST': el.RET_GSTAMT,
        'Bill Amt': el.RET_INVAMT,
        'Branch1': el.UNIT2,
        'Branch2': el.PDC,
        'Branch3': el.MOTOR
      });
    });
    this.excelService.exportAsExcelFile(data, 'Bill Not in Books');
  }
  exportToExcelNotInReturn()
  {
    var data:Array<any>=[];
    this.billsNotInReturnsArray.data.forEach((el)=>{
      data.push({
        'GSTIn': el.BOOK_GSTIN,
        'Party Name':el.PARTYNAME ,
        'Bill No': el.BOOK_INVOICE,
        'Bill Date':this.datePipe.transform(el.BOOK_INVOICEDATE, 'dd/MMM/yyyy') ,
        'GST': el.BOOK_GSTAMT,
        'Bill Amt': el.BOOK_INVAMT,
        'Branch1': el.BRANCHNAME      });
    });
    this.excelService.exportAsExcelFile(data, 'Bill Not in Books');
  }
  GSTR2AReco()
  {
    var retYear="",retMonth="", period="";
    if(this.header.VIEWRETURN=="M")
    {
      retYear=this.datePipe.transform(this.ret_period.value, 'yyyy');
      retMonth=this.datePipe.transform(this.ret_period.value, 'MM');
      period=retMonth+retYear;
    }
    else  if(this.header.VIEWRETURN=="Q")
    {
      period=this.header.QTR;
    }
    else
    {
      retYear=this.datePipe.transform(this.miniDate, 'yyyy');
      retMonth=this.datePipe.transform(this.maxDate, 'yy');
      period=retYear+retMonth;
    }
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/sop/GSTR2A/GSTR2AReco?period="+period+"&token="+this.token+"&gstin="+this.COMPANYGSTIN+"&flag="+this.header.VIEWRETURN).subscribe((res: any[])=> {
      console.log("GSTR2AReco",res);
      this.itemDisplay=res;
      this.fieldArray.data=this.itemDisplay.Table;
      this.partiallyMatchedArray.data=this.itemDisplay.Table1;
      this.differenceInGstArray.data=this.itemDisplay.Table2;
      this.diffInGstInArray.data=this.itemDisplay.Table3;
      this.diffInBillNoArray.data=this.itemDisplay.Table4;
      this.diffInBillDateArray.data=this.itemDisplay.Table5;
      this.billsNotInBooksArray.data=this.itemDisplay.Table6;
      this.billsNotInReturnsArray.data=this.itemDisplay.Table7;
      this.recoArray=this.itemDisplay.Table8;
      this.summaryArray=this.itemDisplay.Table9;
      this.billsNotInCurrentRetArray=this.itemDisplay.Table10;
      console.log("fieldArray",this.fieldArray.data);

      this.isLoadingResults=false;
      let Bills=0, gst=0;
      this.recoArray.forEach((el)=>{
            if(el.CALC=="+")
            {
              Bills=Bills+parseInt(el.BILLS);
              gst=gst+parseInt(el.GST);
            }
            else
            {
              Bills=Bills-parseInt(el.BILLS);
              gst=gst-parseInt(el.GST);
            }
        });
        this.recoArray.push({REMARKS:'Diff',BILLS:Bills,GST:gst});
      },
      error=>{
        this.isLoadingResults=false;
        this.WrongDetailDialog("Somthing went Wrong");
      });
  }
  tabChanged(event){
  }
  downloadGSTR2A()
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
    this.http.get(this.original_url+"/sop/GSTR2A/getGSTR2AData?period="+retMonth+retYear+"&token="+this.token+"&gstin="+this.COMPANYGSTIN+"&OTP="+mOTP+"&retdate=01/"+this.datePipe.transform(this.ret_period.value, 'MMM/yyyy')).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
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
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'sucess',
            displayMsg:'OTP sent on register Mobile!'
          }
        });
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
  // createForm() {
  //   this.GST = this.fb.group({
    
  //     fromdate :  ['', Validators.required ],
  //     todate :  ['', Validators.required ],
      
  //   });
  // }
  
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
    this.partiallyMatchedArray.filter = filterValue.trim().toLowerCase();
    this.differenceInGstArray.filter = filterValue.trim().toLowerCase();
    this.diffInGstInArray.filter = filterValue.trim().toLowerCase();
    this.diffInBillNoArray.filter = filterValue.trim().toLowerCase();
    this.diffInBillDateArray.filter = filterValue.trim().toLowerCase();
    this.billsNotInBooksArray.filter = filterValue.trim().toLowerCase();
    this.billsNotInReturnsArray.filter = filterValue.trim().toLowerCase();
    this.billsNotInCurrentRetArray.filter = filterValue.trim().toLowerCase();
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
  

  }
  openDialog(row): void {
    console.log("data1", row);
    const dialogRef = this.dialog.open(gst2ABillDetailComponent, {
     // width: '600px',
      data: row
    });
  }
}

@Component({
  selector: 'billDetail',
  templateUrl: './billDetail.html',
  styleUrls: ['./gstr2-a.component.css']
})
export class gst2ABillDetailComponent implements OnInit {
  original_url=environment.baseUrl;
  token:any;
  newData:any={};
  allData:any={};
  returndata:Array<any>=[];
  datePipe = new DatePipe("en-US");
  isLoadingResults:any;
  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog,  @Inject(MAT_DIALOG_DATA) public data: any) {
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    
  }
  ngOnInit() {
    debugger;
    const params = new  HttpParams()
    .set('token', this.token)
    .set('gstin', this.data.BOOK_GSTIN)
    .set('inwardid', this.data.INWARDID)
    .set('voucherno', this.data.VOUCHERNO)
    .set('branchid', this.data.BRANCHID)
    .set('billamt', this.data.BOOK_INVAMT);
    this.http.get(this.original_url+"/sop/GSTR2A/getBillDetail?"+ params.toString() ,{
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe((res)=>{
      console.log("res", res);

      this.allData=res;
      this.allData=this.allData.Table[0];
      this.newData=this.allData;
      this.allData=res;
      this.returndata=this.allData.Table1;
    });

    // this.http.get(this.original_url+""+).subscribe((res)=>{

    // });
  }
  updateInvoice(el)
  {
      let list:Array<any>=[];
      this.isLoadingResults=true;
       //list.push({RET_INVOICEDATE:this.datePipe.transform(el.RET_INVOICEDATE, 'dd/MMM/yyyy'), INWARDID:el.INWARDID,BRANCHID:el.BRANCHID,VOUCHERNO:el.VOUCHERNO});
       list.push({RET_INVOICE:this.newData.BILLNO, INWARDID:el.INWARDID,BRANCHID:el.BRANCHID,VOUCHERNO:el.VOUCHERNO});
     this.updateData(list,"B");
  }
  updateInvDate(el)
  {
    let list:Array<any>=[];
     this.isLoadingResults=true;
       list.push({RET_INVOICEDATE:this.datePipe.transform(this.newData.BILLDATE, 'dd/MMM/yyyy'), INWARDID:el.INWARDID,BRANCHID:el.BRANCHID,VOUCHERNO:el.VOUCHERNO});
     this.updateData(list,"D");
  }
  updateData(savelist, flag)
  {
    const params = new  HttpParams()
    
    .set('flag', flag)
    .set('token', this.token)
    .set('list', JSON.stringify(savelist));
   this.isLoadingResults=true;
    this.http.post(this.original_url+"/SOP/GSTR2A/updateGSTR2AData", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      console.log("data",res);
      this.isLoadingResults=false;
      if (res=="Ravinder")
      {
      
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Something went wrong, Login again or connect to System Admin'
          }
        });
      }
      else
      {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'sucess'
            }
          });
      }
      this.isLoadingResults=false;
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
     this.isLoadingResults=false;
    });
   
  }
}

@Component({
  selector: 'voucherDetail',
  templateUrl: './voucherDetail.html',
  styleUrls: ['./gstr2-a.component.css']
})
export class gst2AVoucherDetailComponent implements OnInit {
  original_url=environment.baseUrl;
  token:any;
  constructor( private http: HttpClient,private router: Router, public dialog: MatDialog,  @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {

  }
}