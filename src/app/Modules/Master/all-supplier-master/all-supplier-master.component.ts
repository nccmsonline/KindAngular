import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;
declare var jQuery: any;
import { animate } from '@angular/animations';
import { SupplierMasterService } from './supplier-master.service';
import { Observable } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import {ConfirmationDialogComponent} from '../../../Dialog/confirmation-dialog/confirmation-dialog.component'
import {ConfirmationDialogService} from '../../../Dialog/confirmation-dialog/confirmation-dialog.service'
import {INgxSelectOption} from    '../../../../assets/ngx-select/ngx-select.interfaces';
 import{SuccessDialogComponent  }   from '../../../Dialog/success-dialog/success-dialog.component'
 import { environment } from '../../../../environments/environment';
// import { t } from '@angular/core/src/render3';
@Component({
  selector: 'app-all-supplier-master',
  templateUrl: './all-supplier-master.component.html',
  styleUrls: ['./all-supplier-master.component.css']
})
export class AllSupplierMasterComponent implements OnInit {
  original_url=environment.baseUrl;
  subscription: Subscription;
  message: any;
  data:any={};
  singleSelect: any = [];
  countryID:any;
  StateId:any
  cityId :any;
  bankArray: Array<any> = [];
  country: Array<any> = [];
  StateArray: Array<any> = [];
  cityArray: Array<any> = [];
  userinfo: any;
  action: string;
  actionid: any;
  currentSection = 'section1';
  coid:string;
  boid: string;
  id: string;
  suppliercategorylist:Array<any> = [];
  // fieldArray :any=[];
  newData: any = {};
  supplierForm: FormGroup;
  newdataarray: Array<any> = [];

  // contact
  contacts: Array<any> = [];
  newContact: any = {};
  editContactID: any={};
  contactName: any;
  contactMobile: any;
  contactPhone: any;
  contactFax: any;
  contactEmail: any;
  contactPosition: any;
  CurrencyList:any;

  // Licence
  licences: Array<any> = [];
  newlicence: any = {};
  editLicenceID: any={};

  // Other Info
  otherinfobank: Array<any> = [];
  newOtherInfo: any = {};
  editOtherInfoID: any={};
  myDate = new Date();
  selectedDate : any;
  allSupplierDataGet: any;
  allGetCountry: any;
  allGetBank: any;
  allGetCity: any;
  allGetState: any;
 
  isLoadingResults:any;
  config2= {
    displayKey:"cityname", //if objects array passed which key to be displayed defaults to description
    search:true ,//true/false for the search functionlity defaults to false,
    height: '200px' ,//height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'' ,// text to be displayed when no item is selected defaults to Select,
    customComparator: ()=>{} ,// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: this.cityArray.length,// a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search' // label thats displayed in search input
  }

  public ngxControl = new FormControl();
 
