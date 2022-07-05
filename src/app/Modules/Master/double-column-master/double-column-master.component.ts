import { Global } from '../../../Global';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Subscription, Observable, merge, of as observableOf } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AddDoubleColumnMasterComponent } from './add-double-column-master/add-double-column-master.component';


@Component({
  selector: 'app-double-column-master',
  templateUrl: './double-column-master.component.html',
  styleUrls: ['./double-column-master.component.css']
})
export class DoubleColumnMasterComponent implements OnInit {


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  resultsLength = 0;
  isLoadingResults :boolean;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  sortSelection: any;
  sortOrder: any;
  page: any;
  search: any;
  searcharray: any;
  pagenumber: any;
  type: any;
  exampleDatabase: ExampleHttpDao | null;
  menutype: any;
  title: any;
  displayedColumns: string[] = ['name', 'filter1name', 'FILTER2NAME','FILTER3NAME','COLUMNNAME4','COLUMNNAME5'];
  SingleColumnArray = new MatTableDataSource<any>();
  allFieldArray: any;
  allDataGet: any;
  newData: any = {};
  receiptFieldArray: Array<any> = [];
  private _routerSub = Subscription.EMPTY;

  public href: string = "";
  userRightCheck: any = {};
  canCreateCommonClass = '';
  canViewCommonClass = '';
  filterlist1: Array<any> = [];
  filterlist2: Array<any> = [];
  filterlist3: Array<any> = [];
  newfilterlist2:Array<any> = [];
  showfilter1 = false;
  showfilter2 = false;
  showfilter3 = false;
  filterlabel1: any;
  filterlabel2: any;
  filterlabel3: any;
  showdatepicker = false;
  filtersearch1: any;
  filtersearch2: any;
  COLUMN4LABEL: any;
  COLUMN5LABEL: any;
  showcolumn4=false;
  showcolumn5=false;
  action:any

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private globalVar: Global,
    private router: Router,
    public dialog: MatDialog,
  ) {
    console.log('')
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.menutype = this.route.snapshot.paramMap.get("menutype");
    this.action= this.route.snapshot.paramMap.get("menutype");
    console.log("this.menutype", this.menutype);
    this._routerSub = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {

          console.log("this.event", event);
          // User Right Data Get
          this.href = this.router.url;
          // let Sidebar = sessionStorage.getItem("sidebar");
          // let sidebarDataGet = JSON.parse(Sidebar);
          // sidebarDataGet.forEach(element => { element.items.forEach(res => { if (res.routerLink == this.href) { this.userRightCheck = res; } }); });
          // if (this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; }
          // if (this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }

          // if (this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; }
          // if (this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }

          // if(this.userRightCheck.canview == 'True')
          // {          
            this.isLoadingResults=true;
          this.http.get(this.original_url+"/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=100&sort=&sortorder=&coid="+ this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId+ "&id=" + "&type=" + this.menutype)
            .subscribe((res) => {
              this.allDataGet = res;
              this.receiptFieldArray = this.allDataGet.Table1;
              this.filterlabel1 = this.receiptFieldArray[0].FILTER1LABEL;
              this.filterlabel2 = this.receiptFieldArray[0].FILTER2LABEL;
              this.filterlabel3 = this.receiptFieldArray[0].FILTER3LABEL;
              this.COLUMN4LABEL = this.receiptFieldArray[0].COLUMN4LABEL;
              this.COLUMN5LABEL = this.receiptFieldArray[0].COLUMN5LABEL;
              if(this.COLUMN4LABEL==undefined || this.COLUMN4LABEL==null || this.COLUMN4LABEL==""){
                this.showcolumn4=false;
              }
              else{
                this.showcolumn4=true;
              }
              if(this.COLUMN5LABEL==undefined || this.COLUMN5LABEL==null || this.COLUMN5LABEL==""){
                this.showcolumn5=false;
              }
              else{
                this.showcolumn5=true;
              }
              this.title = this.receiptFieldArray[0].fromname;
              this.menutype = this.receiptFieldArray[0].type;
              this.type = this.menutype;
              if (this.allDataGet.Table2 != undefined) { this.filterlist1 = this.allDataGet.Table2 } else { this.filterlist1 = [] }
              if (this.allDataGet.Table3 != undefined) {
                this.filterlist2 = this.allDataGet.Table3;
                this.newfilterlist2 = this.allDataGet.Table3;
              }
              else {
                this.filterlist2 = [];
                this.newfilterlist2 =[];
              }
              if (this.allDataGet.Table4 != undefined) { this.filterlist3 = this.allDataGet.Table4 } else { this.filterlist3 = [] }
              if (this.filterlist1 != undefined || this.type=='ppcmajorstages' || this.type=='rosterstatus' || this.type=='shiptype' || this.type=='milestone') { if (this.filterlist1.length > 0 || this.type=='ppcmajorstages' || this.type=='rosterstatus' || this.type=='shiptype' || this.type=='milestone') {this.showfilter1 = true; } }
              if (this.filterlist2 != undefined || this.type=='teamppc' || this.type=='ppcmajorstages' || this.type=='rosterstatus') { if (this.filterlist2.length > 0  || this.type=='teamppc' || this.type=='ppcmajorstages'  || this.type=='rosterstatus') { this.showfilter2 = true; } }
              if (this.filterlist3 != undefined) { if (this.filterlist3.length > 0) { this.showfilter3 = true; } }
              let datepicker: any;
              datepicker = this.receiptFieldArray[0].datefiltercolumn;
              if (datepicker != undefined) {
                this.showdatepicker = true;
              }
              else {
                this.showdatepicker = false;
              }
              this.isLoadingResults = false;
              this.resultsLength = 0;
              setTimeout(() => {
                this.SingleColumnArray.sort = this.sort;
                this.SingleColumnArray.paginator=this.paginator;
                this.singlecolumnrefresh();
              }, 1000);
            },error => {
              this.isLoadingResults = false;
            }
      );
          // }
        }
      });
    // if(this.userRightCheck.canview == 'True')
    // {
    // this.doubleColumnMasterService.onDataChanged
    //   .subscribe(event => {
    //     if (event) {
    //       this.SingleColumnArray.data = [];
    //       this.type = event;
    //       setTimeout(() => {
    //         this.singlecolumnrefresh();
    //       }, 1000);
    //     }
    //   });
    // }
  }

  ngOnInit() {
    this.SingleColumnArray.sort = this.sort;
    this.SingleColumnArray.paginator=this.paginator;
  }

  doSelectfilter1(event) {
    if (event) {
      this.filtersearch1 = event;
      if(this.showfilter2==true && this.type=="stagesparameters"){
        this.newfilterlist2=this.filterlist2.filter(a=>a.filter1==event);
      }      
    }
    else {
      this.filtersearch1 = 0;
      this.newfilterlist2=this.filterlist2;
    }
    this.singlecolumnrefresh();
  }

  doSelectfilter2(event) {
    if (event) {
      this.filtersearch2 = event;
    }
    else {
      this.filtersearch2 = 0;
    }
    this.singlecolumnrefresh();
  }

  doRemovefilter1(event) {
    this.filtersearch1 = 0;
    this.singlecolumnrefresh();
  }
  doRemovefilter2(event) {
    this.filtersearch2 = 0;
    this.singlecolumnrefresh();
  }

  // singlecolumnrefresh() {
  //   this.SingleColumnArray.data = [];
  //   this.exampleDatabase = new ExampleHttpDao(this.http);
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  //   merge(this.sort.sortChange)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         if (this.page == undefined) {
  //           this.page = 20;
  //         }
  //         if (this.sort.active == undefined) {
  //           this.sort.active = "";
  //         }
  //         if (this.sort.direction == undefined) {
  //           this.sort.direction = "";
  //         }

  //         this.sortOrder = this.sort.active;
  //         this.sortSelection = this.sort.direction;
  //         this.pagenumber = this.paginator.pageIndex;
  //         if (this.search == undefined) {
  //           this.search = "";
  //         }
  //         if (this.type == undefined) {
  //           this.type = "G";
  //         }
  //         this.filtersearch1 = this.globalVar.checknull(this.filtersearch1, "number");
  //         this.filtersearch2 = this.globalVar.checknull(this.filtersearch2, "number");
          
  //         return this.exampleDatabase!.getRepoIssues(
  //           this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page, this.globalVar.boid, this.globalVar.coid, this.search, this.original_url, this.type, this.filtersearch1, this.filtersearch2);
  //       }),
  //       map(data => {
  //         // Flip flag to show that loading has finished.
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = false;
  //         this.itemCount = data;
  //         this.itemCount = this.itemCount.Table1;
  //         this.itemCount = this.itemCount[0];
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
  //       this.itemDisplay = data;
  //       this.SingleColumnArray.data = this.itemDisplay.Table;
  //       this.getfilternames();
  //     });
  // }
  singlecolumnrefresh() {
    this.isLoadingResults=true;
    this.http.get(this.original_url+'/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=20&sort=&coid='+this.globalVar.CommpanyId+'&boid='+this.globalVar.BranchId+'&sortorder=&search=&id=&type='+ this.action)
      .subscribe((res) => {
        this.isLoadingResults = false;
        let fieldArray: any;
        fieldArray = res;
        this.itemDisplay = res;
        this.SingleColumnArray.data = this.itemDisplay.Table;
        this.getfilternames();
        this.isLoadingResults=false;
      },error => {
        this.isLoadingResults = false;
      }
);
  }

  getfilternames() {
    if(this.menutype == 'businesssegment'){
      this.SingleColumnArray.data = this.SingleColumnArray.data.filter(x=>x.FILTERID1 != 0);
    }
    this.SingleColumnArray.data.forEach(element => {
      if (element.FILTERID1 != undefined && element.FILTERID1 != null && element.FILTERID1 != "") {
        let f1name: any;
        f1name = this.filterlist1.filter(a => a.ID == element.FILTERID1);
        if (f1name.length > 0) {
          element.FILTER1NAME = f1name[0].NAME;
        }
        else { element.FILTER1NAME = "" };
      }
      if (element.FILTERID2 != undefined && element.FILTERID2 != null && element.FILTERID2 != "") {
        let f2name: any;
        f2name = this.filterlist2.filter(a => a.ID == element.FILTERID2);
        if (f2name.length > 0) {
          element.FILTER2NAME = f2name[0].NAME;
        }
        else { element.FILTER2NAME = "" };
      }
      if(this.filterlabel2=='IsTeamLead'){
        if (element.CODE == true) {
          element.CODE = "Yes";
        }
        else {
          element.CODE = "No";
        }
      }
      if(this.filterlabel2=='iscalendarreqd' || this.filterlabel2=='IsPaid'){
        if (element.REF == true) {
          element.REF = "Yes";
        }
        else {
          element.REF = "No";
        }
      }
    });
  }

  openDialog(menutype) {
    console.log("menutype", menutype);
    const dialogRef = this.dialog.open(AddDoubleColumnMasterComponent, {
      width: '700px',
      data: {
        data:{ID:0},
        menutype: this.action,
        action: 'new',
        filterArray1: this.filterlist1,
        filterArray2: this.filterlist2,
        filterArray3: this.filterlist3,
        userRightCheck: this.userRightCheck

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.singlecolumnrefresh();
    });
  }

  getUpdate(event) {
    this.page = event;
    this.page = this.page.pageSize;
    this.singlecolumnrefresh();
  }

  editContact(data, menutype) {
    const dialogRef = this.dialog.open(AddDoubleColumnMasterComponent, {
      width: '700px',
      data: {
        data: data,
        menutype: menutype,
        action: 'edit',
        userRightCheck: this.userRightCheck
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    this.singlecolumnrefresh();
    });
  }

  ngOnDestroy() {
    this._routerSub.unsubscribe();
  }

}

export class ExampleHttpDao {

  userinfo: any;
  coid: any;
  boid: any

  constructor(private http: HttpClient) { }

  // getRepoIssues(sort: string, order: string, page: number, paging: number, boid: number, coid: number, search: string, url: String, type: String, filter1: any, filter2: any): Observable<GithubApi> {

  //   const requestUrl =
  //     `${url}/Masters/CommonMasters/GetdoublecolumndataList?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&coid=${coid}&boid=${boid}&sortorder=${order}&search=${search}&type=${type}&filter1=${filter1}&filter2=${filter2}`;
  //   return this.http.get<GithubApi>(requestUrl);
  // }

}

