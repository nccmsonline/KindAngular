import { MultipleEmployeePopupComponent } from './multiple-employee-popup/multiple-employee-popup.component';
import { Global } from 'src/app/Global';
import { environment } from './../../../../environments/environment';

import { Component, OnInit, ViewChild , } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable,merge,of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import FileSaver from 'file-saver';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-generate-letter',
  templateUrl: './generate-letter.component.html',
  styleUrls: ['./generate-letter.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class GenerateLetterComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
 
  original_url = environment.baseUrl;
  sortOrder :any;
  sortSelection  :any ;
  search: any;
  name: any;
  pagenumber:any;
  employeename:any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  page: any ;
  itemCount: any;
  itemDisplay: any;

  keys: string[]=[];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['DOCUMENTTYPE','DEPTNAME','SUBJECT', 'TITLE', 'PREPAREDON', 'PREPAREDBY', 'download'];
  generateLetterArray = new MatTableDataSource<Letter>();
  allGetorderList: any;
  filterarray:Array<any>=[];
  enqtype:any;
  customername:any;
  showreset:boolean=false;
  public href: string = "";
  userRightCheck:any={};
  canCreateCommonClass ='';
  canViewCommonClass='';

  constructor(
    private http: HttpClient,
    private router: Router, private globalVar: Global,
    public dialog: MatDialog,private translate: TranslateService
  ) {

    // User Right Data Get
    // this.href = this.router.url;
    // let Sidebar = sessionStorage.getItem("sidebar");
    // let sidebarDataGet = JSON.parse(Sidebar);
    // sidebarDataGet.forEach(element => { element.items.forEach(res => { if(res.routerLink == this.href) { this.userRightCheck = res; } }); });
    // if(this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; } 
    // if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    // if(this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; } 
    // if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
    this.filterarray=[{id:"employeename",name:"Employee Name"}];
    this.enqtype=this.filterarray[0].id;
  
    // this.generateLetterService.onDataChanged
    // .subscribe(event => {
    //     if(event){
    //       this.generateLetterArray.data = [];
    //     }
    // });
  }
  
  ngOnInit(){
    this.generateLetterArray.sort = this.sort;
    this.generateLetterArray.paginator=this.paginator;
      this.itemrefresh();

  }

  changefilter(){
    // if(this.enqtype=='contact'){
    //   this.customername='';
    // }
    // else 
    if(this.enqtype=='employeename'){
      this.name="";
    }
  }

  public Print(data): void {
  if(data.EMPTYPE== "s")
  { 
    let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  
    console.log();
    virtualWindow.document.write( data.DOCUMENTTEXT ); 
    
    virtualWindow.document.close(); 
    virtualWindow.focus(); 
        // necessary for IE >= 10 
    setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  }
  else if(data.EMPTYPE== "m")
  {
    const dialogRef = this.dialog.open(MultipleEmployeePopupComponent, {
      width: "900px",
      height: "505px",
      data: {
         data
      }
    });
  }
}

  // PDF Download
  SinglePDFDownload(rowDetail)
  {
    console.log("row1",rowDetail)
    const usingSplit = rowDetail.EMPID.split(',');
    let empIds:Array<any>=[]
    empIds=usingSplit
    console.log("row2",empIds)
    // let filterArray = this.dataSourceSummary.data;
    // let newdadadat = filterArray.find(x => x.id == rowDetail.id).documenttext;
    // let documenttext = rowDetail.documenttext;
    // var blob = new Blob([documenttext], {type: "text/html"});
    // FileSaver.saveAs(blob, "filename");
    empIds.forEach(element => {
      console.log("row3",element)
    this.http.get(this.original_url+"/Masters/CommonMaster/downloadhtmlintopdf?docid="+rowDetail.ID+"&empid="+element, { responseType: 'blob' })
    .subscribe(blob => {
      saveAs(blob, 'Letter.pdf', {
         type: 'text/plain;charset=windows-1252' // --> or whatever you need here
      });
   });
  })
  }

  clearFilter(event){
    if(event==undefined|| event==null || event==''){
     this.showreset=false;
    }
    else{ this.showreset=true;
    }
  }
  
  
  
    applyFilter(event){
      this.paginator.pageIndex = 0;
      // if (this.enqtype == 'contact') {
      //   this.customername = '';
      //   this.search = this.name;
      // }
      // else 
      if (this.enqtype == 'employeename') {
        this.name = ""
        this.search = this.customername;
      }
      this.itemrefresh();
    }

    // SaleOrderperforma(id){
    //   this.router.navigate(['/prepare-proforma-invoice/edit-prepare-proforma-invoice/'+this.userRightCheck.moduleid+'/'+this.userRightCheck.functionalityid+'/'+id+'/sales']);
    //  }
    // revieworder(id){
    //   this.router.navigate(['/contract-review/'+id]);
    // }
  
  //   getUpdate(event) {
  //     this.page=event;
  //     this.page=this.page.pageSize;
  //      this.refreshEmployeelist();
  // }

  itemrefresh(){
    if(this.search==undefined){
               this.search='';
             }
            //  if(this.deptid==undefined){
            //   this.deptid='';
            //  }
            //  if(this.subjid==undefined){
            //   this.subjid='';
            //  }
    
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/Masters/CommonMaster/getgeneratedLetterlist?PageNumber=1&PageSize=100&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=")
    .subscribe((data: any[]) => {
   
        this.itemDisplay=data;
        let dataGet
        dataGet=this.itemDisplay;
        dataGet.forEach(element => {
          let html,html1,html2
          html=element.DOCUMENTTEXT
              // html=element.DOCUMENTTEXT.replace(/(abc)/g,'&nbsp;').trim();
              // html1=html.replace(/("\")/g,' ').trim();
              element.DOCUMENTTEXT=html
        });
        console.log("dataGet",dataGet)
        this.generateLetterArray.data=dataGet;
      this.isLoadingResults=false;
      });
  }

  reset(event){
    this.search='';
    this.name='';
    this.customername='';
    this.showreset=false;
    this.itemrefresh();
  }

  // letterEdit(id)
  // {
  //   this.router.navigate(['/add-generate-letter/'+id+'/edit']);
  // }
}




export interface Letter {
  oa_no: string;
  customer: string;
  ourquoteref: string;
  oa_date: string;
  customerref: string;
}

