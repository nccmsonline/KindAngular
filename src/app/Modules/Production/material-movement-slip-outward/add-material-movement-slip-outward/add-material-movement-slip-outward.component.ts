import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-material-movement-slip-outward',
  templateUrl: './add-material-movement-slip-outward.component.html',
  styleUrls: ['./add-material-movement-slip-outward.component.css']
})
export class AddMaterialMovementSlipOutwardComponent implements OnInit {

 
  newData:any={};
  KRAArray:Array<any>=[];
  toolTypeArray:Array<any>=[];
  toolNoArray:Array<any>=[];
  contacts: Array<any> = [];
  requisitionform: FormGroup;
  newContact: any = {};
  editContactID:any;
  isLoadingResults:false;
  contact:any;
  constructor() {

    this.contacts=[
      {id:1,description:"description1",frameno:"250",cutcoil:"4.8",width:"4.05",weight:"1.34",noofcutting:"21",wastage:"13000",remarks:"Test Remarks 1"} ,                                      
      {id:2,description:"description2",frameno:"200",cutcoil:"3.8",width:"84.05",weight:"3.46",noofcutting:"54",wastage:"155000",remarks:"Test Remarks 2"} ,
      {id:3,description:"description3",frameno:"600",cutcoil:"3.6",width:"34.55",weight:"5.67",noofcutting:"48",wastage:"235000",remarks:"Test Remarks 3"} , 
    ]
    }

    ngOnInit() {
    }
  
    editContact(id){
  
    }
  
    updateContact(id){
  
    }
  
    removeContact(id){
      
    }
  
    addContact(){
      
    }
  
    validateBeforeSave(id,data){
      
    }
  
  
  
  }
  