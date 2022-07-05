import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf, from } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { QueuePositionComponent } from './add-maintenance-order/queue-position/queue-position.component';
import { MoFollowupComponent } from './mo-followup/mo-followup.component';
import { Global } from 'src/app/Global';

@Component({
  selector: 'app-maintenance-order',
  templateUrl: './maintenance-order.component.html',
  styleUrls: ['./maintenance-order.component.css']
})
export class MaintenanceOrderComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  original_url = environment.baseUrl;
  // exampleDatabase: ExampleHttpDao | null;
  pageIndex: any;
  sortOrder: any;
  sortSelection: any;
  resultsLength = 0;
  isLoadingResults = false;
  itemCount: any;
  itemDisplay: any;
  userinfo: any;
  coid: any;
  boid: any;
  userid: any;
  page: any;
  search: any;
  name: any;
  pagenumber: any;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['MONO', 'MODATE', 'MTNO', 'MTDATE', 'MAINTTYPE', 'MACHINENAME', 'MCSRNO', 'MTASSETLOCATION', 'TEAMNAME', 'MOSTATUS', 'QUEUE', 'PRINT', 'ACTION'];
  moArray = new MatTableDataSource<Maintenace>();
  keys: string[] = [];
  searchText: string;
  p: number = 1;
  itemPerPage = '10';
  branch1info: any;
  branch2Data: any;
  fyid: any;
  appraiseltosave: Array<any> = [];
  statusarray: Array<any> = [];
  statuschange: any;
  type: any;
  myDate = new Date();
  fromDate: any;
  toDate: any;
  newData: any = {};
  fystartdate: any;
  fyenddate: any;
  filterarray: Array<any> = [];
  enqtype: any;
  productname: any;
  showreset: boolean = false;
  ticketname: any;
  itemtype: any;
  exteam: boolean = false;
  teamtype: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private globalVar: Global,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    // this.coid = this.userinfo['coid'];
    // this.userid = this.userinfo['userid'];

    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1info = JSON.parse(branch1);
    // this.boid = this.branch1info['boid'];

    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];

    // this.fystartdate = this.branch2Data['fystartdate'];
    // this.fyenddate = this.branch2Data['fyenddate'];
    this.newData.fromdate=this.globalVar.FinancialYearStartDate;
    this.newData.todate=this.myDate;
    this.itemtype = "open";

    this.filterarray = [{ id: "name", name: "Machine Name" }, { id: "maintorderno", name: "Order No." }, { id: "maintticketno", name: "Ticket No." }];
    this.enqtype = this.filterarray[0].id;

    // this.service.statuslist()
    // .subscribe((response) => {
    //   let allDataGet: any;
    //   allDataGet = response;
    //   this.statusarray=allDataGet.Table5;
    // });

  }

  ngOnInit() {
    this.moArray.sort = this.sort;
    this.moArray.paginator=this.paginator;
    this.refresh();
  }

  applydateFilter(event) {
    // this.fromDate = formatDate(event.fromdate, 'yyyy-MM-dd', 'en-US');
    // this.toDate = formatDate(event.todate, 'yyyy-MM-dd', 'en-US');
    // this.paginator.pageIndex = 0;
    this.refresh();
  }

  changetype(event) {
    this.itemtype = event.value;
    this.refresh();
  }

  // List
  // refresh() {
  //   this.fromDate = formatDate(this.newData.fromdate, 'yyyy-MM-dd', 'en-US');
  //   this.toDate = formatDate(this.newData.todate, 'yyyy-MM-dd', 'en-US');
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
  //         this.pagenumber=this.paginator.pageIndex;
  //         if(this.search==undefined)
  //         {
  //           this.search="";
  //         }
  //         if(this.enqtype==undefined)
  //         {
  //           this.enqtype="";
  //         }
  //         if(this.teamtype==undefined)
  //         {
  //           this.teamtype=" ";
  //         }
  //         if(this.statuschange==undefined)
  //         {
  //           this.statuschange="";
  //         }

  //         if(this.fromDate == undefined){
  //           this.fromDate='0';
  //          }

  //          if(this.toDate == undefined){
  //           this.toDate='0';
  //          }

  //         return this.exampleDatabase!.getRepoIssues(
  //           this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page, this.boid, this.coid,this.search, this.original_url,this.enqtype,this.fromDate, this.toDate,this.statuschange,this.itemtype,this.teamtype);
  //       }),
  //       map(data => {
  //         this.itemCount = data;
  //         this.itemCount = this.itemCount.Table1;
  //         this.itemCount = this.itemCount[0];
  //         this.itemCount = this.itemCount.records;
  //         this.isLoadingResults = false;
  //         this.resultsLength = this.itemCount;
  //         return data;
  //       }),

  //       catchError(() => {
  //         this.isLoadingResults = false;
  //         return observableOf([]);
  //       })
  //     ).subscribe((data: any[]) => {
  //       let alldata:any;
  //       alldata=data;
  //       this.itemDisplay = alldata;
  //       this.itemDisplay = this.itemDisplay.Table;
  //       this.moArray.data = this.itemDisplay;
  //     });
  // }


  changeStatus(event) {
    if (event.length == 0) {
      this.statuschange = '';
    }
    else {
      this.statuschange = event[0];
      this.statuschange = this.statuschange.data;
      this.statuschange = this.statuschange.id;
      this.type = 'MOSTATUS';
    }
    this.paginator.pageIndex = 0;
    this.refresh();
  }

  setposition(data) {
    // if (this.newData.moqueueno == undefined || this.newData.moqueueno == null) {
    //   this.newData.moqueueno = 0;
    // }
    const dialogRef = this.dialog.open(QueuePositionComponent, {
      data: {
        action: 'view',
        qno: data.MOQUEUENO 
      }
    });
  }
  // Search Filter
  applyFilter(event) {

    // this.fromDate=formatDate(this.newData.fromdate, 'yyyy-MM-dd', 'en-US');
    // this.toDate=formatDate(this.newData.todate, 'yyyy-MM-dd', 'en-US');
    if (event != undefined) {
      if (this.enqtype == 'maintorderno') {
        this.productname = '';
        this.ticketname = '';
        this.search = this.name;
      }
      else if (this.enqtype == 'name') {
        this.name = '';
        this.ticketname = '';
        this.search = this.productname;
      }
      else if (this.enqtype == 'maintticketno') {
        this.name = '';
        this.productname = '';
        this.search = this.ticketname;
      }
      this.paginator.pageIndex = 0;
      this.refresh();
    }
  }
  clearFilter(event) {
    if (event == undefined || event == null || event == '') {
      this.showreset = false;
    }
    else {
      this.showreset = true;
    }
  }

  // search
  enqTypeChangeFunction(event) {
    this.name = '';
    this.productname = '';
    this.ticketname = '';
    this.showreset = false;
  }
  // Pagination Filter
  getUpdate(event) {
    this.page = event;
    this.page = this.page.pageSize;
    this.refresh();
  }

  // Reset Close
  reset(event) {
    this.search = '';
    this.name = '';
    this.productname = '';
    this.showreset = false;
    this.refresh();
  }

  changefilter() {
    if (this.enqtype == 'maintorderno') {
      this.productname = '';
      this.ticketname = "";
    }
    else if (this.enqtype == 'name') {
      this.productname = "";
      this.ticketname = "";
    }
    else if (this.enqtype == 'maintticketno') {
      this.name = "";
      this.productname = '';
    }
  }
  // Edit Form
  editMaintenaceorder(data) {
    var id = data.ID;
    if (data.TICKETSTATUS == 'Open') {
      this.router.navigate(['/add-maintenance-order/' + id + '/edit']);
    }
    if (data.TICKETSTATUS == 'Close') {
      this.router.navigate(['/add-maintenance-order/' + id + '/view']);
    }
  }

  opendialog(event) {
    const dialogRef = this.dialog.open(MoFollowupComponent, {

      data: {
        action: event,
        type: "new",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });

  }

  changeexteam() {
    if (this.exteam == false) {
      this.teamtype = " "
    }
    else {
      this.teamtype = "E"
    }
    this.refresh();
  }

  refresh() {
    this.search=this.globalVar.checknull(this.search,"string")
    this.fromDate=this.globalVar.checknull(this.fromDate,"Date")
    this.toDate=this.globalVar.checknull(this.toDate,"Date")
    this.enqtype=this.globalVar.checknull(this.enqtype,"string")
    this.statuschange=this.globalVar.checknull(this.statuschange,"string")
    this.itemtype=this.globalVar.checknull(this.itemtype,"string")
    this.teamtype=this.globalVar.checknull(this.teamtype,"string")
    this.http.get(this.original_url+"/Maintenance/Ticket/getticketslist?Pagenumber=1&PageSize=20&sort=&sortorder=&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId+"&searchh="+this.search+"&searchtype="+this.enqtype+"&fromdate="+this.fromDate+"&todate="+this.toDate+"&statusid="+this.statuschange+"&type="+this.itemtype+"&teamtype="+this.teamtype)
    .subscribe((data: any[]) => {
      let alldata: any;
      alldata = data;
      this.itemDisplay = alldata;
      this.itemDisplay = this.itemDisplay.Table;
      this.moArray.data = this.itemDisplay;
      this.isLoadingResults = false;
    });
  }



// export class ExampleHttpDao {
//   constructor(private http: HttpClient) { }
//   getRepoIssues(sort: string, order: string, page: number, paging: number, boid: number, coid: number, search: string, url: String,enqtype :string,fromdate: any, todate:any,mostatusid: any,itemtype: any, teamtype:any): Observable<GithubApi> {
//     const requestUrl =
//       `${url}/Maintenance/Ticket/getticketslist?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}&search=${search}&searchtype=${enqtype}&fromdate=${fromdate}&todate=${todate}&statusid=${mostatusid}&type=${itemtype}&teamtype=${teamtype}`;
//       return this.http.get<GithubApi>(requestUrl);
//   }
// }



// export interface GithubApi {
//   moArray: Maintenace[];
// }

}

export interface Maintenace {
  MTNO: string;
  dated: string;
  asset: string;
  MONO: string;
  MODATE: string;
  teamassigned: string;
  status: string;
  MOSTATUS: string;
  mtstatus: string;
}