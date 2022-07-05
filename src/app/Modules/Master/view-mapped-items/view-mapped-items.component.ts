import { Item } from './../../General/item-master/item.modal';
import { ExcelService } from './../../../services/excel/excel.service';
import { Global } from './../../../Global';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GithubApi } from '../supplier-master/supplier.modal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import {merge, Observable, of as observableOf} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ChildItemsPopupComponent } from '../unique-item-codification-mapping/child-items-popup/child-items-popup.component';
import { formatDate } from '@angular/common';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-mapped-items',
  templateUrl: './view-mapped-items.component.html',
  styleUrls: ['./view-mapped-items.component.css']
})
export class ViewMappedItemsComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  // ItemArray: Array<any> = [];
  supplierCategoryArray: Array<any> = [];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['itemcode','itemname','stock','unit','branchname','view'];
  ItemArray = new MatTableDataSource<Item>();
  //page
  page:any;
  exampleDatabase: ExampleHttpDao | null;
  pageIndex: any;
  sortOrder :any;
  sortSelection  :any ;
  resultsLength = 0;
  isLoadingResults : boolean;
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
  childCategory: Array<any> = [];
  hiddenCategory: Array<any> = [];
  dropdownSettings = {};
  newitemtype: any;
  itemtypearray: Array<any> = [];
  categorychange: any;
  // childid:any;
  selectedItems = [];
  excelexportArray:Array<any> = [];

  storeid:any;
  storeData: Array<any> = [];
  removeitem: Array<any> = [];
  newData:any={};
  public href: string = "";
  userRightCheck:any={};
  canCreateCommonClass ='';
  canViewCommonClass='';
  canExportCommonClass = '';

  constructor(
    private http: HttpClient,
    // private itemMasterService: ItemMasterService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private globalVar: Global,
    private changeDetectorRefs: ChangeDetectorRef,
    private excelService: ExcelService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    // User Right Data Get
    this.href = this.router.url;
    let Sidebar = sessionStorage.getItem("sidebar");
    let sidebarDataGet = JSON.parse(Sidebar);
    // sidebarDataGet.forEach(element => { element.items.forEach(res => { if(res.routerLink == this.href) { this.userRightCheck = res; } }); });
    if(this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; } 
    if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    if(this.userRightCheck.canexport == 'True') { this.canExportCommonClass = ''; }
    if(this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; } 
    if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
    if(this.userRightCheck.canexport == 'False') { this.canExportCommonClass = 'canExportCommonClass'; }
    if(this.userRightCheck.canview == 'True')


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
    this.ItemArray.sort=this.sort;
    this.ItemArray.paginator=this.paginator;
    this.name="";
      this.itemrefresh();  
  }



  //  itemrefresh(){
 
  //   this.isLoadingResults=true;
  //    this.http.get(this.original_url+"/Production/DieAndTools/getallparentitems?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.name)
  //    .subscribe((res)=>{
  //     this.allDataGet=res;
  //     this.ItemArray.data=this.allDataGet.Table;
  //     this.isLoadingResults=false;
  //    },error => {
  //     this.isLoadingResults = false;
  //   }); 
  //  }

  itemrefresh(){
    this.exampleDatabase = new ExampleHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  
    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if(this.page== undefined)
         {
          this.page = 20;
         }
         if( this.sort.active==undefined)
         {
          this.sort.active = "";
         }
         if( this.sort.direction==undefined)
         {
          this.sort.direction="";
         }

         if(this.search==undefined){
           this.search='';
         }

         this.sortOrder=this.sort.active;
         this.sortSelection=this.sort.direction;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.globalVar.BranchId,this.globalVar.CommpanyId, this.original_url,this.globalVar.fyid,this.globalVar.userid,this.globalVar.Token,this.search, this.itemtypearray, this.categorychange);
           
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          // this.itemCount = data;
          // this.itemCount= this.itemCount.Table1;
          // this.itemCount =this.itemCount[0];
          // this.itemCount = this.itemCount.records;
          this.resultsLength = 50;
          
          return data;
        }),
        
        catchError(() => {
          this.isLoadingResults = false;
        
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe((data: any[]) => {
          this.itemDisplay=data;
          this.itemDisplay=this.itemDisplay.Table;
          this.ItemArray.data = this.itemDisplay;
        });
  }


  getUpdate(event) 
  {
    this.page=event;
    this.page=this.page.pageSize;
    this.itemrefresh();
  }
  exportToExcel1() {
    this.isLoadingResults=true
    this.http.get(this.original_url + "/Production/DieAndTools/getalldeactivateditems?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search=")
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet = res;
          this.excelexportArray=allDataGet.Table;
          let exportarray: Array<any> = [];
          exportarray = this.excelexportArray;
          this.excelService.exportAsExcelFile(exportarray, 'Deactivated Items');
          this.isLoadingResults=false
        });
      
    
  }

  // Search
  ItemOpen(rowDetail) {
    
    const dialogRef = this.dialog.open(ChildItemsPopupComponent, {
      width:"1000px",
      height:"550px",
      data  : {
        unitid: rowDetail.BRANCHID,
        itemid : rowDetail.ITEMID,
        itemname:rowDetail.ITEMNAME,
        action:'itemlist'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  
}

  reset(event){
    this.search='';
    this.name='';
    this.itemrefresh();
    
  }
  showdeactivateditems(){}
  
  onChange(event)
  {
    this.itemPerPage = event;
  }

  applyFilter(event) {
    if (event != undefined) {
      this.name = event;
      this.newData.name=this.name;
      this.itemrefresh();
    }
    else {
      this.name = '';
      this.newData.name=this.name;
      this.itemrefresh();
    }
  }


  exportToExcel() {
    this.isLoadingResults=true
    this.isLoadingResults = true;
    if(this.search==undefined){
      this.search='';
    }
    if(this.categorychange==undefined){
     this.categorychange='';
    }
    if(this.storeid==undefined){
      this.storeid='';
    }

    this.http.get(this.original_url + "/Production/DieAndTools/getallitems?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search=")
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet = res;
          this.excelexportArray=allDataGet.Table;
          let exportarray: Array<any> = [];
          exportarray = this.excelexportArray;
          this.excelService.exportAsExcelFile(exportarray, 'Mapped Items Items');
          this.isLoadingResults=false
        });

  
  }
}
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}
  
  getRepoIssues(sort: string, order: string, page: number, paging: number,boid:number,coid:number, url:String,fyid:number,userid:number,token:String,search: String, type:any, parentid: any): Observable<GithubApi> {
  
    const requestUrl =
        `${url}/Production/DieAndTools/getallparentitems?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}&fyid=${fyid}&search=${search}&type=P&parentid=`;
        return this.http.get<GithubApi>(requestUrl);
  }
}