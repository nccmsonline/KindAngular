import { ActivatedRoute, Router } from '@angular/router';
import { Global } from './../../../../Global';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resume-print',
  templateUrl: './resume-print.component.html',
  styleUrls: ['./resume-print.component.css']
})
export class ResumePrintComponent implements OnInit {
  original_url = environment.baseUrl;
  isLoadingResults=false;
  itemsDetailArray: Array<any> = [];
  newItemDetail: any = {};
  editItemID: any={};
  closeResult: string;
  searchText : string;
  onfieldArrayPush: Subscription;
  exportarray : Array<any> = [];
  allAccountData:any;
  indentListToSave : Array<any>=[];
  public repeatHeaders = true;
  satementData: any={};
  fromDate: any;
  toDate: any;
  myDate = new Date();
  PrintDate: Array<any>=[];
  statementAllDate: Array<any>=[];
  statementTable1Date: any={};
  companyname: any;
  unitname:any;
  downloadButton: boolean = true;
  alldata:any;
  CoData: Array<any>=[];
  levydata: Array<any>=[];
  HeaderData: any={};
  DetailData: Array<any>=[];
  GstData: Array<any>=[];
  TotalSummaryData: Array<any>=[];
  TremConditionData: Array<any>=[];
  unitadd:any;
  routepoid:any;
  deliveryschedule:Array<any>=[];
  Paymentterms:Array<any>=[];
  orderedquantity:number;
  igstamt:number;
  cgstamt:number;
  sgstamt:number;
  taxableamt:number;
  unitemail:any;
  unitaddress:any;
  unitpan:any;
  unitgstno:any;
  unitphone:any;
  companylogo: any;
  unitfax:any;
  unitwebsite:any;
  companycin:any;
  itemdiscamt:number;
  revisedid:any;
  revisedcheck:any;
  levy:any;
  action:any;
  dialog: any;
  emailid='' ;
  levyclass: any;
  companydataPrint:any;
  companyName:any;
  Address:any;
  family: Array<any> = [];
  Qualifiaction: Array<any> = [];
  Experience: Array<any> = [];
  HealthArray: Array<any> = [];
  editSkillArray: Array<any> = [];
  postAppliedArray: Array<any> = [];
  

  constructor(
    private global:Global,
    private http: HttpClient,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.companyName=CompanyData['COMPANYNAME'];
    this.Address=CompanyData['ADDRESS'];


    this.routepoid=this.route.snapshot.paramMap.get("id");
    this.StatementClick();
    // this.family=[
    //     {id:1,name:"",relation:"" ,age:""},
    //     {id:2,name:"",relation:"",age:""},
    //     {id:3,name:"",relation:"",age:""},
    //     {id:4,name:"",relation:"",age:""},
    //   ]

  }

  ngOnInit() {
  }

  // print function. function options in index .html
  print() {
    window.print();
  }

  StatementClick()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/HR/Resume/GetResumedetails?coid="+this.global.CommpanyId+"&boid="+this.global.BranchId+"&fyid="+this.global.fyid+"&resumeid="+this.routepoid)
      .subscribe((res: any[]) => {
        this.alldata = res;
        this.HeaderData =  this.alldata.Table[0];
        this.Qualifiaction = this.alldata.Table2;
        this.Experience = this.alldata.Table1;
        this.family=this.alldata.Table14;
        this.editSkillArray = this.alldata.Table3;
        this.postAppliedArray=this.alldata.Table4;
        this.isLoadingResults=false;
      });
  }
  back()
  {
this.router.navigate(['/resume-list']);
  }
  public sendEmail(): void 
  { 
    this.isLoadingResults=true;
      let myEmail="";      
      myEmail=myEmail+('<html><head><title>Print</title>  '); 
         
      myEmail=myEmail+'<style type="text/css">      .custom-invoice-table .email .pan-custom{       text-align: right;       margin: 0;       }              .custom-invoice-table table tr td {       border: solid 1px #ccc;       }       .custom-invoice-table table tr td {       padding: 1px 8px;            }         .table {     width: 100%;     max-width: 100%;     margin-bottom: 1rem;     background-color: transparent; }     .table th,     .table td {       padding: 1rem;       vertical-align: top;       border-top: 1px solid #dee2e6; }     .table thead th {       vertical-align: bottom;       border-bottom: 2px solid #dee2e6; }     .table tbody + tbody {       border-top: 2px solid #dee2e6; }     .table .table {       background-color: #eef5f9; }      .table-sm th,  .table-sm td {     padding: 0.3rem; }      .table-bordered {     border: 1px solid #dee2e6; }     .table-bordered th,     .table-bordered td {       border: 1px solid #dee2e6; }     .table-bordered thead th,     .table-bordered thead td {       border-bottom-width: 2px; }      .table-borderless th,   .table-borderless td,   .table-borderless thead th,   .table-borderless tbody + tbody {     border: 0; }      .table-striped tbody tr:nth-of-type(odd) {     background-color: rgba(0, 0, 0, 0.05); }      .table-hover tbody tr:hover {     background-color: #f8f9fa; }         .table-sm tbody tr td, .mat-table tbody tr td {     font-size: 11px !important;    font-family: "Nunito Sans",sans-serif;   }   html {       -webkit-tap-highlight-color: transparent;   }   body {       color: #222;       font-family: "Nunito Sans",sans-serif;       font-size: .805rem;       font-weight: 400;       line-height: 1.5;     margin: 0;       overflow-x: hidden;         background: #fff;   }     </style>';      
      myEmail=myEmail+('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
    
//this.emailid
      const  params = new  HttpParams()
      .set('text', myEmail)
      .set('emailid',this.emailid)
      .set('subject', 'Purchase Order')
      .set('coid', this.global.CommpanyId)
      .set('boid', this.global.BranchId)
      .set('useremail', this.global.email)
      .set('username', this.global.NameOfUser);
      this.http.post(this.original_url+"/Masters/commonMasters/sendemail", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'sucess'
                }
              });
        
      },
      error=>{
        this.isLoadingResults=false;
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: 'Something went wrong!',
            action: ''
          }
        });
      });
   
  }
}
