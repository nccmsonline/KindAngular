import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { Global } from 'src/app/Global';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-tentative-plan-for-rdc',
  templateUrl: './add-tentative-plan-for-rdc.component.html',
  styleUrls: ['./add-tentative-plan-for-rdc.component.css']
})
export class AddTentativePlanForRdcComponent implements OnInit {
 
  @ViewChildren('oldcodefocus') vc;
  original_url = environment.baseUrl;
  MachineName: any;
  newmachine: any = {};
  requisitionform: FormGroup;
  data: any;
  action: any;
  id: any;
  myDate = new Date();
  isLoadingResults: boolean;
  maintbyget: any;

  // search supplierlist
  arrayItemSupplier = '';
  supplierlist: Array<any> = [];
  allSupplierList: any;

  // maintbysuplier
  arrayItemSupplier1 = '';
  supplierlist1: Array<any> = [];
  allSupplierList1: any;

  // for edit get 
  allDataGet: any;
  mccatgget: any;
  newdataget: any;
  mccategoryarray: Array<any> = [];
  deptarray: Array<any> = [];
  fystartdate: any;
  fyenddate: any;

  // fixed asset
  contacts: Array<any> = [];
  tempcontacts: Array<any> = [];
  newContact: any = {};
  editContactID: any = {};
  newitemtype: any = {};
  removearray: Array<any> = [];
  imagesArray: Array<any> = [];
  userRightCheck: any = {};
  moduleid: any;
  functionalityid: any;
  canEditCommonClass = '';
  canCreateCommonClass = '';
  canDeleteCommonClass = '';
  machinemaster: any;
  isLoading: boolean;

  photosBuffer: Array<any> = [];
  newData: any={};
  mcstatusarray: any;
  arrayItemCustomer: string = '';
  toolNoArray: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private globalVar: Global,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.createForm();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.moduleid = this.activatedRoute.snapshot.paramMap.get('moduleid');
    this.functionalityid = this.activatedRoute.snapshot.paramMap.get('functionalityid');
    this.newmachine.MAINTTYPE="1"

    // User Right Data Get
    //   let Sidebar = sessionStorage.getItem("sidebar");
    //   let sidebarDataGet = JSON.parse(Sidebar);
    //   let childSidebarDataGet = sidebarDataGet.find(x => x.moduleid == this.moduleid);
    //   this.userRightCheck = childSidebarDataGet.items.find(x => x.functionalityid == this.functionalityid);
    //   if (this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }
    //   if (this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; }
    //   if (this.userRightCheck.candelete == 'True') { this.canDeleteCommonClass = ''; }
    //   if (this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }
    //   if (this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; }
    //   if (this.userRightCheck.candelete == 'False') { this.canDeleteCommonClass = 'canDeleteCommonClass'; }

