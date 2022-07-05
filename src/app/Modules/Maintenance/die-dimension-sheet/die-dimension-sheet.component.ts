import { Global } from './../../../Global';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-die-dimension-sheet',
  templateUrl: './die-dimension-sheet.component.html',
  styleUrls: ['./die-dimension-sheet.component.css']
})
export class DieDimensionSheetComponent implements OnInit {
  original_url = environment.baseUrl;
  tablerefresh:boolean = false;
  closeResult: string;
  searchText : string;
  exportarray : Array<any> = [];
  userinfo : any;
  coid : any;
  boid : any;
  userID: any;
  branch1Data: any;
  branch2Data: any;
  fyid: any;
  allAccountData:any;
  itemlist : Array<any>=[];
  repeatHeaders = true;
  satementData: any={};
  fromDate: any;
  toDate: any;
  myDate = new Date();
  statementPrintDate: Array<any>=[];
  statementAllDate: Array<any>=[];
  statementTable1Date: any={};
  companyname: any;
  displayedColumns: string[] = ['DIENAME', 'DRAWINGNO','FRAMENO','STOD','STID','BORE','STSLOT', 'RTSLOT','BLK','STGS','RTGS','STNT','RTNT','RDC','CLOAD','PROGTOOL'];
  unitname:any;
  downloadButton: boolean = true;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemtype: any;
  itemDisplay: any;
  sortSelection: any;
  sortOrder:any;
  page:any;
  search:any;
  searcharray:any;
  pagenumber:any;
  type:any;
  name:any;
  isLoading= false;
  show:boolean = true;
  rptfilterlabel:any;
  checked:any;
  fystartdate :any;
  AllData:any;
  header:any;
  arrayList:any;
  arrayList1:any;
  displaywidth:any;
  alignment:any;    
  footer:any;
  detail = new MatTableDataSource<any>();   
  fieldArray = new MatTableDataSource<DieDimensionSheetComponent>();
  ngData: any={};
  fyenddate:any;


  constructor(   
    private fb: FormBuilder,
    private http: HttpClient,
    private excelService: ExcelService,
    public dialog: MatDialog,private translate: TranslateService,
    public globlaVar :Global,
    ) { 
    this.excelService = excelService;
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
  }

  ngOnInit() {
    // let user = sessionStorage.getItem("currentUser");
    // this.userinfo = JSON.parse(user);
    this.companyname=this.globlaVar.companyName;

    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];

    
    // this.satementData.filter='p';
    // this.itemtype="p";  
    // this.fystartdate = this.branch2Data['fystartdate'];
    // this.fyenddate = this.branch2Data['fyenddate'];
    this.satementData.fromdate= this.globlaVar.monthStartDate;
    this.satementData.todate=this.globlaVar.myDate;
    this.fromDate = this.satementData.fromdate;
    this.toDate = this.satementData.todate;  
    
    // setTimeout(() => {
    //   this.refresh();
    // }, 2000);  
    // this.StatementClick(this.satementData,'show');
    this.commonCheckedFunction();   
  }


  getUpdate(event) 
  {
    this.page=event;
    this.page=this.page.pageSize;
  //  this.refresh();   
  }


//   StatementClick(event,action)
//   {  
//     this.fromDate = formatDate(event.fromdate, 'MM/dd/yyyy', 'en-US');
//     this.toDate = formatDate(event.todate, 'MM/dd/yyyy', 'en-US');

//       this.commonCheckedFunction();   

// }

applyFilter(filterValue: string) {
  filterValue = filterValue.trim();
  filterValue = filterValue.toLowerCase();
  this.detail.filter = filterValue;
}

reset(){
  this.name='';
  this.applyFilter(this.name);
}

  commonCheckedFunction()
  {
    this.isLoadingResults = true;
    this.fromDate = formatDate(this.satementData.fromdate, 'yyyy-MM-dd', 'en-US');
    this.toDate = formatDate(this.satementData.todate, 'yyyy-MM-dd', 'en-US');
    this.http.get(this.original_url+"/Maintenance/DieMaint/getdiedimensionreport?coid="+this.globlaVar.CommpanyId+"&boid="+this.globlaVar.BranchId+"&fyid="+this.globlaVar.fyid+"&fromDate="+this.fromDate+"&ToDate="+this.toDate)
       .subscribe((res: any[]) => {
        this.isLoadingResults = false;
        let alldata: any =res
        this.detail.data = alldata.Table;
 
    });
  }
  exportToExcel() {
    // TableUtil.exportTableToExcel("ExampleMaterialTable",'die-dimension-sheet');
    this.excelService.exportAsExcelFile(this.displayedColumns, 'absentlist');
    // let newArray:Array<any>=[]
    // this.exportarray=this.detail.data;
    // console.log("dta",this.exportarray)
    // newArray.forEach(element => {
     
   
  // }); 
  //   this.excelService.exportAsExcelFile(this.exportarray, 'Indent-Register');
  }
}
