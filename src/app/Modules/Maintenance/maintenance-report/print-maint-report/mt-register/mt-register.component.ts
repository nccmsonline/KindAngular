import { Global } from './../../../../../Global';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mt-register',
  templateUrl: './mt-register.component.html',
  styleUrls: ['./mt-register.component.css']
})
export class MtRegisterComponent implements OnInit {
  original_url = environment.baseUrl;
  userinfo: any;
  coid: any;
  boid: any;
  userID: any;
  branch1Data: any;
  branch2Data: any;
  fyid: any;
  newData: any = {};
  fromdate: any;
  todate: any;
  myDate = new Date();
  fystartdate: any;
  fyenddate: any;
  displayedColumns: string[] = ['mtno', 'mtdatetime', 'mono', 'machinename', 'location', 'complaintby', 'department', 'problem', 'type','status'];
  companyname: any;
  unitname: any;
  itemtype: string;
  rptfilterlabel: string;
  isLoadingResults = true;
  PrintData = new MatTableDataSource<any>(); 
  repeatHeaders = true;
  subscription: Subscription;
  exportarray : Array<any> = [];
  mtfilterArray: Array<any>=[{id:"P",name:"Preventive"},{id:"B",name:"Breakdown"},{id:"C",name:"Calibration"},{id:"A",name:"AMC."}];
  mttype:any;
  
  constructor(
    private http: HttpClient,
    private excelService: ExcelService,
    private router: Router,
    // private MaintenanceReportsService: MaintenanceReportsService,
    private translate: TranslateService,
    private globalVar: Global,
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

    // this.fystartdate = this.branch2Data['fystartdate'];
    // this.fyenddate = this.branch2Data['fyenddate'];

    this.excelService = excelService;
    this.itemtype = "";
    this.newData.type = "";

    this.fromdate = this.fystartdate;
    this.todate = this.fyenddate;
    this.newData.fromdate = this.fromdate;
    this.newData.todate = this.todate;

    this.mttype = '';

    // this.subscription = this.MaintenanceReportsService.onDataChanged
    // .subscribe(event => {
    //     if(event){
    //       this.newData = event;
    //       this.itemtype = this.newData.type;
    //       this.rptfilterlabel = this.itemtype;
    //       // this.StatementClick(this.newData);
         
    //     }
        
    // });
  }

  ngOnInit() {
    this.StatementClick(this.newData);
    this.subscription.unsubscribe();
  }

  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }

  changetype(event) {
    this.itemtype = event.type;
    this.rptfilterlabel = this.itemtype;
    this.StatementClick(this.newData);
  }

  clearmttype(){
    this.StatementClick(this.newData);
  }

  mttypeChange(id){
    this.StatementClick(this.newData);
  }

  StatementClick(data) {
    this.isLoadingResults = true;
    this.mttype = this.globalVar.checknull(this.newData.mttype,"string");
    this.fromdate = formatDate(data.fromdate, 'yyyy-MM-dd', 'en-US');
    this.todate = formatDate(data.todate, 'yyyy-MM-dd', 'en-US');
    this.http.get(this.original_url + "/Maintenance/Ticket/getmtregister?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fromdate=" + this.fromdate + "&todate=" + this.todate + "&type=" + this.itemtype+ "&mttype=" + this.mttype)
      .subscribe((res: any[]) => {
        let printalldata;
        this.isLoadingResults = false;
        printalldata = res;
        this.PrintData.data = printalldata.Table;
        // this.MaintenanceReportsService.serviceDataarray(this.newData);
      });
  }

  exportToExcel() {
    this.exportarray=this.PrintData.data;
    this.excelService.exportAsExcelFile(this.exportarray, 'M.T.-Register');
  }

  back(){
    // this.MaintenanceReportsService.serviceDataarray(undefined);
    this.router.navigate(['/maintenance-reports']);
  }

}
