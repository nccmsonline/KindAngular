import { PasswordPopupComponent } from './password-popup/password-popup.component';
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
import { formatDate } from '@angular/common';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-add-die-master',
  templateUrl: './add-die-master.component.html',
  styleUrls: ['./add-die-master.component.css']
})
export class AddDieMasterComponent implements OnInit {
  @ViewChildren('oldcodefocus') vc;
  original_url = environment.baseUrl;
  newData: any = {};
  requisitionform: FormGroup;
  myDate = new Date();
  contacts: Array<any> = [];
  contact: any = {};
  isLoadingResults :boolean;
  id: any;
  toolTypeArray: Array<any> = [];
  toolNoArray: Array<any> = [];
  userArray: Array<any> = [];
  maintOfficerArray: Array<any> = [];
  ToolSectionArray: Array<any> = [];
  yesornoArray: Array<any> = [];
  reasonArray: Array<any> = [];
  delayReason: Array<any> = [];
  action: any;
  arrayItemCustomer: any = '';
  isLoading = false;
  allDataGet: any;
  photosBuffer: Array<any> = [];
  PoleArray: Array<any> = [];
  MachineArray: Array<any> = [];
  StatusArray: Array<any> = [];
  FrameArray: Array<any> = [];
  DieTypeArray: Array<any> = [];
  EfficiencyArray: Array<any> = [];
  LastOperationArray: Array<any> = [];
  framenoArray: Array<any> = [];
  ColourArray: Array<any> = [];
  ProcessArray: Array<any> = [];
  userRightCheck: any = {};
  dimentionDataGet: Array<any> = [];


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

    this.createForm();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');




    // this.contacts = [
    //   { id: 1, name: "Main Pillar / Bush", Remarks: "", togglereqd: true, status: true },
    //   { id: 2, name: "Semi Pillar / Bush", Remarks: "", togglereqd: true, status: true },
    //   { id: 3, name: "Centre Locatio / Pin", Remarks: "", togglereqd: true, status: true },
    //   { id: 4, name: "Grinding Sleeves", Remarks: "", togglereqd: true, status: true },
    //   { id: 5, name: "Alignment Bolts", Remarks: "", togglereqd: true, status: false },
    //   { id: 6, name: "Top / Bottom Plate", Remarks: "", togglereqd: true, status: true },
    //   { id: 7, name: "Dwelling", Remarks: "", togglereqd: true, status: true },
    //   { id: 7, name: "Approx. Tool Life", Remarks: "", togglereqd: true, status: true },
    //   { id: 8, name: "RT Size", Remarks: "", togglereqd: false, status: true },
    //   { id: 9, name: "RT ID Bore Size", Remarks: "", togglereqd: false, status: true },
    // ]

    // this.toolTypeArray = [
    //   { id: 1, name: "Blanking" },
    //   { id: 2, name: "Stator" },
    //   { id: 3, name: "Rotor" }
    // ]
    // this.toolNoArray = [
    //   { id: 1, name: "061105" },
    //   { id: 2, name: "061106" },
    //   { id: 3, name: "061107" },
    //   { id: 4, name: "061108" },
    //   { id: 5, name: "061109" }
    // ]

    // this.userArray = [
    //   { id: 1, name: "Manpreet Singh" },
    //   { id: 2, name: "Navneet Kumar" },
    //   { id: 3, name: "User 1" },
    //   { id: 4, name: "User 2" },
    //   { id: 5, name: "User 3" }
    // ]

    // this.maintOfficerArray = [
    //   { id: 1, name: "Progressive" },
    //   { id: 2, name: "Gang or Compoubd" }
    // ]

    this.yesornoArray = [
      { id: 1, name: "Yes" },
      { id: 2, name: "No" }
    ]


    // this.reasonArray = [
    //   { id: 2, name: "2" },
    //   { id: 3, name: "4" },
    //   { id: 4, name: "6" },
    //   { id: 5, name: "8" }
    // ]

