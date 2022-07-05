import { AddSingleColumnMasterComponent } from 'src/app/Modules/General/single-column-master/add-single-column-master/add-single-column-master.component';
import { environment } from './../../../../../environments/environment';
import { Global } from '../../../../Global';
import { ValidationComponent } from './../../../../validation/validation.component';
import { SuccessDialogComponent } from './../../../../Dialog/success-dialog/success-dialog.component';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Table } from 'primeng/table';
import { DieHistoryComponent } from './die-history/die-history.component';

@Component({
  selector: 'app-add-die-maint-checkpoints',
  templateUrl: './add-die-maint-checkpoints.component.html',
  styleUrls: ['./add-die-maint-checkpoints.component.css']
})
export class AddDieMaintCheckpointsComponent implements OnInit {
  @ViewChildren('oldcodefocus') vc;
  original_url = environment.baseUrl;
  newData: any = {};
  requisitionform: FormGroup;
  myDate = new Date(); 
  contact: Array<any> = [];
  contacts: Array<any> = [];
  isLoadingResults:boolean;
  id:any;
  toolTypeArray:Array<any> = [];
  toolNoArray:Array<any> = [];
  userArray:Array<any> = [];
  maintOfficerArray:Array<any> = [];
  storeInchargeArray:Array<any> = [];
  reasonArray:Array<any> = [];
  delayReason:Array<any> = [];
  action: any;
  receivedArray :Array<any> = [];
  allContacts:Array<any> = [];
  datePipe = new DatePipe("en-US");
  showReport=false

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.newData.DATE=this.myDate;
    this.newData.fromdate=globalVar.monthStartDate;
    this.newData.todate=this.myDate;
    this.createForm();
  //   this.contacts=[
  //   {id:1,name:"Main Pillar / Bush",Remarks:"" ,togglereqd:true,STATUS:true},
  //   {id:2,name:"Semi Pillar / Bush",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:3,name:"Centre Location / Pin",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:4,name:"Grinding Sleeves",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:5,name:"Alignment",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:6,name:"Bolts",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:7,name:"Top Plate",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:8,name:"Bottom Plate",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:9,name:"Dowelling",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:10,name:"Die Thickness",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:11,name:"Approx. Tool Life",Remarks:"",togglereqd:true,STATUS:true},
  //   {id:12,name:"RT Size",Remarks:"",togglereqd:false,STATUS:true},
  //   {id:13,name:"RT ID Bore Size",Remarks:"",togglereqd:false,STATUS:true},
  // ]

  // this.toolTypeArray=[
  //   {id:1,name:"Blank"},
  //   {id:2,name:"Stator"},
  //   {id:3,name:"CRotor"}
  // ]
  // this.toolNoArray=[
  //   {id:1,name:"061105"},
  //   {id:2,name:"061106"},
  //   {id:3,name:"061107"},
  //   {id:4,name:"061108"},
  //   {id:5,name:"061109"}
  // ]

  // this.userArray=[
  //   {id:1,name:"Manpreet Singh"},
  //   {id:2,name:"Navneet Kumar"},
  //   {id:3,name:"User 1"},
  //   {id:4,name:"User 2"},
  //   {id:5,name:"User 3"}
  // ]

  // this.maintOfficerArray=[
  //   {id:1,name:"Maint Officer 1"},
  //   {id:2,name:"Maint Officer 2"},
  //   {id:3,name:"Maint Officer 3"},
  //   {id:4,name:"Maint Officer 4"},
  //   {id:5,name:"Maint Officer 5"}
  // ]

  // this.storeInchargeArray=[
  //   {id:1,name:"Store Incharge 1"},
  //   {id:2,name:"Store Incharge 2"},
  //   {id:3,name:"Store Incharge 3"},
  //   {id:4,name:"Store Incharge 4"},
  //   {id:5,name:"Store Incharge 5"}
  // ]

  // this.reasonArray=[
  //   {id:1,name:"Reason 1"},
  //   {id:2,name:"Reason 2"},
  //   {id:3,name:"Reason 3"},
  //   {id:4,name:"Reason 4"},
  //   {id:5,name:"Reason 5"}
  // ]

