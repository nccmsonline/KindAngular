import { ValidationComponent } from './../../../../validation/validation.component';
import { SuccessDialogComponent } from './../../../../Dialog/success-dialog/success-dialog.component';
import { Global } from '../../../../Global';
import { environment } from './../../../../../environments/environment';

import { Component, OnInit, Inject, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-double-column-master',
  templateUrl: './add-double-column-master.component.html',
  styleUrls: ['./add-double-column-master.component.css']
})
export class AddDoubleColumnMasterComponent implements OnInit {

  original_url = environment.baseUrl;
  @ViewChildren('code') vc;
  newData: any = {};
  singleMaster: FormGroup;
  actionGet: any;
  header: any;
  typeCategory: any;
  show: boolean = false;
  codeShow: boolean = false;
  myDate = new Date();
  convertDAte: any;
  action: any;
  Itemlist: any;
  Itemlistnew: Array<any> = [];
  arrayList: Array<string>;
  newarray: Array<string>;
  value: any;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  dataGet: any;
  subscription: Subscription;
  message: any;
  compare: any;
  isLoadingResults: boolean;
  errorMsg: any;
  idArray: Array<any> = [];
  entrycheck: any;
  allDataGet: any;
  filterlabel1: any;
  filterlabel2: any;
  filterlabel3: any;
  showfilter1 = false;
  showfilter2 = false;
  showfilter3 = false;
  showdatepicker = false;
  showmasterforradiobtn = false;
  showmasterfordropdownbtn = false;
  receiptFieldArray: any = {};
  userRightCheck: any = {};
  filterlist1: Array<any> = [];
  filterlist2: Array<any> = [];
  filterlist3: Array<any> = [];
  newfilterlist2: Array<any> = [];
  filterid4: any;
  radiobtnid: any;
  dropdownlistid: any;
  dropdownmstlist: Array<any> = [];
  radiobtnmstlist: Array<any> = [];
  canEditCommonClass = '';
  canCreateCommonClass = '';
  showcalenderreqd = false;
  showpaidcheckbox = false;
  showshortname = false;
  showcol3 = false;
  shownoofhelper = false;
  showdays = false;
  errorMsgnoofhelper = '';
  colorcode = "";
  column4label: any;
  column5label: any;
  showcolumn4 = false;
  showcolumn5 = false;
  COLUMN4LABEL: any;
  COLUMN5LABEL: any;
  id: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddDoubleColumnMasterComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    private globalVar: Global,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.createForm();
    console.log('data', data)
    this.entrycheck = data.entry;
    this.action = data.action;
    this.id = data.data;
    this.id = this.id.ID;
    this.actionGet = data.menutype;
    // this.filterlist1 = data.filterArray1;
    // this.filterlist2 = data.filterArray2;
    // this.newfilterlist2=data.filterArray2;
    // this.filterlist3 = data.filterArray3;
    // if (this.filterlist1 != undefined) { if (this.filterlist1.length > 0) { this.showfilter1 = true; } }
    // if (this.filterlist2 != undefined) { if (this.filterlist2.length > 0) { this.showfilter2 = true; } }
    // if (this.filterlist3 != undefined) { if (this.filterlist3.length > 0) { this.showfilter3 = true; } }
    // User Right
    this.userRightCheck = data.userRightCheck;
    if (this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }
    if (this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; }

    if (this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }
    if (this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; }

