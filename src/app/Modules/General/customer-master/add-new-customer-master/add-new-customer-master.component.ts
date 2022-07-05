
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';  
declare var $: any;
import {ConfirmationDialogComponent} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogService} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service'
import { Subscription, Observable,BehaviorSubject } from 'rxjs';
declare var jQuery: any;
import { CustomerMasterService } from '../customer-master.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {formatDate } from '@angular/common';
import {INgxSelectOption} from    '../../../../../assets/ngx-select/ngx-select.interfaces';
import {SuccessDialogComponent} from '../.././../../Dialog/success-dialog/success-dialog.component';


@Component({
  selector: 'app-add-new-customer-master',
  templateUrl: './add-new-customer-master.component.html',
  styleUrls: ['./add-new-customer-master.component.css']
})
export class AddNewCustomerMasterComponent implements OnInit {
  page :any;
  GetAllCountryList: Array<any> = [];
  GetZoneList: Array<any> = [];
  bankArray: Array<any> = [];
  GetRegionList: Array<any> = [];
  GetStateList:  Array<any> = [];
  AllCityList:  Array<any> = [];
  GetAreaList:  Array<any> = [];
  contacts: Array<any> = [];
  newContact: any = {};
  editContactID: any={};
  contactPhone: any;
  customerForm: FormGroup;
  private baseUrl = 'http://suvidhaapi.suvidhacloud.com/api';
  countryID: any;
  StateId:any;
  cityId:any;
  zoneID: any;
  regionID: any;
  areaId:any
  newData: any={};
  currentSection = 'section1';
  userinfo : any;
  coid : any;
  boid : any;
  id : any;
  allGetCountry: any;
  allGetBank: any;
  allGetZone: any;
  allGetArea: any;
  allGetCity: any;
  allGetState: any;
  customercategory:  Array<any> = [];
  allCustomerCategory: any;
  subscription: Subscription;
  message: any;
  bussinessList:any;
  CurrencyList :any;
// Licence
licences: Array<any> = [];
newlicence: any = {};
editLicenceID: any={};

contactName: any;
contactMobile: any;

contactFax: any;
contactEmail: any;
contactPosition: any;

// Other Info
otherinfobank: Array<any> = [];
newOtherInfo: any = {};
editOtherInfoID: any={};
action: string;
myDate = new Date();



