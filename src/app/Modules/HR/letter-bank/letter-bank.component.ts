import { Global } from './../../../Global';
import { Component, OnInit,ViewChild, AfterContentInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import {catchError, filter, map, startWith, switchMap} from 'rxjs/operators';
import { Subscription, Observable,merge,of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-letter-bank',
  templateUrl: './letter-bank.component.html',
  styleUrls: ['./letter-bank.component.css']
})
export class LetterBankComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  // ItemArray: Array<any> = [];
  supplierCategoryArray: Array<any> = [];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['category', 'deptname','subject','title'];
  ItemArray = new MatTableDataSource<LetterBank>();
  //page
  page:any;
  // exampleDatabase: ExampleHttpDao | null;
  pageIndex: any;
  sortOrder :any;
  sortSelection  :any ;
  resultsLength = 0;
  isLoadingResults :boolean;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  allGetZone:any;
  exportarray:any;
  search: any;
  name: any;
  getItemlistdata: any;
  allDataGet: any;
  getitemtype: Array<any> = [];
  getitemcategory: Array<any> = [];
  dropdownSettings = {};
  newitemtype: any;
  itemtypearray: Array<any> = [];
  categorychange: any;
  selectedItems = [];
  fieldArray : any;
  departmentDataget: Array<any>=[];
  subjectSingle: Array<any>=[];
  subjectDataget: Array<any>=[];
  deptid:any;
  subjid:any;
  public href: string = "";
  FYUSER:any;ServerIP:any;
  userid:any;token:any;WorkingDate:any;
  fstartdate:any;
  fenddate:any;
  boid:any;
  coid:any;
  fyid:any;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private globalVar:Global,
  ) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.coid=CompanyData['COMPANYID'];
    this.fstartdate=  formatDate(CompanyData['FINANCIALYEARSTARTDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    this.fenddate=  formatDate(CompanyData['FINANCIALYEARENDDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
   
   
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  ngOnInit() {
    this.ItemArray.sort = this.sort;
    this.ItemArray.paginator=this.paginator;
      this.itemrefresh();
   
  }

  ngAfterContentInit() {
  this.isLoadingResults=true;
    this.http.get(this.original_url+ "/Masters/CommonMaster/getLetterbanklist?COID="+this.globalVar.CommpanyId+"&BOID="+this.globalVar.BranchId)
    .subscribe((data: any[]) => {
          this.fieldArray = data;
          this.departmentDataget = this.fieldArray.Table1;
          this.subjectSingle = this.fieldArray.Table2;
          this.isLoadingResults=false;
        },error => {
          this.isLoadingResults = false;
        }
        );
    
  }

  //Department Change
  departmentChange(event)
  {
    if(event.length == 0)
    {
      this.deptid = '';
      this.subjectDataget = [];
    }
    else
    {
      this.deptid = event[0];
      this.deptid = this.deptid.data;
      this.deptid = this.deptid.ID;
      this.subjectDataget = this.subjectSingle.filter(x => x.DEPTID == this.deptid);
    }
    this.paginator.pageIndex=0;
    this.itemrefresh();
  }

  // Sunject Change
  subjectChange(event)
  {
    if(event.length == 0)
    {
      this.subjid = '';
    }
    else
    {
      this.subjid = event[0];
      this.subjid = this.subjid.data;
      this.subjid = this.subjid.ID;
    }
    this.paginator.pageIndex=0;
    this.itemrefresh();
  }

  onItemSelect() {
    this.selectedItems.forEach((item,index) => {
      this.itemtypearray.push(item.id);
    });
    this.paginator.pageIndex=0;
    this.itemrefresh();
    this.itemtypearray=[];
  }

  itemCtaegoryChange(event)
  {
    if(event.length == 0)
    {
      this.categorychange = '';
    }
    else
    {
    }
    this.paginator.pageIndex=0;
    this.itemrefresh();
  }

  // itemrefresh(){
  //   this.exampleDatabase = new ExampleHttpDao(this.http);
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  
  //   merge(this.sort.sortChange)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         if(this.page== undefined)
  //        {
  //         this.page = 20;
  //        }
  //        if( this.sort.active==undefined)
  //        {
  //         this.sort.active = "";
  //        }
  //        if( this.sort.direction==undefined)
  //        {
  //         this.sort.direction="";
  //        }
  //        if(this.search==undefined){
  //          this.search='';
  //        }
  //        if(this.deptid==undefined){
  //         this.deptid='';
  //        }
  //        if(this.subjid==undefined){
  //         this.subjid='';
  //        }

  //        this.sortOrder=this.sort.active;
  //        this.sortSelection=this.sort.direction;
  //         return this.exampleDatabase!.getRepoIssues(
  //           this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.globalVar.boid,this.globalVar.coid, this.original_url,this.search, this.deptid, this.subjid, this.globalVar.userid);
           
  //       }),
  //       map(data => {
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = false;
  //         this.itemCount = data;
  //         this.itemCount= this.itemCount.Table1;
  //         this.itemCount =this.itemCount[0];
  //         this.itemCount = this.itemCount.records;
  //         this.resultsLength = this.itemCount;
          
  //         return data;
  //       }),
        
  //       catchError(() => {
  //         this.isLoadingResults = false;
        
  //         this.isRateLimitReached = true;
  //         return observableOf([]);
  //       })
  //     ).subscribe((data: any[]) => {
  //       this.itemDisplay=data;
  //       this.itemDisplay=this.itemDisplay.Table;
  //       this.ItemArray.data = this.itemDisplay;
  //       });
  // }

  itemrefresh(){
    if(this.search==undefined){
               this.search='';
             }
             if(this.deptid==undefined){
              this.deptid='';
             }
             if(this.subjid==undefined){
              this.subjid='';
             }
    
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/Masters/CommonMaster/getLetterbanklist?COID="+ this.globalVar.CommpanyId+"&BOID="+ this.globalVar.BranchId+"&DEPTID="+ this.deptid+"&SUBJID="+ this.subjid)
    .subscribe((data: any[]) => {
      this.itemDisplay=data;
      this.itemDisplay=this.itemDisplay.Table;
      this.ItemArray.data = this.itemDisplay;
      this.isLoadingResults=false;
      },error => {
        this.isLoadingResults = false;
      }
      );
  }

  // getUpdate(event) 
  // {
  //   this.page=event;
  //   this.page=this.page.pageSize;
  //   this.itemrefresh();
  // }

  // Search
  applyFilter(filterValue) {
    this.paginator.pageIndex=0;
    this.search=filterValue;
    this.itemrefresh();
  }

  reset(event){
    this.search='';
    this.name='';
    this.itemrefresh();
  }

  editDocument(data)
  {
    var id=data.ID;
    this.router.navigate(['/add-letter-bank/'+id+'/edit']);
  }

}
// export class ExampleHttpDao {
//   constructor(private http: HttpClient) {}
  
//   getRepoIssues(sort: string, order: string, page: number, paging: number,boid:number,coid:number, url:String,search: String, deptid:any, subjid:any, userid:any): Observable<GithubApi> {

//     const requestUrl =
//         `${url}/Masters/CommonMasters/getLetterbanklist?Pagenumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}&userid=${userid}&search=${search}&dept=${deptid}&subject=${subjid}`;
//         return this.http.get<GithubApi>(requestUrl);
//   }

// }

export interface LetterBank {
  itemcategoryname: string;
  itemcode: string;
  item_name: string;
  hsncode: string;
}

// export interface GithubApi {
//   items: LetterBank[];
//   total_count: number;
// }