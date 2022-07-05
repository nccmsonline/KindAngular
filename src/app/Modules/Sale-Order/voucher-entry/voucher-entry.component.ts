import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { templateSourceUrl } from '@angular/compiler';
declare var $: any;
declare var jQuery: any;
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-voucher-entry',
  templateUrl: './voucher-entry.component.html',
  styleUrls: ['./voucher-entry.component.css']
})
export class VoucherEntryComponent implements OnInit {
  
  receiptForm: FormGroup;
  paymentForm: FormGroup;
  contraForm: FormGroup;
  journalForm: FormGroup;

  // Common Variable
  viewMode = 'receipt';
  p: number = 1;
  userinfo: any;
  coid:string;
  boid: string;
  userid: string;
  bankData: Array<any> = [];
  allGetBankData: any;
  vouchercategory: Array<any> = [];
  particularArray: Array<any> = [];
  allGetParticularData: any;
  commonArray : any;

  // Receipt Variable
  receiptFieldArray: Array<any> = [];
  receiptNewAttribute: any = {};
  receiptEditRowID: any={};
  receiptStaffData: Array<any> = [];
  receiptTotalCRAmount: number = 0;
  receiptCrAmount: number = 0;
  receiptVoucheramount: string;
  receiptdrcr: string;
  receiptOnChangedate: any = {};

  // Payment Variable
  paymentFieldArray: Array<any> = [];
  paymentNewAttribute: any = {};
  paymentEditRowID: any={};
  paymentStaffData: Array<any> = [];
  paymentTotalDRAmount: number = 0;
  paymentDrAmount: number = 0;
  paymentVoucheramount: string;
  paymentdrcr: string;
  paymentOnChangedate: any = {};

  // Contra Variable
  contraFieldArray: Array<any> = [];
  contraNewAttribute: any = {};
  contraEditRowID: any={};
  contraStaffData: Array<any> = [];
  contraTotalCRAmount: number = 0;
  contraCrAmount: number = 0;
  contraVoucheramount: string;
  contradrcr: string;
  contraOnChangedate: any = {};

  // Journal Variable
  journalFieldArray: Array<any> = [];
  journalNewAttribute: any = {};
  journalEditRowID: any={};
  journalStaffData: Array<any> = [];
  journalTotalCRAmount: number = 0;
  journalCrAmount: number = 0;
  journalVoucheramount: string;
  journaldrcr: string;
  journalOnChangedate: any = {};
  journalTotalDRAmount: number = 0;
  journalDrAmount: number = 0;
  totalMismatch: number = 0;

  

  constructor(private http: HttpClient, private fb: FormBuilder)
  {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.userid = this.userinfo['userid'];

    this.receiptCreateForm();
    this.paymentCreateForm();
    this.contraCreateForm();
    this.journalCreateForm();

    this.http.get("http://suvidhaapi.suvidhacloud.com/api/FA/FA/vouchercategory")
      .subscribe((res: any[]) => {
        this.vouchercategory = res;
      })

    this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountHeads/GetGLAccountHeads?coid="+this.coid+"&boid="+this.boid)
      .subscribe((res: any[]) => {
        this.allGetParticularData = res;
        this.particularArray = this.allGetParticularData.Table;
      })
  }

  ngOnInit() {
      this.http.get("http://suvidhaapi.suvidhacloud.com/api/FA/FA/getallbanks?coid="+this.coid+"&boid="+this.boid)
      .subscribe((res: any[]) => {
        this.allGetBankData = res;
        this.bankData = this.allGetBankData.Table;
      })
  }

  // Receipt Start
  receiptCreateForm() {
    this.receiptForm = this.fb.group({
      id: '',
      coid: '',
      boid: '',
      accountid: ['', Validators.required ],
      userid: '',
      credit: ['', Validators.required ],
      date: {disabled: true, value: ''},
      debit: '',
      drcr: '',
      isconfirm: '',
      narration: ['', Validators.required ],
      refid: '',
      rowno: '',
      voucheramount: '',
      vouchercategory: '',
      voucherdate: '',
      voucherno: '',
      vouchertype: '',
      provisional:'',
      receiptCashBankID: '',
    });
  }
  receiptEdit(val){
    this.receiptEditRowID = val;
  }
  receiptUpdate(val){
    this.receiptEditRowID = {};
  }
  receiptAddFieldValue() {
    this.receiptFieldArray.push(this.receiptNewAttribute);
      this.receiptFieldArray.forEach((item,index) => {
        var num = 'rowno';
        var value = index+1;
        item[num] = value;
        var num1 = 'id';
        var value1 = index+1;
        item[num1] = value1;
        this.receiptCrAmount = Number(item.credit);
    });
    this.receiptTotalCRAmount = this.receiptCrAmount + this.receiptTotalCRAmount;
    this.receiptNewAttribute = {};
  }
  receiptDeleteFieldValue(index) {
      this.receiptFieldArray.splice(index, 1);
  }
  receiptRowSelected(data)
  {
    this.receiptStaffData = [];
    this.receiptStaffData.push(data);
  }
  // Receipt End

