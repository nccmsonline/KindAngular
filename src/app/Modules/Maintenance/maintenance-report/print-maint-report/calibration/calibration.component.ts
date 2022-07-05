import { Global } from './../../../../../Global';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/services/excel/excel.service';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.css']
})
export class CalibrationComponent implements OnInit {

  userRightCheck:any={};
  canPrintCommonClass ='';
  canViewCommonClass='';
  canExportCommonClass = '';
  userinfo: any;
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
  displayedColumns:string[]=[ 'srno','machinename','location','splteam','spltools','calibrationdueon'];
  exportarray : Array<any> = [];

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private globalVar: Global,
    private excelService: ExcelService,
    private changeDetectorRefs: ChangeDetectorRef,
    // private MaintenanceReportsService: MaintenanceReportsService,
    private router: Router,
  ) { 
    
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
    // this.fyid = this.globalVar.fyid

    // User Right Data Get
    // let SidebarCommon = sessionStorage.getItem("sidebar");
    // let sidebarDataGet = JSON.parse(SidebarCommon);
    // let childSidebarDataGet = sidebarDataGet.find(x=>x.moduleid == 2);
    // this.userRightCheck = childSidebarDataGet.items.find(x=>x.functionalityid == 1103);

    if(this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; } 
    if(this.userRightCheck.canprint == 'True') { this.canPrintCommonClass = '';}
    if(this.userRightCheck.canexport == 'True') { this.canExportCommonClass = '';}

    if(this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; } 
    if(this.userRightCheck.canprint == 'False') { this.canPrintCommonClass = 'canPrintCommonClass';}
    if(this.userRightCheck.canexport == 'False') { this.canExportCommonClass = 'canExportCommonClass';}

    // if(this.userRightCheck.canview == 'True')
    // {
    //   this.subscription =
    //   this.MaintenanceReportsService.onDataChanged
    //   .subscribe(event => {
    //       if(event){
    //         this.StatementClick(event[0]);
    //       }
    //   });
    // }
  }
  ngOnInit() {
  }

  StatementClick(data)
  {    
    this.isLoadingResults = true;
    this.detail.data = data.detail;
    this.reportname = data.reportname;
    this.fromdate = data.fromdate;
    this.todate = data.todate;
    this.isLoadingResults = false;
    // this.gettotal();
  }

  exportToExcel() {
    this.exportarray=this.detail.data;
    this.excelService.exportAsExcelFile(this.exportarray, 'Calibration-due-report');
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