  constructor( 
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject('BASE_URL') private original_url : string,
    public dialogRef: MatDialogRef<AddNewCustomerMasterComponent>,
    private customerMasterService: CustomerMasterService,
    private messageService: ConfirmationDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
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
      
      let user = sessionStorage.getItem("currentUser");
      this.userinfo = JSON.parse(user);
      this.coid = this.userinfo['coid'];
      this.boid = this.userinfo['boid'];

      this.createForm();
      this.action = data.action;
      if(this.action == 'edit')
      {
        this.newData = data.contact;
        console.log(this.newData);
        this.http.get(this.original_url+"/Masters/customermaster/GetCustomerdata?coid="+this.coid+"&boid="+this.boid+"&custid="+this.newData.id)
        .subscribe((res) => {
          console.log("vivek", res);
          this.newData = res;
          this.contacts = this.newData.Table2;
          this.licences = this.newData.Table3;
          this.otherinfobank = this.newData.Table1;
          this.newData = this.newData.Table;
          this.newData = this.newData[0]; 
          this.countryID=this.newData.country;
          this.StateId=this.newData.state;
          this.zoneID=this.newData.zone;
          this.regionID=this.newData.region;
          this.areaId=this.newData.area;
          this.countryChange();
          this.stateChange();
          this.zoneChange();
          this.regionChange();
        });

      }
    
// this.contacts = [
//    {id: 1, contact_name: 'Vivek', contact_phone_number: '1234567890', contact_email: 'vivek@gmail.com', contact_position: 'manager' ,contact_type: 'Drug Licence', isactive: 1},
//    {id: 2, contact_name: 'Mohit', contact_phone_number: '0987654321', contact_email: 'mohit@gmail.com', contact_position: 'employee', contact_type: 'Drug Licence', isactive: 1}
//   ];

  // this.contacts = [
  //   {id: 1, name: 'Vivek', mobile: '1234567890', phone: '1234567890', fax: 'manager', email: 'vivek@gmail.com', position: 'employee', isactive: 1},
  //   {id: 2, name: 'Mohit', mobile: '0987654321', phone: '1234567890', fax: 'manager', email: 'mohit@gmail.com', position: 'employee', isactive: 1}
  //  ];

  //  Licence
  // this.licences = [
  //   {id: 1, licencetype: 'Drug Licence', licenceno: '1234567890', validtill: '2018-10-02', authentication: 'manager', isactive: 1},
  //   {id: 2, licencetype: 'Manufacturing', licenceno: '0987654321', validtill: '2018-10-02', authentication: 'employee', isactive: 1}
  //  ];

  //  Other Info
  // this.otherinfobank = [
  //   {id: 1, bankname: 'ICICI', bankacno: '45345345', ifsc: 'sads6565', isactive: 1},
  //   {id: 2, bankname: 'A.B Bank', bankacno: '34534534534', ifsc: 'tyryr676', isactive: 1}
  //  ];
  
   }
     // Contact Start
  addContact(){
    this.contacts.push(this.newContact);
    this.contacts.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
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
    if(event.licensetype!=null && event.licenseno!=null && event.validtill!=null && event.authentication!=null )
    {
   
      //console.log(newOtherInfo,"newOtherInfo");
    this.licences.push(this.newlicence);
    this.licences.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newlicence = {};
    console.log("qwerty",this.licences);
  }
  }
  removeLicence(index){
    this.licences.splice(index,1);
  }
  editLicence(val){
    this.editLicenceID = val;
  }
  updateLicence(val){
    this.editLicenceID = {};
  }
  // Licence End

  //other info start
  addOtherInfo(event){
    if(event.bankname!=null && event.bankacno!=null && event.branch!=null && event.ifsc!=null )
    {

    this.otherinfobank.push(this.newOtherInfo);
    this.otherinfobank.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newOtherInfo = {};
  }
  }
  removeOtherInfo(index){
    this.otherinfobank.splice(index,1);
  }
  editOtherInfo(val){
    this.editOtherInfoID = val;
  }
  updateOtherInfo(val){
    this.editOtherInfoID = {};
  }
  //other info end

  ngOnInit() {
    this.customerMasterService.GetAllCountryList()
    .subscribe((response) => {
      this.allGetCountry = response;
      this.allGetCountry = this.allGetCountry.Table;
      this.GetAllCountryList = this.allGetCountry;
     // console.log(response);
    });

    this.customerMasterService.GetZoneList()
      .subscribe((response) => {
        this.allGetZone = response;
        this.allGetZone = this.allGetZone.Table;
        this.GetZoneList= this.allGetZone;
      });

    this.customerMasterService.BankList()
      .subscribe((response) => {
        this.allGetBank = response;
        this.allGetBank = this.allGetBank.Table;
        this.bankArray= this.allGetBank;
      });

    this.customerMasterService.GetCustomerCategory()
      .subscribe((response) => {
        this.allCustomerCategory = response;
        this.allCustomerCategory = this.allCustomerCategory.Table;
        this.customercategory = this.allCustomerCategory;
      });
      this.customerMasterService.Currencylist()
      .subscribe((response) => {
        this.CurrencyList = response;
        this.CurrencyList = this.CurrencyList.Table;
        console.log("List1", this.CurrencyList);
     
      });
      this.customerMasterService.bussinesslist()
      .subscribe((response) => {
        this.bussinessList = response;
        this.bussinessList = this.bussinessList.Table;
        console.log("List1", this.CurrencyList);
     
      });
  }

