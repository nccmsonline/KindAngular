import { Global } from './../../../../../Global';

import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-maintenance-order-list-popup',
  templateUrl: './maintenance-order-list-popup.component.html',
  styleUrls: ['./maintenance-order-list-popup.component.css']
})
export class MaintenanceOrderListPopupComponent implements OnInit {

  original_url=environment.baseUrl;
  typeid:any;
  contacts: Array<any> = [];
  coid:any;
  boid: any;
  fyid: any;
  isLoadingResults = false;
  userid: any;
  userinfo: any;
  useraccesstoken:any;
  branch1Data:any;
  companyState:any;
  branch2Data:any;
  osservertype:any;
  newContact: any = {};
  editContactID: any = {};
  routeID: any;
  newData: any={};
  radioDDArray: Array<any> = [];
  myDate = new Date();
  Entrytype = 'Insert';

  constructor(
    public dialogRef: MatDialogRef<MaintenanceOrderListPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private http: HttpClient,
    private globalVar: Global,
    // private service: MaintenanceorderService,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.userid = this.userinfo['userid'];
    // this.coid = this.userinfo['coid'];
    // this.useraccesstoken = this.userinfo['useraccesstoken'];
    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.boid = this.branch1Data['boid'];
    // this.osservertype = this.branch1Data['osservertype'];
    // this.companyState = this.branch1Data['state'];
    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];
    this.newData.id = data.actionID;
    this.typeid = 1;
  }

  ngOnInit() {
    this.refresh();
  }
  
  refresh() {
    this.isLoadingResults = true;
    this.http.get(this.original_url+"/Masters/MachineMaster/GetMachineData?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + this.newData.id)
      .subscribe((response) => {
        this.isLoadingResults=false;
        var allDataGet: any;
        allDataGet = response;
        this.radioDDArray = allDataGet.Table4;
        this.contacts = allDataGet.Table5;
        this.contacts.forEach((res) => {
          res.scheduledate = res.scheduledate.toUTCString();
          res.DisabledRow = true;
        });
        if(this.contacts.length > 0)
        {
          this.typeid = this.contacts[0].typeid;
          this.Entrytype = 'Update';
        }
      });
  }

  changeRadio(event)
  {
    this.contacts = [];
    this.newContact = {};
  }

  validateDetail(data) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Before add please rectify following mistakes:-</h5>";
    if (this.typeid == undefined || this.typeid == null || this.typeid == '') { flag = false; msg = msg + "* Please select Under WTY or Under A.M.C<br/>" }
    if (data.amount == undefined || data.amount == null || data.amount == '') { flag = false; msg = msg + "* Please amount entered<br/>" }
    
    if((data.fromdate == undefined || data.fromdate == null || data.fromdate == '') && (data.todate == undefined || data.todate == null || data.todate == ''))
    {}else{
      if (data.scheduledate == undefined || data.scheduledate == null || data.scheduledate == '') { flag = false; msg = msg + "* Schedule Date Not selected<br/>" }
    }

    this.contacts.forEach((contact) => {
      if(contact.scheduledate == undefined || contact.scheduledate == null || contact.scheduledate == '')
      {} else {
        if(contact.scheduledate.getTime() == data.scheduledate.getTime())
        {
          flag = false; msg = msg + "* Schedule date same not allowed<br/>"
        }
      }
    });

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

  addContact() {
    if (this.validateDetail(this.newContact)) {
      this.contacts.push(this.newContact);
      this.contacts.forEach((contact, index) => {
        var num = 'id';
        var value = index + 1;
        contact[num] = value;
        contact['DisabledRow'] = false;
      });
      this.newContact = {};
    }
  }

  removeContact(index) {
    this.contacts.splice(index, 1);
  }

  editContact(data) {
    // if(data.DisabledRow == false)
    // {
      this.editContactID = data.id;
    // }
  }

  updateContact(val) {
    if (this.validateDetail(val)) {
      this.editContactID = {};
    }
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  // header array validations
  validateBeforeSave(data) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Before add please rectify following mistakes:-</h5>";
    if (this.contacts.length <= 0) { flag = false; msg = msg + "* Atleast add one Date<br/>" }

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
      this.saveMO(data)
    }
  }

  // Save Header Array || Close M.O
  saveMO(data) {
    this.isLoadingResults = true;
    var machineDetail: Array<any> = [];
    var scheduledate, remarks, settled, closedon, fromdate, todate;

    for (let mdata of this.contacts) {
      if (mdata.scheduledate == undefined || mdata.scheduledate == '' || mdata.scheduledate == null ) {scheduledate = ''} else {scheduledate = formatDate(mdata.scheduledate, 'yyyy-MM-dd', 'en-US')}
      if (mdata.remarks == undefined || mdata.remarks == '' || mdata.remarks == null ) {remarks = ''} else {remarks = mdata.remarks}
      if (mdata.settled == undefined || mdata.settled == '' || mdata.settled == null ) {settled = false} else {settled = mdata.settled}
      if (mdata.closedon == undefined || mdata.closedon == '' || mdata.closedon == null ) {closedon = ''} else {closedon = formatDate(mdata.closedon, 'yyyy-MM-dd', 'en-US')}
      if (mdata.fromdate == undefined || mdata.fromdate == '' || mdata.fromdate == null ) {fromdate = ''} else {fromdate = formatDate(mdata.fromdate, 'yyyy-MM-dd', 'en-US')}
      if (mdata.todate == undefined || mdata.todate == '' || mdata.todate == null ) {todate = ''} else {todate = formatDate(mdata.todate, 'yyyy-MM-dd', 'en-US')}

      machineDetail.push({
        id: mdata.id,
        machineid: this.newData.id,
        fromdate: fromdate,
        todate: todate,
        typeid: this.typeid,
        scheduledate: scheduledate,
        amount: mdata.amount,
        remarks: remarks,
        settled: settled,
        closedon: closedon
      });
    }

    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('Entrytype', 'Update')
      .set('UserId', this.globalVar.UserId)
      .set('machineamcschedulearray', JSON.stringify(machineDetail));

    this.http.post(this.original_url+"/masters/MachineMaster/savemachineamcschedule", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.dialogRef.close();
      });
  }
}