  // Payment Start
  paymentCreateForm() {
    this.paymentForm = this.fb.group({
      id: '',
      coid: '',
      boid: '',
      accountid: ['', Validators.required ],
      userid: '',
      credit: '',
      date: {disabled: true, value: ''},
      debit: ['', Validators.required ],
      drcr: '',
      isconfirm: '',
      narration: ['', Validators.required ],
      refid: '',
      rowno: '',
      voucheramount: '',
      vouchercategory: '',
      voucherdate: '',
      voucherno: '',
      vouchertype: '',
      provisional:'',
      paymentCashBankID: '',
    });
  }
  paymentEdit(val){
    this.paymentEditRowID = val; 
  }
  paymentUpdate(val){
    this.paymentEditRowID = {};
  }
  paymentAddFieldValue() {
    this.paymentFieldArray.push(this.paymentNewAttribute);
      this.paymentFieldArray.forEach((item,index) => {
        var num = 'rowno';
        var value = index+1;
        item[num] = value;
        var num1 = 'id';
        var value1 = index+1;
        item[num1] = value1;
        this.paymentDrAmount = Number(item.debit);
    });
    this.paymentTotalDRAmount = this.paymentDrAmount + this.paymentTotalDRAmount;
    this.paymentNewAttribute = {};
  }
  paymentDeleteFieldValue(index) {
      this.paymentFieldArray.splice(index, 1);
  }
  paymentRowSelected(data)
  {
    this.paymentStaffData = [];
    this.paymentStaffData.push(data);
  }
  // Payment End
  
  // Contra Start
  contraCreateForm() {
    this.contraForm = this.fb.group({
      id: '',
      coid: '',
      boid: '',
      accountid: ['', Validators.required ],
      userid: '',
      credit: ['', Validators.required ],
      date: {disabled: true, value: ''},
      debit: '',
      drcr: '',
      isconfirm: '',
      narration: ['', Validators.required ],
      refid: '',
      rowno: '',
      voucheramount: '',
      vouchercategory: '',
      voucherdate: '',
      voucherno: '',
      vouchertype: '',
      provisional:'',
      contraCashBankID: '',
    });
  }
  contraEdit(val){
    this.contraEditRowID = val; 
  }
  contraUpdate(val){
    this.contraEditRowID = {};
  }
  contraAddFieldValue() {
    this.contraFieldArray.push(this.contraNewAttribute);
      this.contraFieldArray.forEach((item,index) => {
        var num = 'rowno';
        var value = index+1;
        item[num] = value;
        var num1 = 'id';
        var value1 = index+1;
        item[num1] = value1;
        this.contraCrAmount = Number(item.credit);
    });
    this.contraTotalCRAmount = this.contraCrAmount + this.contraTotalCRAmount;
    this.contraNewAttribute = {};
  }
  contraDeleteFieldValue(index) {
      this.contraFieldArray.splice(index, 1);
  }
  contraRowSelected(data)
  {
    this.contraStaffData = [];
    this.contraStaffData.push(data);
  }
  // Contra End

  // Journal Start
  journalCreateForm() {
    this.journalForm = this.fb.group({
      id: '',
      coid: '',
      boid: '',
      accountid: ['', Validators.required ],
      userid: '',
      credit: ['', Validators.required ],
      date: {disabled: true, value: ''},
      debit: ['', Validators.required ],
      drcr: '',
      isconfirm: '',
      narration: ['', Validators.required ],
      refid: '',
      rowno: '',
      voucheramount: '',
      vouchercategory: '',
      voucherdate: '',
      voucherno: '',
      vouchertype: '',
      provisional:'',
    });
  }
  onDebitChange(event){
    this.journalNewAttribute.credit = '0';
  }
  onCreditChange(){
    this.journalNewAttribute.debit = '0';
  }
  journalEdit(newArray){
    this.journalEditRowID = newArray.id;
    console.log("newArray", newArray);
    
    // if(newArray.credit)
  }
  journalUpdate(val){
    this.journalEditRowID = {};
  }
  journalAddFieldValue() {
    this.journalFieldArray.push(this.journalNewAttribute);
      this.journalFieldArray.forEach((item,index) => {
        var num = 'rowno';
        var value = index+1;
        item[num] = value;
        var num1 = 'id';
        var value1 = index+1;
        item[num1] = value1;
        this.journalCrAmount = Number(item.credit);

        this.journalDrAmount = Number(item.debit);
    });
    this.journalTotalCRAmount = this.journalCrAmount + this.journalTotalCRAmount;
    this.journalTotalDRAmount = this.journalDrAmount + this.journalTotalDRAmount;

    this.totalMismatch = this.journalTotalDRAmount - this.journalTotalCRAmount;

    this.journalNewAttribute = {};
  }
  journalDeleteFieldValue(index) {
      this.journalFieldArray.splice(index, 1);
  }
  journalRowSelected(data)
  {
    this.journalStaffData = [];
    this.journalStaffData.push(data);
  }
  // Journal End

