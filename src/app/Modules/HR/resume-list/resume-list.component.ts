import { ResumeStatusPopupComponent } from './resume-status-popup/resume-status-popup.component';
import { Global } from 'src/app/Global';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.css']
})
export class ResumeListComponent implements OnInit {


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  original_url = environment.baseUrl;
  // exampleDatabase: ExampleHttpDao | null;
  pageIndex: any;
  sortOrder: any;
  sortSelection: any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  page: any;
  search: any;
  name: any;
  pagenumber: any;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['action', 'resumeno', 'deptname', 'category', 'source', 'name', 'currentlocation', 'contact', 'totexpyy', 'currentsalary', 'qualification','print'];
  grnArray = new MatTableDataSource<ResumeListComponent>();
  keys: string[] = [];
  searchText: string;
  p: number = 1;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  sorucearray: Array<any> = [];
  departmentDDArray: Array<any> = [];
  resumeSessionStore: any = {};
  public href: string = "";
  userRightCheck: any = {};
  canCreateCommonClass = '';
  canViewCommonClass = '';
  canExportCommonClass = '';
  fystartdate: any;
  fyenddate: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    // private resumeListService: ResumeListService,
    public dialog: MatDialog, private globalVar: Global,
    private excelService: ExcelService, private translate: TranslateService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    // this.fystartdate=this.globalVar.fystartdate;
    // this.fyenddate=this.globalVar.fyenddate;

    // User Right Data Get
    this.href = this.router.url;
    let Sidebar = sessionStorage.getItem("sidebar");
    let sidebarDataGet = JSON.parse(Sidebar);
    // sidebarDataGet.forEach(element => { element.items.forEach(res => { if(res.routerLink == this.href) { this.userRightCheck = res; } }); });
    if (this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; }
    if (this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }
    if (this.userRightCheck.canexport == 'True') { this.canExportCommonClass = ''; }
    if (this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; }
    if (this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }
    if (this.userRightCheck.canexport == 'False') { this.canExportCommonClass = 'canExportCommonClass'; }

    let resumeuser = sessionStorage.getItem("resumeSeesionApi");
    if (resumeuser == null) {
      let resumeSessionStore: any = {};
      resumeSessionStore.fromdate = '';
      resumeSessionStore.todate = '';
      resumeSessionStore.enqstatus = '';
      resumeSessionStore.deptid = '';
      sessionStorage.setItem('resumeSeesionApi', JSON.stringify(resumeSessionStore));
    }
    let resumeinfo: any;
    let resumeuser1 = sessionStorage.getItem("resumeSeesionApi");
    resumeinfo = JSON.parse(resumeuser1);
    this.resumeSessionStore.fromdate = resumeinfo['fromdate'];
    this.resumeSessionStore.todate = resumeinfo['todate'];
    this.resumeSessionStore.enqstatus = resumeinfo['enqstatus'];
    this.resumeSessionStore.deptid = resumeinfo['deptid'];

