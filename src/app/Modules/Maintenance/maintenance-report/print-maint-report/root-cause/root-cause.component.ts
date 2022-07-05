import { Global } from './../../../../../Global';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/services/excel/excel.service';

@Component({
  selector: 'app-root-cause',
  templateUrl: './root-cause.component.html',
  styleUrls: ['./root-cause.component.css']
})
export class RootCauseComponent implements OnInit {

  userRightCheck: any = {};
  canPrintCommonClass = '';
  canViewCommonClass = '';
  canExportCommonClass = '';
  coid: any;
  branch1Data: any;
  branch2Data: any;
  boid: any;
  fyid: any;
  subscription: Subscription;
  isLoadingResults = true;
  detail = new MatTableDataSource<any>();
  reportname: any;
  reporttype: any;
  fromdate: any;
  todate: any;
  displayedColumns: string[] = ['srno', 'rootcause', 'totalaffected', 'totalhrslost', 'labouramt', 'partsamt', 'outsidelabouramt', 'total'];
  exportarray: Array<any> = [];
  userinfo: any;

  molbrTotal: any;
  mopartsTotal: any;
  mooutsidelbrTotal: any;
  grandTotal: any;
  hourslostTotal: any;
  Totalmachinesaffected: any;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private excelService: ExcelService,
    private globalVar: Global,
    private changeDetectorRefs: ChangeDetectorRef,
    // private MaintenanceReportsService: MaintenanceReportsService,
    private router: Router, ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    // let user = sessionStorage.getItem("currentUser");
    // this.userinfo = JSON.parse(user);
    // this.coid = this.globalVar.CommpanyId
    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.boid = this.globalVar.BranchId
    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.globalVar.fyid;

    // User Right Data Get
    let SidebarCommon = sessionStorage.getItem("sidebar");
    let sidebarDataGet = JSON.parse(SidebarCommon);
    // let childSidebarDataGet = sidebarDataGet.find(x => x.moduleid == 2);
    // this.userRightCheck = childSidebarDataGet.items.find(x => x.functionalityid == 1103);

    if (this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; }
    if (this.userRightCheck.canprint == 'True') { this.canPrintCommonClass = ''; }
    if (this.userRightCheck.canexport == 'True') { this.canExportCommonClass = ''; }

    if (this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; }
    if (this.userRightCheck.canprint == 'False') { this.canPrintCommonClass = 'canPrintCommonClass'; }
    if (this.userRightCheck.canexport == 'False') { this.canExportCommonClass = 'canExportCommonClass'; }

    // if (this.userRightCheck.canview == 'True') {
    //   this.subscription =
    //     this.MaintenanceReportsService.onDataChanged
    //       .subscribe(event => {
    //         if (event) {
    //           this.StatementClick(event[0]);
    //         }
    //       });
    // }
  }

  ngOnInit() {
  }

  StatementClick(data) {
    this.isLoadingResults = true;
    this.detail.data = data.detail;
    this.reportname = data.reportname;
    this.fromdate = data.fromdate;
    this.todate = data.todate;
    // this.isLoadingResults = false;
    this.gettotal();
  }

  // total amount in footer function
  gettotal() {
    var
      hourslostTotal: number = 0,
      Totalmachinesaffected: number = 0,
      molbrTotal: number = 0,
      mopartsTotal: number = 0,
      mooutsidelbrTotal: number = 0,
      grandTotal: number = 0;

    this.detail.data.forEach((data) => {
      if (data.hourslost == "" || data.hourslost == undefined || data.hourslost == null || data.hourslost == NaN) { data.hourslost = 0; } else { data.hourslost = data.hourslost; }
      if (data.totalmachinesaffected == "" || data.totalmachinesaffected == undefined || data.totalmachinesaffected == null || data.totalmachinesaffected == NaN) { data.totalmachinesaffected = 0; } else { data.totalmachinesaffected = data.totalmachinesaffected; }
      if (data.mototlbr == "" || data.mototlbr == undefined || data.mototlbr == null || data.mototlbr == NaN) { data.mototlbr = 0; } else { data.mototlbr = data.mototlbr; }
      if (data.mototparts == "" || data.mototparts == undefined || data.mototparts == null || data.mototparts == NaN) { data.mototparts = 0; } else { data.mototparts = data.mototparts; }
      if (data.mototoutsidelbr == "" || data.mototoutsidelbr == undefined || data.mototoutsidelbr == null || data.mototoutsidelbr == NaN) { data.mototoutsidelbr = 0; } else { data.mototoutsidelbr = data.mototoutsidelbr; }
      if (data.totalamt == "" || data.totalamt == undefined || data.totalamt == null || data.totalamt == NaN) { data.totalamt = 0; } else { data.totalamt = data.totalamt; }

      hourslostTotal = hourslostTotal + parseFloat(data.hourslost);
      Totalmachinesaffected = Totalmachinesaffected + parseFloat(data.totalmachinesaffected);
      molbrTotal = molbrTotal + parseFloat(data.mototlbr);
      mopartsTotal = mopartsTotal + parseFloat(data.mototparts);
      mooutsidelbrTotal = mooutsidelbrTotal + parseFloat(data.mototoutsidelbr);
      grandTotal = grandTotal + parseFloat(data.totalamt);

      this.hourslostTotal = hourslostTotal;
      this.Totalmachinesaffected = Totalmachinesaffected;
      this.molbrTotal = molbrTotal.toFixed(2);
      this.mopartsTotal = mopartsTotal.toFixed(2);
      this.mooutsidelbrTotal = mooutsidelbrTotal.toFixed(2);
      this.grandTotal = grandTotal.toFixed(2);
    });
    this.isLoadingResults = false;
  }

  exportToExcel() {
    this.exportarray = this.detail.data;
    this.excelService.exportAsExcelFile(this.exportarray, 'Maintenance-report');
  }
  // print function. function options in index .html
  print() {
    window.print();
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