    private _ngxDefaultTimeout;
    private _ngxDefaultInterval;
    private _ngxDefault;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private supplierMasterService: SupplierMasterService,
    private messageService: ConfirmationDialogService,
    public dialog: MatDialog
  ) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid ="1";
    this.boid = "1";
    this.createForm();
    this.action = 'add';
    this.showData();
  }
  showData()
  {
    let tmpCategory:Array<any>=[];
    let tmpCat:Array<number>=[];
    this.action = 'edit';
    let supplierData:any={};
    let tmp = sessionStorage.getItem("supplierData");
    supplierData = JSON.parse(tmp);
    this.newData=supplierData.Table[0];
    this.country=supplierData.Table1;
    this.StateArray=supplierData.Table2;
    this.contacts=supplierData.Table3;
    this.otherinfobank=supplierData.Table4;
    tmpCategory=supplierData.Table5;
    tmpCategory.forEach((el)=>{
      tmpCat.push(el.CATEGORYID);
    });
    this.newData.CATEGORYID=tmpCat;
    this.onChangeState();
  } 
  ngOnInit() {
    
    this.supplierMasterService.supplierCategoryList()
    .subscribe((response) => {
      this.allGetCountry = response;
      this.allGetCountry = this.allGetCountry.Table;
      this.suppliercategorylist= this.allGetCountry;
    });

    
      this.supplierMasterService.CountryList()
      .subscribe((response) => {
        this.allGetCountry = response;
        this.allGetCountry = this.allGetCountry.Table;
        this.country= this.allGetCountry;
      });
       
      this.supplierMasterService.BankList()
        .subscribe((response) => {
          this.allGetBank = response;
          this.allGetBank = this.allGetBank.Table;
          this.bankArray= this.allGetBank;
          console.log("List1", this.bankArray);
        });
      this.supplierMasterService.Currencylist()
      .subscribe((response) => {
        this.CurrencyList = response;
        this.CurrencyList = this.CurrencyList.Table;
        
      });
        this._ngxDefaultTimeout = setTimeout(() => {
          this._ngxDefaultInterval = setInterval(() => {
              const idx = Math.floor(Math.random() * (this.country.length - 1));
              this._ngxDefault = this.country[idx];
              // console.log('new default value = ', this._ngxDefault);
          }, 2000);
      }, 2000);
        
  }
  

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    document.querySelector('#' + section)
    .scrollIntoView();
  }
  keyDownFunction(event) {
    if(event.keyCode == 2) {
      alert('you just clicked enter');
      // rest of your code
    }
  }
  
  // Contact Start
  addContact(){
    this.contacts.push(this.newContact);
    this.contacts.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    console.log("asadssd",this.contacts);
    this.newContact = {};
  }
  removeContact(index){
    this.contacts.splice(index,1);
  }
  editContact(val){
    this.editContactID = val;
  }
  updateContact(val){
    this.editContactID = {};
  }
  
  // Conatct End


  //other info start
  addOtherInfo(event){
    
    if(event.BANKNAME!=null && event.BANKACNO!=null && event.BRANCH!=null && event.IFSC!=null )
    {
      //console.log(newOtherInfo,"newOtherInfo");
    this.newOtherInfo=event;
    this.otherinfobank.push(this.newOtherInfo);
    this.otherinfobank.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    console.log(" this.newOtherInfo", this.newOtherInfo);
    this.newOtherInfo = {};
    }
  }
  removeOtherInfo(index){
    this.otherinfobank.splice(index,1);
  }
  editOtherInfo(val){
    this.editOtherInfoID = val;
    console.log("this.editOtherInfoID", this.editOtherInfoID);
  }
  updateOtherInfo(val){
    console.log("test");
    this.editOtherInfoID = {};
  }
  //other info end

  onChangeOfBank(id, data)
  {
    data.BANKNAME= this.bankArray.find(x=>x.BANKID==id).BANKNAME;
  }

  createForm() {
    this.supplierForm = this.fb.group({
      NAME: ['', Validators.required ],
      CATEGORYID: ['', Validators.required ],
      GSTIN: ['', Validators.required ],
      PAN: ['', Validators.required ],
      ADDRESS1: ['', Validators.required ],
      ADDRESS2: '',
      CITYID: '',
      STATEID: '',
      COUNTRYID: '',
      PINCODE: ['', Validators.required ],
      MOBILE: ['', Validators.required ],
      PHONE: ['', Validators.required ],
      FAX: '',
      EMAIL: ['', Validators.compose([Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'), Validators.minLength(1)])],
      WEBSITE: '',
      //currency_preference: ['', Validators.required ],
    });
  }
  
  onCategoryChange(id)
  {
    console.log("event",id);
    console.log("categoryid",this.newData.CATEGORYID);
   
  }
  onChangeCountry()
  {
      let params = new HttpParams();
      params = params.append('Countryid', this.countryID);
         // this.countryID = id;
      this.http.get(this.original_url+ "/Master/getStateList", {params: params}).
        subscribe((res: any[]) => {
      
          this.allGetState = res;
          this.allGetState = this.allGetState.Table;
          this.StateArray = this.allGetState;
        });
    }
  
  onChangeState()
  {
      this.http.get(this.original_url+ "/Master/getCityList?stateid="+this.newData.STATEID)
        .subscribe((res: any[]) => {
          this.allGetCity = res;
          this.allGetCity = this.allGetCity.Table;
          this.cityArray = this.allGetCity;
          console.log("City", this.cityArray);

        });
    }
  
 

  // onChangeObj(newObj) {
  //   console.log(newObj);
  //   this.selectedDate = newObj;
  // }
  

  saveSupplier(action, data)
  {
    let contactNewArray: Array<any> = [];
    let formObj = this.supplierForm.getRawValue();
    let newCategory: Array<any> = [];
    let newArray: Array<any> = [];
    let newContact: Array<any> = [];
   
    let tmpHrd:any={};
    let tmpContact:any={};
    let tmpBank:any={};
    data = formObj;
    if(data.COUNTRYID == undefined) { data.COUNTRYID = 0; }
    if(data.STATEID == undefined) { data.STATEID = 0; }
    if(data.CITYID == undefined) { data.CITYID = 0; }
    if(data.WEBSITE == undefined) { data.WEBSITE = 0}
    if(data.FAX==undefined){data.FAX=''}
    if(action=='insert')
    {
      this.id="0";
      tmpHrd.PARTYID=":A";
    }
    else
    {
      this.id=this.newData.PARTYID;
    }

    this.newData.CATEGORYID.forEach(el=> {
      console.log("ravinder",el);
      newCategory.push({PARTYID:':A',CATEGORYID:el});
    });
    //tmpHrd.CATEGORYID=data.CATEGORYID;
    tmpHrd.NAME=data.NAME;
    tmpHrd.ADDRESS1=data.ADDRESS1;
    tmpHrd.ADDRESS2=data.ADDRESS2;
    tmpHrd.COUNTRYID=data.COUNTRYID;
    tmpHrd.STATEID=data.STATEID;
    tmpHrd.CITYID=data.CITYID;
    tmpHrd.PINCODE=data.PINCODE;
    tmpHrd.GSTIN=data.GSTIN;
    tmpHrd.PAN=data.PAN;
    tmpHrd.FAX=data.FAX;
    tmpHrd.PHONE=data.PHONE
    tmpHrd.MOBILE=data.MOBILE;
    tmpHrd.EMAIL=data.EMAIL;
    tmpHrd.WEBSITE=data.WEBSITE;
    tmpHrd.CURRENCYID=data.CURRENCYID;
    tmpHrd.Edate=":b";
    newArray.push(tmpHrd);
    if(this.newContact.name !== undefined || this.newContact.email !== undefined || this.newContact.fax!== undefined || this.newContact.mobile !== undefined || this.newContact.positon!== undefined || this.newContact.phone!== undefined)
    {  
      // not click on plus
      tmpContact={};
      tmpContact.PartyId=":A";
      if(this.newContact.NAME == undefined){tmpContact.NAME = '';}else{tmpContact.NAME = this.newContact.NAME}
      if(this.newContact.EMAIL == undefined){tmpContact.EMAIL = '';}else{tmpContact.EMAIL = this.newContact.EMAIL}
      if(this.newContact.FAX == undefined){tmpContact.FAX = '';}else{tmpContact.FAX = this.newContact.FAX}
      if(this.newContact.MOBILE == undefined){tmpContact.MOBILE = '';}else{tmpContact.MOBILE = this.newContact.MOBILE}
      if(this.newContact.POSITION == undefined){tmpContact.POSITION = '';}else{tmpContact.POSITION = this.newContact.POSITION}
      if(this.newContact.PHONE == undefined){tmpContact.PHONE = '';}else{tmpContact.PHONE = this.newContact.PHONE}
      newContact.push(tmpContact);
    }

      
      this.contacts.forEach((el) => {
        if(!el.NAME){this.contactName = '';}else{this.contactName = el.NAME;}
        if(!el.MOBILE){this.contactMobile = '';}else{this.contactMobile =el.MOBILE;}
        if(!el.PHONE){this.contactPhone = '';}else{this.contactPhone = el.PHONE;}
        if(!el.FAX){this.contactFax = '';}else{this.contactFax = el.FAX;}
        if(!el.EMAIL){this.contactEmail = '';}else{this.contactEmail = el.EMAIL;}
        if(!el.POSITION){this.contactPosition = '';}else{this.contactPosition = el.POSITION;}
        tmpContact={};
        Object.assign(tmpContact, {
          PartyId:":A",
          NAME: this.contactName,
          MOBILE: this.contactMobile,
          PHONE: this.contactPhone,
          FAX: this.contactFax,
          EMAIL: this.contactEmail,
          POSITION: this.contactPosition
        });
        newContact.push(tmpContact);
      });
   
      let NewBankList:Array<any>=[];
      if(this.newOtherInfo.BANKID !== undefined && this.newOtherInfo.BANKACNO !== undefined && this.newOtherInfo.IFSC!== undefined)
      {  
       
        if(this.newOtherInfo.BANKID == undefined){this.newOtherInfo.BANKID = 0;}
        if(this.newOtherInfo.BANKACNO == undefined){this.newOtherInfo.BANKACNO = '';}
        if(this.newOtherInfo.IFSC == undefined){this.newOtherInfo.IFSC = '';}
        if(this.newOtherInfo.BRANCH == undefined){this.newOtherInfo.BRANCH = '';}

        tmpBank={};
        Object.assign(tmpBank, {
          PartyId:":A",
          BANKID:this.newOtherInfo.BANKID,
          BANKACNO: this.newOtherInfo.BANKACNO,
          IFSC: this.newOtherInfo.IFSC,
          BRANCH:this.newOtherInfo.BRANCH
        });
        NewBankList.push(tmpBank);
      }
  

      this.otherinfobank.forEach((el) => {
        tmpBank={};
        Object.assign(tmpBank, {
          PartyId:":A",
          BANKID:el.BANKID,
          BANKACNO: el.BANKACNO,
          IFSC: el.IFSC,
          BRANCH:el.BRANCH
        });
        NewBankList.push(tmpBank);
      });
   
    console.log("new array",this.newdataarray);
    
    this.isLoadingResults=true;
    const params = new  HttpParams()
    .set('header', JSON.stringify(newArray))
    .set('category', JSON.stringify(newCategory))
    .set('contact',JSON.stringify(newContact))
    .set('bank', JSON.stringify(NewBankList))
    .set('id', this.id);

    this.http.post(this.original_url+"/Master/saveParty", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      debugger;
     this.isLoadingResults=false;
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'sucess'
       }
     });
       this.isLoadingResults=false;
    },
    error=>{
      var erroremsg:any;
      erroremsg=error.message;
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:erroremsg
       }
     });
     this.isLoadingResults=false;
    });



    // let params = new HttpParams();
    // params = params.append('action',action);
    // params = params.append('header',JSON.stringify(newArray));
    // params = params.append('contact',JSON.stringify(this.newdataarray));
    // params = params.append('bank',JSON.stringify(this.otherinfobank));
    //    console.log("hello",params)
    //  this.http.post("/Master/saveParty?Entrytype=Insert&UserId=1&CompanyDataarray="+JSON.stringify(newArray)+"&ContactDataarray="+JSON.stringify(this.newdataarray)+"&BankDataArray="+JSON.stringify(this.otherinfobank)+"&LicenseDataArray="+JSON.stringify(this.licences), {data: ''})
    //   .subscribe((res) => {
    //      console.log("vivek", res);
    //      this.supplierMasterService.savePushData(res, data);
    //      this.successDialog();
    //   });
  }

  updatesupplier(data)
  {
   // this.dialogRef.close();
  }

  countryFunction()
  {
    $(document).ready(function(){
      $('#countryID').css("display", "block");
    });
  }

  stateFunction()
  {
    $(document).ready(function(){
      $('#stateID').css("display", "block");
    });
  }

  cityFunction()
  {
    $(document).ready(function(){
      $('#cityID').css("display", "block");
    });
  }
   
  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
     
       
      });

  }
 closeDialog() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '300px'
   
     
    });

}




ngOnDestroy(): void {
  // clearTimeout(this._ngxDefaultTimeout);
  // clearInterval(this._ngxDefaultInterval);
  this.subscription.unsubscribe();
}

public doNgxDefault(): any {
  return this._ngxDefault;
}

// public inputTyped = (source: string, text: string) => console.log('SingleDemoComponent.inputTyped', source, text);

//   public doFocus = () => console.log('SingleDemoComponent.doFocus');

//   public doBlur = () => console.log('SingleDemoComponent.doBlur');

//   public doOpen = () => console.log('SingleDemoComponent.doOpen');

//   public doClose = () => console.log('SingleDemoComponent.doClose');

  public doSelect = (value: any) => {console.log('value', value); this.countryID=value;  
   this.onChangeCountry();};
   public doSelect1 = (value: any) => {console.log('value', value); this.StateId=value; 
   this.onChangeState();};
   public doSelect3 = (value: any) => {console.log('value', value);   
  };

  public doRemove = (value: any) => console.log('SingleDemoComponent.doRemove', value);

  public doSelectOptions = (options: INgxSelectOption[]) => {console.log('SingleDemoComponent.doSelectOptions', options); 
  };


}
