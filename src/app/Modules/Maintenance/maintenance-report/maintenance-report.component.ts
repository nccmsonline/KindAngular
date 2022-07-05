import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maintenance-report',
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.css']
})
export class MaintenanceReportComponent implements OnInit {

 
  original_url = environment.baseUrl;
  userinfo: any;
  coid: any;
  boid: any;
  fyid: any;
  userID: any;
  useraccesstoken: any;
  branch1Data: any;
  branch2Data: any;
  isLoadingResults = true;
  DataGet: Array<any> = [];
  fromdate: any;
  todate: any;
  myDate = new Date();
  fystartdate: any;
  fyenddate: any;
  newData: any = {};
  itemClass: any;
  dropdownSettings = {};
  reportname: string;


  constructor(
    private http: HttpClient,
    // private MaintenanceReportsService: MaintenanceReportsService,
    public dialog: MatDialog,
    private router: Router,
    // private purchaseOrderService: PurchaseOrderService,
    private route: ActivatedRoute
  ) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.useraccesstoken = this.userinfo['useraccesstoken'];

    let branch1 = sessionStorage.getItem("branch1");
    let branch2 = sessionStorage.getItem("branch2");
    this.branch1Data = JSON.parse(branch1);
    this.branch2Data = JSON.parse(branch2);
    this.boid = this.branch1Data['boid'];
    this.fyid = this.branch2Data['fyid'];
    this.userID = this.userinfo['userid'];

    this.fystartdate = this.branch2Data['fystartdate'];
    this.fyenddate = this.branch2Data['fyenddate'];
    this.newData.fromdate = this.fystartdate;
    this.newData.todate = this.fyenddate;

    // this.purchaseOrderService.onDataChanged
    //   .subscribe(event => {       
    //   })
    // let Sidebar = sessionStorage.getItem("sidebar");
    // this.itemClass = JSON.parse(Sidebar);
    // this.itemClass = this.itemClass;
    // for(let i=0;i<this.itemClass.length;i++){

    //  for(let j=0; j<this.itemClass[i].items.length;j++){
    //    if ("/sale-reportdata"==this.itemClass[i].items[j].routerLink) 
    //     {
    //      let moduleid= this.itemClass[i].items[j].moduleid
    //      this.newData.routerLink=this.itemClass[i].items[j].routerLink;         
    //      this.http.get(this.original_url+"/Logins/LoginValidation/getmodulemenulist?coid="+this.coid+"&boid="+this.boid+"&userid="+this.userID+"&moduleid="+moduleid)
    //     .subscribe((response: any[]) => {
    //       this.isLoadingResults = false;
    //      this.DataGet = response;
    //    });
    //   }             
    //  }
    // }
    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'id',
    //   textField: 'name',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   enableCheckAll: false,
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // }; 

