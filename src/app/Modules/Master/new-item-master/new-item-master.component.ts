import { AddItemMasterComponent } from './add-item-master/add-item-master.component';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { Global } from 'src/app/Global';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../../General/item-master/item.modal';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-item-master',
  templateUrl: './new-item-master.component.html',
  styleUrls: ['./new-item-master.component.css']
})
export class NewItemMasterComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  // ItemArray: Array<any> = [];
  supplierCategoryArray: Array<any> = [];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['itemcode','itemname','oldcode','itemcategoryname','unit','class','location'];
  ItemArray = new MatTableDataSource<Item>();
  //page
  page:any;
  pageIndex: any;
  sortOrder :any;
  sortSelection  :any ;
  resultsLength = 0;
  isLoadingResults = true;
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
  storeid:any;
  storeData: Array<any> = [];
  removeitem: Array<any> = [];
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
    // {
    //   this.itemMasterService.onDataChanged
    //     .subscribe(event => {
    //         if(event){
    //           this.changeDetectorRefs.detectChanges();
    //           this.ItemArray.data = [];
    //            this.itemrefresh();
    //         }
    //     });
    // }
    
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


  itemCtaegoryChange(event, type)
  {
    if(event.length == 0)
    {
      this.categorychange = '';
    }
    else
    {
      this.categorychange = event[0];
      this.categorychange = this.categorychange.data;
      this.categorychange = this.categorychange.id;
      if(type == 'parent'){
        this.childCategory = this.hiddenCategory.filter(x => x.parentgroupid == this.categorychange);
      }
    }
    this.paginator.pageIndex=0;
    this.itemrefresh();
  }

  // itemChildCtaegoryChange(event)
  // {
    // if(event.length == 0)
    // {
    //   this.childid = '';
    // }
    // else
    // {
    //   this.childid = event[0];
    //   this.childid = this.childid.data;
    //   this.childid = this.childid.id;
    // }
    // this.paginator.pageIndex=0;
    // this.itemrefresh();
  // }

  storeChangeFunction(event)
  {
    if(event.length == 0)
    {
      this.storeid = '';
    }
    else
    {
      this.storeid = event[0];
      this.storeid = this.storeid.data;
      this.storeid = this.storeid.id;
    }
    this.paginator.pageIndex=0;
    this.itemrefresh();
  }

  itemrefresh(){
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/Masters/ItemMaster/getitemmasterlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=&Pagenumber=&Pagesize=&sort=")
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
 
  getUpdate(event) 
  {
    this.page=event;
    this.page=this.page.pageSize;
    this.itemrefresh();
  }

  // Search
  applyFilter(filterValue) {
    //this.fieldArray.filter = filterValue.trim().toLowerCase();
    this.paginator.pageIndex=0;
    this.search=filterValue;
    this.itemrefresh();
  }

  reset(event){
    this.search='';
    this.name='';
    this.itemrefresh();
    
  }
  
  onChange(event)
  {
    this.itemPerPage = event;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddItemMasterComponent, {
      height: '',
        data: {
          action: 'new',
          userRightCheck: this.userRightCheck,
          itemId: '0'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
  }

  editContact(contact): void {
    const dialogRef = this.dialog.open(AddItemMasterComponent, {
      data: {
        contact: contact,
        action : 'edit',
        userRightCheck: this.userRightCheck,
        itemId: contact.ITEMID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  itemStockOpen(data)
  {
    // const dialogRef = this.dialog.open(ItemStockComponent, {
    //   width: '95%',
    //   data  : {
    //         itemData: data,
    //         action: 'item'
    //     }
    //   });
  
    //   dialogRef.afterClosed().subscribe(result => {
    //   });
  }

  bomPopup(id)
  {
    // const dialogRef = this.dialog.open(BomPopupComponent, {
    //   width: '50%',
    //   data  : {
    //         itemid: id,
    //         action: 'bom'
    //     }
    //   });
  
    //   dialogRef.afterClosed().subscribe(result => {
    //   });
  }

  exportToExcel() {
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

  }
}
