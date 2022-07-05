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


@Component({
  selector: 'app-add-tool-room-inspection-master',
  templateUrl: './add-tool-room-inspection-master.component.html',
  styleUrls: ['./add-tool-room-inspection-master.component.css']
})
export class AddToolRoomInspectionMasterComponent implements OnInit {
  @ViewChildren('oldcodefocus') vc;
  original_url = environment.baseUrl;
  newData: any = {};
  requisitionform: FormGroup;
  myDate = new Date();
  contact: Array<any> = [];
  contacts: Array<any> = [];
  isLoadingResults=false;
  id:any;
  toolTypeArray:Array<any> = [];
  toolNoArray:Array<any> = [];
  userArray:Array<any> = [];
  maintOfficerArray:Array<any> = [];
  storeInchargeArray:Array<any> = [];
  reasonArray:Array<any> = [];
  delayReason:Array<any> = [];
  action: any;
  arrayItemCustomer:any='';
  isLoading=false;
  allDataGet: any;
  photosBuffer:Array<any> = [];


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
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');

    this.createForm();
    this.contacts=[
    {id:1,name:"Main Pillar / Bush",Remarks:"" ,togglereqd:true,status:true},
    {id:2,name:"Semi Pillar / Bush",Remarks:"",togglereqd:true,status:true},
    {id:3,name:"Centre Locatio / Pin",Remarks:"",togglereqd:true,status:true},
    {id:4,name:"Grinding Sleeves",Remarks:"",togglereqd:true,status:true},
    {id:5,name:"Alignment Bolts",Remarks:"",togglereqd:true,status:false},
    {id:6,name:"Top / Bottom Plate",Remarks:"",togglereqd:true,status:true},
    {id:7,name:"Dwelling",Remarks:"",togglereqd:true,status:true},
    {id:7,name:"Approx. Tool Life",Remarks:"",togglereqd:true,status:true},
    {id:8,name:"RT Size",Remarks:"",togglereqd:false,status:true},
    {id:9,name:"RT ID Bore Size",Remarks:"",togglereqd:false,status:true},
  ]

  this.toolTypeArray=[
    {id:1,name:"Blanking"},
    {id:2,name:"Stator"},
    {id:3,name:"Rotor"}
  ]
  this.toolNoArray=[
    {id:1,name:"061105"},
    {id:2,name:"061106"},
    {id:3,name:"061107"},
    {id:4,name:"061108"},
    {id:5,name:"061109"}
  ]

  this.userArray=[
    {id:1,name:"Manpreet Singh"},
    {id:2,name:"Navneet Kumar"},
    {id:3,name:"User 1"},
    {id:4,name:"User 2"},
    {id:5,name:"User 3"}
  ]

  this.maintOfficerArray=[
    {id:1,name:"Progressive"},
    {id:2,name:"Gang or Compoubd"}
  ]

  this.storeInchargeArray=[
    {id:1,name:"Working"},
    {id:2,name:"Under Maint."}
  ]
  

  this.reasonArray=[
    {id:2,name:"2"},
    {id:3,name:"4"},
    {id:4,name:"6"},
    {id:5,name:"8"}
  ]

