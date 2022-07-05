import { Global } from './../../../../Global';

import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { PartsAmtCalculatorComponent } from './parts-amt-calculator/parts-amt-calculator.component';
import { MaintenanceOrderListPopupComponent } from './maintenance-order-list-popup/maintenance-order-list-popup.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { ImageViewComponent } from 'src/app/Modules/General/image-view/image-view.component';
import { AddSingleColumnMasterComponent } from 'src/app/Modules/General/single-column-master/add-single-column-master/add-single-column-master.component';


@Component({
  selector: 'app-mo-followup',
  templateUrl: './mo-followup.component.html',
  styleUrls: ['./mo-followup.component.css']
})
export class MoFollowupComponent implements OnInit {
  original_url=environment.baseUrl;
  images_url = environment.imageUrl;
  newData:any={};
  newContact:any={};
  contacts: Array<any> = [];
  isLoadingResults = false;
  PopData:any;
  actionType='Insert';
  type:any;
  url:any;
  saveurl:any;
  filterarray:Array<any>=[];
  teamType:Array<any>=[];
  totallabouramt: string;
  totalpartsamt: string;
  totaloutlabouramt: string;
  totalshow :boolean=false;
  myDate = new Date();
  rootcauseDDarray:Array<any>=[];
  teamDDarray:Array<any>=[];
  empnameDDarray:Array<any>=[];
  disableSave :boolean=false;
  mtstatus: any;
  userRightCheck:any={};
  moNoHeader:any;
  arrayItemSupplier = '';
  allSupplierList: any;
  supplierlist: Array<any> = [];
  externalteam = false;
  formData = new FormData();
  imagesArray: Array<any> = [];
  imgURL:any;
  updateamcDisablebutton:boolean=true;
  inamc:any

  constructor(
    public dialogRef: MatDialogRef<MoFollowupComponent>,
    public dialog: MatDialog,
    private globalVar: Global,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private http: HttpClient,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
  
    this.PopData = data.action;
    this.type=data.type;
    this.moNoHeader=this.PopData.MONO;
    this.filterarray=[{id:1,name:"Machine Name"},{id:2,name:"Order No."},{id:3,name:"Ticket No."}];
    this.teamType=[{id:"I",name:"INT."},{id:"E",name:"EXT."}];
  }

  ngOnInit() {
    this.refresh();
  }

  ngAfterContentInit() {
  }

  onChangeOfTeamtype(event,newContact) {
  }
  
  refresh() {
    this.isLoadingResults = true;
    this.http.get(this.original_url+"/Maintenance/Ticket/getmoprogressdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id="+this.PopData.ID)
      .subscribe((response) => {
        var allDataGet: any;
        allDataGet = response;
        this.isLoadingResults=false;
        this.rootcauseDDarray = allDataGet.Table;
        this.teamDDarray = allDataGet.Table1;
        this.empnameDDarray = allDataGet.Table2;
        this.newData = allDataGet.Table4[0];
        this.newContact.MOTEAMTYPE = this.newData.MOTEAMTYPE;
        this.newContact.MOASSIGNEDTEAMID = this.newData.MOASSIGNEDTEAMID;
        this.newContact.suplname = this.newData.suplname;
        this.newContact.batchDetail = [];
        this.contacts = allDataGet.Table3;
        // this.inamc = allDataGet.Table8.inamc;
        // if(this.inamc == 1)
        // {
          // this.updateamcDisablebutton = false;
        // }
        // this.imagesArray = allDataGet.Table7;
        // this.imagesArray.forEach(el => {
        //   el.imageinfo = this.images_url+'/Maintenance/maintenance-order/'+el.refid+'/'+el.filename;
        // });
        if (this.newData.MTCLOSED == "true") {
          this.disableSave = true;
          this.newData.CLOSEMO = true;
          this.mtstatus = "Closed";
          this.newData.MACHINEUPAT = this.newData.MACHINEUPAT != null ? new Date("Wed, 27 July 2016 " + this.newData.MACHINEUPAT) : this.myDate;
          this.newData.MOCOMPLETEDAT = this.newData.MOCOMPLETEDAT != null ? new Date("Wed, 27 July 2016 " + this.newData.MOCOMPLETEDAT) : this.myDate;
          this.newData.MOCLOSEDAT = this.newData.MOCLOSEDAT != null ? new Date("Wed, 27 July 2016 " + this.newData.MOCLOSEDAT) : this.myDate;
        }
        else {
          this.mtstatus = "Pending";
        }

        if (this.contacts.length > 0) {
          this.calSummary();
        }
        else{
          this.isLoadingResults=false;
        }
      });
  }

