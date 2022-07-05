import { Global } from 'src/app/Global';
import { QueuePositionComponent } from './queue-position/queue-position.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpRequest, HttpEventType, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../../../environments/environment';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { ConfirmAlertComponent } from 'src/app/confirm-alert/confirm-alert.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { MoFollowupComponent } from '../mo-followup/mo-followup.component';

@Component({
  selector: 'app-add-maintenance-order',
  templateUrl: './add-maintenance-order.component.html',
  styleUrls: ['./add-maintenance-order.component.css']
})
export class AddMaintenanceOrderComponent implements OnInit {
  
  isLoadingResults = false;
  MaintenanceOrderForm: FormGroup;
  routeID: any;
  routeAction: any;
  MONO: any;
  MTNO: any;
  MTID: any;
  MOID: any;
  monoexist = false;
  original_url = environment.baseUrl;
  newData: any = {};
  priorityArray: Array<any> = [];
  AssignedTeamArray: Array<any> = [];
  mydate = new Date();
  externalteam = false;
  arrayItemSupplier = '';
  allSupplierList: any;
  supplierlist: Array<any> = [];
  moArray: Array<any> = [];
  maxqueueno: any;
  LASTQUEUENO: any;
  fystartdate: any;
  fyenddate: any;

  userRightCheck: any = {};
  LASTMODATE: any;
  notifier: NotifierService;
  MOSTATUS: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private globalVar:Global,
    notifier: NotifierService
  ) {

    this.notifier = notifier;
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    // this.coid = this.userinfo['coid'];

    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.boid = this.branch1Data['boid'];
    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];
    // this.fystartdate = this.branch2Data['fystartdate'];
    // this.fyenddate = this.branch2Data['fyenddate'];
    this.newData.MODATE = this.mydate;
    this.newData.MOTEAMTYPE = "I";

    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.createForm();

    if (this.routeAction == "edit" || this.routeAction == "view" || this.routeAction == "mchistory" || this.routeAction == 'mtregister' || this.routeAction == 'moregister') {
      this.isLoadingResults = true;
      this.http.get(this.original_url+"/Maintenance/Ticket/getticketdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + this.routeID)
        .subscribe((response) => {
          
          var allDataGet: any;
          allDataGet = response;
          this.newData = allDataGet.Table[0];
          if (this.newData.MOTEAMTYPE == "E") {
            this.externalteam = true;
          }
          else {
            this.externalteam = false;
          }
          
          this.MTNO = this.newData.MTNO;
          this.MOID = this.newData.MOID;
          this.MONO = this.newData.MONO;
          this.MOSTATUS = this.newData.MOSTATUS;
          // this.LASTMODATE = allDataGet.Table8[0].LASTMODATE;
          this.LASTQUEUENO = allDataGet.Table11[0].MAXQUEUENO;
          if (this.MONO == undefined || this.MONO == null || this.MONO == '') {
            this.MONO = allDataGet.Table7[0].LASTMONO;
            this.newData.MOQUEUENO = this.LASTQUEUENO;
            this.newData.MOTEAMTYPE = "I"
          }
          else {
            this.monoexist = true;
          }

          if (this.newData.MODATE == undefined || this.newData.MODATE == null || this.newData.MODATE == '') {
            this.newData.MODATE = this.mydate;
          }

          // this.newData.MOTIME = this.newData.MOTIME != null ? new Date("Wed, 27 July 2016 " + this.newData.MOTIME) : this.mydate;
          this.priorityArray = allDataGet.Table9;
          this.moArray = allDataGet.Table12;
          this.AssignedTeamArray = allDataGet.Table5;
          // this.AssignedTeamArray.forEach(element => {
          //   element.teamname = element.teamname.replace(/,/g, ', ');
          // });
          this.isLoadingResults = false;
        }, error => {
          this.isLoadingResults = false;
        });

    }

  }

  dropdownHide() {
  }

  changeteamtype(event) {
    if (event.value == "E") {
      this.externalteam = true;
    }
    else {
      this.externalteam = false;
    }
  }

  statuspopup(event){
    const dialogRef = this.dialog.open(MoFollowupComponent, {
      
      data: {
        action: event,
        type:"new",
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  
  }


  checkmaxqueue(event, rowDetail) {
    if (event > this.LASTQUEUENO) {
      rowDetail.MOQUEUENO = this.LASTQUEUENO;
    }
  }
  
  back() {
    if (this.routeAction == 'edit' || this.routeAction == 'view') { this.router.navigate(['/maintenance-order']); }
    else if (this.routeAction == 'mchistory') {
      // let checkVar = true;
      // this.machineHistoryService.dataCheck(checkVar)
      this.router.navigate(['/machine-history']); 
    }
    else if (this.routeAction == 'mtregister') { this.router.navigate(['/maintenance-reports/print-maint-report/mt-register']); }
    else if (this.routeAction == 'moregister') { this.router.navigate(['/maintenance-reports/print-maint-report/mo-register']); }
  }

  onChangeOfItemCodeSupplier(data, rowDetail) {
    if (data == null) {
      rowDetail.suplid = '';
      rowDetail.SUPLNAME = '';
    }
    else {
      this.arrayItemSupplier = '';
      rowDetail.suplid = data.CUSTOMERID;
      rowDetail.SUPLNAME = data.NAME;
    }
  }

  reset(data) {
    data.suplid = '';
    this.arrayItemSupplier = ''
    this.onChangeOfItemCodeSupplier(null, data);
  }

  gotorequistionpage() {
    this.router.navigate(['add-requisition/:id/:action' + this.userRightCheck.moduleid + '/' + this.userRightCheck.functionalityid + '/' + this.routeID + '/maintenance']);
  }

  // Supplier Start
  searchTermSupplier(term) {
    this.arrayItemSupplier = term;
    
    if (this.arrayItemSupplier !== '') {
      this.isLoadingResults = true;
      this.http.get(this.original_url+"/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=" + this.arrayItemSupplier+"&type=S")
        .subscribe((response) => {
          this.isLoadingResults = false;
          this.allSupplierList = response;
          this.allSupplierList = this.allSupplierList.Table;
          this.supplierlist = this.allSupplierList;
      //   });
    });
  }
    else {
      this.supplierlist = [];
      this.arrayItemSupplier = '';
    }
  }

  createForm() {
    this.MaintenanceOrderForm = this.fb.group({

    })
  }

  ngOnInit() {
  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data:-</h5>";

    if (hdata.MODATE == undefined || hdata.MODATE == '' || hdata.MODATE == null) { flag = false; msg = msg + "* Please select a valid MO Date <br/>" }
    if (hdata.MOTEAMTYPE == '' || hdata.MOTEAMTYPE == null || hdata.MOTEAMTYPE == undefined) { flag = false; msg = msg + "* Please Select Team Type <br/>" }
    if ((hdata.MOTEAMTYPE == "I")&&(hdata.MOASSIGNEDTEAMID == '' || hdata.MOASSIGNEDTEAMID == undefined || hdata.MOASSIGNEDTEAMID == null)) { flag = false; msg = msg + "* Please Select Maintenance Team <br/>" }
    if ((hdata.MOTEAMTYPE == "E")&&(hdata.SUPLNAME == '' ||hdata.SUPLNAME == undefined ||hdata.SUPLNAME == null)) { flag = false; msg = msg + "* Please Select Maintenance Team <br/>" }
    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
    else {
      this.SaveMaintenanceOrder(hdata, action)
    }
  }

  // openaddteamdialog() {
  //   const dialogRef = this.dialog.open(AddNewteamComponent, {
  //     data: {
  //       action: 'new'
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.http.get(this.original_url + '/Maintenance/Ticket/commonapiticket?coid=' + this.coid + "&boid=" + this.boid + '&fyid=' + this.fyid)
  //         .subscribe((res) => {
  //           let allDataGet: any;
  //           allDataGet = res;
  //           this.AssignedTeamArray = allDataGet.Table4;
  //           // this.newData.MOASSIGNEDTEAMID = this.AssignedTeamArray.find(x => x.id == result.id).teamleaderid;
  //           this.maxqueueno = allDataGet.Table10[0].maxqueueno;
  //         });
  //     }
  //   });
  // }

  checkqueueno(qno) {
    console.log("qno , this.LASTQUEUENO",qno , this.LASTQUEUENO)
    if (qno > this.LASTQUEUENO || qno == 0) {
      this.newData.MOQUEUENO = this.LASTQUEUENO;
      this.notifier.notify('warning', 'Please enter a valid queue no.');
    }
    else if(qno < this.LASTQUEUENO  ) {
      if (qno != undefined && qno != null && qno > 0) {
        let mo: any;
        mo = this.moArray.filter(a => a.MOQUEUENO == qno);
        if (mo != undefined || mo != null || mo != '') {
          const msg = "* Are you sure to set position " + qno + ". Because it is already alloted to order no " + mo[0].MONO + "";
          const popupdialog = this.dialog.open(ConfirmAlertComponent, {
            data: {
              msg: msg,
              action: ''
            }
          });
        }
      }
    }
  }

  setposition() {
    if (this.newData.MOQUEUENO == undefined || this.newData.MOQUEUENO == null) {
      this.newData.MOQUEUENO = 0;
    }
    const dialogRef = this.dialog.open(QueuePositionComponent, {
      data: {
        action: 'view',
        qno: this.newData.MOQUEUENO
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success == 'success') {
        this.newData.MOQUEUENO = result.value;
        this.checkqueueno(this.newData.MOQUEUENO);
        //this.moArray=result.moarr;
      }
    });
  }


  SaveMaintenanceOrder(hdata, action) {
    this.isLoadingResults = true;
    var hdrDataarray: Array<any> = [],MOASSIGNEDTEAMID;

    let id; let MONO; let MODATE; let MOTIME; let MTID; let MOSTARTDATE; let MOENDDATE; let MOQUEUENO;

    if (this.MOID == undefined || this.MOID == null) { this.MOID = 0; } else { id = this.MOID; }
    if (hdata.MONO == undefined || hdata.MONO == null) { MONO = 0; } else { MONO = hdata.MONO; }
    // if (hdata.MODATE == undefined || hdata.MODATE == null) { MODATE = ''; } else { MODATE = hdata.MODATE; }

    if (hdata.MOTIME == undefined || hdata.MOTIME == null || hdata.MOTIME == '00:00:00') { MOTIME = '00:00:00'; } else { MOTIME = formatDate(hdata.MOTIME, 'hh:mm:ss', 'en-US') }
    if (this.routeID == undefined || this.routeID == null) { MTID = 0; } else { MTID = this.routeID; }
    // if (hdata.MOSTARTDATE == undefined || hdata.MOSTARTDATE == '' || hdata.MOSTARTDATE == null) { MOSTARTDATE = '' } else { MOSTARTDATE = formatDate(hdata.MOSTARTDATE, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'); }
    // if (hdata.MOENDDATE == undefined || hdata.MOENDDATE == '' || hdata.MOENDDATE == null) { MOENDDATE = '' } else { MOENDDATE = formatDate(hdata.MOENDDATE, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'); }
    if (hdata.MOQUEUENO == undefined || hdata.MOQUEUENO == null) { MOQUEUENO = 0; } else { MOQUEUENO = hdata.MOQUEUENO; }
    if(hdata.MOTEAMTYPE == "I"){MOASSIGNEDTEAMID = hdata.MOASSIGNEDTEAMID}
    if(hdata.MOTEAMTYPE == "E"){MOASSIGNEDTEAMID = hdata.suplid}
    hdrDataarray.push(
      {
        ID: this.routeID,
        MONO: 0,
        MODATE: formatDate(hdata.MODATE, 'yyyy-MM-dd', 'en-US'),
        MOTIME: MOTIME,
        MTID: MTID,
        MOTEMPLATEID: "",
        MOPRIORITYID: "1",
        MOQUEUENO: MOQUEUENO,
        MOSTARTDATE: '',
        MOENDDATE: '',
        MOSTATUSID: "1",
        MACHINEDOWNTIMEHRS:'',
        MACHINEDOWNTIMEMINS: "",
        MOTOTLBR: "",
        MOTOPARTS: "",
        MOTOTOUTSIDELBR: "",
        MOTOTTIMETAKENHRS: "",
        MOTOTTIMETAKENMINS: "",
        MOROOTCAUSEID: "",
        MOREMARKS: "",
        MOTEAMTYPE: hdata.MOTEAMTYPE,
        MOASSIGNEDTEAMID: MOASSIGNEDTEAMID,
        CREATEDBY: this.globalVar.userid,
        CREATEDON: formatDate(this.mydate, 'yyyy-MM-dd ', 'en-US'),
        MODIFIEDBY: "",
        MODIFIEDON: "",
        MACHINEUPON:'',
        MACHINEUPAT:'',
        MOCLOSEDON:'',
        MOCLOSEDAT:'',
        MOCLOSEDBY:'',
        MOCOMPLETEDON:'',
        MOCOMPLETEDAT:'',
        MOTIMETAKENDAYS:'',
        MACHINEDOWNTIMEDAYS:'',
        HOURSSLOT:'',
      });

    // var dtlDataarray: Array<any> = [];
    // let moteamenddate;let mostarttime;let moteamendtime;

    // if (hdata.moteamenddate == undefined || hdata.moteamenddate == '' || hdata.moteamenddate == null) { hdata.moteamenddate = '' } else { hdata.moteamenddate = formatDate(hdata.moteamenddate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'); }
    // if (hdata.mostarttime == undefined || hdata.mostarttime == null || hdata.mostarttime == '00:00:00') { mostarttime = '00:00:00'; } else {  mostarttime= formatDate(hdata.mostarttime, 'hh:mm:ss', 'en-US') }
    // if (hdata.moteamendtime == undefined || hdata.moteamendtime == null || hdata.moteamendtime == '00:00:00') { moteamendtime = '00:00:00'; } else {  moteamendtime= formatDate(hdata.moteamendtime, 'hh:mm:ss', 'en-US') }

    // dtlDataarray.push(
    //   {
    //     id:"0",
    //     MOID:"0",
    //     MOTEAMTYPE:hdata.MOTEAMTYPE, 
    //     MOASSIGNEDTEAMID:hdata.MOASSIGNEDTEAMID,
    //     MOSTARTDATE:MOSTARTDATE,
    //     mostarttime:mostarttime,
    //     moteamenddate:moteamenddate,
    //     moteamendtime:moteamendtime,
    //     molbr:"",
    //     moparts:"",
    //     mooutsidelbr:"",
    //     moteamremarks:"",
    //   });

    // var moDataarray: Array<any> = [];
    // var i = 0; 
    // for (let mdata of this.moArray) {
    //   moDataarray.push({
    //     rowno:i+1,
    //     id:mdata.id,
    //     MOQUEUENO:mdata.MOQUEUENO
    //   });
    //   i++;
    // }

    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('statementtype', action)
      .set('UserId', this.globalVar.UserId)
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('headerarray', JSON.stringify(hdrDataarray))
    // .set('detailarray', JSON.stringify(dtlDataarray))
    // .set('moarray', JSON.stringify(moDataarray))

    this.http.post(this.original_url+"/Maintenance/Ticket/Savemaintenanceorder", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        // let temp;
        // temp=res;
        // MONO = temp[0].MONO;
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/maintenance-order']);
      });
  }
  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

}