    // this.delayReason = [
    //   { id: 1, name: "160" },
    //   { id: 2, name: "100" },
    //   { id: 3, name: "90" },
    // ]
  //   this.contacts.forEach(element => {
  //     this.statusChange(element.status, element);
  //   });
  //   this.newData.srno = "8";
  }

  ngOnInit() {
   
      if (this.action == 'new') {
        this.isLoadingResults=true;
        this.http.get(this.original_url + "/Maintenance/DieMaint/getcommonapidie?coid=" + this.globalVar.CommpanyId + "&boid=2&fyid=" + this.globalVar.fyid)
          .subscribe((res) => {
            let allDataGet: any;
            let idGet: any;
            allDataGet = res;
            this.FrameArray = allDataGet.Table2;
            this.framenoArray= allDataGet.Table2;
            this.DieTypeArray = allDataGet.Table1;
            this.MachineArray = allDataGet.Table3;
            this.PoleArray = allDataGet.Table4;
            this.ToolSectionArray = allDataGet.Table5;
            this.StatusArray = allDataGet.Table6;
            this.EfficiencyArray = allDataGet.Table11;
            this.LastOperationArray = allDataGet.Table10;
            this.ColourArray = allDataGet.Table12;
            this.ProcessArray = allDataGet.Table7;
            idGet = allDataGet.Table;
            idGet = idGet[0];
            this.isLoadingResults=false;
            // for (let tables of allDataGet) {
            //   console.log("1", tables)
          
              
              // for (let item of this.DieTypeArray) {
              //   debugger
              //   for (let i in item) {
                  // if (typeof (item[i]) === 'object') {
                    // console.log("runseprate", i)
                    // var a;
                    // i=i.toLowerCase(); 
                    // item.map(f=>{ return f.toUpperCase(); });
                    // item=a
                  // }
                // }
              //   console.log("item",item)
              // }
            // }
            // console.log("table last",this.DieTypeArray)

            
          },error => {
            this.isLoadingResults = false;
          }
    );
      }
      else if (this.action == 'edit') {
        this.isLoadingResults=true;
        this.http.get(this.original_url + "/Maintenance/DieMaint/getdiemasterdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&id="+this.id)
          .subscribe((res) => {
            let allDataGet: any;
            allDataGet = res;
            this.DieTypeArray = allDataGet.Table2;
            this.FrameArray = allDataGet.Table3; 
            this.framenoArray= allDataGet.Table3;
            this.MachineArray = allDataGet.Table4;
            this.PoleArray = allDataGet.Table5;
            this.ToolSectionArray = allDataGet.Table6;
            this.ProcessArray = allDataGet.Table8;
            this.LastOperationArray = allDataGet.Table10;
            this.EfficiencyArray = allDataGet.Table11;
            this.ColourArray = allDataGet.Table12;
            this.StatusArray = allDataGet.Table7;
            this.dimentionDataGet= allDataGet.Table13;

            if(this.dimentionDataGet.length > 0){
              this.contact=this.dimentionDataGet[0];
            if(this.contact.BLK =="Y"){this.contact.BLK =true}else{this.contact.BLK =false}
            if(this.contact.STGS =="Y"){this.contact.STGS =true}else{this.contact.STGS =false}
            if(this.contact.RTGS =="Y"){this.contact.RTGS =true}else{this.contact.RTGS =false}
            if(this.contact.STNT =="Y"){this.contact.STNT =true}else{this.contact.STNT =false}
            if(this.contact.RTNT =="Y"){this.contact.RTNT =true}else{this.contact.RTNT =false}
            if(this.contact.RDC =="Y"){this.contact.RDC =true}else{this.contact.RDC =false}
            if(this.contact.CLOAD =="Y"){this.contact.CLOAD =true}else{this.contact.CLOAD =false}
            if(this.contact.PROAGTOOL =="Y"){this.contact.PROAGTOOL =true}else{this.contact.PROAGTOOL =false}
            }
            
            this.newData = allDataGet.Table[0];
            if (this.newData.BOMEXISTS == 'Y') {this.newData.BOMEXISTS = true} else { this.newData.BOMEXISTS = false }
            if (this.newData.ISCOLORED == 'Y') {this.newData.ISCOLORED = true} else { this.newData.ISCOLORED = false }
            
            if (this.newData.DOUBLEPUNCH == 'Y') {this.newData.DOUBLEPUNCH = true} else { this.newData.DOUBLEPUNCH = false }
           if(this.newData.PROCESSUSED !=null && this.newData.PROCESSUSED !=undefined && this.newData.PROCESSUSED !=''){
            let newprocess=this.newData.PROCESSUSED.replace(/"/g,"");
            this.newData.PROCESSUSED = newprocess;
           }
            this.newData.DIENAME=this.newData.DIENAME
            this.isLoadingResults=false;
          },error => {
            this.isLoadingResults = false;
          }
    );
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

  statusChange(status, row) {
    console.log("event,value", status)
    if (status == true) {
      row.statusName = 'Ok';
    } if (status == false) {
      row.statusName = 'Not Ok';
    }

  }

  dropdownHide(){
    this.arrayItemCustomer = '';
  }

  validateEdit(hdata, action){
    const dialogRef = this.dialog.open(PasswordPopupComponent, {
      width: '400px',
      data  : {
            action: 'new'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result)
        {
          let password= result.password
          if(password == 'Kind@123'){
            this.validateBeforeSave(hdata, action)
          }else{
            const dialogRef = this.dialog.open(ValidationComponent, {
              data: {
                msg: "Please enter a valid Password",
                action: ''
              }
            });
      
            dialogRef.afterClosed().subscribe(result => {
      
            });
          }
        }
      });
  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    if (this.newData.PARTYID == undefined || this.newData.PARTYID == '' || this.newData.PARTYID == null) { flag = false; msg = msg + "* Please Select Party Name<br/>" }
    if (this.newData.CUSTOMERINITIAL == undefined || this.newData.CUSTOMERINITIAL == '' || this.newData.CUSTOMERINITIAL == null) { flag = false; msg = msg + "* Please Enter Customer Initial<br/>" }
    else if(this.newData.CUSTOMERINITIAL.length<3){ flag = false; msg = msg + "* Please Enter Valid Customer Initial Name<br/>" }
    if (this.newData.SERIES == undefined || this.newData.SERIES == '' || this.newData.SERIES == null) { flag = false; msg = msg + "* Please Enter Catg/Series<br/>" }
    else if(this.newData.SERIES.length<4){ flag = false; msg = msg + "* Please Enter Valid Series Name<br/>" }
    if (this.newData.FRAMEID == undefined || this.newData.FRAMEID == '' || this.newData.FRAMEID == null) { flag = false; msg = msg + "* Please Select Frame<br/>" }
    if (this.newData.POLEID == undefined || this.newData.POLEID == '' || this.newData.POLEID == null) { flag = false; msg = msg + "* Please Select Polarity<br/>" }
    if (this.newData.EFFICIENCYID == undefined || this.newData.EFFICIENCYID == '' || this.newData.EFFICIENCYID == null) { flag = false; msg = msg + "* Please Select Efficiency Grade<br/>" }
    if (this.newData.PROCESSUSED == undefined || this.newData.PROCESSUSED == '' || this.newData.PROCESSUSED == null) { flag = false; msg = msg + "* Please Select Process<br/>" }
    // if (this.newData.MACHINEID == undefined || this.newData.MACHINEID == '' || this.newData.MACHINEID == null) { flag = false; msg = msg + "* Please Select Machine Involved<br/>" }
    if (this.newData.REMARKS == undefined || this.newData.REMARKS == '' || this.newData.REMARKS == null) { flag = false; msg = msg + "* Please Enter description<br/>" }
    // if( (this.newData.ISCOLORED == true )&&( this.newData.COLORID == '' || this.newData.COLORID == null)) { flag = false; msg = msg + "* Please Select Colour<br/>" }
    if( (this.newData.DOUBLEPUNCH == true )&&( this.newData.NOOFSTROKES == '' || this.newData.NOOFSTROKES == null)) { flag = false; msg = msg + "* Please Enter No of Strokes<br/>" }
    // if( (this.contact.DRGNO == undefined )&&( this.contact.DRGNO == '' || this.contact.DRGNO == null)) { flag = false; msg = msg + "* Please Enter Drawing No<br/>" }
    // if( (this.contact.FRAME == undefined )&&( this.contact.FRAME == '' || this.contact.FRAME == null)) { flag = false; msg = msg + "* Please Select Frame No<br/>" }



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
  savemachine(data, actions) {

    this.isLoadingResults = true;
    // machinedetail array
    let newArray: Array<any> = [];
    let assetdetail: Array<any> = [];
    let id, DIEID, DIETYPEID, SENDFORMAINTENANCEDT, RECDTIME, MAINTENANCECOMPLETEDT, REMARKS, PARTYID, SENDTIME, PIECENO, UnderWty, Wtyupto, UnderAMC, AMCFrom,
      AMCUpto, LastMaint, LMAfterOps, LastBDownMaint, BMAfterOps, NextMaint, NMAfterOps, SplTools, SplTeam, splremarks,
      EmergencyContactNo, ProjLifeYY, ProjLifeMM, ProjLifeOps, ActualLifeYY, ActualLifeMM, ActualLifeOps, MCModel, createdon, createdby, modifiedon, modifiedby,
      procuredon, installedon, operationalon, currentloc, calibrationdueon, calibrationAfterOps, TOTALPIECES, MFGDATE, ISCOLORED, COLORID, MATERIALUSED, SUPPLIERID, PROCESSUSED, VENDORID, PLANNEDSTROKES, STROKESMADE, AVAILABLESTROKES, LASTUSEDDATE, LASTUSEDONPRESSID, LASTOPERATORID, SCRAPPEDDATE,
      SCRAPPEDBYOPERATORID, SCRAPREASONID, SCRAPVALUEREALISED, WASTAGE, NOOFSTROKES, MACHINEID, BOMEXISTS, EFFICIENCYID, STATUSID, SERIES, INHOUSEVENDORED, CUSTOMERINITIAL, USERID, EDATE, MDATE, DIENAME, TOOLSECTIONID, DIEQTY, DOUBLEPUNCH, FRAMEID, POLEID, DRAWINGNO, DIECODE, ELESTANDARDID, RTRDRAWINGNO, PARTYREFRENCENO, STRNOOFSLOTS, RTRNOOFSLOTS
      ,DRGNO,FRAME,STOD	,STID,BORE,STSLOT,RTSLOT, BLK,STGS,RTGS,STNT,RTNT,RDC,CLOAD,PROAGTOOL;


    // if (actions == 'insert') {
    //   data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    // } else if (actions == 'Update') {
    //   data.createdon = data.createdon;
    // }
    // if (actions == 'insert') {
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
    // // modifiedon = data.modifiedon
    // if (data.createdon == undefined || data.createdon == null || data.createdon == '') { createdon = ""; } else { createdon = data.createdon }
    DIEID = this.globalVar.checknull(data.DIEID, "number")
    DIETYPEID = this.globalVar.checknull(data.DIETYPEID, "number")
    TOTALPIECES = this.globalVar.checknull(data.TOTALPIECES, "number")
    COLORID = this.globalVar.checknull(data.COLORID, "number")
    PLANNEDSTROKES = this.globalVar.checknull(data.PLANNEDSTROKES, "number")
    DIETYPEID = this.globalVar.checknull(data.DIETYPEID, "number")
    PIECENO = this.globalVar.checknull(data.PIECENO, "number")
    STROKESMADE = this.globalVar.checknull(data.STROKESMADE, "number")
    AVAILABLESTROKES = this.globalVar.checknull(data.AVAILABLESTROKES, "number")
    LASTUSEDONPRESSID = this.globalVar.checknull(data.LASTUSEDONPRESSID, "number")
    LASTOPERATORID = this.globalVar.checknull(data.LASTOPERATORID, "number")
    INHOUSEVENDORED = this.globalVar.checknull(data.INHOUSEVENDORED, "number")
    TOOLSECTIONID = this.globalVar.checknull(data.TOOLSECTIONID, "number")
    DOUBLEPUNCH = this.globalVar.checknull(data.DOUBLEPUNCH, "number")
    FRAMEID = this.globalVar.checknull(data.FRAMEID, "number")
    MACHINEID = this.globalVar.checknull(data.MACHINEID, "number")
    NOOFSTROKES = this.globalVar.checknull(data.NOOFSTROKES, "number")
    WASTAGE = this.globalVar.checknull(data.WASTAGE, "number")
    POLEID = this.globalVar.checknull(data.POLEID, "number")
    DRAWINGNO = this.globalVar.checknull(data.DRAWINGNO, "number")
    RECDTIME = this.globalVar.checknull(data.RECDTIME, "DateTime")
    MFGDATE = this.globalVar.checknull(data.MFGDATE, "Date")
    LASTUSEDDATE = this.globalVar.checknull(data.LASTUSEDDATE, "Date")
    REMARKS = this.globalVar.checknull(data.REMARKS, "string")
    MATERIALUSED = this.globalVar.checknull(data.MATERIALUSED, "string")
    CUSTOMERINITIAL = this.globalVar.checknull(data.CUSTOMERINITIAL, "string")
    PROCESSUSED = this.globalVar.checknull(data.PROCESSUSED, "number")
    VENDORID = this.globalVar.checknull(data.VENDORID, "string")
    SERIES = this.globalVar.checknull(data.SERIES, "string")
    // PROCESSUSED = this.globalVar.checknull(data.PROCESSUSED, "string")
    EFFICIENCYID = this.globalVar.checknull(data.EFFICIENCYID, "number")
    DIENAME = this.globalVar.checknull(data.DIENAME, "string")
    SENDTIME = this.globalVar.checknull(data.SENDTIME, "DateTime")
    STATUSID=  this.globalVar.checknull(data.STATUSID, "number")


    if (data.BOMEXISTS == undefined || data.BOMEXISTS == null || data.BOMEXISTS == '' || data.BOMEXISTS == "false" || data.BOMEXISTS == '0') { BOMEXISTS = "N"; } else { BOMEXISTS = "Y" }
    if (data.ISCOLORED == undefined || data.ISCOLORED == null || data.ISCOLORED == '' || data.ISCOLORED == "false" || data.ISCOLORED == '0') { ISCOLORED = "N"; } else { ISCOLORED = "Y" }
    if (data.DOUBLEPUNCH == undefined || data.DOUBLEPUNCH == null || data.DOUBLEPUNCH == '' || data.DOUBLEPUNCH == "false" || data.DOUBLEPUNCH == '0') { DOUBLEPUNCH = "N"; } else { DOUBLEPUNCH = "Y" }


    // if (data.MaintBy == 'false') { MaintBy = "0"; } else { MaintBy = "1" }
    // if (data.MainSupplierId == undefined || data.MainSupplierId == null || data.MainSupplierId == '' || data.MaintBy == "false") { MainSupplierId = "0"; } else { MainSupplierId = data.MainSupplierId }
    // if (data.UnderWty == '1') { UnderWty = "1"; } else { UnderWty = "0" }
    // if (data.Wtyupto == undefined || data.Wtyupto == null || data.Wtyupto == '') { Wtyupto = ""; } else { Wtyupto = formatDate(data.Wtyupto, 'yyyy-MM-dd', 'en-US') }
    // if (data.UnderAMC == '1') { UnderAMC = "1"; } else { UnderAMC = "0" }


    newArray.push(
      {
        MAINTENANCEID: this.id,
        DIEID: DIEID,
        DIETYPEID: DIETYPEID,
        REMARKS: REMARKS,
        BRANCHID: this.globalVar.BranchId,
        COMPANYID: this.globalVar.CommpanyId,
        PIECENO: PIECENO,
        TOTALPIECES: TOTALPIECES,
        MFGDATE: MFGDATE,
        PARTYID: data.PARTYID,
        ISCOLORED: ISCOLORED,
        COLORID: COLORID,
        MATERIALUSED: MATERIALUSED,
        SUPPLIERID: '',
        PROCESSUSED: PROCESSUSED,
        CUSTOMERINITIAL: CUSTOMERINITIAL,
        SERIES: SERIES,
        VENDORID: VENDORID,
        PLANNEDSTROKES: PLANNEDSTROKES,
        STROKESMADE: STROKESMADE,
        AVAILABLESTROKES: AVAILABLESTROKES,
        LASTUSEDDATE: LASTUSEDDATE,
        LASTUSEDONPRESSID: LASTUSEDONPRESSID,
        LASTOPERATORID: LASTOPERATORID,
        MACHINEID: MACHINEID,
        EFFICIENCYID: EFFICIENCYID,
        BOMEXISTS: BOMEXISTS,
        DOUBLEPUNCH: DOUBLEPUNCH,
        NOOFSTROKES: NOOFSTROKES,
        SCRAPPEDDATE: '',
        SCRAPPEDBYOPERATORID: '',
        SCRAPREASONID: '',
        SCRAPVALUEREALISED: '',
        STATUSID: STATUSID,
        INHOUSEVENDORED: INHOUSEVENDORED,
        WASTAGE: WASTAGE,
        USERID: '',
        EDATE: '',
        MDATE: '',
        DIENAME: DIENAME,
        TOOLSECTIONID: TOOLSECTIONID,
        DIEQTY: '',
        FRAMEID: FRAMEID,
        POLEID: POLEID,
        DRAWINGNO: DRAWINGNO,
        DIECODE: '',
        ELESTANDARDID: '',
        RTRDRAWINGNO: '',
        PARTYREFRENCENO: '',
        STRNOOFSLOOTS: '',
        RTRNOFSLOTS: '',

      });
      
    var dtlarray: Array<any> = [];

      // if (row != undefined) {
      //   for (var data1 of row) {
      //     dtlarray.push(data1);
      //   }
      // }
      DRGNO=this.globalVar.checknull(this.contact.DRGNO,"string")
      FRAME=this.globalVar.checknull(this.contact.FRAME,"number")
      STOD	=this.globalVar.checknull(this.contact.STOD,"string")
      STID	=this.globalVar.checknull(this.contact.STID,"string")
      BORE=this.globalVar.checknull(this.contact.BORE,"string")
      STSLOT=this.globalVar.checknull(this.contact.STSLOT,"number")
      RTSLOT=this.globalVar.checknull(this.contact.RTSLOT,"number")
      if(this.contact.BLK == null || this.contact.BLK == undefined || this.contact.BLK == '' || this.contact.BLK == false){BLK ="N"}else{BLK="Y"}
      if(this.contact.STGS == null || this.contact.STGS == undefined || this.contact.STGS == '' || this.contact.STGS == false){STGS ="N"}else{STGS="Y"}
      if(this.contact.RTGS == null || this.contact.RTGS == undefined || this.contact.RTGS == '' || this.contact.RTGS == false){RTGS ="N"}else{RTGS="Y"}
      if(this.contact.STNT == null || this.contact.STNT == undefined || this.contact.STNT == '' || this.contact.STNT == false){STNT ="N"}else{STNT="Y"}
      if(this.contact.RTNT == null || this.contact.RTNT == undefined || this.contact.RTNT == '' || this.contact.RTNT == false){RTNT ="N"}else{RTNT="Y"}
      if(this.contact.RDC == null || this.contact.RDC == undefined || this.contact.RDC == '' || this.contact.RDC == false){RDC ="N"}else{RDC="Y"}
      if(this.contact.CLOAD == null || this.contact.CLOAD == undefined || this.contact.CLOAD == '' || this.contact.CLOAD == false){CLOAD ="N"}else{CLOAD="Y"}
      if(this.contact.PROAGTOOL == null || this.contact.BLPROAGTOOLK == undefined || this.contact.PROAGTOOL == '' || this.contact.PROAGTOOL == false){PROAGTOOL ="N"}else{PROAGTOOL="Y"}
      // if(this.contact.BLK == null || this.contact.BLK == undefined || this.contact.BLK == '' || this.contact.BLK == "N"){BLK ="N"}else{BLK="Y"}
      // BLK	=this.globalVar.checknull(this.contact.BLK,"string")
      // STGS	=this.globalVar.checknull(this.contact.STGS,"string")
      // RTGS	=this.globalVar.checknull(this.contact.RTGS,"string")
      // STNT	=this.globalVar.checknull(this.contact.STNT,"string")
      // RTNT	=this.globalVar.checknull(this.contact.RTNT,"string")
      // RDC  =this.globalVar.checknull(this.contact.RDC,"string")
      // CLOAD	=this.globalVar.checknull(this.contact.CLOAD,"string")
      // PROAGTOOL	=this.globalVar.checknull(this.contact.PROAGTOOL,"string")

      dtlarray.push({
        ID:0,
        DIEID:DIEID, 
        DRGNO:DRGNO,	 
        FRAME	: FRAME,
        STOD : STOD,
        STID	:STID, 
        BORE:BORE	, 
        STSLOT:STSLOT,	 
        RTSLOT:RTSLOT	, 
        BLK	:BLK ,
        STGS	:STGS, 
        RTGS	:RTGS ,
        STNT:STNT	, 
        RTNT:RTNT	,
        RDC	:RDC,
        CLOAD	:CLOAD,
        PROAGTOOL	:PROAGTOOL,
      });
    

    const params = new HttpParams()
      .set('statementtype', actions)
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('fyid', this.globalVar.fyid)
      .set('id', this.id)
      .set('UserId', this.globalVar.UserId)
      .set('hdrarray', JSON.stringify(newArray))
      .set('dimensionmdtl', JSON.stringify(dtlarray))
    this.http.post(this.original_url + "/Maintenance/DieMaint/Savediemaster", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/die-master']);
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
  reset1(data) {

  }
  searchTermCustomer(event) {
    let term: any;
    term = event.target.value;
    this.arrayItemCustomer = term;
    if (this.arrayItemCustomer !== '') {
      this.isLoading = true;
      this.http.get(this.original_url+"/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=" + this.arrayItemCustomer+"&type=C")
        .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.photosBuffer = this.allDataGet;
        },error => {
          this.isLoadingResults = false;
        }
  );
    }
    else {
      this.isLoading = false;
      this.photosBuffer = [];
      this.arrayItemCustomer = '';
    }
  }




  reset(data) {
    this.arrayItemCustomer = '';
    data.PARTYNAME = '';
    data.PARTYID = '';
    this.onChangeOfItemCodeCustomer(null, null);
  }

  generateName(data){
    let A,B,C,D,E,F,G,H,I
    A=data.CUSTOMERINITIAL
    if(data.SERIES != null && data.SERIES != undefined && data.SERIES != ''){
    B=data.SERIES.substring(0, 5)
    }
    if(data.FRAME != null && data.FRAME != undefined && data.FRAME != ''){
    C=data.FRAME.substring(0, 4)
    }
    if(data.POLARITY != null && data.POLARITY != undefined && data.POLARITY != ''){
    D=data.POLARITY.substring(0, 2)
    }
    if(data.EFFICIENCY != null && data.EFFICIENCY != undefined && data.EFFICIENCY != ''){
    E=data.EFFICIENCY.substring(0, 3)
    }
    if(data.PROCESS != null && data.PROCESS != undefined && data.PROCESS != ''){
    F=data.PROCESS.substring(0, 4)
    }
    if(data.MCINCLUDED != null && data.MCINCLUDED != undefined && data.MCINCLUDED != ''){
    G=data.MCINCLUDED.substring(0, 2)
    }
    A=this.globalVar.checknull(A,"string")
    B=this.globalVar.checknull(B,"string")
    C=this.globalVar.checknull(C,"string")
    D=this.globalVar.checknull(D,"string")
    E=this.globalVar.checknull(E,"string")
    F=this.globalVar.checknull(F,"string")
    G=this.globalVar.checknull(G,"string")
    this.newData.DIENAME=A+'/'+B+'-'+C+'/'+D+'-'+E+'-'+F+'/'+G
  }

  changeFrame(id,data) {
    var NAME = this.FrameArray.find(x => x.FRAMEID == id).FRAMEDESC;
    data.FRAME = NAME;
    this.generateName(data);
 }

 changePole(id,data) {
  var NAME = this.PoleArray.find(x => x.POLEDESC == id).POLEDESC;
  data.POLARITY = NAME;
  this.generateName(data);
}

changeEff(id,data) {
  var NAME = this.EfficiencyArray.find(x => x.ID == id).EFFICIENCYID;
  data.EFFICIENCY = NAME;
  this.generateName(data);
}

changeProcess(id,data) {
  var NAME = this.ProcessArray.find(x => x.PROCESSID == id).PROCESSDESC;
  data.PROCESS = NAME;
  this.generateName(data);
}

changeMachine(id,data) {
  var NAME = this.MachineArray.find(x => x.MACHINEID == id).MACHINENAME;
  data.MCINCLUDED = NAME;
  this.generateName(data);
}


  onChangeOfItemCodeCustomer(data, rowDetail) {
    if (data == null) {

      this.newData.PARTYID = '';
      this.newData.PARTYNAME = '';

    }
    else {

      this.newData.PARTYID = data.CUSTOMERID;
      this.newData.PARTYNAME = data.NAME;
      this.arrayItemCustomer = '';

    }
  }


}