  createForm() {
     this.customerForm = this.fb.group({
      id: '',
      coid: '',
      boid: '',
      title: '',
      vendorcode: '',
      name: ['', Validators.required ],
      categoryid: ['', Validators.required ],
      segmentid: ['', Validators.required ],
      gsTin: ['', Validators.required ],
      pan: ['', Validators.required ],
      address1: ['', Validators.required ],
      address2: '',
      zone: ['',Validators.required],
      area: '',
      region: '',
      city: ['', Validators.required ],
      state: ['', Validators.required ],
      country: ['', Validators.required ],
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
      excise_regn_no: '',
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
      currency_preference: ['', Validators.required ]
    });
   }

  countryChange(){
  

      this.customerMasterService.GetStateList(this.countryID)
        .subscribe((res) => {
          this.allGetState = res;
          this.allGetState = this.allGetState.Table;
          this.GetStateList = this.allGetState;
        });

   
    
  }

  stateChange(){
  
         this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/AllCityList?Countryid="+this.countryID+"&Stateid="+this.StateId+"&coid="+this.coid+"&boid="+this.boid)
        .subscribe((res: any[]) => {
          this.allGetCity = res;
          this.allGetCity = this.allGetCity.Table;
          this.AllCityList = this.allGetCity;
        });
    }
  
  cityChange(id){
    if(id)
    {
      this.cityId=id;
      this.cityId= this.cityId.value[0];
      this.cityId= this.cityId.id;
      this.customerForm.patchValue({city: this.cityId})
    }
  }

  zoneChange(){
   
      
      this.http.get(this.baseUrl+"/Masters/CommonMasters/GetRegionList?coid="+this.coid+"&boid="+this.boid+"&Countryid="+this.countryID+"&Zoneid="+this.zoneID)
        .subscribe((res: any[]) => {
          this.allGetZone = res;
          this.allGetZone = this.allGetZone.Table;
          this.GetRegionList = this.allGetZone;
        });
    }
  

  regionChange()
  { 
    console.log("1",this.regionID);
    console.log("2",this.zoneID);
  
      this.http.get(this.baseUrl+"/Masters/CommonMasters/GetAreaList?coid="+this.coid+"&boid="+this.boid+"&Zoneid="+this.zoneID+"&Regionid="+ this.regionID)
        .subscribe((res: any[]) => {
          this.allGetArea = res;
          this.allGetArea = this.allGetArea.Table;
          this.GetAreaList = this.allGetArea;
          console.log("this.GetAreaList", res);
        });
      
    }
  

