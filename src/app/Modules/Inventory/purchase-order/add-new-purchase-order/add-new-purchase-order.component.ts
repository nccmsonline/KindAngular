import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../purchase-order.service';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
declare var $: any;
declare var jQuery: any;
import { animate } from '@angular/animations';
import {Observable} from "rxjs";


@Component({
  selector: 'app-add-new-purchase-order',
  templateUrl: './add-new-purchase-order.component.html',
  styleUrls: ['./add-new-purchase-order.component.css']
})
export class AddNewPurchaseOrderComponent implements OnInit {

  fieldArray: Array<any> = [];
  date = new FormControl(new Date());
  newData: any={};
  newChangeData: any={};
  purchaseForm: FormGroup;
  allDataGet: any;
  supplierlist:Array<any> = [];
  currentSection = 'item_detail';
    // Item
    items: Array<any> = [];
    newitem: any = {};
    editItemID: any={};
  
    // Shipping
    shippings: Array<any> = [];
    newshipping: any = {};
    editshippingID: any={};

     // Terms Condition
     termsConditions: Array<any> = [];
     newtermsCondition: any = {};
     edittermsConditionID: any={};

     // Payment Terms
     paymentTerms: Array<any> = [];
     newpaymentTerm: any = {};
     editpaymentTermID: any={};

     // Delivery Schedyle
     deliverySchedules: Array<any> = [];
     newdeliverySchedule: any = {};
     editdeliveryScheduleID: any={};
    action: string;
    coid:any;
    boid: any;
    userinfo: any;
    address='';
    gstIn='';
    state='';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    @Inject('BASE_URL') private original_url : string
  ) { 
    this.createForm();
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    // this.action = data.action;
    // if(this.action == 'edit')
    // {
    //   this.newData = data.contact;
    // }

  //  Contact
  //  this.items = [
  //   {id:1, item_name: 'Raw Material',item_code: 1, hsn_code: '12345', gst: '2', unit: '1', qty: '10', rate: '31.25', amt:'13456', remarks:'test'},
  //   {id:2, item_name: 'Raw Material',item_code: 2, hsn_code: '12345', gst: '3', unit: '1', qty: '10', rate: '31.25', amt:'13456', remarks:'test'},
    
  //  ];

   //  Licence
   this.shippings = [
    { id:11, shipto: 'NCCMS', billto: 'NCCMS'}
   ];

  //  this.termsConditions = [
  //   { id:111,TermsCondition: '1234567890'},
  //   { id:222 ,TermsCondition: '0987654321'}
  //  ];

  //  this.paymentTerms = [
  //   { id:111,PaymentTerms: '1234567890'},
  //   { id:222 ,PaymentTerms: '0987654321'}
  //  ];

  //  this.deliverySchedules = [
  //   { id:111, itemname: 'Raw Material', itemcode:'1234', date: '10-10-2018', quantity: '34', units:'kilos'},
  //   { id:222, itemname: 'Raw Material', itemcode:'4321', date: '10-12-2018', quantity: '34', units:'kilos'}
  //  ];
  }


   // Item Start
   addItem(event){
     console.log("event",event)
     if(event.item_name!=null && event.item_code!=null && event.hsn_code!=null && event.gst!=null && event.unit!=null && event.qty!=null
      && event.rate!=null && event.amt!=null && event.remarks!=null)
     {
    this.items.push(this.newitem);
    this.items.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newitem = {};
  }
}
  removeItem(index){
    this.items.splice(index,1);
  }
  editItem(val){
    this.editItemID = val;
  }
  updateItem(val){
    console.log("test");
    this.editItemID = {};
  }
  // Item End

  removeShipping(index){
    this.shippings.splice(index,1);
  }
  editShipping(val){
    this.editshippingID = val;
  }
  updateShipping(val){
    console.log("test");
    this.editshippingID = {};
  }
  // Shipping End

  //Terms and Condition Start
  addtermsCondition(event){
    console.log("event",event)
    if(event.TermsCondition!=null)
    {
    this.termsConditions.push(this.newtermsCondition);
    this.termsConditions.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newtermsCondition = {};
  }
}
  removetermsCondition(index){
    this.termsConditions.splice(index,1);
  }
  edittermsCondition(val){
    this.edittermsConditionID = val;
  }
  updatetermsCondition(val){
    console.log("test");
    this.edittermsConditionID = {};
  }
    //Terms and Condition End

    //Payment Terms Start
  addpaymnetTerm(event){
    if(event.PaymentTerms!=null)
    {
    this.paymentTerms.push(this.newpaymentTerm);
    this.paymentTerms.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newpaymentTerm = {};
  }
}
  removepaymentTerm(index){
    this.paymentTerms.splice(index,1);
  }
  editpaymnetTerm(val){
    this.editpaymentTermID = val;
  }
  updatepaymnetTerm(val){
    console.log("test");
    this.editpaymentTermID = {};
  }
    //Payment Terms End

    //Delivery Schedule Start
  adddeliverySchedule(event){
    console.log("event",event)
    if(event.itemname!=null && event.itemcode!=null && event.date!=null && event.quantity!=null && event.units!=null)
    {
    this.deliverySchedules.push(this.newdeliverySchedule);
    this.deliverySchedules.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newdeliverySchedule = {};
  }
}
  removedeliverySchedule(index){
    this.deliverySchedules.splice(index,1);
  }
  editdeliverySchedule(val){
    this.editdeliveryScheduleID = val;
  }
  updatedeliverySchedule(val){
    console.log("test");
    this.editdeliveryScheduleID = {};
  }
    //Delivery Schedule End

  ngOnInit() {

    this.purchaseOrderService.SupplierList()
      .subscribe((response) => {
        this.allDataGet = response;
        this.allDataGet = this.allDataGet.Table;
        this.supplierlist = this.allDataGet;
        // this.keys= Object.keys(this.fieldArray[0]);
      });
  }

  onChange(id) {
    console.log("id", id);
    this.http.get(this.original_url+"/Masters/SupplierMaster/GetSupplierData?coid="+this.coid+"&boid="+this.boid+"&supplierid="+id)
        .subscribe((res) => {
          
          this.newChangeData = res;
          console.log("test",res);
          this.newChangeData = this.newChangeData.Table;
          
          this.newChangeData = this.newChangeData[0];
          if(this.newChangeData !== undefined)
          {
            this.address = this.newChangeData.address2;
          this.gstIn = this.newChangeData.gsTin;
          this.state = this.newChangeData.statename;
          }
          
          // console.log(this.address+ "-" +this.gstin+"-"+this.state);
           console.log("changedata",this.newChangeData);
          
        });
  }

  createForm() {
    this.purchaseForm = this.fb.group({
      po_no: ['', Validators.required ],
      po_date: {disabled: true, value: ''},
      supplier: ['', Validators.required ],
      your_ref: ['', Validators.required ]
    });
  }

  savePurchase(data)
  {
    console.log("data0",data);
    this.purchaseOrderService.savePushData(data);
    this.router.navigate(['/purchase-order']);
  }
}