    this.http.get(this.original_url + "/production/ppc/PPC/getcommonapippc?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId)
      .subscribe((response: any[]) => {
        let allDataGet: any;
        allDataGet = response;
        this.radiobtnid = allDataGet.Table4[0].radiobtnid;
        this.dropdownlistid = allDataGet.Table4[0].dropdownlistid;
        this.dropdownmstlist = allDataGet.Table5;
      }), error => {
        this.isLoadingResults = false;
      }
      ;

    if (this.action == 'new') {
      this.isLoadingResults = true;
      this.http.get(this.original_url + "/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=100&sort=&sortorder=&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + this.id + "&type=" + this.actionGet)
        .subscribe(event => {
          let allDataGet: any;
          allDataGet = event;
          this.receiptFieldArray = allDataGet.Table1;
          this.Itemlist = allDataGet.Table;
          this.Itemlistnew = this.Itemlist;
          if (this.Itemlistnew !== undefined) {
            this.arrayList = this.Itemlistnew.map(person => person.NAME);
            this.filteredOptions = this.myControl.valueChanges
              .pipe(
                startWith(''),
                map(value => value.length >= 1 ? this._filter(value) : [])
              );
          }
          if (allDataGet.Table2 != undefined) { this.filterlist1 = allDataGet.Table2 } else { this.filterlist1 = [] }
          if (allDataGet.Table3 != undefined) {
            this.filterlist2 = allDataGet.Table3;
            this.newfilterlist2 = allDataGet.Table3;
          }
          else {
            this.filterlist2 = [];
            this.newfilterlist2 = [];
          }
          if (allDataGet.Table4 != undefined) { this.filterlist3 = allDataGet.Table4 } else { this.filterlist3 = [] }
          if (this.filterlist1 != undefined) { if (this.filterlist1.length > 0) { this.showfilter1 = true; } }
          if (this.filterlist2 != undefined) { if (this.filterlist2.length > 0) { this.showfilter2 = true; } }
          if (this.filterlist3 != undefined) { if (this.filterlist3.length > 0) { this.showfilter3 = true; } }


          this.header = this.receiptFieldArray[0].FROMNAME;
          this.filterlabel1 = this.receiptFieldArray[0].FILTER1LABEL;
          this.filterlabel2 = this.receiptFieldArray[0].FILTER2LABEL;
          this.filterlabel3 = this.receiptFieldArray[0].FILTER3LABEL;
          this.COLUMN4LABEL = this.receiptFieldArray[0].COLUMN4LABEL;
          this.COLUMN5LABEL = this.receiptFieldArray[0].COLUMN5LABEL;
          this.typeCategory = this.receiptFieldArray[0].TYPE;
          this.isLoadingResults = false;
          if (this.typeCategory == "ppcmajorstages") {
            this.showcalenderreqd = true;
          }
          else {
            this.showcalenderreqd = false;
          }
          if (this.typeCategory == "rosterstatus") {
            this.showpaidcheckbox = true;
          }
          else {
            this.showpaidcheckbox = false;
          }
          if (this.typeCategory == "modelmst" || this.typeCategory == 'rosterstatus' || this.typeCategory == "teamppc" || this.typeCategory == "shiptype" || this.typeCategory == "milestone") {
            this.showshortname = true;
          }
          else {
            this.showshortname = false;
          }
          if (this.COLUMN4LABEL == undefined || this.COLUMN4LABEL == null || this.COLUMN4LABEL == "") {
            this.showcolumn4 = false;
          }
          else {
            this.showcolumn4 = true;
          }
          if (this.COLUMN5LABEL == undefined || this.COLUMN5LABEL == null || this.COLUMN5LABEL == "") {
            this.showcolumn5 = false;
          }
          else {
            this.showcolumn5 = true;
          }
          this.errorMsg = this.receiptFieldArray[0].columnname1;
          let datepicker: any;
          datepicker = this.receiptFieldArray[0].datefiltercolumn;
          if (datepicker != undefined) {
            this.showdatepicker = true;
          }
          else {
            this.showdatepicker = false;
            this.arrayList = this.Itemlistnew.map(person => person.NAME.trim());
          }
        }, error => {
          this.isLoadingResults = false;
        });
    }
    else if (this.action == 'edit') {
      this.isLoadingResults = true;
      this.dataGet = data.data;
      this.http.get(this.original_url + "/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=100&sort=&sortorder=&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + this.id + "&type=" + this.actionGet)
        .subscribe(event => {

          let allDataGet: any;
          allDataGet = event;
          this.Itemlist = allDataGet.Table;
          this.receiptFieldArray = allDataGet.Table1;
          let headertable: Array<any> = allDataGet.Table;
          this.newData = headertable.filter(a => a.ID == this.id);
          this.newData = this.newData[0];
          this.isLoadingResults = false;
          if (allDataGet.Table2 != undefined) { this.filterlist1 = allDataGet.Table2 } else { this.filterlist1 = [] }
          if (allDataGet.Table3 != undefined) {
            this.filterlist2 = allDataGet.Table3;
            this.newfilterlist2 = allDataGet.Table3;
          }
          else {
            this.filterlist2 = [];
            this.newfilterlist2 = [];
          }
          if (allDataGet.Table4 != undefined) { this.filterlist3 = allDataGet.Table4 } else { this.filterlist3 = [] }
          if (this.filterlist1 != undefined) { if (this.filterlist1.length > 0) { this.showfilter1 = true; } }
          if (this.filterlist2 != undefined) { if (this.filterlist2.length > 0) { this.showfilter2 = true; } }
          if (this.filterlist3 != undefined) {
            if (this.filterlist3.length > 0) {
              this.showfilter3 = true;
              if (this.newData.FILTERID3 != undefined) {
                this.doSelectfilter3(this.newData.FILTERID3);
              }
            }
          }

          if (this.actionGet != 'teamppc') {
            this.newData.NAME = this.newData.NAME.toUpperCase();
            if (this.newData.code != undefined) { this.newData.code = this.newData.code } else { this.newData.code = '' }
          }
          this.newData.FILTERID1 = this.newData.FILTERID1;
          this.newData.FILTERID2 = this.newData.FILTERID2;
          this.newData.FILTERID3 = this.newData.FILTERID3;
          this.arrayList = this.Itemlist.map(person => person.NAME);

          this.filteredOptions = this.myControl.valueChanges
            .pipe(
              startWith(''),
              map(value => value.length >= 1 ? this._filter(value) : [])
            );
          this.header = this.receiptFieldArray[0].FROMNAME;
          this.filterlabel1 = this.receiptFieldArray[0].FILTER1LABEL;
          this.filterlabel2 = this.receiptFieldArray[0].FILTER2LABEL;
          this.filterlabel3 = this.receiptFieldArray[0].FILTER3LABEL;
          this.COLUMN4LABEL = this.receiptFieldArray[0].COLUMN4LABEL;
          this.COLUMN5LABEL = this.receiptFieldArray[0].COLUMN5LABEL;
          let datepicker: any;
          datepicker = this.receiptFieldArray[0].datefiltercolumn;
          if (datepicker != undefined) {
            this.showdatepicker = true;
            if (this.newData.NAME != undefined && this.newData.NAME != null && this.newData.NAME != "") {
              this.newData.NAME = new Date(this.newData.NAME);
            }
            else {
              this.newData.NAME = "";
            }
          }
          else {
            this.arrayList = this.Itemlist.map(person => person.NAME.trim());
          }
          this.header = this.receiptFieldArray[0].FROMNAME;
          this.typeCategory = this.receiptFieldArray[0].TYPE;
          if (this.typeCategory == "ppcmajorstages") {
            this.showcalenderreqd = true;
          }
          else {
            this.showcalenderreqd = false;
          }
          if (this.typeCategory == "rosterstatus") {
            this.showpaidcheckbox = true;
          }
          else {
            this.showpaidcheckbox = false;
          }

          if (this.typeCategory == "modelmst") {
            this.showshortname = true;
            this.showcol3 = true;
          }
          else {
            this.showshortname = false;
            this.showcol3 = false;
          }
          if (this.COLUMN4LABEL == undefined || this.COLUMN4LABEL == null || this.COLUMN4LABEL == "") {
            this.showcolumn4 = false;
          }
          else {
            this.showcolumn4 = true;
          }
          if (this.COLUMN5LABEL == undefined || this.COLUMN5LABEL == null || this.COLUMN5LABEL == "") {
            this.showcolumn5 = false;
          }
          else {
            this.showcolumn5 = true;
          }
          if (this.typeCategory == "teamppc" || this.typeCategory == 'rosterstatus' || this.typeCategory == 'milestone') {
            this.showshortname = true;
          }
          else {
            this.showshortname = false;
          }
          this.errorMsg = this.receiptFieldArray[0].columnname1;
        }, error => {
          this.isLoadingResults = false;
        });
      // if(this.newData.FILTERID3!=undefined){
      //   if(this.newData.FILTERID3==this.dropdownlistid){
      //     this.doSelectfilter4(this.newData.FILTERID3);
      //   }
      //   else if(this.newData.FILTERID3==this.radiobtnid){
      //     this.doSelectfilter5(this.newData.FILTERID3);
      //   }
      // }
    }

    // this.subscription =
    //   this.messageService.getMessage()
    //     .subscribe(message => {
    //       this.message = message;
    //       if (this.message != null) {
    //         this.dialogRef.close();
    //       }
    //     });
  }

  ngOnInit() {
  }

  // Color Change
  onChangeColor(color: string) {
    if (this.typeCategory == "rosterstatus") {
      this.newData.COLUMNNAME5 = color;
    }
    else {
      this.newData.code = color;
    }
    this.colorcode = color;
  }

  validnoofhelper(event) {
    if (event == 0 || event > 99) {
      this.shownoofhelper = true;
      this.errorMsgnoofhelper = 'Please enter valid no.';
    }
    else {
      this.shownoofhelper = false;
      this.errorMsgnoofhelper = '';
    }
  }

  doSelectfilter1(event) {
    if (event) {
      if (this.showfilter2 == true && this.typeCategory == "stagesparameters") {
        this.newfilterlist2 = this.filterlist2.filter(a => a.filter1 == event);
      }
    }
    else {
      this.newfilterlist2 = this.filterlist2;
    }
  }
  doSelectfilter2(event) {

  }
  doSelectfilter3(event) {
    if (event == this.radiobtnid) {
      this.showmasterforradiobtn = true;
      this.showmasterfordropdownbtn = false;
    }
    else if (event == this.dropdownlistid) {
      this.showmasterfordropdownbtn = true;
      this.showmasterforradiobtn = false;
    }
    else {
      this.showmasterfordropdownbtn = false;
      this.showmasterforradiobtn = false;
    }
  }

  doSelectfilter4(event) {

  }

  doSelectfilter5(event) {

  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.arrayList.filter(option => option.toLowerCase().includes(filterValue));
  }

  createForm() {
    this.singleMaster = this.fb.group({
      id: '',
      // name: [null, Validators.required],
      name: '',
      code: '',
      col3: '',
      COLUMNNAME4: '',
      COLUMNNAME5: '',
      FILTERID1: [null, Validators.required],
      FILTERID2: [null, Validators.required],
      FILTERID3: [null, Validators.required],
      FILTERID4: [null, Validators.required],
      FILTERID5: [null, Validators.required],
    });
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  checkteamlead(event) {
    console.log(event, "event")
    if (event.checked == true) {

    }
  }

  saveData(data, actiondata, action) {
    debugger
    console.log('mmycontrol', this.myControl)
    this.value = this.myControl;
    this.compare = this.value

    if (this.compare._pendingValue == undefined) { this.compare._pendingValue = '' }
    if (this.showdatepicker == false) {
      // this.compare = this.compare._pendingValue.toLowerCase().trim();
    }
    else {
      this.compare = formatDate(this.compare._pendingValue, 'yyyy-MM-dd', 'en-US');
    }
    if (this.compare == '' || this.compare == undefined || this.compare == null) {
      let msg = "* Please enter Name";
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    }
    else {
      this.isLoadingResults = true;
      this.show = false;
      this.codeShow = false;
      this.convertDAte = formatDate(this.myDate, 'yyyy-MM-dd', 'en-US');

      // Check Duplicate
      if (action == 'Insert') {
        if (this.arrayList == undefined) {
          this.arrayList = [];
        }
        if (this.showdatepicker == false) {
          this.newarray = this.arrayList.map(v => v.toLowerCase());
        }
        else {
          this.newarray = this.arrayList.map(v => formatDate(v, 'yyyy-MM-dd', 'en-US'));
        }
        if (this.newarray.find(fruit => fruit == this.compare)) {
          this.show = true;
          setTimeout(() => {
            this.isLoadingResults = false;
          }, 500);
        }
      }
      else {
        this.show = false;
      }

      if (this.show == false) {
        this.show = false;
        this.value = this.value._pendingValue;
        setTimeout(() => {
          this.isLoadingResults = false;
        }, 500);
        let mainID: any;
        if (action == 'Insert') {
          mainID = '0';
        }
        else if (action == 'Update') {
          mainID = data.id;
        }

        setTimeout(() => {
          this.isLoadingResults = false;
        }, 3000);

        if (this.showfilter1 == true) {
          data.FILTERID1 = this.globalVar.checknull(data.FILTERID1, "string");
        }
        else {
          data.FILTERID1 = '';
        }

        if (this.showdatepicker == true) {
          data.NAME = this.globalVar.checknull(data.NAME, "Date");
        }

        if (this.showfilter2 == true) {
          data.FILTERID2 = this.globalVar.checknull(data.FILTERID2, "string");
        }
        else {
          data.FILTERID2 = '';
        }

        if (this.showfilter3 == true) {
          data.FILTERID3 = this.globalVar.checknull(data.FILTERID3, "string");
          data.filterid4 = this.globalVar.checknull(data.filterid4, "string");
          data.filterid5 = this.globalVar.checknull(data.filterid5, "string");
        }
        else {
          data.FILTERID3 = '';
          data.filterid4 = '';
          data.filterid5 = '';
        }
        if (data.filterid4 == undefined && data.filterid5 == undefined) { this.filterid4 = "" }
        else if (data.filterid4 == undefined) { this.filterid4 = data.filterid5 } else { this.filterid4 = data.filterid4 }

        if (this.typeCategory == "shiptype" || this.typeCategory == "milestone") {
          data.code = this.globalVar.checknull(data.code, "number");
        }
        else {
          data.code = this.globalVar.checknull(data.code, "string");
        }

        if (this.typeCategory == "businesssegment") {
          data.code = data.FILTERID1;
          data.col3 = "";
        }
        data.COLUMNNAME4 = this.globalVar.checknull(data.COLUMNNAME4, "boolean")
        data.COLUMNNAME5 = this.globalVar.checknull(data.COLUMNNAME5, "string")
        // data.col3 = this.globalVar.checknull(data.col3, "string");

        if (this.codeShow == false) {
          const params = new HttpParams()
            .set('coid', this.globalVar.CommpanyId)
            .set('boid', this.globalVar.BranchId)
            .set('userid', this.globalVar.userid)
            .set('type', this.actionGet)
            .set('statementtype', action)
            .set('id', this.id)
            .set('name', this.value)
            .set('code', data.code)
            .set('col3', '')
            .set('columnname4', data.COLUMNNAME4)
            .set('columnname5', data.COLUMNNAME5)
            .set('filterid1', data.FILTERID1)
            .set('filterid2', data.FILTERID2)
            .set('filterid3', data.FILTERID3)
            .set('dated', this.convertDAte);

          this.http.post(this.original_url + "/Masters/CommonMaster/savedoublecolumnmastersdata", params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          })
            .subscribe(res => {
              // this.doubleColumnMasterService.savePushData(res, actiondata);
              this.isLoadingResults = false;
              this.successDialog();
              this.dialogRef.close(this.value);
            }, error => {
              this.isLoadingResults = false;
            });
        }
      }
    }
  }

}
