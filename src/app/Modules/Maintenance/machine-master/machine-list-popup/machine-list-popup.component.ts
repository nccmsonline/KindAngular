import { Global } from './../../../../Global';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-machine-list-popup',
  templateUrl: './machine-list-popup.component.html',
  styleUrls: ['./machine-list-popup.component.css']
})
export class MachineListPopupComponent implements OnInit {

  original_url=environment.baseUrl;
  TYPEID:any;
  contacts: Array<any> = [];
  isLoadingResults = false;
  newContact: any = {};
  editContactID: any = {};
  routeID: any;
  newData: any={};
  radioDDArray: Array<any> = [];
  myDate = new Date();
  Entrytype = 'Insert';
  canCreateCommonClass:any;
  id: any;
  action: any;
  moduleid: any;
  functionalityid: any;

  constructor(
    public dialogRef: MatDialogRef<MachineListPopupComponent>,
    public dialog: MatDialog,
    private globalVar: Global,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private http: HttpClient,
    // private service: MaintenanceorderService,
  ) {
    this.radioDDArray=[{id:1,name:"Under Wty."},{id:2,name:"Under A.M.c"}]
    console.log("data",data)
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.newData = data.actionData;
    this.id = data.actionData;
    this.id = this.id.MACHINEID;
    this.TYPEID = 1;
  }

  ngOnInit() {
    this.refresh();
  }
  
  refresh() {
    this.isLoadingResults = true;
    this.http.get(this.original_url + "/Masters/MachineMaster/GetMachineData?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" +this.id)
      .subscribe((response) => {
        this.isLoadingResults=false;
        var allDataGet: any;
        allDataGet = response;
        this.newData=allDataGet.Table[0],
        this.contacts = allDataGet.Table7;
        this.contacts.forEach((res) => {
          res.SCHEDULEDATE = res.SCHEDULEDATE.toUTCString();
        });
        if(this.contacts.length > 0)
        {
          this.TYPEID = this.contacts[0].TYPEID;
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
    if (this.TYPEID == undefined || this.TYPEID == null || this.TYPEID == '') { flag = false; msg = msg + "* Please select Under WTY or Under A.M.C<br/>" }
    if (data.AMOUNT == undefined || data.AMOUNT == null || data.AMOUNT == '') { flag = false; msg = msg + "* Please AMOUNT entered<br/>" }
    
    if((data.FROMDATE == undefined || data.FROMDATE == null || data.FROMDATE == '') && (data.TODATE == undefined || data.TODATE == null || data.TODATE == ''))
    {}else{
      if (data.SCHEDULEDATE == undefined || data.SCHEDULEDATE == null || data.SCHEDULEDATE == '') { flag = false; msg = msg + "* schedule Date Not selected<br/>" }
    }

    this.contacts.forEach((contact) => {
      if(contact.SCHEDULEDATE == undefined || contact.SCHEDULEDATE == null || contact.SCHEDULEDATE == '')
      {} else {
        if(contact.SCHEDULEDATE.getTime() == data.SCHEDULEDATE.getTime())
        {
          flag = false; msg = msg + "* schedule date same not allowed<br/>"
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
      });
      this.newContact = {};
    }
  }

  removeContact(index) {
    this.contacts.splice(index, 1);
  }

  editContact(val) {
    this.editContactID = val;
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
    var SCHEDULEDATE, REMARKS, FROMDATE, TODATE;

    for (let mdata of this.contacts) {
      if (mdata.SCHEDULEDATE == undefined || mdata.SCHEDULEDATE == '' || mdata.SCHEDULEDATE == null ) {SCHEDULEDATE = ''} else {SCHEDULEDATE = formatDate(mdata.SCHEDULEDATE, 'yyyy-MM-dd', 'en-US')}
      if (mdata.FROMDATE == undefined || mdata.FROMDATE == '' || mdata.FROMDATE == null ) {FROMDATE = ''} else {FROMDATE = formatDate(mdata.FROMDATE, 'yyyy-MM-dd', 'en-US')}
      if (mdata.TODATE == undefined || mdata.TODATE == '' || mdata.TODATE == null ) {TODATE = ''} else {TODATE = formatDate(mdata.TODATE, 'yyyy-MM-dd', 'en-US')}
      if (mdata.REMARKS == undefined || mdata.REMARKS == '' || mdata.REMARKS == null ) {REMARKS = ''} else {REMARKS = REMARKS}
      machineDetail.push({
        ID: mdata.id,
        MCID: this.id,
        FROMDATE: FROMDATE,
        TODATE: TODATE,
        TYPEID: this.TYPEID,
        SCHEDULEDATE: SCHEDULEDATE,
        AMOUNT: mdata.AMOUNT,
        REMARKS: REMARKS,
        SETTLED: 0,
        ISACTIVE:0,
      });
    }

    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('statementtype', this.Entrytype)
      .set('UserId', this.globalVar.UserId)
      .set('machineamcschedulearray', JSON.stringify(machineDetail));

    this.http.post(this.original_url + "/Masters/MachineMaster/savemachineamcschedule", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.dialogRef.close();
      });
  }
}