    // this.resumeListService.onDataChanged
    //   .subscribe(event => {
    //     if (event) {
    //       const data = this.grnArray.data;
    //       data.push(event);
    //       this.grnArray.data = data;
    //     }
    //   })
  }

  ngOnInit() {
    // if(this.userRightCheck.canview == 'True')
    this.grnArray.sort = this.sort;
    this.grnArray.paginator=this.paginator;
    {
      this.http.get(this.original_url + "/HR/Resume/GetResumeStatus?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid=" + this.globalVar.fyid)
        .subscribe(event => {
          let temp;
          temp = event,
            this.sorucearray = temp.Table;
          this.departmentDDArray = temp.Table1;
          this.refreshResume();
        });
    }
  }

  // List
  refreshResume() {
    this.isLoadingResults = true;
    if (this.page == undefined) {
      this.page = 20;
    }
    if (this.sort.active == undefined) {
      this.sort.active = "";
    }
    if (this.sort.direction == undefined) {
      this.sort.direction = "";
    }
    this.sortOrder = this.sort.active;
    this.sortSelection = this.sort.direction;
    this.pagenumber = this.paginator.pageIndex;
    if (this.search == undefined) {
      this.search = "";
    }


    if (this.resumeSessionStore.fromdate == undefined || this.resumeSessionStore.fromdate == null || this.resumeSessionStore.fromdate == '') { this.resumeSessionStore.fromdate = ""; } else { this.resumeSessionStore.fromdate = formatDate(this.resumeSessionStore.fromdate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.todate == undefined || this.resumeSessionStore.todate == null || this.resumeSessionStore.todate == '') { this.resumeSessionStore.todate = ""; } else { this.resumeSessionStore.todate = formatDate(this.resumeSessionStore.todate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.enqstatus == undefined || this.resumeSessionStore.enqstatus == null || this.resumeSessionStore.enqstatus == '') { this.resumeSessionStore.enqstatus = ""; } else { this.resumeSessionStore.enqstatus = this.resumeSessionStore.enqstatus }
    if (this.resumeSessionStore.deptid == undefined || this.resumeSessionStore.deptid == null || this.resumeSessionStore.deptid == '') { this.resumeSessionStore.deptid = ""; } else { this.resumeSessionStore.deptid = this.resumeSessionStore.deptid }


    this.http.get(this.original_url + "/HR/Resume/Getresumelist?PageNumber=1&PageSize=0&sort=" + this.sort.active + "&sortorder=" + this.sort.direction + "&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + this.search + "&resumestatus=" + this.resumeSessionStore.enqstatus + "&deptid=" + this.resumeSessionStore.deptid + "&fromdate=" + this.resumeSessionStore.fromdate + "&todate=" + this.resumeSessionStore.todate)
      .subscribe(event => {
        let data;
        data = event;
        this.itemDisplay = data;
        this.itemDisplay = this.itemDisplay.Table;
        this.grnArray.data = this.itemDisplay;
        this.isLoadingResults = false;
      });

  }


  // Search Filter
  applyFilter(event) {
    if (event != undefined) {
      this.search = event;
      this.refreshResume();
    }
  }

  // Status Filter
  selectstatus() {
    if (this.resumeSessionStore.fromdate == undefined || this.resumeSessionStore.fromdate == null || this.resumeSessionStore.fromdate == '') { this.resumeSessionStore.fromdate = ""; } else { this.resumeSessionStore.fromdate = formatDate(this.resumeSessionStore.fromdate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.todate == undefined || this.resumeSessionStore.todate == null || this.resumeSessionStore.todate == '') { this.resumeSessionStore.todate = ""; } else { this.resumeSessionStore.todate = formatDate(this.resumeSessionStore.todate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.enqstatus == undefined || this.resumeSessionStore.enqstatus == null || this.resumeSessionStore.enqstatus == '') { this.resumeSessionStore.enqstatus = ""; } else { this.resumeSessionStore.enqstatus = this.resumeSessionStore.enqstatus }
    if (this.resumeSessionStore.deptid == undefined || this.resumeSessionStore.deptid == null || this.resumeSessionStore.deptid == '') { this.resumeSessionStore.deptid = ""; } else { this.resumeSessionStore.deptid = this.resumeSessionStore.deptid }
    sessionStorage.setItem('resumeSeesionApi', JSON.stringify(this.resumeSessionStore));
    this.refreshResume();
  }

  // Reset Close
  reset(event) {
    this.search = '';
    this.name = '';
    this.refreshResume();
  }

  // Edit Form
  editResume(data) {
    var ID = data.ID;
    this.router.navigate(['/add-resume/' + ID + '/edit']);
  }

  // Remove Filter
  removestatus(event) {
    if (this.resumeSessionStore.fromdate == undefined || this.resumeSessionStore.fromdate == null || this.resumeSessionStore.fromdate == '') { this.resumeSessionStore.fromdate = ""; } else { this.resumeSessionStore.fromdate = formatDate(this.resumeSessionStore.fromdate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.todate == undefined || this.resumeSessionStore.todate == null || this.resumeSessionStore.todate == '') { this.resumeSessionStore.todate = ""; } else { this.resumeSessionStore.todate = formatDate(this.resumeSessionStore.todate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.enqstatus == undefined || this.resumeSessionStore.enqstatus == null || this.resumeSessionStore.enqstatus == '') { this.resumeSessionStore.enqstatus = ""; } else { this.resumeSessionStore.enqstatus = this.resumeSessionStore.enqstatus }
    if (this.resumeSessionStore.deptid == undefined || this.resumeSessionStore.deptid == null || this.resumeSessionStore.deptid == '') { this.resumeSessionStore.deptid = ""; } else { this.resumeSessionStore.deptid = this.resumeSessionStore.deptid }
    sessionStorage.setItem('resumeSeesionApi', JSON.stringify(this.resumeSessionStore));
    this.refreshResume();
  }
  print(element){
    console.log("element",element)
    this.router.navigate(['/resume-print/'+element.ID]);
    }
  //Resume Status
  opendialog(event) {
    const dialogRef = this.dialog.open(ResumeStatusPopupComponent, {

      data: {
        rowData: event,
        type: "resume",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshResume();
    });
  }

  removetodate(event) {
    this.resumeSessionStore.todate = '';
    if (this.resumeSessionStore.fromdate == undefined || this.resumeSessionStore.fromdate == null || this.resumeSessionStore.fromdate == '') { this.resumeSessionStore.fromdate = ""; } else { this.resumeSessionStore.fromdate = formatDate(this.resumeSessionStore.fromdate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.todate == undefined || this.resumeSessionStore.todate == null || this.resumeSessionStore.todate == '') { this.resumeSessionStore.todate = ""; } else { this.resumeSessionStore.todate = formatDate(this.resumeSessionStore.todate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.enqstatus == undefined || this.resumeSessionStore.enqstatus == null || this.resumeSessionStore.enqstatus == '') { this.resumeSessionStore.enqstatus = ""; } else { this.resumeSessionStore.enqstatus = this.resumeSessionStore.enqstatus }
    if (this.resumeSessionStore.deptid == undefined || this.resumeSessionStore.deptid == null || this.resumeSessionStore.deptid == '') { this.resumeSessionStore.deptid = ""; } else { this.resumeSessionStore.deptid = this.resumeSessionStore.deptid }
    sessionStorage.setItem('resumeSeesionApi', JSON.stringify(this.resumeSessionStore));
  }

  removefromdate(event) {
    this.resumeSessionStore.fromdate = '';
    if (this.resumeSessionStore.fromdate == undefined || this.resumeSessionStore.fromdate == null || this.resumeSessionStore.fromdate == '') { this.resumeSessionStore.fromdate = ""; } else { this.resumeSessionStore.fromdate = formatDate(this.resumeSessionStore.fromdate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.todate == undefined || this.resumeSessionStore.todate == null || this.resumeSessionStore.todate == '') { this.resumeSessionStore.todate = ""; } else { this.resumeSessionStore.todate = formatDate(this.resumeSessionStore.todate, 'yyyy-MM-dd', 'en-US') }
    if (this.resumeSessionStore.enqstatus == undefined || this.resumeSessionStore.enqstatus == null || this.resumeSessionStore.enqstatus == '') { this.resumeSessionStore.enqstatus = ""; } else { this.resumeSessionStore.enqstatus = this.resumeSessionStore.enqstatus }
    if (this.resumeSessionStore.deptid == undefined || this.resumeSessionStore.deptid == null || this.resumeSessionStore.deptid == '') { this.resumeSessionStore.deptid = ""; } else { this.resumeSessionStore.deptid = this.resumeSessionStore.deptid }
    sessionStorage.setItem('resumeSeesionApi', JSON.stringify(this.resumeSessionStore));
  }

  exportToExcel() {
    let pageindex = this.paginator.pageIndex + 1;
    this.http.get(this.original_url + "/HR/Resume/Getresumelist?PageNumber=1&PageSize=0&sort=" + this.sort.active + "&sortorder=" + this.sort.direction + "&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + this.search + "&resumestatus=" + this.resumeSessionStore.enqstatus + "&deptid=" + this.resumeSessionStore.deptid + "&fromdate=" + this.resumeSessionStore.fromdate + "&todate=" + this.resumeSessionStore.todate)
      .subscribe(event => {
        let temp; let allDataGet: any;
        temp = event;
        allDataGet = temp.Table;
        allDataGet.forEach(item => {
          delete item['ID'];
          delete item['NAME'];
          delete item['STATUSID'];
          delete item['COLORCODE'];
        });
        this.excelService.exportAsExcelFile(allDataGet, 'Resume');
      });
  }
}




