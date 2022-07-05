import { Global } from './../../../Global';
import { environment } from './../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-machine-history',
  templateUrl: './machine-history.component.html',
  styleUrls: ['./machine-history.component.css']
})
export class MachineHistoryComponent implements OnInit {

  original_url = environment.baseUrl;
 
  sortOrder: any;
  sortSelection: any;
  checked: any;
  categorychange: any;
  // useraccesstoken: any;
  branch1Data: any;
  branch2Data: any;
  fystartdate: any;
  fyenddate: any;
  newData: any = {};
  DataGet: Array<any> = [];
  machineHeaderGet: any;
  showitem: boolean = false;
  showdetailReport:boolean=false;
  reportData: Array<any> = [];
  total: any;
  labouramt: any;
  partsamt: any;
  outsidelabour: any;
  machineIdGet: any;
  mydate = new Date();
  fromdate: string;
  todate: string;
  isLoadingResults = true;
  molbrTotal: any;
  mopartsTotal: any;
  mooutsidelbrTotal: any;
  hrsTotal:any;
  grandTotal: any ;
  onDataChanged: Observable<any>;
  subscription: Subscription;
  emptyData:any= {};
  trueCheck: Observable<any>;
  mtfilterArray: Array<any>=[{id:"P",name:"Preventive"},{id:"B",name:"Breakdown"},{id:"C",name:"Calibration"},{id:"A",name:"AMC."}];
  mttype:any;
  reportname: string;
  // truesubscription: Subscription;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    // private machineHistoryService: MachineHistoryService,
    private globalVar: Global,
    // private MaintenanceReportsService:MaintenanceReportsService,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.newData.fromdate = this.globalVar.FinancialYearStartDate;
    this.newData.todate = this.mydate;

    // this.truesubscription = this.machineHistoryService.trueCheck
    //   .subscribe(res => {
    //   });

    // this.subscription = this.machineHistoryService.onDataChanged
    //   .subscribe(event => {
    //     if(event) {
    //       this.newData = event;
    //       this.machineIdGet = this.newData.machineid;
    //       this.getMachineData();
    //       if(this.subscription != undefined){
    //         this.subscription.unsubscribe();
    //         }
    //     }
    //   });

