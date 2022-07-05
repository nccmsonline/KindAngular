import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { formatDate, DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dr-cr-note-view',
  templateUrl: './dr-cr-note-view.component.html',
  styleUrls: ['./dr-cr-note-view.component.css']
})
export class DrCrNoteViewComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;fendDate:any;
  original_url = environment.baseUrl;
  newData:any={};isLoadingResults:any;
  userid:any;token:any;  
  fstartDate:any;CompanyData:any={};allData:any={};
  WorkingDate:any;datePipe = new DatePipe("en-US");
  supplierArray:Array<any>=[];
  purchaseorderarray = new MatTableDataSource<any>();
  showParty=false;showTogleParty=false;
  displayedColumns: string[] = ['notetype','noteno', 'notedate',  'suplname', 'amount', 'billno', 'billdate', 'print'];
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,private translate: TranslateService
  ) { 
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    
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
    // User Right Data Get
    this.getData();
  }

  getData()
  {
    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getDrCrList?fromdate="+sDate+"&todate="+eDate+"&token="+this.token+"&partyid="+this.newData.PARTYID).subscribe((res)=>{
      this.allData=res;
      this.purchaseorderarray.data=this.allData.Table;
      this.isLoadingResults=false;
     });   
  }




  printDrCRNote(NOTEID)
  {
    let data:any={};
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Purchase/DrCrPrint?NoteId="+NOTEID+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.allData=this.allData.Table;
      data.header=this.allData[0];
      this.allData=res;
      data.detail=this.allData.Table1;
      // data.backto='/drcr-note-list';
      sessionStorage.setItem('drcrdata', JSON.stringify(data));
      // this.router.navigate(['/drcr-note-print']);
      
      const dialogRef = this.dialog.open(DrcrNotePrintComponent, {
        data: {
          wrongData: 'sucess',
          displayMsg:'Data Saved'
        }
      });

      this.isLoadingResults=false;
     },
     error=>{
       this.isLoadingResults=false;
     });  
  }


  searchParty(term, flag)
  {
    
    if(term !== '' )
    {
      let cusSup='S';
      this.showParty=true;
        this.http.get(this.original_url+"/Master/getAccountList?flag="+cusSup+"&search="+term+"&token="+this.token).subscribe((res)=>{
          
        this.allData=res;
        this.supplierArray=this.allData.Table;
        this.isLoadingResults=false;
        },
        error=>{
          this.isLoadingResults=false;
        });   
      
    }
    else
    {
      this.newData.PARTYID=0;
      this.supplierArray = [];
      this.showParty = false;
      this.showTogleParty=false;
      this.getData();
    }
  }
  onChangeOfParty(row,data)
  {
    data.NAME=row.NAME;  
    data.PARTYID=row.CUSTOMERID;
    this.getData();
    this.showParty = false;
    this.showTogleParty=false;
  }

  ngOnInit() {
  }
  printDrCRNote1(NOTEID)
  {
    let data:any={};
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Purchase/DrCrPrint?NoteId="+NOTEID+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.allData=this.allData.Table;
      data.header=this.allData[0];
      this.allData=res;
      data.detail=this.allData.Table1;
      data.backto='/drcr-note-list';
      sessionStorage.setItem('drcrdata', JSON.stringify(data));
      this.router.navigate(['/drcr-note-print'], { queryParams:  filter, skipLocationChange: true});
      
      this.isLoadingResults=false;
     },
     error=>{
       this.isLoadingResults=false;
     });  
  }
}



@Component({
  selector: 'app-dr-cr-note-view',
  templateUrl: './drcr-note-print.html',
  styleUrls: ['./dr-cr-note-view.component.css']
})

export class DrcrNotePrintComponent implements OnInit {
  original_url = environment.baseUrl;
  getinvid : any;
  getType: any;
  
  alldata : any;
  CoData: Array<any>=[];
  HeaderData : Array<any>=[];
  DetailData : Array<any>=[];
  PrintDate: Array<any>=[]; 
  hdata:any={};
  Numtoword:any={};
  downloadButton: boolean = true;
  repeatHeaders: boolean = true;
  DrcrdtlLine3:any;
  Totalamount:any;
  TaxableAmt:any;
  igst:any;
  sgst:any;
  cgst:any;
  notename:any;
  title:any;telephone:any;GSTIn:any;
  companyName:any;Address1:any;Address2:any;
  backto:any;
  constructor(
    private http: HttpClient,
   
    private route: ActivatedRoute,private translate: TranslateService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.DrcrdtlLine3="against our Purchase Order No.";
    
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.companyName=CompanyData['COMPANYNAME'];
    this.Address1=CompanyData['ADDRESS'];
    this.Address2 = CompanyData['ADDRESS1'];
    this.GSTIn = CompanyData['COMPANYGSTNO'];
    this.telephone = CompanyData['TELEPHONE'];
    let indent = sessionStorage.getItem("drcrdata");
    var data = JSON.parse(indent);
    this.hdata=data['header'];
    this.DetailData=data['detail'];
    this.backto=data['backto'];
   // sessionStorage.removeItem('drcrdata');
    this.ShowDetail();
  
   }

  ngOnInit() {
  }
  // print()
  // {
  //   window.print();
  // }
  public print(): void 
  { 
    

      let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
      virtualWindow.document.write('<html><head><title>Print</title>  '); 
      virtualWindow.document.write('<link rel="stylesheet" href="assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
      virtualWindow.document.write('<link href="assets/dist/css/style.min.css" rel="stylesheet"> '); 
      virtualWindow.document.write('<link href="styles.css" rel="stylesheet"> '); 
      virtualWindow.document.write('<link href="assets/dist/css/style-custom.css" rel="stylesheet">'); 
      virtualWindow.document.write('<style type="text/css" media="print">@page{size: auto;margin: 0mm;} #printPageButton,#printPageButton1,#printPageButton2,#printPageButton3,#hidefromdatelabel,#hidefromdate,#hidetodatelabel,#hidetodate,#hidesortbutton {  display: none;} table, pre { page-break-inside:auto ; font-size: 12px; font-family: Arial, Helvetica, sans-serif;}</style>'); 
      
      virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
      virtualWindow.document.close(); 
      // necessary for IE >= 10 
      virtualWindow.focus(); 
      // necessary for IE >= 10 
      setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000); 
      // Give the DOM time to render images before printing.
   }
  ShowDetail()
  {
   
   
        var pono="",i=1;
        this.Totalamount=0;
        this.igst=0;    
        this.sgst=0;
        this.cgst=0;
        this.TaxableAmt=0;
        this.DetailData.forEach((el) => {
          el.serialno=i;
           if(i>1 && pono.includes(el.ORDERNO)==false)
           {
            pono=pono+", ";
              pono=pono+el.ORDERNO;
           }
           else if(i==1)
           {
              pono=pono+el.ORDERNO;  
           }
           //pono=pono+el.ordernumber;
           i++;
           this.Totalamount=this.Totalamount+el.AMOUNT;
           this.igst=this.igst+el.IGST;
           this.sgst=this.sgst+el.SGST;
           this.cgst=this.cgst+el.CGST;
           this.TaxableAmt=this.TaxableAmt+el.AMOUNT-el.IGST-el.SGST-el.CGST;

        });
        this.DrcrdtlLine3="against our Purchase Order No. : "+pono;
        if(this.PrintDate.length !== 0)
        {
          this.downloadButton = false;
        }
        else{
          this.downloadButton = true;
        }    
    
  }
}