    //   this.fystartdate = this.globalVar.fystartdate;
    //   this.fyenddate = this.globalVar.fyenddate;
  }

  ngOnInit() {
    if (this.action == 'new') {
      this.isLoadingResults = true;
      this.http.get(this.original_url + "/Masters/MachineMaster/GetCommonapiformachinemaster?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&userid=" + this.globalVar.UserId)
        .subscribe((res) => {
          let allDataGet: any;
          let idGet: any;
          allDataGet = res;
          this.mcstatusarray = allDataGet.Table1;
          this.mccategoryarray = allDataGet.Table;
          this.deptarray = allDataGet.Table4;
          idGet = allDataGet.Table;
          idGet = idGet[0];
          this.newmachine.id = idGet.LastMcId;
          this.newmachine.MaintBy = "false";
          this.isLoadingResults = false;
        }, error => {
          this.isLoadingResults = false;
        });
    }
    else if (this.action == 'edit') {
      this.isLoadingResults = true;
      this.http.get(this.original_url + "/Masters/MachineMaster/GetMachineData?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + this.id)
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet = res;
          this.mccategoryarray = allDataGet.Table2;
          this.mcstatusarray = allDataGet.Table3;
          this.deptarray = allDataGet.Table6;
          this.isLoadingResults = false;
          this.newmachine = allDataGet.Table[0];
          this.contacts=allDataGet.Table1;
          // this.newmachine.MAINTTYPE = this.newmachine.MAINTTYPE.tostring()
          if(this.newmachine.MAINTTYPE==2){
            this.newmachine.MAINTTYPE="2"
          }else{
            this.newmachine.MAINTTYPE="1"
          }
         if( this.newmachine.DISCONTINUEDSTATUS == "Y" ) 
         { this.newmachine.DISCONTINUEDSTATUS =true}
         else{
          this.newmachine.DISCONTINUEDSTATUS=false
         }
        }, error => {
          this.isLoadingResults = false;
        });
    }
  }


  removeContact(index) {
    this.contacts.splice(index, 1);
    this.removearray = [];
  }

  editContact(val) {
    this.editContactID = val;
  }

  updateContact(val) {
    // if (this.validateDetail(val)) {
      // this.vc.first.nativeElement.focus();
    //   this.editContactID = {};
    // }
  }

  validateDetail(data) {
    // var flag: boolean;
    // flag = true;
    // var msg: any;
    // msg = "<h5>Before add please rectify following mistakes:-</h5>";
    // if (data.ASSETNO == undefined || data.itemid == 0 || data.itemid == '') { flag = false; msg = msg + "* Asset No. Not Entered<br/>" }


    // if (flag == false) {
    //   const dialogRef = this.dialog.open(ValidationComponent, {
    //     data: {
    //       msg: msg,
    //       action: ''
    //     }
    //   });
    // }
    // return flag;
  }

  addContact() {

    // if (this.validateDetail(this.newContact)) {
      // this.vc.first.nativeElement.focus();
      this.contacts.push(this.newContact);
      console.log('contacts1', this.contacts)
      this.newitemtype['ID'] = this.newContact.itemid;
      this.removearray.push(this.newitemtype);
      this.contacts.forEach((contact, index) => {
        var num = 'ID';
        var value = index + 1;
        contact[num] = value;
        var num1 = 'sr';
        var value1 = index + 1;
        contact[num1] = value1;
        var MCID = 'MCID'
        contact[MCID] = '0'
      });
      this.newContact = {};
      this.newContact.stockinhand = '';
    // }
  }

  // supplier

  searchTermSupplier(event) {
    let term: any;
    term = event;
    this.arrayItemSupplier = term;
    if (this.arrayItemSupplier !== '') {
      this.isLoading = true;
      this.http.get(this.original_url + "/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + this.arrayItemSupplier + "&type=S")
        .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.supplierlist = this.allDataGet;
        }, error => {
          this.isLoadingResults = false;
        }
        );
    }
    else {
      this.isLoading = false;
      this.supplierlist = [];
      this.arrayItemSupplier = '';
    }
  }

  reset(data) {
    this.arrayItemSupplier = '';
    data.SUPPLIEDBYNAME = '';
    data.SUPPLIEDBY = '';
    this.onChangeOfItemCodeSupplier(null, null);
  }
  onChangeOfItemCodeSupplier(data, rowDetail) {
    if (data == null) {

      this.newmachine.SUPPLIEDBY = '';
      this.newmachine.SUPPLIEDBYNAME = '';

    }
    else {

      this.newmachine.SUPPLIEDBY = data.CUSTOMERID;
      this.newmachine.SUPPLIEDBYNAME = data.NAME;
      this.arrayItemSupplier = '';

    }
  }
  //CUSTOMER LIST

  searchTermCustomer(event) {
    let term: any;
    term = event;
    this.arrayItemCustomer = term;
    if (this.arrayItemCustomer !== '') {
      this.isLoading = true;
      this.http.get(this.original_url + "/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + this.arrayItemCustomer + "&type=S")
        .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.photosBuffer = this.allDataGet;
        }, error => {
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

  reset1(data) {
    this.arrayItemCustomer = '';
    data.MAINTENANCEBYNAME = '';
    data.MAINTENANCEBY = '';
    this.onChangeOfItemCodeCustomer(null, null);
  }

  onChangeOfItemCodeCustomer(data, rowDetail) {
    if (data == null) {

      this.newmachine.MAINTENANCEBY = '';
      this.newmachine.MAINTENANCEBYNAME = '';

    }
    else {

      this.newmachine.MAINTENANCEBY = data.CUSTOMERID;
      this.newmachine.MAINTENANCEBYNAME = data.NAME;
      this.arrayItemCustomer = '';

    }
  }

  dropdownHide() {
    this.arrayItemSupplier = '';
    this.arrayItemSupplier1 = '';

  }
  createForm() {
    this.requisitionform = this.fb.group({

      id: '',
      MachineName: '',
      MCCatgId: '',
      MCSRNo: '',
      MCChassisNo: '',
      MCModel: '',
      MCCapacity: '',
      MaintBy: '',
      MCSupplierId: '',
      MCManufacturer: '',
      MainSupplierId: '',
      UnderWty: '',
      Wtyupto: '',
      UnderAMC: '',
      AMCFrom: '',
      AMCUpto: '',
      LastMaint: '',
      LMAfterOps: '',
      LastBDownMaint: '',
      BMAfterOps: '',
      NextMaint: '',
      NMAfterOps: '',
      SplTools: '',
      SplTeam: '',
      EmergencyContactNo: '',
      ProjLifeYY: '',
      ProjLifeMM: '',
      ProjLifeOps: '',
      ActualLifeYY: '',
      ActualLifeMM: '',
      ActualLifeOps: '',
      FixedAssetId: '',
    });
  }

  checkmonth(event, rowDetail) {
    if (11 < event) {

      rowDetail.PROJLIFEMM = 11;
    }
  }

  checkmonth1(event1, rowDetail1) {
    if (11 < event1) {

      rowDetail1.ACTUALLIFEMM = 11;
    }
  }

  //Upload File
  upload(file) {

  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    if (this.newmachine.MACHINENAME == undefined || this.newmachine.MACHINENAME == '' || this.newmachine.MACHINENAME == null) { flag = false; msg = msg + "* Please Enter Machine Name<br/>" }
    if (this.newmachine.WORKINGSTATUS == undefined || this.newmachine.WORKINGSTATUS == '' || this.newmachine.WORKINGSTATUS == null) { flag = false; msg = msg + "* Please Select Status<br/>" }
    if ((this.newmachine.UNDEWARRANTYUPTO == "true" || this.newmachine.UNDEWARRANTYUPTO == "1") && (this.newmachine.UNDEWARRANTYDUEDATE == '' || this.newmachine.UNDEWARRANTYDUEDATE == "0" || this.newmachine.UNDEWARRANTYDUEDATE == undefined)) { flag = false; msg = msg + "* Please Select Warranty Upto Date or Uncheck Warranty Option<br/>" }
    if ((this.newmachine.MAINTTYPE == "true" || this.newmachine.MAINTTYPE == "2") && (this.newmachine.MAINTENANCEBY == '' || this.newmachine.MAINTENANCEBY == "0" || this.newmachine.MAINTENANCEBY == undefined)) { flag = false; msg = msg + "* Please Select Party or Uncheck Party Option<br/>" }
    if ((this.newmachine.DISCONTINUEDSTATUS == 'true' || this.newmachine.DISCONTINUEDSTATUS == "1") && (this.newmachine.DISCONTINUEDDATE == '' || this.newmachine.DISCONTINUEDDATE == undefined)) { flag = false; msg = msg + "* Please Select Discontinous Date Or Uncheck Discontinued Option <br/>" }
    if ((this.newmachine.UNDERAMC == 'true' || this.newmachine.UNDERAMC == "1") && (this.newmachine.AMCDUEDATE == '' || this.newmachine.AMCDUEDATE == undefined || this.newmachine.AMCUPTO == '' || this.newmachine.AMCUPTO == undefined)) { flag = false; msg = msg + "* Please Select AMC Dates Or Uncheck AMC Option <br/>" }
    if (this.newmachine.MACHINETYPE == undefined || this.newmachine.MACHINETYPE == '' || this.newmachine.MACHINETYPE == null) { flag = false; msg = msg + "* Machine Category not selected<br/>" }
    if (this.newmachine.DEPTID == undefined || this.newmachine.DEPTID == '' || this.newmachine.DEPTID == null) { flag = false; msg = msg + "* Department not selected<br/>" }
    if (this.newmachine.LOCATION == undefined || this.newmachine.LOCATION == '' || this.newmachine.LOCATION == null) { flag = false; msg = msg + "* Machine Location not Entered<br/>" }


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
    console.log('data', data)
    this.isLoadingResults = true;
    // machinedetail array
    let newArray: Array<any> = [];
    let assetdetail: Array<any> = [];
    let id, SPLTOOLREMARKS, SPLTEAMREMARKS, UNDERWTY, MCSupplierId, MCManufacturer, MaintBy, MainSupplierId, UnderWty, Wtyupto, UnderAMC, AMCFrom,
      AMCUpto, LASTMAINT, LMAFTEROPS, LASTBDOWNMAINT, BMAFTEROPS, NEXTMAINT, NMAFTEROPS, MCMODEL, SplTeam, SPLREMARKS,
      EMERGENCYCONTACT, PROJLIFEYY, PROJLIFEMM, PROJLIFEOPS, ACTUALLIFEYY, ACTUALLIFEMM, ACTUALLIFEOPS, createdon, createdby, modifiedon, modifiedby,
      procuredon, installedon, operationalon, currentloc, CALIBRATIONDUEON, CALIBRATIONAFTEROPS, MCCHASSISNO, MACHINETYPE, MACHINENAME,
      MACHINESERIALNO, MACHINECAPACITY, MANUFACTURINGYEAR, PURCHASEFROMID, WORKINGSTATUS, SUPPLIEDBY, LOCATION, MANUFACTURER, MAINTENANCEBY,
      SPLTOOLSREQUIRED, SPLTEAMREQUIRED, MDATE, UNDEWARRANTYDUEDATE, UNDEWARRANTYUPTO, AMCDUEDATE, DISCONTINUEDDATE, DISCONTINUEDSTATUS,
      AMCUPTO, UNDERAMC, DEPTID, CURRENTLOC, PROCUREDON, INSTALLEDON, OPERATIONALON, CREATEDBY, CREATEDON, MODIFIEDBY, MODIFIEDON,MAINTTYPE;



    MACHINESERIALNO = this.globalVar.checknull(data.MACHINESERIALNO, "number")
    MCCHASSISNO = this.globalVar.checknull(data.MCCHASSISNO, "string")
    MCMODEL = this.globalVar.checknull(data.MCMODEL, "string")
    MACHINECAPACITY = this.globalVar.checknull(data.MACHINECAPACITY, "string")
    SUPPLIEDBY = this.globalVar.checknull(data.SUPPLIEDBY, "number")
    MANUFACTURER = this.globalVar.checknull(data.MANUFACTURER, "string")
    MANUFACTURINGYEAR	 = this.globalVar.checknull(data.MANUFACTURINGYEAR	, "Date")
    MAINTENANCEBY = this.globalVar.checknull(data.MAINTENANCEBY, "number")
    PURCHASEFROMID = this.globalVar.checknull(data.PURCHASEFROMID, "number")
    UNDEWARRANTYDUEDATE = this.globalVar.checknull(data.UNDEWARRANTYDUEDATE, "Date")
    AMCDUEDATE = this.globalVar.checknull(data.AMCDUEDATE, "Date")
    AMCUPTO = this.globalVar.checknull(data.AMCUPTO, "Date")
    LASTMAINT = this.globalVar.checknull(data.LASTMAINT, "Date")
    LMAFTEROPS = this.globalVar.checknull(data.LMAFTEROPS, "number")
    LASTBDOWNMAINT = this.globalVar.checknull(data.LASTBDOWNMAINT, "Date")
    BMAFTEROPS = this.globalVar.checknull(data.BMAFTEROPS, "number")
    NEXTMAINT = this.globalVar.checknull(data.NEXTMAINT, "Date")
    NMAFTEROPS = this.globalVar.checknull(data.NMAFTEROPS, "number")
    CALIBRATIONDUEON = this.globalVar.checknull(data.CALIBRATIONDUEON, "Date")
    CALIBRATIONAFTEROPS = this.globalVar.checknull(data.CALIBRATIONAFTEROPS, "number")
    SPLTOOLSREQUIRED = this.globalVar.checknull(data.SPLTOOLSREQUIRED, "string")
    SPLTEAMREQUIRED = this.globalVar.checknull(data.SPLTEAMREQUIRED, "string")
    EMERGENCYCONTACT = this.globalVar.checknull(data.EMERGENCYCONTACT, "string")
    PROJLIFEYY = this.globalVar.checknull(data.PROJLIFEYY, "number")
    PROJLIFEMM = this.globalVar.checknull(data.PROJLIFEMM, "number")
    PROJLIFEOPS = this.globalVar.checknull(data.PROJLIFEOPS, "number")
    DISCONTINUEDDATE = this.globalVar.checknull(data.DISCONTINUEDDATE, "Date")
    ACTUALLIFEYY = this.globalVar.checknull(data.ACTUALLIFEYY, "number")
    ACTUALLIFEMM = this.globalVar.checknull(data.ACTUALLIFEMM, "number")
    ACTUALLIFEOPS = this.globalVar.checknull(data.ACTUALLIFEOPS, "number")
    SPLREMARKS = this.globalVar.checknull(data.SPLREMARKS, "string")
    SPLTOOLREMARKS  = this.globalVar.checknull(data.SPLTOOLREMARKS , "string")
    SPLTEAMREMARKS = this.globalVar.checknull(data.SPLTEAMREMARKS, "string")


    if (data.MAINTTYPE == undefined || data.MAINTTYPE == null || data.MAINTTYPE == '' || data.MAINTTYPE == "false" || data.MAINTTYPE == "1") { MAINTTYPE = "1"; } else { MAINTTYPE = "2" }
    if (data.UNDERWTY == undefined || data.UNDERWTY == null || data.UNDERWTY == '' || data.UNDERWTY == "false" ) { UNDERWTY = "N"; } else { UNDERWTY = "Y" }
    if (data.UNDERAMC == undefined || data.UNDERAMC == null || data.UNDERAMC == '' || data.UNDERAMC == "false" ) { UNDERAMC = "N"; } else { UNDERAMC = "Y" }
    if (data.DISCONTINUEDSTATUS == undefined || data.DISCONTINUEDSTATUS == null || data.DISCONTINUEDSTATUS == '' || data.DISCONTINUEDSTATUS == "false" ) { DISCONTINUEDSTATUS = "N"; } else { DISCONTINUEDSTATUS = "Y" }







    // if (actions == 'insert') {
    //   data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    // } else if (actions == 'Update') {
    //   data.createdon = data.createdon;
    // }
    // if (actions == 'insert') {
    //   data.createdby = this.globalVar.UserId;
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
    //   data.modifiedby = this.globalVar.UserId;
    // }
    // createdby = data.createdby
    // modifiedby = data.modifiedby
    // modifiedon = data.modifiedon
    // if (data.createdon == undefined || data.createdon == null || data.createdon == '') { createdon = ""; } else { createdon = data.createdon }
    // if (data.MCCapacity == undefined || data.MCCapacity == null || data.MCCapacity == '') { MCCapacity = ""; } else { MCCapacity = data.MCCapacity }
    // if (data.MCSRNo == undefined || data.MCSRNo == null || data.MCSRNo == '') { MCSRNo = ""; } else { MCSRNo = data.MCSRNo }
    // if (data.MCChassisNo == undefined || data.MCChassisNo == null || data.MCChassisNo == '') { MCChassisNo = ""; } else { MCChassisNo = data.MCChassisNo }
    // if (data.MCModel == undefined || data.MCModel == null || data.MCModel == '') { MCModel = ""; } else { MCModel = data.MCModel }
    // if (data.MCSupplierId == undefined || data.MCSupplierId == null || data.MCSupplierId == '') { MCSupplierId = "0"; } else { MCSupplierId = data.MCSupplierId }
    // if (data.MCManufacturer == undefined || data.MCManufacturer == null || data.MCManufacturer == '') { MCManufacturer = ""; } else { MCManufacturer = data.MCManufacturer }
    // if (data.MaintBy == 'false') { MaintBy = "0"; } else { MaintBy = "1" }
    // if (data.MainSupplierId == undefined || data.MainSupplierId == null || data.MainSupplierId == '' || data.MaintBy == "false") { MainSupplierId = "0"; } else { MainSupplierId = data.MainSupplierId }
    // if (data.UnderWty == '1') { UnderWty = "1"; } else { UnderWty = "0" }
    // if (data.Wtyupto == undefined || data.Wtyupto == null || data.Wtyupto == '') { Wtyupto = ""; } else { Wtyupto = formatDate(data.Wtyupto, 'yyyy-MM-dd', 'en-US') }
    // if (data.UnderAMC == '1') { UnderAMC = "1"; } else { UnderAMC = "0" }
    // if (data.AMCFrom == undefined || data.AMCFrom == null || data.AMCFrom == '') { AMCFrom = ""; } else { AMCFrom = formatDate(data.AMCFrom, 'yyyy-MM-dd', 'en-US') }
    // if (data.AMCUpto == undefined || data.AMCUpto == null || data.AMCUpto == '') { AMCUpto = ""; } else { AMCUpto = formatDate(data.AMCUpto, 'yyyy-MM-dd', 'en-US') }
    // if (data.LastMaint == undefined || data.LastMaint == null || data.LastMaint == '') { LastMaint = ""; } else { LastMaint = formatDate(data.LastMaint, 'yyyy-MM-dd', 'en-US') }
    // if (data.LMAfterOps == undefined || data.LMAfterOps == null || data.LMAfterOps == '') { LMAfterOps = null; } else { LMAfterOps = data.LMAfterOps }
    // if (data.LastBDownMaint == undefined || data.LastBDownMaint == null || data.LastBDownMaint == '') { LastBDownMaint = ""; } else { LastBDownMaint = formatDate(data.LastBDownMaint, 'yyyy-MM-dd', 'en-US') }
    // if (data.BMAfterOps == undefined || data.BMAfterOps == null || data.BMAfterOps == '') { BMAfterOps = null } else { BMAfterOps = data.BMAfterOps }
    // if (data.NextMaint == undefined || data.NextMaint == null || data.NextMaint == '') { NextMaint = ""; } else { NextMaint = formatDate(data.NextMaint, 'yyyy-MM-dd', 'en-US') }
    // if (data.NMAfterOps == undefined || data.NMAfterOps == null || data.NMAfterOps == '') { NMAfterOps = null } else { NMAfterOps = data.NMAfterOps }
    // if (data.calibrationdueon == undefined || data.calibrationdueon == null || data.calibrationdueon == '') { calibrationdueon = ""; } else { calibrationdueon = formatDate(data.calibrationdueon, 'yyyy-MM-dd', 'en-US') }
    // if (data.calibrationAfterOps == undefined || data.calibrationAfterOps == null || data.calibrationAfterOps == '') { calibrationAfterOps = null } else { calibrationAfterOps = data.calibrationAfterOps }
    // if (data.SplTools == undefined || data.SplTools == null || data.SplTools == '') { SplTools = ""; } else { SplTools = data.SplTools }
    // if (data.SplTeam == undefined || data.SplTeam == null || data.SplTeam == '') { SplTeam = ""; } else { SplTeam = data.SplTeam }
    // if (data.EmergencyContactNo == undefined || data.EmergencyContactNo == null || data.EmergencyContactNo == '') { EmergencyContactNo = ""; } else { EmergencyContactNo = data.EmergencyContactNo }
    // if (data.splremarks == undefined || data.splremarks == null || data.splremarks == '') { splremarks = ""; } else { splremarks = data.splremarks }
    // if (data.ProjLifeYY == undefined || data.ProjLifeYY == null || data.ProjLifeYY == '') { ProjLifeYY = null } else { ProjLifeYY = data.ProjLifeYY }
    // if (data.ProjLifeMM == undefined || data.ProjLifeMM == null || data.ProjLifeMM == '') { ProjLifeMM = null } else { ProjLifeMM = data.ProjLifeMM }
    // if (data.ProjLifeOps == undefined || data.ProjLifeOps == null || data.ProjLifeOps == '') { ProjLifeOps = null } else { ProjLifeOps = data.ProjLifeOps }
    // if (data.ActualLifeYY == undefined || data.ActualLifeYY == null || data.ActualLifeYY == '') { ActualLifeYY = null } else { ActualLifeYY = data.ActualLifeYY }
    // if (data.ActualLifeMM == undefined || data.ActualLifeMM == null || data.ActualLifeMM == '') { ActualLifeMM = null } else { ActualLifeMM = data.ActualLifeMM }
    // if (data.ActualLifeOps == undefined || data.ActualLifeOps == null || data.ActualLifeOps == '') { ActualLifeOps = null } else { ActualLifeOps = data.ActualLifeOps }

    newArray.push(
      {
        MACHINECOODE:'',
        MANUFACTURINGYEAR	:MANUFACTURINGYEAR	,
        id: this.id,
        COMPANYID: this.globalVar.CommpanyId,
        BRANCHID: this.globalVar.BranchId,
        USERID: this.globalVar.UserId,
        WORKINGSTATUS: data.WORKINGSTATUS,
        MACHINENAME: data.MACHINENAME,
        MACHINETYPE: data.MACHINETYPE,
        MACHINESERIALNO: MACHINESERIALNO,
        MCCHASSISNO: MCCHASSISNO,
        MCMODEL: MCMODEL,
        MACHINECAPACITY: MACHINECAPACITY,
        SUPPLIEDBY: SUPPLIEDBY,
        DEPTID: data.DEPTID,
        LOCATION: data.LOCATION,
        MANUFACTURER: MANUFACTURER,
        MDATE:'',
        MAINTENANCEBY: MAINTENANCEBY,
        //part model - PURCHASEFROM
        PURCHASEFROM: PURCHASEFROMID,
        UNDERWTY:UNDERWTY,
        UNDEWARRANTYUPTO: UNDEWARRANTYDUEDATE,
        UNDEWARRANTYDUEDATE: UNDEWARRANTYDUEDATE,
        UNDERAMC: UNDERAMC,
        //AMC From model - AMCDUEDATE 
        AMCDUEDATE: AMCDUEDATE,
        AMCUPTO: AMCUPTO,
        LASTMAINT: LASTMAINT,
        LMAFTEROPS: LMAFTEROPS,
        LASTBDOWNMAINT: LASTBDOWNMAINT,
        BMAFTEROPS: BMAFTEROPS,
        NEXTMAINT: NEXTMAINT,
        NMAFTEROPS: NMAFTEROPS,
        CALIBRATIONDUEON: CALIBRATIONDUEON,
        CALIBRATIONAFTEROPS: CALIBRATIONAFTEROPS,
        SPLTOOLSREQUIRED: 'N',
        SPLTEAMREQUIRED: 'N',
        EMERGENCYCONTACT: EMERGENCYCONTACT,
        PROJLIFEYY: PROJLIFEYY,
        PROJLIFEMM: PROJLIFEMM,
        PROJLIFEOPS: PROJLIFEOPS,
        DISCONTINUEDSTATUS: DISCONTINUEDSTATUS,
        DISCONTINUEDDATE: DISCONTINUEDDATE,
        ACTUALLIFEYY: ACTUALLIFEYY,
        ACTUALLIFEMM: ACTUALLIFEMM,
        ACTUALLIFEOPS: ACTUALLIFEOPS,
        SPLREMARKS: SPLREMARKS,
        INSTALLATIONDATE: '',
        PURCHASEDATE: '',
        MAINTTYPE: MAINTTYPE,
        PREVENTIVEMAINTENANCEDUEDATE: '',
        PREVENTIVEDAYSTIME: 0,
        MACHINEID: this.id,
        PREVENTIVEHRSTIME: 0,
        SPLMATERIALREQUIRED: '',
        EDATE:formatDate(this.myDate, 'yyyy-MM-dd', 'en-US')  ,
        ETIME: '',
        TARGET: '',
        SPLTOOLREMARKS :SPLTOOLREMARKS ,
        SPLTEAMREMARKS:SPLTEAMREMARKS,
        // PREVENTIVEDAYSTIME	:0,



        // MachineName: data.MachineName,
        // MCCatgId: data.MCCatgId,
        // MCSRNo: MCSRNo,
        // MCChassisNo: MCChassisNo,
        // MCModel: MCModel,
        // MCCapacity: MCCapacity,
        // MCSupplierId: MCSupplierId,
        // MCManufacturer: MCManufacturer,
        // MaintBy: MaintBy,
        // MainSupplierId: MainSupplierId,
        // deptid:data.deptid,
        // location:data.location,
        // UnderWty: UnderWty,
        // Wtyupto: Wtyupto,
        // UnderAMC: UnderAMC,
        // AMCFrom: AMCFrom,
        // AMCUpto: AMCUpto,
        // EmergencyContactNo: EmergencyContactNo,
        // splremarks:splremarks,
        // LastMaint: LastMaint,
        // LMAfterOps: LMAfterOps,
        // LastBDownMaint: LastBDownMaint,
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
    var mcasset: Array<any> = [];
    let i = 0;
    for (let mdata of this.contacts) {
      console.log('contacts', this.contacts)
      // var row = mdata.mcasset;
      // if (row != undefined) {
      //   for (var data1 of row) {
      //     mcasset.push(data1);
      //   }
      // }

      if (mdata.CURRENTLOC == undefined || mdata.CURRENTLOC == null || mdata.CURRENTLOC == '') { CURRENTLOC = ""; } else { CURRENTLOC = mdata.CURRENTLOC }
      if (mdata.PROCUREDON == undefined || mdata.PROCUREDON == null || mdata.PROCUREDON == '') { PROCUREDON = ""; } else { PROCUREDON = formatDate(mdata.PROCUREDON, 'yyyy-MM-dd', 'en-US') }
      if (mdata.INSTALLEDON == undefined || mdata.INSTALLEDON == null || mdata.INSTALLEDON == '') { INSTALLEDON = ""; } else { INSTALLEDON = formatDate(mdata.INSTALLEDON, 'yyyy-MM-dd', 'en-US') }
      if (mdata.OPERATIONALON == undefined || mdata.OPERATIONALON == null || mdata.OPERATIONALON == '') { OPERATIONALON = ""; } else { OPERATIONALON = formatDate(mdata.OPERATIONALON, 'yyyy-MM-dd', 'en-US') }

      mcasset.push({
        ID: i + 1,
        COID: this.globalVar.CommpanyId,
        BOID: this.globalVar.BranchId,
        MCID: this.id,
        ASSETNO: mdata.ASSETNO,
        CURRENTLOC: CURRENTLOC,
        PROCUREDON: PROCUREDON,
        INSTALLEDON: INSTALLEDON,
        OPERATIONALON: OPERATIONALON,
        CREATEDBY: this.globalVar.userid,
        CREATEDON: formatDate(this.myDate, 'yyyy-MM-dd', 'en-US')  ,
        MODIFIEDBY: '',
        MODIFIEDON: '',

      });
      i++;
    }

    const params = new HttpParams()
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('UserId', this.globalVar.UserId)
      .set('id', this.id)
      .set('statementtype', actions)
      .set('machinemasterarray', JSON.stringify(newArray))
      .set('fixedassetarray', JSON.stringify(mcasset));
    this.http.post(this.original_url + "/Masters/MachineMaster/SaveMachinemaster", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/machine-master']);
      }, error => {
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
