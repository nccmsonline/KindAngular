
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var $: any;
import { Router} from '@angular/router';
declare var jQuery: any;
import { animate } from '@angular/animations';
import {Observable} from "rxjs";
import {GoodsReceiptNoteService} from "../goods-receipt-note.service"


@Component({
  selector: 'app-add-new-goods-receipt-note',
  templateUrl: './add-new-goods-receipt-note.component.html',
  styleUrls: ['./add-new-goods-receipt-note.component.css']
})
export class AddNewGoodsReceiptNoteComponent implements OnInit {
  fieldArray: Array<any> = [];
  newData: any={};
  ReceiptForm: FormGroup;
    // contact
    contacts: Array<any> = [];
    newContact: any = {};
    editContactID: any={};
  
    // Licence
    licences: Array<any> = [];
    newlicence: any = {};
    editLicenceID: any={};

     // payment
     payments: Array<any> = [];
     newpayment: any = {};
     editpaymentID: any={};
    action: string;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
  private goodsreceipt: GoodsReceiptNoteService,
    public dialog: MatDialog
  ) { 
    this.createForm();
    

  //  Contact
   this.contacts = [
    {id:1, item_name: 'Vivek',item_code: 1,unit: '1',billed_qty:1,recd_qty:1,break:0,  rate: '31.25',hsn:'12134',po_rate:0, gst_percentage:'12', igst_amt:'12234', cgst_amt:'1234' ,sgst_amt:'1256',net_rate:'0',amt:'13456',dly:'123',ar_ref:'0',remarks:'hello'},
    {id:2, item_name: 'hello',item_code: 2,unit: '1',billed_qty:1,recd_qty:1,break:0,  rate: '31.25',hsn:'13423',po_rate:0, gst_percentage:'12', igst_amt:'12234', cgst_amt:'1234',sgst_amt:'1256',net_rate:'0',amt:'13456',dly:'123',ar_ref:'0',remarks:'hello'},
    
   ];

   //  Licence
   this.licences = [
    { id:11,licence_number: '1234567890'},
    { id:22,licence_number: '0987654321'}
   ];

   this.payments = [
    { id:111,licence_number: '1234567890'},
    { id:222 ,licence_number: '0987654321'}
   ];
  }


   // Contact Start
   addContact(){
    this.contacts.push(this.newContact);
    this.newContact = {};
  }
  removeContact(index){
    this.contacts.splice(index,1);
  }
  editContact(val){
    this.editContactID = val;
  }
  updateContact(val){
    console.log("test");
    this.editContactID = {};
  }
  // Conatct End

  // Licence Start
  addLicence(){
    this.licences.push(this.newlicence);
    console.log("this.licences", this.licences);
    this.newlicence = {};
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

  addpayment(){
    this.payments.push(this.newContact);
    this.newpayment = {};
  }
  removepayment(index){
    this.payments.splice(index,1);
  }
  editpayment(val){
    this.editpaymentID = val;
  }
  updatepayment(val){
    console.log("test");
    this.editpaymentID = {};
  }

  ngOnInit() {
  }
  createForm() {
    this.ReceiptForm = this.fb.group({
      grnCat: ['', Validators.required ],
      gateEntryNo: ['', Validators.required ],
      supplier: ['', Validators.required ],
      gateEntryNo1:['', Validators.required ],
      grnNo: ['', Validators.required ],
      grnDate: ['', Validators.required ],
      challanNo: ['', Validators.required ],
      challanDate: ['', Validators.required ],
      billNo: ['', Validators.required ],
      billDate: ['', Validators.required ],
      grNo: ['', Validators.required ],
      grDate: ['', Validators.required ],
      purAc: ['', Validators.required ],
      billAmt: ['', Validators.required ],
      freightOctober: ['', Validators.required ],
      otherCharges:['', Validators.required ],
      otherDiscount:['', Validators.required ],
     // diffInTotal:['', Validators.required ],
      billDiscount:['', Validators.required ],
      customDutyCharges:['', Validators.required ],
      customDuty:['', Validators.required ]
     
     

    });

} 
savePurchase(data)
{
  console.log("data", data);
  this.goodsreceipt.savePushData(data);
  this.router.navigate(['/good-receipt']);
 
}

updatePurchase(data)
{
 
}


}