  // parts calculator popup on eye button for new entry
  itemStockOpen(newContact)
  {
    const dialogRef = this.dialog.open(PartsAmtCalculatorComponent, {
      width: '70%',
      data  : {
            id: this.PopData.ID,
            action: 'new',
            itemData: newContact
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result)
        {
          this.newContact.batchDetail = result.batchDetail;
          // this.newContact.exists = 'exists';
          this.newContact.MOPARTS = result.amount;
        }
      });
  }

// parts calculator popup on eye button Teamwise
  itemStockOpenTeamwise(data){
    const dialogRef = this.dialog.open(PartsAmtCalculatorComponent, {
      width: '70%',
      data  : {
            id: data.id,
            action: 'teamwise',
            itemData: data,
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
      
      });
  }

  // on change of Team
  onChangeOfTeam(id,rowDetail) {
    rowDetail.teamname = this.teamDDarray.find(x => x.id == id).teamname;
  }

  // on change of mt status
  onChangeOfmtStatus(id,rowDetail) {
    rowDetail.mtstatus = this.filterarray.find(x => x.id == id).name;
  }

  reset(data) {
    data.MOASSIGNEDTEAMID = '';
    data.suplname='';
    this.arrayItemSupplier = ''
    this.onChangeOfItemCodeSupplier(null, data);
  }

  // onChangeOfTeamtype(event) {
  //   if (event.value == "E") {
  //     this.externalteam = true;
  //   }
  //   else {
  //     this.externalteam = false;
  //   }
  // }

  onChangeOfItemCodeSupplier(data, rowDetail) {
    if (data == null) {
      rowDetail.MOASSIGNEDTEAMID = '';
      rowDetail.suplname = '';
    }
    else {
      this.arrayItemSupplier = '';
      rowDetail.MOASSIGNEDTEAMID = data.CUSTOMERID;
      rowDetail.suplname = data.NAME;
    }
  }

  openPopup(rowDetail)
  {
    const dialogRef = this.dialog.open(MaintenanceOrderListPopupComponent, {
      
      data: {
        actionID: this.newData.mtassetid
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // save detail array
  addContact(event) {

    this.isLoadingResults = true;
    var dtlDataarray: Array<any> = [];
    var hdrEmptyArray: Array<any> = [];
    var partsamtcalcarray:Array<any> =[];
    
    let MOLBR, MOPARTS, MOOUTSIDELBR, MOTEAMREMARKS, MOSTARTTIME, MOTEAMENDTIME;

    if (event.MOLBR == undefined || event.MOLBR == '' || event.MOLBR == null) { MOLBR = 0 } else { MOLBR = event.MOLBR }
    if (event.MOPARTS == undefined || event.MOPARTS == '' || event.MOPARTS == null) { MOPARTS = 0 } else { MOPARTS = event.MOPARTS }
    if (event.MOOUTSIDELBR == undefined || event.MOOUTSIDELBR == '' || event.MOOUTSIDELBR == null) { MOOUTSIDELBR = 0 } else { MOOUTSIDELBR = event.MOOUTSIDELBR }
    if (event.MOTEAMREMARKS == undefined || event.MOTEAMREMARKS == '' || event.MOTEAMREMARKS == null) { MOTEAMREMARKS = '' } else { MOTEAMREMARKS = event.MOTEAMREMARKS }
    if (event.MOSTARTTIME == undefined || event.MOSTARTTIME == null || event.MOSTARTTIME == '00:00:00') { MOSTARTTIME = '00:00:00'; } else { MOSTARTTIME = formatDate(event.MOSTARTTIME, 'yyyy-MM-dd hh:mm:ss', 'en-US') }
    if (event.MOTEAMENDTIME == undefined || event.MOTEAMENDTIME == null || event.MOTEAMENDTIME == '00:00:00') { MOTEAMENDTIME = '00:00:00'; } else { MOTEAMENDTIME = formatDate(event.MOTEAMENDTIME, 'yyyy-MM-dd hh:mm:ss', 'en-US') }
    dtlDataarray.push(
      {
        ID: "0",
        MOID: this.PopData.ID,
        MTID: this.PopData.ID,
        MOTEAMTYPE:event.MOTEAMTYPE,
        MOASSIGNEDTEAMID: event.MOASSIGNEDTEAMID,
        MOSTARTDATE: formatDate(event.MOSTARTDATE, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MOSTARTTIME: MOSTARTTIME,
        MOTEAMENDDATE: formatDate(event.MOTEAMENDDATE, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MOTEAMENDTIME: MOTEAMENDTIME,
        MOLBR: Number(MOLBR),
        MOPARTS: Number(MOPARTS),
        MOOUTSIDELBR: Number(MOOUTSIDELBR),
        MOTEAMREMARKS: MOTEAMREMARKS,
        // mtstatusid: event.mtstatusid
      });
      let i =0,consumedqty:number;
      for(let mdata of event.batchDetail)
        {

          if(mdata.totalconsumedqty == undefined || mdata.totalconsumedqty == null || mdata.totalconsumedqty == '') {consumedqty = 0} else {consumedqty = mdata.totalconsumedqty}
          // if(mdata.requiredby == undefined || mdata.requiredby == null || mdata.requiredby == '') {requiredby = ''} else {requiredby = formatDate(mdata.requiredby, 'yyyy-MM-dd', 'en-US')}

          if(consumedqty != 0){
          partsamtcalcarray.push({
            id: i+1,
            // reqnid:mdata.reqnid,
            mtid:mdata.mtid,
            teamid :event.MOASSIGNEDTEAMID,
            reqnid :mdata.reqnid,
            itemid :mdata.itemid,
            consumedqty : Number(consumedqty),
            itemrate :mdata.itemrate,
            coid: this.globalVar.CommpanyId,
            boid:this.globalVar.BranchId
            // woffquantity:0,
            // remarks: remarks,
            // receivedby:0,
            // requiredby: requiredby
          });
          i++;
        }
        }

      // dtlDataarray.push(
      //   {
      //     id: "0",
      //     MOID: this.PopData.id,
      //     MOTEAMTYPE:event.MOTEAMTYPE,
      //     MOASSIGNEDTEAMID: event.MOASSIGNEDTEAMID,
      //     MOSTARTDATE: formatDate(event.MOSTARTDATE, 'yyyy/MM/dd', 'en-US'),
      //     MOSTARTTIME: MOSTARTTIME,
      //     MOTEAMENDDATE: formatDate(event.MOTEAMENDDATE, 'yyyy/MM/dd', 'en-US'),
      //     MOTEAMENDTIME: MOTEAMENDTIME,
      //     MOLBR: MOLBR,
      //     MOPARTS: MOPARTS,
      //     MOOUTSIDELBR: MOOUTSIDELBR,
      //     MOTEAMREMARKS: MOTEAMREMARKS,
      //     // mtstatusid: event.mtstatusid
      //   });

    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('statementtype', 'saveprogress')
      .set('UserId', this.globalVar.UserId)
      .set('detailarray', JSON.stringify(dtlDataarray))
      .set('headerarray', JSON.stringify(hdrEmptyArray))
      .set('partsamtcalcarray', JSON.stringify(partsamtcalcarray))


    this.http.post(this.original_url+"/Maintenance/Ticket/savemoprogress", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        // this.isLoadingResults = false;
        this.successDialog();
        this.refresh()
        this.newContact = {};
      });
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
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
    });
  }
    else {
      this.supplierlist = [];
      this.arrayItemSupplier = '';
    }
  }
  //  total amount calculation
  calSummary() {
    var totallabouramt: number = 0;
    var totalpartsamt: number = 0;
    var totaloutlabouramt: number = 0;
    this.contacts.forEach((data) => {
      if (data.MOLBR == "" || data.MOLBR == undefined || data.MOLBR == null || data.MOLBR == NaN) { data.MOLBR = 0; } else { data.MOLBR = data.MOLBR; }
      if (data.MOPARTS == "" || data.MOPARTS == undefined || data.MOPARTS == null || data.MOPARTS == NaN) { data.MOPARTS = 0; } else { data.MOPARTS = data.MOPARTS; }
      if (data.MOOUTSIDELBR == "" || data.MOOUTSIDELBR == undefined || data.MOOUTSIDELBR == null || data.MOOUTSIDELBR == NaN) { data.MOOUTSIDELBR = 0; } else { data.MOOUTSIDELBR = data.MOOUTSIDELBR; }

      totallabouramt = totallabouramt + parseFloat(data.MOLBR);
      totalpartsamt = totalpartsamt + parseFloat(data.MOPARTS);
      totaloutlabouramt = totaloutlabouramt + parseFloat(data.MOOUTSIDELBR);
    });
    this.totallabouramt = totallabouramt.toFixed(2);
    this.totalpartsamt = totalpartsamt.toFixed(2);
    this.totaloutlabouramt = totaloutlabouramt.toFixed(2);
    this.totalshow = true;
    this.isLoadingResults=false;
  }

  // changeMo(data){
  //   if(data == true)
  //   {
  //   var flag: boolean;
  //   flag = true;
  //   var msg: any;
  //   msg = "<h5>Before add please rectify following mistakes:-</h5>";
  //   if (this.contacts.length == 0) { flag = false; msg = msg + "* There is No detail of Action Taken on this M.O. and No Cost Data entered.<br/>* Please enter atleast one Row with Remarks." }
  //   if (flag == false) {
  //     const dialogRef = this.dialog.open(ValidationComponent, {
  //       data: {
  //         msg: msg,
  //         action: ''
  //       }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {

  //     });
  //   }
  //   return flag;
  // }
  // }

  // header array validations
  validateBeforeSave(data, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Before add please rectify following mistakes:-</h5>";
    // need to enter 1 column from 3
    if ((data.MOTIMETAKENDAYS == undefined || data.MOTIMETAKENDAYS == null || data.MOTIMETAKENDAYS == '' || data.MOTIMETAKENDAYS == 0) &&
        (data.MOTOTTIMETAKENHRS == undefined || data.MOTOTTIMETAKENHRS == null || data.MOTOTTIMETAKENHRS == '' || data.MOTOTTIMETAKENHRS == 0) &&
        (data.MOTOTTIMETAKENMINS == undefined || data.MOTOTTIMETAKENMINS == null || data.MOTOTTIMETAKENMINS == '' || data.MOTOTTIMETAKENMINS == 0)) { flag = false; msg = msg + "* Please enter a valid Repair Time<br/>" }
        // need to enter 1 column from 3
    if ((data.MACHINEDOWNTIMEDAYS == undefined || data.MACHINEDOWNTIMEDAYS == null || data.MACHINEDOWNTIMEDAYS == '' || data.MACHINEDOWNTIMEDAYS == 0) &&
        (data.MACHINEDOWNTIMEHRS == undefined || data.MACHINEDOWNTIMEHRS == null || data.MACHINEDOWNTIMEHRS == '' || data.MACHINEDOWNTIMEHRS == 0) &&
        (data.MACHINEDOWNTIMEMINS == undefined || data.MACHINEDOWNTIMEMINS == null || data.MACHINEDOWNTIMEMINS == '' || data.MACHINEDOWNTIMEMINS == 0)) { flag = false; msg = msg + "* Please enter a valid Machine Downtime<br/>" }
    if (data.MOCOMPLETEDON == undefined || data.MOCOMPLETEDON == null || data.MOCOMPLETEDON == '') { flag = false; msg = msg + "* Please select M.O Completion Date<br/>" }
    if (data.MOCOMPLETEDAT == undefined || data.MOCOMPLETEDAT == null || data.MOCOMPLETEDAT == '') { flag = false; msg = msg + "* Please select M.O Completion Time<br/>" }
    if (data.MACHINEUPON == undefined || data.MACHINEUPON == null || data.MACHINEUPON == '') { flag = false; msg = msg + "* Please select Machine UP Date<br/>" }
    if (data.MACHINEUPAT == undefined || data.MACHINEUPAT == null || data.MACHINEUPAT == '') { flag = false; msg = msg + "* Please select Machine UP Time<br/>" }
    if (data.MOROOTCAUSEID == undefined || data.MOROOTCAUSEID == null || data.MOROOTCAUSEID == '') { flag = false; msg = msg + "* Please select Root Cause<br/>" }
    if (data.MOCLOSEDBY == undefined || data.MOCLOSEDBY == null || data.MOCLOSEDBY == '') { flag = false; msg = msg + "* Please select M.O Closed by<br/>" }
    if (data.MOCLOSEDON == undefined || data.MOCLOSEDON == null || data.MOCLOSEDON == '') { flag = false; msg = msg + "* Please Select M.O Closed on<br/>" }
    if (data.MOCLOSEDAT == undefined || data.MOCLOSEDAT == null || data.MOCLOSEDAT == '') { flag = false; msg = msg + "* Please select M.O Closed at<br/>" }
    if (data.nextmaintdate == undefined || data.nextmaintdate == null || data.nextmaintdate == '') { flag = false; msg = msg + "* Please select Next Maintenance Date<br/>" }
    if (data.MACHINEUPON > data.MOCLOSEDON) { flag = false; msg = msg + "* Machine Up Date should be less or equal to M.O closed on Date<br/>" }
    // if (this.contacts.length == 0) { flag = false; msg = msg + '* "There is No detail of Action Taken on this M.O. and No Cost Data entered.<br/>  Please enter atleast one Row with Remarks."'}
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
    // return flag;
    else {
      this.saveMO(data)
    }
  }

// detail array validations
  validateDetail(data) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Before add please rectify following mistakes:-</h5>";
    if (data.MOASSIGNEDTEAMID == undefined || data.MOASSIGNEDTEAMID == null || data.MOASSIGNEDTEAMID == '') { flag = false; msg = msg + "* Team not seletect<br/>" }
    if (data.MOSTARTDATE == undefined || data.MOSTARTDATE == null || data.MOSTARTDATE == '') { flag = false; msg = msg + "* Start Date not seletect<br/>" }
    if (data.MOTEAMENDDATE == undefined || data.MOTEAMENDDATE == null || data.MOTEAMENDDATE == '') { flag = false; msg = msg + "* End Date not entred<br/>" }
    // if (data.mtstatusid == undefined || data.mtstatusid == '' || data.mtstatusid == null) { flag = false; msg = msg + "* M.T. Status not selected.<br/>" }

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
    // return flag;
    else {
      this.addContact(data)
    }
  }

  validateMinutes(event, rowDetail) {
    if ( event >= 60) {
      rowDetail.MOTOTTIMETAKENMINS = 59;
    }
  }

  validateMinutes1(event, rowDetail) {
    if (event >= 60) {
      rowDetail.MACHINEDOWNTIMEMINS = 59;
    }
  }

  validateHours(event, rowDetail) {
    if (event >= 24) {
      rowDetail.MOTOTTIMETAKENHRS = 23;
    }
  }

  validateHours1(event, rowDetail) {
    if (event >= 24) {
      rowDetail.MACHINEDOWNTIMEHRS = 23;
    }
  }

  // single column master add popup
  openRootCause(row, menutype,type)
  {
    const dialogRef = this.dialog.open(AddSingleColumnMasterComponent, {
      width:'700px',
      data  : {
        data: row,
        menutype: menutype,
        action: type,
        userRightCheck: this.userRightCheck
      }
     });
 
     dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.get(this.original_url+'/Masters/CommonMasters/GetsinglecolumnmastersList?PageNumber=1&PageSize=200&sort=&coid='+this.globalVar.CommpanyId+'&boid='+this.globalVar.BranchId+'&sortorder=&search=&type='+menutype)
          .subscribe((res) => {
            let fieldArray: any;
            fieldArray = res;
              this.rootcauseDDarray = fieldArray.Table;
          });
      }
     });
  }

  // Image View
  imageView(rowDetail)
  {
    const dialogRef = this.dialog.open(ImageViewComponent, {
      width:'700px',
      data  : {
        data: rowDetail.imageinfo
      }
     });
  }

  // Image Remove
  removeImage(index)
  {
    this.imagesArray.splice(index,1);
  }

  // File Upload
  preview(files) {
    if (files.length === 0)
    return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      let i=0;
      for (let file of files) {
        this.imagesArray.push({
          id: i+1,
          filename: file.name,
          imageinfo: this.imgURL
        });
        this.formData.append(file.name, file);
        i++;
      }
    }
  }

  // Save Header Array || Close M.O
  saveMO(data) {
    this.isLoadingResults = true;
    var headerarray: Array<any> = [];
    var dtlEmptyArray: Array<any> = [];

    headerarray.push(
      {
        ID: "0",
        MOID: this.PopData.ID,
        MTID: this.PopData.ID,
        MOTIMETAKENDAYS: data.MOTIMETAKENDAYS,
        MOTOTTIMETAKENHRS: data.MOTOTTIMETAKENHRS,
        MOTOTTIMETAKENMINS: data.MOTOTTIMETAKENMINS,
        MACHINEDOWNTIMEDAYS: data.MACHINEDOWNTIMEDAYS,
        MACHINEDOWNTIMEHRS: data.MACHINEDOWNTIMEHRS,
        MACHINEDOWNTIMEMINS: data.MACHINEDOWNTIMEMINS,
        MOCOMPLETEDON: formatDate(data.MOCOMPLETEDON, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MOCOMPLETEDAT: formatDate(data.MOCOMPLETEDAT, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MACHINEUPON: formatDate(data.MACHINEUPON, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MACHINEUPAT: formatDate(data.MACHINEUPAT, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        HOURSSLOT: data.HOURSSLOT,
        MOROOTCAUSEID: data.MOROOTCAUSEID,
        MOCLOSEDBY: data.MOCLOSEDBY,
        nextmaintdate: formatDate(data.nextmaintdate, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MOCLOSEDON: formatDate(data.MOCLOSEDON, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        MOCLOSEDAT: formatDate(data.MOCLOSEDAT, 'yyyy-MM-dd hh:mm:ss', 'en-US'),
      });
    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('statementtype', 'closemo')
      .set('UserId', this.globalVar.UserId)
      .set('detailarray', JSON.stringify(dtlEmptyArray))
      .set('headerarray', JSON.stringify(headerarray))
      .set('partsamtcalcarray', JSON.stringify([]));

    this.http.post(this.original_url+"/Maintenance/Ticket/savemoprogress", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        // var imageArray: Array<any> = [];
        // var i = 0;
        // for (let mdata of this.imagesArray) {
        //   imageArray.push({
        //     id: 0,
        //     refid: 0,
        //     srno: i + 1,
        //     imageinfo: mdata.filename,
        //     remarks: '',
        //     isactive: 1
        //   });
        //   i++
        // }

        // if (this.imagesArray.length! > 0) {
        //   let progress: number;
        //   let message: any;
        //   const uploadReq = new HttpRequest('POST', this.original_url+'/Common/UploadFile?module=maint&form=maintenance-order&refid=' + this.PopData.ID + '&userid=' + this.globalVar.UserId + '&osservertype=' + this.globalVar + '&imageArray=' + JSON.stringify(imageArray) + '&tablename=db_mt.mo_images&remarks=', this.formData, {
        //     reportProgress: true
        //   });
        //   this.http.request(uploadReq).subscribe(event => {
        //     if (event.type === HttpEventType.UploadProgress){
        //       progress = Math.round(100 * event.loaded / event.total); 
        //     }
        //     if (event.type === HttpEventType.Response){
        //       this.successDialog();
        //       this.refresh();
        //       this.newData = {};
        //       message = event.body.toString();
        //     }
        //   });          
        // }
        // else {
          this.successDialog();
          this.refresh();
          this.newData = {};
        // }
      });
  }
}