      // if(!this.subscription.unsubscribe) { } else { this.subscription.unsubscribe() }
      // if(!this.truesubscription.unsubscribe) { } else { this.truesubscription.unsubscribe() }
  }

  ngOnInit() {
    // this.subscription.unsubscribe();
    // this.truesubscription.unsubscribe();
    this.refresh();
  }

  ngOnDestroy()
  {
    if(this.subscription != undefined){
    this.subscription.unsubscribe();
    }
    // this.truesubscription.unsubscribe();
  }

  // get machine list
  refresh() {
    this.isLoadingResults = true;
    this.http.get(this.original_url + "/Maintenance/Ticket/commonapiticket?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid=" + this.globalVar.fyid)
      .subscribe((res: any[]) => {
        let allDataGet;
        allDataGet = res;
        this.DataGet = allDataGet.Table12;
        this.isLoadingResults = false;
      });
  }

  getdataonClick(data){
    this.mttype= this.globalVar.checknull(this.mttype,"string")
    this.reportname = 'Machine History Detail';
    this.http.get(this.original_url + "/Maintenance/Ticket/getmachinehistory?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&machineid="+ this.machineIdGet +"&mttype="+this.mttype+ "&fromdate=" + this.fromdate + "&todate=" + this.todate )
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
          hdata.push({ 'detail': detail, 'reportname': this.reportname, 'fromdate': data.fromdate, 'todate': data.todate , 'reporttype': "MachineHistory" });
          // this.MaintenanceReportsService.serviceDataarray(hdata);
          this.router.navigate(['/maintenance-reports/print-maint-report/machine-history-details']);
        }

      });
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

  // on machine selection
  // reportchange(event, data) {
  //   this.machineIdGet = '';
  //   data.location = '';
  //   data.lastpmdone = '';
  //   data.nextpmdue = '';
  //   data.lastbdown = '';

  //   if (event.length > 0) {
  //     let mdata;
  //     mdata = event[0];
  //     mdata = mdata.data;
  //     this.machineIdGet = mdata.id;
  //     data.location = mdata.location;
  //     if (mdata.LASTMAINT != null && mdata.LASTMAINT != undefined && mdata.LASTMAINT != '') { data.lastpmdone = formatDate(mdata.LASTMAINT, 'dd-MM-yyyy', 'en-US'); }
  //     if (mdata.NEXTMAINT != null && mdata.NEXTMAINT != undefined && mdata.NEXTMAINT != '') { data.nextpmdue = formatDate(mdata.NEXTMAINT, 'dd-MM-yyyy', 'en-US'); }
  //     if (mdata.LASTBDOWNMAINT != null && mdata.LASTBDOWNMAINT != undefined && mdata.LASTBDOWNMAINT != '') { data.lastbdown = formatDate(mdata.LASTBDOWNMAINT, 'dd-MM-yyyy', 'en-US'); }
  //     if (mdata.FIRSTTICKETDATE != null && mdata.FIRSTTICKETDATE != undefined && mdata.FIRSTTICKETDATE != '') {
  //       this.newData.fromdate = mdata.FIRSTTICKETDATE;
  //     }
  //     else {
  //       this.newData.fromdate = this.branch2Data['fystartdate'];
  //     }
  //     this.newData.todate = this.mydate;
  //     this.showitem = true;
  //     // this.machineHistoryService.sendMessage(this.newData);
  //     this.getMachineData();
  //   }
  //   else {
  //     this.showitem = false;
  //   }
  // }

  reportchange(event, data) {
    this.machineIdGet = '';
    data.location = '';
    data.lastpmdone = '';
    data.nextpmdue = '';
    data.lastbdown = '';

    if (event != undefined) {
      debugger
      this.showdetailReport=true;
      let mdata;
      mdata = event;
      // mdata = mdata.data;
      this.machineIdGet = mdata.MACHINEID;
      data.LOCATION = mdata.LOCATION;
      if (mdata.LASTMAINT != null && mdata.LASTMAINT != undefined && mdata.LASTMAINT != '') { data.LASTMAINT = formatDate(mdata.LASTMAINT, 'dd-MM-yyyy', 'en-US'); }
      if (mdata.NEXTMAINT != null && mdata.NEXTMAINT != undefined && mdata.NEXTMAINT != '') { data.NEXTMAINT = formatDate(mdata.NEXTMAINT, 'dd-MM-yyyy', 'en-US'); }
      if (mdata.LASTBDOWNMAINT != null && mdata.LASTBDOWNMAINT != undefined && mdata.LASTBDOWNMAINT != '') { data.LASTBDOWNMAINT = formatDate(mdata.LASTBDOWNMAINT, 'dd-MM-yyyy', 'en-US'); }
      if (mdata.FIRSTTICKETDATE != null && mdata.FIRSTTICKETDATE != undefined && mdata.FIRSTTICKETDATE != '') {
        this.newData.fromdate = mdata.FIRSTTICKETDATE;
      }
      else {
        this.newData.fromdate = this.globalVar.FinancialYearStartDate;
      }
      this.newData.todate = this.mydate;
      // this.machineHistoryService.sendMessage(this.newData);
      this.getMachineData();
    }
    else {
      this.showitem = false;
      this.showdetailReport=false;
    }
  }

  // get report data
  getMachineData() {
    if(this.machineIdGet != '' && this.machineIdGet != null && this.machineIdGet != undefined){
    this.showitem = true;
    this.isLoadingResults = true;
    this.mttype= this.globalVar.checknull(this.newData.mttype,"string")
    if (this.newData.fromdate == null || this.newData.fromdate == undefined || this.newData.fromdate == '') { this.fromdate = '' }
    else { this.fromdate = formatDate(this.newData.fromdate, 'yyyy-MM-dd', 'en-US'); }
    if (this.newData.todate == null || this.newData.todate == undefined || this.newData.todate == '') { this.todate = '' }
    else { this.todate = formatDate(this.newData.todate, 'yyyy-MM-dd', 'en-US'); }
    this.http.get(this.original_url + "/Maintenance/ticket/getmachinehistory?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&machineid=" + this.machineIdGet + "&fromdate=" + this.fromdate + "&todate=" + this.todate+ "&mttype=" + this.mttype)
      .subscribe((res: any[]) => {
        var allDataGet: any;
        allDataGet = res;
        this.reportData = allDataGet.Table;
        // this.machineHistoryService.sendMessage(this.newData);
        this.showdetailReport=true;
        this.gettotal();
      }); 
    }
  }

  // total amount in footer function
  gettotal() {
    var hrsTotal: number = 0,
        molbrTotal: number = 0,
        mopartsTotal: number = 0,
        mooutsidelbrTotal: number = 0,
        grandTotal: number = 0;

    this.reportData.forEach((data) => {
      if (data.hourslost == "" || data.hourslost == undefined || data.hourslost == null || data.hourslost == NaN) { data.hourslost = 0; } else { data.hourslost = data.hourslost; }
      if (data.MOLBR == "" || data.MOLBR == undefined || data.MOLBR == null || data.MOLBR == NaN) { data.MOLBR = 0; } else { data.MOLBR = data.MOLBR; }
      if (data.MOPARTS == "" || data.MOPARTS == undefined || data.MOPARTS == null || data.MOPARTS == NaN) { data.MOPARTS = 0; } else { data.MOPARTS = data.MOPARTS; }
      if (data.MOOUTSIDELBR == "" || data.MOOUTSIDELBR == undefined || data.MOOUTSIDELBR == null || data.MOOUTSIDELBR == NaN) { data.MOOUTSIDELBR = 0; } else { data.MOOUTSIDELBR = data.MOOUTSIDELBR; }
      if(data.TOTALAMT==""||data.TOTALAMT==undefined||data.TOTALAMT==null||data.TOTALAMT==NaN)  {data.TOTALAMT=0 ;} else {data.TOTALAMT=data.TOTALAMT;}

      hrsTotal = hrsTotal + parseFloat(data.hourslost);
      molbrTotal = molbrTotal + parseFloat(data.MOLBR);
      mopartsTotal = mopartsTotal + parseFloat(data.MOPARTS);
      mooutsidelbrTotal = mooutsidelbrTotal + parseFloat(data.MOOUTSIDELBR);
      grandTotal = grandTotal + parseFloat(data.TOTALAMT);

      this.hrsTotal = hrsTotal;
      this.molbrTotal = molbrTotal.toFixed(2);
      this.mopartsTotal = mopartsTotal.toFixed(2);
      this.mooutsidelbrTotal = mooutsidelbrTotal.toFixed(2);
      this.grandTotal=grandTotal.toFixed(2);
    });
    this.isLoadingResults = false;
  }

}
