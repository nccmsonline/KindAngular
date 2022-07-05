import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;
declare var jQuery: any;
import { animate } from '@angular/animations';
import { SupplierMasterService } from '../supplier-master.service';
import { Observable } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Supplier}  from "../supplier.modal";
import {formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import {ConfirmationDialogComponent} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.component'
import {ConfirmationDialogService} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service'
import {INgxSelectOption} from    '../../../../../assets/ngx-select/ngx-select.interfaces';
 import{SuccessDialogComponent  }   from '../../../../Dialog/success-dialog/success-dialog.component'
@Component({
  selector: 'app-add-new-supplier-master',
  templateUrl: './add-new-supplier-master.component.html',
  styleUrls: ['./add-new-supplier-master.component.css']
})
export class AddNewSupplierMasterComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  message: any;
 
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
    public dialogRef: MatDialogRef<AddNewSupplierMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    
    @Inject('BASE_URL') private original_url : string
  ) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.subscription = 
    this.messageService.getMessage()
    .subscribe(message => 
      {
         this.message= message;
        
         if(this.message != null)
       {
       
        this.dialogRef.close();
       }
     
      });
     
    this.createForm();
    this.action = data.action;
    if(this.action == 'edit')
    {
      //this.newData = data.contact;
      console.log(data.contact.id);
     

      
      this.http.get(this.original_url+"/Masters/SupplierMaster/GetSupplierData?coid="+this.coid+"&boid="+this.boid+"&supplierid="+data.contact.id)
        .subscribe((res) => {
          console.log("vivek", res);
         
          this.newData = res;
          console.log("resr",res);
         
          this.contacts = this.newData.Table2;
          this.licences = this.newData.Table3;
          this.otherinfobank = this.newData.Table1;
          this.newData = this.newData.Table;
          this.newData = this.newData[0];
          this.countryID=this.newData.country
          this.StateId=this.newData.state;
          console.log("this.stateid",this.StateId);
          this.onChangeCountry();
          this.onChangeState();
        });
    }

    // Contact
    // this.contacts = [
      // {id: 1, name: 'Vivek', mobile: '1234567890', phone: '1234567890', fax: 'manager', email: 'vivek@gmail.com', position: 'employee', isactive: 1},
      // {id: 2, name: 'Mohit', mobile: '0987654321', phone: '1234567890', fax: 'manager', email: 'mohit@gmail.com', position: 'employee', isactive: 1}
    //  ];

    //  Licence
    // this.licences = [
      // {id: 1, licencetype: 'Drug Licence', licenceno: '1234567890', validtill: '2018-10-02', authentication: 'manager', isactive: 1},
      // {id: 2, licencetype: 'Manufacturing', licenceno: '0987654321', validtill: '2018-10-02', authentication: 'employee', isactive: 1}
    //  ];

    //  Other Info
    // this.otherinfobank = [
      // {id: 1, bankname: '1', bankacno: '45345345', ifsc: 'sads6565', isactive: 1},
      // {id: 2, bankname: '1', bankacno: '34534534534', ifsc: 'tyryr676', isactive: 1}
    //  ];
  }

  ngOnInit() {
    
    this.supplierMasterService.supplierCategoryList()
      .subscribe((response) => {
        this.allSupplierDataGet = response;
        this.allSupplierDataGet = this.allSupplierDataGet.Table;
        this.suppliercategorylist= this.allSupplierDataGet;
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
        });
      this.supplierMasterService.Currencylist()
      .subscribe((response) => {
        this.CurrencyList = response;
        this.CurrencyList = this.CurrencyList.Table;
        console.log("List1", this.CurrencyList);
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

  // Licence Start
  addLicence(event){
    console.log("event",event)
    if(event.licensetype!=null && event.licenseno!=null && event.validtill!=null && event.authentication!=null )
    {
    this.licences.push(this.newlicence);
    this.licences.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newlicence = {};
  }
  }
  removeLicence(index){
    this.licences.splice(index,1);
  }
  editLicence(val){
    this.editLicenceID = val;
  }
  updateLicence(val){
    console.log("test");
    this.editLicenceID = {};
  }
  // Licence End

  //other info start
  addOtherInfo(event){
    
    if(event.bankname!=null && event.bankacno!=null && event.branch!=null && event.ifsc!=null )
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

  createForm() {
    this.supplierForm = this.fb.group({
      id: '',
      coid: '',
      boid: '',
      title: '',
      vendorcode: '',
      name: ['', Validators.required ],
      categoryid: ['', Validators.required ],
      segmentid: '',
      gsTin: ['', Validators.required ],
      pan: ['', Validators.required ],
      address1: ['', Validators.required ],
      address2: '',
      zone: '',
      area: '',
      region: '',
      city: '',
      state: '',
      country: '',
      newCity: '',
      newCountry: '',
      newState: '',
      pin: ['', Validators.required ],
      mobile_number: ['', Validators.required ],
      phone_number: ['', Validators.required ],
      fax: '',
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'), Validators.minLength(1)])],
      website: '',
      tds_applicable: '',
      tds_rate: '',
      tcs_applicable: '',
      tcs_rate: '',
      vat_number: '',
      vat_date: '',
      excise_regn_number: '',
      excise_commissionerate: '',
      excise_division: '',
      excise_range: '',
      isactive: '',
      createdby: '',
      createdon: '',
      modifiedby: '',
      modifiedon: '',
      deactivatedby: '',
      deactivatedon: '',
      credit_days: '',
      credit_limit:'',
      currency_preference: ['', Validators.required ],
    });
  }
  

  onChangeCountry()
  {
      let params = new HttpParams();
      params = params.append('Countryid', this.countryID);
      params = params.append('coid', this.coid);
      params = params.append('boid', this.boid);
         // this.countryID = id;
      this.http.get('http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/GetStateList', {params: params}).
        subscribe((res: any[]) => {
      
          this.allGetState = res;
          this.allGetState = this.allGetState.Table;
          this.StateArray = this.allGetState;
        });
    }
  
  onChangeState()
  {
     
      this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/AllCityList?Countryid="+this.countryID+"&Stateid="+this.StateId+"&coid="+this.coid+"&boid="+this.boid)
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
  

  saveSupplier(data)
  {
    let contactNewArray: Array<any> = [];
    let formObj = this.supplierForm.getRawValue();
    let newArray: Array<any> = [];
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.id = '0';

    data = formObj;
    data.coid = this.coid;
    data.boid = this.boid;
    data.id = '1';
    data.segmentid = '0';
    data.zone = '0';
    data.area = '0';
    data.region = '0';
    data.isactive = '1';
    data.deactivatedby = '0';
    data.deactivatedon = '';
    data.vat_date = formatDate(data.vat_date, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    data.createdby = '1';
    data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    data.modifiedby = '0';
    data.modifiedon = '';
    data.title = '0';
    data.vendorcode = '0';
    
    newArray.push(data);

    if(data.newCountry == undefined) { data.newCountry = ''; }
    if(data.newState == undefined) { data.newState = ''; }
    if(data.newCity == undefined) { data.newCity = ''; }
    if(data.country == undefined) { data.country = ''; }
    if(data.state == undefined) { data.state = ''; }
    if(data.city == undefined) { data.city = ''; }
    if(data.tds_applicable == undefined) { data.tds_applicable = false; }
    if(data.tds_rate == undefined) { data.tds_rate = '0'; }
    if(data.tcs_applicable == undefined) { data.tcs_applicable = false; }
    if(data.tcs_rate == undefined) { data.tcs_rate = '0'; }
    if(!data.tds_rate) {data.tds_rate = '0'}
    if(!data.tcs_rate) {data.tcs_rate = '0'}
    if(data.vat_number == undefined) {data.vat_number = '0'}
    if(data.vat_date == undefined) {data.vat_date = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');}
    if(data.excise_regn_number == undefined) {data.excise_regn_number = '0'}
    if(data.excise_commissionerate == undefined) {data.excise_commissionerate = '0'}
    if(data.excise_division == undefined) {data.excise_division = '0'}
    if(data.excise_range == undefined) {data.excise_range = '0'}
    if(data.website == undefined) { data.website = ''}
    if(data.fax==undefined){data.fax=''}
    if(data.credit_days==undefined){data.credit_days='0'}
    if(data.credit_limit==undefined){data.credit_limit='0'}
    

    if(this.newContact.name !== undefined || this.newContact.email !== undefined || this.newContact.fax!== undefined || this.newContact.mobile !== undefined || this.newContact.positon!== undefined || this.newContact.phone!== undefined)
    {  
      // not click on plus
      if(this.newContact.name == undefined){this.newContact.name = '';}else{this.newContact.name = this.newContact.name}
      if(this.newContact.email == undefined){this.newContact.email = '';}else{this.newContact.email = this.newContact.email}
      if(this.newContact.fax == undefined){this.newContact.fax = '';}else{this.newContact.fax = this.newContact.fax}
      if(this.newContact.mobile == undefined){this.newContact.mobile = '';}else{this.newContact.mobile = this.newContact.mobile}
      if(this.newContact.positon == undefined){this.newContact.positon = '';}else{this.newContact.positon = this.newContact.positon}
      if(this.newContact.phone == undefined){this.newContact.phone = '';}else{this.newContact.phone = this.newContact.phone}

      contactNewArray.push(this.newContact);

    }

    if(this.newContact.name == undefined && this.newContact.email == undefined && this.newContact.fax == undefined && this.newContact.mobile == undefined && this.newContact.positon == undefined && this.newContact.phone == undefined)
    {
      if(this.contacts.length == 0)
      {
        this.contacts=[
          {id: '', name: '', mobile: '', phone: '', fax: '', email: '', position: '', isactive: '1'}
        ]
      }
      else
      {
          this.contacts.forEach((el) => {
            if(!el.name){this.contactName = '';}else{this.contactName = el.name;}
            if(!el.mobile){this.contactMobile = '';}else{this.contactMobile =el.mobile;}
            if(!el.phone){this.contactPhone = '';}else{this.contactPhone = el.phone;}
            if(!el.fax){this.contactFax = '';}else{this.contactFax = el.fax;}
            if(!el.email){this.contactEmail = '';}else{this.contactEmail = el.email;}
            if(!el.position){this.contactPosition = '';}else{this.contactPosition = el.position;}
            Object.assign(el, {
              name: this.contactName,
              mobile: this.contactMobile,
              phone: this.contactPhone,
              fax: this.contactFax,
              email: this.contactEmail,
              position: this.contactPosition,
              isactive: '1'
            });
          });
      }
    }
    if(this.contacts.length !== 0)
      {
        if(this.newContact.name !== undefined || this.newContact.email !== undefined || this.newContact.fax!== undefined || this.newContact.mobile !== undefined || this.newContact.positon!== undefined || this.newContact.phone!== undefined)
        {
          if(this.newContact.name == undefined){this.newContact.name = '';}else{this.newContact.name = this.newContact.name}
          if(this.newContact.email == undefined){this.newContact.email = '';}else{this.newContact.email = this.newContact.email}
          if(this.newContact.fax == undefined){this.newContact.fax = '';}else{this.newContact.fax = this.newContact.fax}
          if(this.newContact.mobile == undefined){this.newContact.mobile = '';}else{this.newContact.mobile = this.newContact.mobile}
          if(this.newContact.positon == undefined){this.newContact.positon = '';}else{this.newContact.positon = this.newContact.positon}
          if(this.newContact.phone == undefined){this.newContact.phone = '';}else{this.newContact.phone = this.newContact.phone}
        }
      }

      this.contacts.forEach((el) => {
        if(!el.name){this.contactName = '';}else{this.contactName = el.name;}
        if(!el.mobile){this.contactMobile = '';}else{this.contactMobile =el.mobile;}
        if(!el.phone){this.contactPhone = '';}else{this.contactPhone = el.phone;}
        if(!el.fax){this.contactFax = '';}else{this.contactFax = el.fax;}
        if(!el.email){this.contactEmail = '';}else{this.contactEmail = el.email;}
        if(!el.position){this.contactPosition = '';}else{this.contactPosition = el.position;}
        
        Object.assign(el, {
          name: this.contactName,
          mobile: this.contactMobile,
          phone: this.contactPhone,
          fax: this.contactFax,
          email: this.contactEmail,
          position: this.contactPosition,
          isactive: '1'
        });
      });

   
    
    this.newdataarray = this.contacts.concat(contactNewArray);
    console.log("new array",this.newdataarray);
    // if(this.contacts.length == 0)
    //   {
    //     this.contacts=[
    //       {id: '', name: '', mobile: '', phone: '', fax: '', email: '', position: '', isactive: '1'}
    //     ]
    //   }

    if(this.licences.length == 0 )
    {
      this.licences=[{id: '', licencetype: '', licenceno: '', validtill: '', authentication: '', isactive: '1'}]
    }
    if(this.otherinfobank.length ==0)
    {
     this.otherinfobank=[ {id: '', bankname: '', bankacno: '', ifsc: '', isactive: '1'}]
    }
    let params = new HttpParams();
    params = params.append('1',JSON.stringify(newArray));
    params = params.append('2',JSON.stringify(this.newdataarray));
    params = params.append('3',JSON.stringify(this.otherinfobank));
    params = params.append('4',JSON.stringify(this.licences));
       console.log("hello",params)
      //  console.log("1",newArray)
      //  console.log("2",this.contacts);
      //  console.log("3",this.otherinfobank);
      //  console.log("4",this.licences);
    
      
     // this.successDialog();
     this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/Masters/SupplierMaster/SaveSupplier?Entrytype=Insert&UserId=1&CompanyDataarray="+JSON.stringify(newArray)+"&ContactDataarray="+JSON.stringify(this.newdataarray)+"&BankDataArray="+JSON.stringify(this.otherinfobank)+"&LicenseDataArray="+JSON.stringify(this.licences), {data: ''})
      .subscribe((res) => {
         console.log("vivek", res);
         this.supplierMasterService.savePushData(res, data);
         this.successDialog();
      });
    
 //  this.supplierMasterService.savePushData(JSON.stringify(newArray), JSON.stringify(this.contacts), JSON.stringify(this.otherinfobank), JSON.stringify(this.licences));
   // this.dialogRef.close();
  }

  updatesupplier(data)
  {
    this.dialogRef.close();
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