    this.http.get(this.original_url + "/Logins/LoginValidation/getmodulemenulist?coid=" + this.coid + "&boid=" + this.boid + "&userid=" + this.userID + "&moduleid=16")
      .subscribe((response: any[]) => {
        this.isLoadingResults = false;
        this.DataGet = response;
      });

  }

  ngOnInit() {
  }

  getdataonClick(data, action) {

    this.fromdate = formatDate(data.fromdate, 'yyyy-MM-dd', 'en-US');
    this.todate = formatDate(data.todate, 'yyyy-MM-dd', 'en-US');

    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5> Please reactify the following mistakes:-</h5>";
    if (this.newData.routerLink == null || this.newData.routerLink == undefined || this.newData.routerLink == '' || this.newData.routerLink == '/sale-reportdata') {
      { flag = false; msg = msg + "* Please Select Report<br/>" }
      if (flag == false) {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
      return flag;
    }

    else {
      this.isLoadingResults = true;
      // 1
      if (data.routerLink == "1299") {
        this.reportname = 'Preventive Maintenance';
        this.http.get(this.original_url + "/Maintenance/Ticket/getpreventivemaintreport?coid=" + this.coid + "&boid=" + this.boid + "&fromdate=" + this.fromdate + "&todate=" + this.todate + "&machineid=&type=preventivemaint")
          .subscribe((respose) => {
            let allDataGet: any, detail: Array<any> = [];
            this.isLoadingResults = false;
            allDataGet = respose;

            detail = allDataGet.Table;

            if (detail.length == 0) {
              this.noDataDialog();
            }

            else {
              let hdata: Array<any> = [];
              hdata.push({ 'detail': detail, 'reportname': this.reportname, 'fromdate': data.fromdate, 'todate': data.todate });
              // this.MaintenanceReportsService.serviceDataarray(hdata);
              this.router.navigate(['/print-maint-report/preventive']);
            }

          });
      }
      // 2
      if (data.routerLink == "1300") {
        this.reportname = 'Calibration';
        this.http.get(this.original_url + "/Maintenance/Ticket/getpreventivemaintreport?coid=" + this.coid + "&boid=" + this.boid + "&fromdate=" + this.fromdate + "&todate=" + this.todate + "&machineid=&type=")
          .subscribe((respose) => {
            let allDataGet: any, detail: Array<any> = [];
            this.isLoadingResults = false;
            allDataGet = respose;

            detail = allDataGet.Table;

            if (detail.length == 0) {
              this.noDataDialog();
            }

            else {
              let hdata: Array<any> = [];
              hdata.push({ 'detail': detail, 'reportname': this.reportname, 'fromdate': data.fromdate, 'todate': data.todate });
              // this.MaintenanceReportsService.serviceDataarray(hdata);
              this.router.navigate(['/print-maint-report/calibration']);
            }

          });
      }
      // 3
      if (data.routerLink == "1301") {
        this.reportname = 'Reason (Root Cause) wise Break Down';
        this.http.get(this.original_url + "/Maintenance/Ticket/getpreventivemaintreport?coid=" + this.coid + "&boid=" + this.boid + "&fromdate=" + this.fromdate + "&todate=" + this.todate + "&machineid=&type=")
          .subscribe((respose) => {
            let allDataGet: any, detail: Array<any> = [];
            this.isLoadingResults = false;
            allDataGet = respose;

            detail = allDataGet.Table1;

            if (detail.length == 0) {
              this.noDataDialog();
            }

            else {
              let hdata: Array<any> = [];
              hdata.push({ 'detail': detail, 'reportname': this.reportname, 'fromdate': data.fromdate, 'todate': data.todate });
              // this.MaintenanceReportsService.serviceDataarray(hdata);
              this.router.navigate(['/print-maint-report/root-cause']);
            }

          });
      }
      if (data.routerLink == "1302") {
        this.router.navigate(['/print-maint-report/mt-register']);
      }

      if (data.routerLink == "1303") {
        this.router.navigate(['/print-maint-report/mo-register']);
      }
      if (data.routerLink == "1415") {
        this.reportname = 'Machine History Detail';
        this.http.get(this.original_url + "/Maintenance/Ticket/getmachinehistorydetail?coid=" + this.coid + "&boid=" + this.boid +"&machineid=0&mttype=0"+ "&fromdate=" + this.fromdate + "&todate=" + this.todate )
          .subscribe((respose) => {
            let allDataGet: any, detail: Array<any> = [];
            this.isLoadingResults = false;
            allDataGet = respose;
            detail = allDataGet.Table;

            if (detail.length == 0) {
              this.noDataDialog();
            }

            else {
              let hdata: Array<any> = [];
              hdata.push({ 'detail': detail, 'reportname': this.reportname, 'fromdate': data.fromdate, 'todate': data.todate , 'reporttype': "MaintReports"});
              // this.MaintenanceReportsService.serviceDataarray(hdata);
              this.router.navigate(['/print-maint-report/machine-history-details']);
            }

          });
      }
    }
  }

  noDataDialog() {
    var msg: any;
    msg = "<h5>*No Data found for the given criteria.</h5>";
    const dialogRef = this.dialog.open(ValidationComponent, {
      data: {
        msg: msg,
        action: ''
      }
    });
  }
}