  this.delayReason=[
    {id:1,name:"160"},
    {id:2,name:"100"},
    {id:3,name:"90"},
  ]
  this.contacts.forEach(element => {
  this.statusChange(element.status,element);
  });
  this.newData.srno="8";
   }

  ngOnInit() {
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

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    if (this.newData.MachineName == undefined || this.newData.MachineName == '' || this.newData.MachineName == null) { flag = false; msg = msg + "* Please Enter Machine Name<br/>" }
    if ((this.newData.MaintBy == "true" || this.newData.MaintBy == "1") && (this.newData.MainSupplierId == '' || this.newData.MainSupplierId == "0" || this.newData.MainSupplierId == undefined)) { flag = false; msg = msg + "* Please Select Maintenance Party <br/>" }
    if ((this.newData.UnderWty == '1' || this.newData.UnderWty == "1") && (this.newData.Wtyupto == '' || this.newData.Wtyupto == undefined)) { flag = false; msg = msg + "* Please Select Warranty Upto Date Or Uncheck Warranty Option <br/>" }
    if ((this.newData.UnderAMC == '1' || this.newData.UnderAMC == "1") && (this.newData.AMCFrom == '' || this.newData.AMCFrom == undefined || this.newData.AMCUpto == '' || this.newData.AMCUpto == undefined)) { flag = false; msg = msg + "* Please Select AMC Dates Or Uncheck AMC Option <br/>" }
    if (this.newData.MCCatgId == undefined || this.newData.MCCatgId == '' || this.newData.MCCatgId == null) { flag = false; msg = msg + "* Machine Category not selected<br/>" }
    if (this.newData.deptid == undefined || this.newData.deptid == '' || this.newData.deptid == null) { flag = false; msg = msg + "* Department not selected<br/>" }
    if (this.newData.location == undefined || this.newData.location == '' || this.newData.location == null) { flag = false; msg = msg + "* Machine Location not Entered<br/>" }


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
    let id, DIEID, DIETYPEID, SENDFORMAINTENANCEDT, RECDTIME, MAINTENANCECOMPLETEDT, REMARKS, SENDTIME, UnderWty, Wtyupto, UnderAMC, AMCFrom,
      AMCUpto, LastMaint, LMAfterOps, LastBDownMaint, BMAfterOps, NextMaint, NMAfterOps, SplTools, SplTeam,splremarks,
      EmergencyContactNo, ProjLifeYY, ProjLifeMM, ProjLifeOps, ActualLifeYY, ActualLifeMM, ActualLifeOps, MCModel, createdon, createdby, modifiedon, modifiedby,
      procuredon, installedon, operationalon, currentloc, calibrationdueon, calibrationAfterOps;


    if (actions == 'insert') {
      data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    } else if (actions == 'Update') {
      data.createdon = data.createdon;
    }
    if (actions == 'insert') {
      data.createdby = this.globalVar.userid;
    } else if (actions == 'Update') {
      data.createdby = data.createdby;
    }
    if (actions == 'insert') {
      data.modifiedon = "";
    } else if (actions == 'Update') {
      data.modifiedon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    }
    if (actions == 'insert') {
      data.modifiedby = "";
    } else if (actions == 'Update') {
      data.modifiedby = this.globalVar.userid;
    }
    createdby = data.createdby
    modifiedby = data.modifiedby
    modifiedon = data.modifiedon
    if (data.createdon == undefined || data.createdon == null || data.createdon == '') { createdon = ""; } else { createdon = data.createdon }
    DIEID=this.globalVar.checknull(data.DIEID,"number")
    DIETYPEID=this.globalVar.checknull(data.DIETYPEID,"number")
    SENDFORMAINTENANCEDT=this.globalVar.checknull(data.SENDFORMAINTENANCEDT,"Date")
    RECDTIME	=this.globalVar.checknull(data.RECDTIME	,"DateTime")
    MAINTENANCECOMPLETEDT=this.globalVar.checknull(data.MAINTENANCECOMPLETEDT,"Date")
    REMARKS	=this.globalVar.checknull(data.REMARKS,"string")
    SENDTIME	=this.globalVar.checknull(data.SENDTIME	,"DateTime")
    SENDFORMAINTENANCEDT=this.globalVar.checknull(data.SENDFORMAINTENANCEDT,"Date")
    SENDFORMAINTENANCEDT=this.globalVar.checknull(data.SENDFORMAINTENANCEDT,"Date")
  
    // if (data.MaintBy == 'false') { MaintBy = "0"; } else { MaintBy = "1" }
    // if (data.MainSupplierId == undefined || data.MainSupplierId == null || data.MainSupplierId == '' || data.MaintBy == "false") { MainSupplierId = "0"; } else { MainSupplierId = data.MainSupplierId }
    // if (data.UnderWty == '1') { UnderWty = "1"; } else { UnderWty = "0" }
    // if (data.Wtyupto == undefined || data.Wtyupto == null || data.Wtyupto == '') { Wtyupto = ""; } else { Wtyupto = formatDate(data.Wtyupto, 'yyyy-MM-dd', 'en-US') }
    // if (data.UnderAMC == '1') { UnderAMC = "1"; } else { UnderAMC = "0" }
   

    newArray.push(
      {

        MAINTENANCEID	: this.id,
        DIEID: DIEID,
        DIETYPEID	: DIETYPEID,
        TOOLSECTIONID	: data.TOOLSECTIONID	,
        SENDFORMAINTENANCEDT: SENDFORMAINTENANCEDT	,
        RECDTIME: RECDTIME,
        MAINTENANCECOMPLETEDT	: MAINTENANCECOMPLETEDT	,
        LASTUSEDDATE	: '',
        LASTUSEDONPRESSID	: 0,
        LASTOPERATORID	:0,
        MATERIALUSED	:0,
        PROCESSUSED	: 0,
        MECHANICNAME	: 0,
        MAINTENANCESOURCE	: 0,
        REMARKS	: REMARKS	,
        BRANCHID	: this.globalVar.BranchId,
        COMPANYID	: this.globalVar.CommpanyId,
        SENDTIME	:SENDTIME	,
        STROCKESMODE	: 0,
        STROCKESAVAILABLE	: 0,
        MAINTENACEDETAIL	: 0,
        BMAfterOps: BMAfterOps,
        NextMaint: NextMaint,
        NMAfterOps: NMAfterOps,
        calibrationdueon: calibrationdueon,
        calibrationAfterOps: calibrationAfterOps,
        SplTools: SplTools,
        SplTeam: SplTeam,
        ProjLifeYY: ProjLifeYY,
        ProjLifeMM: ProjLifeMM,
        ProjLifeOps: ProjLifeOps,
        ActualLifeYY: ActualLifeYY,
        ActualLifeMM: ActualLifeMM,
        ActualLifeOps: ActualLifeOps,
        coid: this.globalVar.CommpanyId,
        boid: this.globalVar.BranchId,
        createdby: createdby,
        createdon: createdon,
        modifiedby: modifiedby,
        modifiedon: modifiedon,


      });
    // fixed asset detail array
    var mcasset: Array<any> = [];
    let i = 0;
    for (let mdata of this.contacts) {

      var row = mdata.mcasset;
      if (row != undefined) {
        for (var data1 of row) {
          mcasset.push(data1);
        }
      }

      if (mdata.currentloc == undefined || mdata.currentloc == null || mdata.currentloc == '') { currentloc = ""; } else { currentloc = mdata.currentloc }
      if (mdata.procuredon == undefined || mdata.procuredon == null || mdata.procuredon == '') { procuredon = ""; } else { procuredon = formatDate(mdata.procuredon, 'yyyy-MM-dd', 'en-US') }
      if (mdata.installedon == undefined || mdata.installedon == null || mdata.installedon == '') { installedon = ""; } else { installedon = formatDate(mdata.installedon, 'yyyy-MM-dd', 'en-US') }
      if (mdata.operationalon == undefined || mdata.operationalon == null || mdata.operationalon == '') { operationalon = ""; } else { operationalon = formatDate(mdata.operationalon, 'yyyy-MM-dd', 'en-US') }

      mcasset.push({
        id: i + 1,
        coid: this.globalVar.CommpanyId,
        boid: this.globalVar.BranchId,
        mcid: 0,
        assetno: mdata.assetno,
        currentloc: currentloc,
        procuredon: procuredon,
        installedon: installedon,
        operationalon: operationalon,
        createdby: createdby,
        createdon: createdon,
        modifiedby: modifiedby,
        modifiedon: modifiedon,

      });
      i++;
    }

    const params = new HttpParams()
      .set('Entrytype', actions)
      .set('UserId', this.globalVar.userid)
      .set('machinemasterarray', JSON.stringify(newArray))
      .set('fixedassetarray', JSON.stringify(mcasset));
    this.http.post(this.original_url + "/Masters/DieMaster/SaveDiemaster", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/die-master']);
      });
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
  reset1(data){

  }
  searchTermCustomer(event) {
    let term: any;
    term = event.target.value;
    this.arrayItemCustomer = term;
    if (this.arrayItemCustomer !== '') {
      this.isLoading = true;
      this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CustomerMaster/CustomerList?PageNumber=1&PageSize=100&sort=1&customerid=0coid=1&boid=1&search=" + this.arrayItemCustomer)
      .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.photosBuffer = this.allDataGet;
        });
    }
    else {
      this.isLoading = false;
      this.photosBuffer = [];
      this.arrayItemCustomer = '';
    }
  }




  reset(data) {
    this.arrayItemCustomer = '';
    data.customername = '';
    data.customerid = '';
    this.onChangeOfItemCodeCustomer(null, null);
  }




  onChangeOfItemCodeCustomer(data, rowDetail) {
    if (data == null) {

      this.newData.customerid = '';
      this.newData.customername = '';

    }
    else {

      this.newData.customerid = data.id;
      this.newData.customername = data.name;
      this.arrayItemCustomer = '';
     
    }
  }


}