  areaChange(id)
  {
   
    
      this.areaId=id;
      this.areaId= this.areaId.value[0];
      this.areaId= this.areaId.id;
      this.customerForm.patchValue({area: this.areaId})
    
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

  countryFunction()
  {
    $(document).ready(function(){
      $('#countryID').css("display", "block");
    });
  }

  countryFunctionhide()
  {
    $(document).ready(function(){
      $('#countryID').css("display", "none");
    });
  }

  saveCustomer(data)
  {
    let formObj = this.customerForm.getRawValue();
    let newArray: Array<any> = [];
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.id = '0';

    data = formObj;
    data.vat_date = formatDate(data.vat_date, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    data.coid = this.coid.toString();
    data.boid = this.boid.toString();
    data.id = this.id.toString();
    data.segmentid = '0';
    data.isactive = '1';
    data.deactivatedby = '0';
    data.deactivatedon = '';
    data.createdby = this.userinfo['userid'].toString();
    data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    data.modifiedby = '0';
    data.modifiedon = '';
    if(data.credit_days==undefined){data.credit_days='0'}
    if(data.credit_limit==undefined){data.credit_limit='0'}
    if(data.newCountry == undefined) { data.newCountry = ''; }
    if(data.newState == undefined) { data.newState = ''; }
    if(data.newCity == undefined) { data.newCity = ''; }
    if(data.country == undefined) { data.country = '0'; }
    if(data.state == undefined) { data.state = '0'; }
    if(data.city == undefined) { data.city = '0'; }
    if(data.tds_applicable == undefined) { data.tds_applicable = false; }
    if(data.tds_rate == '') { data.tds_rate = '0'; }
    if(data.tcs_applicable == undefined) { data.tcs_applicable = false; }
    if(data.tcs_rate == '') { data.tcs_rate = '0'; }
    if(data.area == undefined) { data.area = '0'; }
    if(data.region == undefined) { data.region = '0'; }
    if(data.zone == undefined) { data.zone = '0'; }
    if(data.title == undefined) { data.title = ''; }
    if(data.vendorcode == undefined) { data.vendorcode = '0'; }
    if(!data.tds_rate) {data.tds_rate = '0'}
    if(!data.tcs_rate) {data.tcs_rate = '0'}
    if(!data.vat_number) {data.vat_number = '0'}
    if(!data.vat_date) {data.vat_date = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');}
    if(!data.excise_regn_number) {data.excise_regn_number = '0'}
    if(!data.excise_commissionerate) {data.excise_commissionerate = '0'}
    if(!data.excise_division) {data.excise_division = '0'}
     if(!data.excise_range) {data.excise_range = '0'}
     if(!data.website){data.website=''}
     if(!data.excise_regn_no){data.excise_regn_no=''}
     if(!data.fax)(data.fax='')
    
    newArray.push(data);

    let params = new HttpParams();
    params = params.append('Entrytype', 'Insert');
    params = params.append('UserId', '1');
    params = params.append('CompanyDataarray', JSON.stringify(newArray));
    params = params.append('ContactDataarray', JSON.stringify(this.contacts));
    params = params.append('BankDataArray', JSON.stringify(this.otherinfobank));
    params = params.append('LicenseDataArray', JSON.stringify(this.licences));
     console.log("new",newArray)
     console.log("params", params);
   

    
    if(this.contacts.length == 0)
    {
      
      this.contacts=[
        {id: '', name: '', mobile: '', phone: '', fax: '', email: '', position: '', isactive: '1'}
      ]
    }
     else{

     this.contacts.forEach((el) => {
       if(!el.name){this.contactName = '';}else{this.contactName = el.name;}
       if(!el.mobile){this.contactMobile = '';}else{this.contactMobile = el.mobile;}
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
       console.log("el", el);
     });
    }
    if(this.licences.length == 0 )
       
    {  
      this.licences=[{id: '', licensetype: '', licenseno: '', validtill: '', authentication: '', isactive: '1'}]
    }
    if(this.otherinfobank.length ==0)
    {
     this.otherinfobank=[ {id: '', bankname: '', bankacno: '', ifsc: '', isactive: '1'}]
    }
   
    console.log("this.contacts", this.contacts);
     console.log("this.licences", this.licences);

  
    

    
    

    this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/Masters/customermaster/SaveCustomer?Entrytype=Insert&UserId=1&CompanyDataarray="+JSON.stringify(newArray)+"&ContactDataarray="+JSON.stringify(this.contacts)+"&BankDataArray="+JSON.stringify(this.otherinfobank)+"&LicenseDataArray="+JSON.stringify(this.licences), {data: ''})
      .subscribe((res) => {
         this.customerMasterService.savePushData(data);
         this.successDialog();
      });
  //  this.dialogRef.close();
  
  }
  updateCustomMaster(data)
  {
    this.dialogRef.close();
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    document.querySelector('#' + section)
    .scrollIntoView();
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
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  
  public doSelect = (value: any) =>{ this.countryID=value;  console.log('hello', this.countryID);
   this.countryChange();};
    public doSelect1 = (value: any) => { this.StateId=value;  console.log('hello', this.StateId);
   this.stateChange();};
   public doSelect2 = (value: any) =>    {
  };
  public doSelect3 = (value: any) => {console.log('value', value);   this.zoneID=value;
  this.zoneChange();
};
public doSelect4 = (value: any) => {console.log('value', value);   this.regionID=value;
this.regionChange();
};
public doSelect5 = (value: any) => {console.log('value', value);   
}
public doSelect6 = (value: any) => {console.log('value', value);   
}
public doSelect7 = (value: any) => {console.log('value', value);   
}

  public doRemove = (value: any) => console.log('SingleDemoComponent.doRemove', value);

  public doSelectOptions = (options: INgxSelectOption[]) => {console.log('SingleDemoComponent.doSelectOptions', options); 
  };

}