  voucherSave(data, category, tab)
  {
    console.log("category", category);
    if(category == "receipt") {
      console.log("1");
      if(data.receiptCashBankID == undefined) { data.receiptCashBankID = '0'; }
      this.receiptFieldArray.forEach((el) => {
        this.receiptdrcr = 'C';
        this.receiptVoucheramount = el.credit;
        delete el['credit'];
        Object.assign(el, {
          id: '0', coid: this.coid, boid: this.boid, userid: this.userid, voucherno: '1',
          voucherdate: formatDate(data.date, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'),
          refid: '0', isconfirm: 1, vouchertype: 'J',
          vouchercategory: 'V', drcr: this.receiptdrcr, voucheramount: this.receiptVoucheramount,
          trntype: tab.id, cashbankid: data.receiptCashBankID, totalamount: this.receiptTotalCRAmount
        });
      });
      this.commonArray = this.receiptFieldArray;
    } else if(category == "payment") {
      console.log("2", data);
      if(data.paymentCashBankID == undefined) { data.paymentCashBankID = '0'; }
      this.paymentFieldArray.forEach((el) => {
        this.paymentdrcr = 'D';
        this.paymentVoucheramount = el.debit;
        delete el['debit'];
        Object.assign(el, {
          id: '0',
          coid: this.coid,
          boid: this.boid,
          userid: this.userid,
          voucherno: '1',
          voucherdate: formatDate(data.date, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'),
          refid: '0',
          isconfirm: 1,
          vouchertype: 'J',
          vouchercategory: 'V',
          drcr: this.paymentdrcr,
          voucheramount: this.paymentVoucheramount,
          trntype: tab.id,
          cashbankid: data.paymentCashBankID,
          totalamount: this.paymentTotalDRAmount
        });
      });
      this.commonArray = this.paymentFieldArray;
    } else if(category == "contra") {
      console.log("3", data);

      if(data.contraCashBankID == undefined) { data.contraCashBankID = '0'; }
      this.contraFieldArray.forEach((el) => {
        this.contradrcr = 'C';
        this.contraVoucheramount = el.credit;
        delete el['credit'];
        Object.assign(el, {
          id: '0', coid: this.coid, boid: this.boid, userid: this.userid, voucherno: '1',
          voucherdate: formatDate(data.date, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'),
          refid: '0', isconfirm: 1, vouchertype: 'J',
          vouchercategory: 'V', drcr: this.contradrcr, voucheramount: this.contraVoucheramount,
          trntype: tab.id, cashbankid: data.contraCashBankID, totalamount: this.contraTotalCRAmount
        });
      });
      this.commonArray = this.contraFieldArray;
    } else if(category == "journal") {
      console.log("4", data);

      if(data.journalCashBankID == undefined) { data.journalCashBankID = '0'; }
      this.journalFieldArray.forEach((el) => {
        this.journaldrcr = 'C';
        this.journalVoucheramount = el.credit;
        delete el['credit'];
        delete el['debit'];
        Object.assign(el, {
          id: '0', coid: this.coid, boid: this.boid, userid: this.userid, voucherno: '1',
          voucherdate: formatDate(data.date, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530'),
          refid: '0', isconfirm: 1, vouchertype: 'J',
          vouchercategory: 'V', drcr: this.journaldrcr, voucheramount: this.journalVoucheramount,
          trntype: tab.id, cashbankid: data.journalCashBankID, totalamount: this.journalTotalCRAmount
        });
      });
      this.commonArray = this.journalFieldArray;
    }

    console.log("this.commonArray", this.commonArray);


    // let params = new HttpParams();
    // params = params.append('voucherarray', JSON.stringify(this.receiptFieldArray));
    // console.log("params", params);

    // this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/FA/FA/SaveVoucher?voucherentrytype=Insert&voucherarray="+JSON.stringify(this.receiptFieldArray), {data: ''})
    //   .subscribe((res) => {
    //      console.log("Punjab Singh", res);
    //      this.receiptOnChangedate = {};
    //      this.receiptFieldArray = [];
    //   });
  }
}