  // this.delayReason=[
  //   {id:1,name:"Maint Officer Not Available"},
  //   {id:2,name:"Power Failure"},
  //   {id:3,name:"ROther Reason"},
  //   {id:4,name:"Delay Reason 4"},
  //   {id:5,name:"Delay Reason 5"}
  // ]
  this.contacts.forEach(element => {
  this.statusChange(element.STATUS,element);
  });
  // this.newData.srno="8";
   }

  ngOnInit() {
    if (this.action == 'new') {
      this.isLoadingResults=true;
      this.http.get(this.original_url + "/Maintenance/DieMaint/getcommonapidiemaint?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid)
        .subscribe((res) => {
          let allDataGet: any;
          let idGet: any;
          allDataGet = res;
          this.toolTypeArray = allDataGet.Table1;
          this.toolNoArray = allDataGet.Table7;
          this.receivedArray = allDataGet.Table;
          this.reasonArray = allDataGet.Table6;
          this.delayReason = allDataGet.Table8;
          this.maintOfficerArray = allDataGet.Table11;
          this.storeInchargeArray = allDataGet.Table11;
          this.newData.SRNO = allDataGet.Table9[0].SRNO;
          this.allContacts= allDataGet.Table10;
          this.isLoadingResults=false;
        },error => {
          this.isLoadingResults = false;
        });
    }
    else if (this.action == 'edit') {
      this.isLoadingResults=true;
      this.http.get(this.original_url + "/Maintenance/DieMaint/getdiemaintdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&id="+this.id)
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet = res;
          let tempContacts:Array<any>=[]
          this.toolTypeArray = allDataGet.Table3;
          this.toolNoArray = allDataGet.Table9;
          this.receivedArray = allDataGet.Table2;
          this.reasonArray = allDataGet.Table8;
          this.delayReason = allDataGet.Table10;
          this.maintOfficerArray = allDataGet.Table12;
          this.storeInchargeArray = allDataGet.Table12;
          this.allContacts=allDataGet.Table11;
          this.newData = allDataGet.Table[0];
          this.newData.fromdate=this.globalVar.monthStartDate;
          this.newData.todate=this.myDate;
          this.showReport=true;
          tempContacts=allDataGet.Table1
          this.isLoadingResults = false;
          // this.contacts.forEach(element => {
            tempContacts.forEach(i => {
            // if(element.id == i.CHECKPOINTID){
              if(i.CHECKPOINTVALE == "false"){
              i.CHECKPOINTVALE=false;
            }
            if(i.CHECKPOINTVALE == "true"){
            i.CHECKPOINTVALE=true;
          }
          if(i.STATUS == "false"){
            i.STATUS=false;
          }
          if(i.STATUS == "true"){
          i.STATUS=true;
        }
              // i.STVALUE=i.STVALUE;
              // i.OBSVALUE=i.OBSVALUE;
              // element.STATUS=i.STATUS;
              // i.REMARKS=i.REMARKS;
              this.statusChange(i.STATUS,i);
              console.log("contact",i)
            // }
              });
              this.contacts=tempContacts
            // });

        });
    }
  }

  createForm() {
    this.requisitionform = this.fb.group({
      deptid: ['', Validators.required],
      costcentreid: ['', Validators.required],
      reqndate: '',
      batchmfgdate: '',
      batchexpirydate: '',
      storeid: ['', Validators.required],
      manualslipno: '',
      batchno: '',
      uom: '',
      productid: '',
      bomid: '',
      lotsize: '',
    });
  }

  statusChange(STATUS, row) {
    console.log("event,value", STATUS)
    if (STATUS == true) {
      row.statusName = 'Ok';
    } if (STATUS == false) {
      row.statusName = 'Not Ok';
    }

  }

  dieChange(event,rowDetail){
    console.log("event,rowDetail",event,rowDetail)
    if(event !=null && event !=undefined && event !=''){
      this.showReport=true;
     let tooltypeid = this.toolNoArray.find(x => x.DIEID == event).DIETYPEID;
     let PLANNEDSTROKES = this.toolNoArray.find(x => x.DIEID == event).PLANNEDSTROKES;
     let STROKESMADE = this.toolNoArray.find(x => x.DIEID == event).STROKESMADE;
     let AVAILABLESTROKES = this.toolNoArray.find(x => x.DIEID == event).AVAILABLESTROKES;

     this.newData.PLANNEDSTROKES=PLANNEDSTROKES
     this.newData.DIETYPEID=tooltypeid
     this.newData.STROKESMADE=STROKESMADE
     this.newData.AVAILABLESTROKES=AVAILABLESTROKES
     this.changeDieType(tooltypeid)
     
    }else{
      this.showReport=false;
      this.newData.DIETYPEID='';
      this.newData.PLANNEDSTROKES='';
      this.newData.STROKESMADE='';
      this.newData.AVAILABLESTROKES='';
    }
  }
  
  changeDieType(id){
    if(id == null || id == undefined || id == '' ){
      this.contacts=[];
    }else{
      this.contacts = this.allContacts.filter(x => x.DOCCATGID == id);
      this.http.get(this.original_url + "/Maintenance/DieMaint/getstdvaluefortool?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&toolid="+this.newData.DIEID)
        .subscribe((res) => {
          let allDataGet: any;let array:Array<any> = [];
          allDataGet = res;
          array=allDataGet.Table
          array.forEach(element => {
          this.contacts.forEach(el => {
            if(element.CHECKPOINTID == el.CHECKPOINTID)
            {
              el.STVALUE=element.STVALUE
            }
            });
          });
    })
  }
  }

  report(data){
    let fromdate= this.datePipe.transform(this.newData.fromdate, 'dd/MMM/yyyy') ;
    let todate= this.datePipe.transform(this.newData.todate, 'dd/MMM/yyyy') ;
    const dialogRef = this.dialog.open(DieHistoryComponent, {
      width:'904px',
      data:{
        fromdate:fromdate,
        todate:todate,
        dieid:this.newData.DIEID}
    });
  }

  delayresonPopup(data){
    const dialogRef = this.dialog.open(AddSingleColumnMasterComponent, {
      width:'700px',
      data  : {
        data: 0,
        menutype: 'delayreason',
        action: 'new',
        userRightCheck: ''
      }
     });
 
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults=true
      this.http.get(this.original_url + "/Masters/CommonMaster/GetsinglecolumnmastersList?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&type=delayreason")
      .subscribe((res) => {
        let allDataGet: any;
        allDataGet = res;
        this.delayReason = allDataGet.Table;
        this.isLoadingResults=false
      })
    });
  }
  resonPopup(data){
    const dialogRef = this.dialog.open(AddSingleColumnMasterComponent, {
      width:'700px',
      data  : {
        data: 0,
        menutype: 'reason',
        action: 'new',
        userRightCheck: ''
      }
     });
 
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults=true
      this.http.get(this.original_url + "/Masters/CommonMaster/GetsinglecolumnmastersList?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&type=reason")
      .subscribe((res) => {
        let allDataGet: any;
        allDataGet = res;
        this.reasonArray = allDataGet.Table;
        this.isLoadingResults=false
      })
    });
  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    if (this.newData.DIETYPEID == undefined || this.newData.DIETYPEID == '' || this.newData.DIETYPEID == null) { flag = false; msg = msg + "* Please select Tool Type<br/>" }
    if (this.newData.DIEID == undefined || this.newData.DIEID == '' || this.newData.DIEID == null) { flag = false; msg = msg + "* Please select Tool Number<br/>" }
    if (this.newData.EDATE == undefined || this.newData.EDATE == '' || this.newData.EDATE == null) { flag = false; msg = msg + "* Please Enter Date<br/>" }
    // if (this.newData.RECEIVEDFROMID == undefined || this.newData.RECEIVEDFROMID == '' || this.newData.RECEIVEDFROMID == null) { flag = false; msg = msg + "* Please select Received From <br/>" }
    if (this.newData.SENDFORMAINTENANCEDT == undefined || this.newData.SENDFORMAINTENANCEDT == '' || this.newData.SENDFORMAINTENANCEDT == null) { flag = false; msg = msg + "* Please Enter Received on Date<br/>" }
    if (this.newData.STROCKESAVAILABLE == undefined || this.newData.STROCKESAVAILABLE == '' || this.newData.STROCKESAVAILABLE == null) { flag = false; msg = msg + "* Please Enter Grindings In one Day<br/>" }
    if (this.newData.REASONID == undefined || this.newData.REASONID == '' || this.newData.REASONID == null) { flag = false; msg = msg + "* Please Select Reason For Grinding<br/>" }
    if (this.newData.MAINTDONEID == undefined || this.newData.MAINTDONEID == '' || this.newData.MAINTDONEID == null) { flag = false; msg = msg + "* Please Select Maint. Done By<br/>" }
    if (this.newData.INCHARGEID == undefined || this.newData.INCHARGEID == '' || this.newData.INCHARGEID == null) { flag = false; msg = msg + "* Please select Incharge Tool Room<br/>" }
 

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
      this.savemachine(hdata, action);
    }
  }
  savemachine(data, action) {
    console.log("data",data)
    this.isLoadingResults = true;
    // machinedetail array
    let newArray: Array<any> = [];
    let assetdetail: Array<any> = [];
    let id, DIEID, DIETYPEID, SENDFORMAINTENANCEDT, RECDTIME, MAINTENANCECOMPLETEDT, REMARKS, SENDTIME, UnderWty, Wtyupto, UnderAMC, AMCFrom,
      AMCUpto, LastMaint, LMAfterOps, LastBDownMaint, BMAfterOps, NextMaint, NMAfterOps, SplTools, SplTeam,splremarks,
      EmergencyContactNo, ProjLifeYY, ProjLifeMM, ProjLifeOps, ActualLifeYY, ActualLifeMM, ActualLifeOps, MCModel, createdon, createdby, modifiedon, modifiedby,
      procuredon, installedon, operationalon, currentloc,MAINTDONEID,DELAYREASONID,REASONID,STROCKESAVAILABLE,EXPTTIME,RECEIVEDFROMID,LASTUSEDDATE,TOOLSECTIONID, 
      calibrationdueon, calibrationAfterOps,REMARK,INCHARGEID,STVALUE,BOMEXISTS, OBSVALUE1 ,OBSVALUE2,OBSVALUE3,OBSVALUE,STATUS,CHECKPOINTID,CHECKPOINTVALE,REMARKS1,AUTHORISEDBY,MAINTENACEDETAIL;


    // if (action == 'insert') {
    //   data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    // } else if (actions == 'Update') {
    //   data.createdon = data.createdon;
    // }
    // if (action == 'insert') {
    //   data.createdby = this.globalVar.userid;
    // } else if (actions == 'Update') {
    //   data.createdby = data.createdby;
    // }
    // if (actions == 'insert') {
    //   data.modifiedon = "";
    // } else if (actions == 'Update') {
    //   data.modifiedon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    // }
    // if (actions == 'insert') {
    //   data.modifiedby = "";
    // } else if (actions == 'Update') {
    //   data.modifiedby = this.globalVar.userid;
    // }
    // createdby = data.createdby
    // modifiedby = data.modifiedby
    // modifiedon = data.modifiedon
    // if (data.createdon == undefined || data.createdon == null || data.createdon == '') { createdon = ""; } else { createdon = data.createdon }
    DIEID=this.globalVar.checknull(data.DIEID,"number")
    DIETYPEID=this.globalVar.checknull(data.DIETYPEID,"number")
    TOOLSECTIONID=this.globalVar.checknull(data.TOOLSECTIONID,"number")
    RECEIVEDFROMID=this.globalVar.checknull(data.RECEIVEDFROMID,"number")
    STROCKESAVAILABLE=this.globalVar.checknull(data.STROCKESAVAILABLE,"number")
    REASONID=this.globalVar.checknull(data.REASONID,"number")
    DELAYREASONID=this.globalVar.checknull(data.DELAYREASONID,"number")
    MAINTDONEID=this.globalVar.checknull(data.MAINTDONEID,"number")
    INCHARGEID=this.globalVar.checknull(data.INCHARGEID,"number")
    AUTHORISEDBY=this.globalVar.checknull(data.AUTHORISEDBY,"number")
    SENDFORMAINTENANCEDT=this.globalVar.checknull(data.SENDFORMAINTENANCEDT,"Date")
    LASTUSEDDATE=this.globalVar.checknull(data.LASTUSEDDATE,"Date")
    RECDTIME	=this.globalVar.checknull(data.RECDTIME	,"DateTime")
    EXPTTIME	=this.globalVar.checknull(data.EXPTTIME	,"DateTime")
    SENDTIME	=this.globalVar.checknull(data.SENDTIME	,"DateTime")
    // RECDTIME	=this.globalVar.checknull(data.RECDTIME	,"DateTime")
    REMARKS	=this.globalVar.checknull(data.REMARKS,"string")
    MAINTENACEDETAIL=this.globalVar.checknull(data.MAINTENACEDETAIL,"string")
    // SENDFORMAINTENANCEDT=this.globalVar.checknull(data.SENDFORMAINTENANCEDT,"Date")
   // data.SENDFORMAINTENANCEDT = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    MAINTENANCECOMPLETEDT =this.globalVar.checknull(data.MAINTENANCECOMPLETEDT,"Date")
    // data.SENDFORMAINTENANCEDT = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');

    // if (data.MaintBy == 'false') { MaintBy = "0"; } else { MaintBy = "1" }
    // if (data.MainSupplierId == undefined || data.MainSupplierId == null || data.MainSupplierId == '' || data.MaintBy == "false") { MainSupplierId = "0"; } else { MainSupplierId = data.MainSupplierId }
    // if (data.UnderWty == '1') { UnderWty = "1"; } else { UnderWty = "0" }
    // if (data.Wtyupto == undefined || data.Wtyupto == null || data.Wtyupto == '') { Wtyupto = ""; } else { Wtyupto = formatDate(data.Wtyupto, 'yyyy-MM-dd', 'en-US') }
    // if (data.UnderAMC == '1') { UnderAMC = "1"; } else { UnderAMC = "0" }
   

    newArray.push(
      {
        COMPANYID	: this.globalVar.CommpanyId,
        BRANCHID	: this.globalVar.BranchId,
        MAINTENANCEID	: this.id,
        DIEID: DIEID,
        DIETYPEID	: DIETYPEID,
        TOOLSECTIONID	: TOOLSECTIONID	,
        SENDFORMAINTENANCEDT: SENDFORMAINTENANCEDT	,
        RECEIVEDFROMID:RECEIVEDFROMID,
        LASTUSEDDATE	: LASTUSEDDATE,       
        RECDTIME:RECDTIME,
        EXPTTIME:EXPTTIME,
        MAINTENANCECOMPLETEDT	: MAINTENANCECOMPLETEDT	,
        SENDTIME	:SENDTIME	,
        STROCKESAVAILABLE	:STROCKESAVAILABLE ,
        REASONID:REASONID,
        DELAYREASONID:DELAYREASONID,
        MAINTDONEID:MAINTDONEID,
        INCHARGEID:INCHARGEID,
        REMARKS	: REMARKS	,
        AUTHORISEDBY:AUTHORISEDBY,
        LASTUSEDONPRESSID	: 0,
        LASTOPERATORID	:0,
        MATERIALUSED	:0,
        PROCESSUSED	: 0,
        MECHANICNAME	: 0,
        MAINTENANCESOURCE	: 0,
        STROCKESMODE	: 0,
        MAINTENACEDETAIL	: MAINTENACEDETAIL,
        // BMAfterOps: BMAfterOps,
        // NextMaint: NextMaint,
        // NMAfterOps: NMAfterOps,
        // calibrationdueon: calibrationdueon,
        // calibrationAfterOps: calibrationAfterOps,
        // SplTools: SplTools,
        // SplTeam: SplTeam,
        // ProjLifeYY: ProjLifeYY,
        // ProjLifeMM: ProjLifeMM,
        // ProjLifeOps: ProjLifeOps,
        // ActualLifeYY: ActualLifeYY,
        // ActualLifeMM: ActualLifeMM,
        // ActualLifeOps: ActualLifeOps,
        // coid: this.globalVar.CommpanyId,
        // boid: this.globalVar.BranchId,
        // createdby: createdby,
        // createdon: createdon,
        // modifiedby: modifiedby,
        // modifiedon: modifiedon,
      });
    // fixed asset detail array
    var dtlarray: Array<any> = [];
    let i = 0;
    for (let mdata of this.contacts) {

      var row = mdata.dtlarray;
      // if (row != undefined) {
      //   for (var data1 of row) {
      //     dtlarray.push(data1);
      //   }
      // }
      STVALUE=this.globalVar.checknull(mdata.STVALUE,"number")
      OBSVALUE=this.globalVar.checknull(mdata.OBSVALUE,"number")
      OBSVALUE1=this.globalVar.checknull(mdata.OBSVALUE1,"number")
      OBSVALUE2=this.globalVar.checknull(mdata.OBSVALUE2,"number")
      OBSVALUE3=this.globalVar.checknull(mdata.OBSVALUE3,"number")
      REMARKS1	=this.globalVar.checknull(mdata.REMARKS,"string")
      // if (mdata.CHECKPOINTID == undefined || mdata.CHECKPOINTID == null || mdata.CHECKPOINTID == '' || mdata.CHECKPOINTID == "false" || mdata.CHECKPOINTID == '0') { mdata.CHECKPOINTID = "false"; } else { mdata.CHECKPOINTID = mdata.CHECKPOINTVALE }
      if (mdata.CHECKPOINTVALE == undefined || mdata.CHECKPOINTVALE == null || mdata.CHECKPOINTVALE == '' || mdata.CHECKPOINTVALE == "false" || mdata.CHECKPOINTVALE == '0') { CHECKPOINTVALE = false; } else {CHECKPOINTVALE = true }
      if (mdata.STATUS == undefined || mdata.STATUS == null || mdata.STATUS == '' || mdata.STATUS == "false" || mdata.STATUS == '0') { STATUS = false; } else { STATUS = true }
  
      // if (mdata.currentloc == undefined || mdata.currentloc == null || mdata.currentloc == '') { currentloc = ""; } else { currentloc = mdata.currentloc }
      // if (mdata.procuredon == undefined || mdata.procuredon == null || mdata.procuredon == '') { procuredon = ""; } else { procuredon = formatDate(mdata.procuredon, 'yyyy-MM-dd', 'en-US') }
      // if (mdata.installedon == undefined || mdata.installedon == null || mdata.installedon == '') { installedon = ""; } else { installedon = formatDate(mdata.installedon, 'yyyy-MM-dd', 'en-US') }
      // if (mdata.operationalon == undefined || mdata.operationalon == null || mdata.operationalon == '') { operationalon = ""; } else { operationalon = formatDate(mdata.operationalon, 'yyyy-MM-dd', 'en-US') }

      dtlarray.push({
        ID: '0',
        MAINTENANCEID	: this.id,
        BRANCHID	: this.globalVar.BranchId,
        STVALUE:STVALUE,
        STATUS: STATUS,
        OBSVALUE : OBSVALUE,
        OBSVALUE1 : OBSVALUE1,
        OBSVALUE2 : OBSVALUE2,
        OBSVALUE3 : OBSVALUE3,
        REMARKS:REMARKS1,
        CHECKPOINTID:mdata.CHECKPOINTID,
        CHECKPOINTVALE:CHECKPOINTVALE,

      });
      i++;
    }

    const params = new HttpParams()
      .set('statementtype', action)
      .set('UserId', this.globalVar.UserId)
      .set('id', this.id)
      .set('hdrarray', JSON.stringify(newArray))
      .set('dtlarray', JSON.stringify(dtlarray));
    this.http.post(this.original_url + "/Maintenance/DieMaint/Savediemaint", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/die-maint-checkpoints']);
      },error => {
        this.isLoadingResults = false;
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
