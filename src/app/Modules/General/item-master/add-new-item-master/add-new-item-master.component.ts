import { Component, OnInit, ElementRef, ViewChild, Injectable, Inject  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';  
import {formatDate } from '@angular/common';
declare var $: any;
declare var jQuery: any;

import { animate } from '@angular/animations';
import { ItemMasterService } from '../item-master.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-add-new-item-master',
  templateUrl: './add-new-item-master.component.html',
  styleUrls: ['./add-new-item-master.component.css']
})
export class AddNewItemMasterComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  userinfo : any;
  coid : any;
  boid : any;
  id: any;
  itemtypeAaray:any ;
  myDate = new Date();
  fieldArray: Array<any> = [];
  ItemCategory: Array<any> = [];
  GetitemUOM: Array<any> = [];
  Getitemtype: Array<any> = [];
  newData: any={};
  ItemForm: FormGroup;
  allDataGet: any;
  UOMGet: any;
  ItemTypeGet: any;
  imageUrl = '';
  PDFurl = '';
  currentSection = 'item_detail';
  getitemtype: Array<any> = [];
  getsupplierlist: Array<any> = [];
  allList:any;

  // item
  items: Array<any> = [];
  newItem: any = {};
  editItemID: any={};
  supplierCategoryArray:Array<any>=[];
  // contact
  contacts: Array<any> = [];
  newContact: any = {};
  editContactID: any={};

  // Licence
  licences: Array<any> = [];
  newlicence: any = {};
  editLicenceID: any={};
  action: string;

  // item
  brands: Array<any> = [];
  newBrand: any = {};
  editBrandID: any={};

  config = {displayKey:"Itemtype",search:true , height: '200px' ,placeholder:'' ,customComparator: ()=>{} ,limitTo: this.getitemtype.length,moreText: 'more' ,noResultsFound: 'No results found!',searchPlaceholder:'Search'}

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private itemMasterService: ItemMasterService,
    public dialogRef: MatDialogRef<AddNewItemMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) { 
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.createForm();
    this.action = data.action;
    if(this.action == 'edit')
    {
      this.newData = data.contact;
    }
  //  Contact
   this.contacts = [
    {id: 1, contact_name: 'Vivek', contact_phone_number: '1234567890', contact_email: 'vivek@gmail.com', contact_position: 'manager'},
    {id: 2, contact_name: 'Mohit', contact_phone_number: '0987654321', contact_email: 'mohit@gmail.com', contact_position: 'employee'}
   ];

   //  Licence
   this.licences = [
    {id: 1, licence_type: 'Drug Licence', licence_number: '1234567890', valid_up_to_date: '2018-10-02', authentication: 'manager'},
    {id: 2, licence_type: 'Manufacturing', licence_number: '0987654321', valid_up_to_date: '2018-10-02', authentication: 'employee'}
   ];

   //  Licence
  //  this.brands = [
  //   {id: 1, name: 'Drug Licence'},
  //   {id: 2, name: 'Manufacturing'}
  //  ];
  }

  ngOnInit() {
    this.itemMasterService.getSupplierList()
    .subscribe((response) => {
      this.allList = response;
      this.allList= this.allList.Table;
      //this.ItemCategory = this.allDataGet;
      this.getsupplierlist=this.allList;
      // this.keys= Object.keys(this.fieldArray[0]);
    });
    this.itemMasterService.Getitemtype()
    .subscribe((response) => {
      this.allDataGet = response;
      //this.allDataGet = this.allDataGet.Table;
      //this.ItemCategory = this.allDataGet;
      this.getitemtype=this.allDataGet;
      // this.keys= Object.keys(this.fieldArray[0]);
    });

    this.itemMasterService.GetitemUOM()
    .subscribe((response) => {
      this.UOMGet = response;
      this.GetitemUOM = this.UOMGet;
       console.log("response",response)
    });

    this.itemMasterService.getitemtype()
    .subscribe((response) => {
      this.ItemTypeGet = response;
      this.getitemtype = this.ItemTypeGet;
       console.log("response",this.ItemTypeGet)
    });

  }

  // Item Start
  additem(){
    this.items.push(this.newItem);
    this.items.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
      var coid = 'coid';
      item[coid] =this.coid;
      var coid = 'boid';
      item[coid] =this.boid;
      var itemid='itemid'
      item[itemid]='0';
      var isactive='isactive';
      item[isactive]="1";


    });
    console.log("items",this.items)
    this.newItem = {};
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

  // Brand Start
  addBrand(){
    this.brands.push(this.newBrand);
    this.brands.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
      var coid = 'coid';
      item[coid] =this.coid;
      var coid = 'boid';
      item[coid] =this.boid;
      var itemid='itemid'
      item[itemid]='0'
    });
    console.log("this.brands", this.brands);
    this.newBrand = {};
  }
  // removeItem(index){
  //   this.items.splice(index,1);
  // }
  editBrand(val){
    this.editBrandID = val;
  }
  updateBrand(val){
    this.editBrandID = {};
  }
  // Brand End

  // image Upload
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        this.imageUrl = event.target.result;
      }
    }
  }

  // PDF Upload
  onPdfSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        // this.PDFurl = event.target.result;
      }
    }
  }

  createForm() {
    this.ItemForm = this.fb.group({
      itemcategoryid :'',
      itemcode: ['', Validators.required ],
      itemname: ['', Validators.required ],
      itemalias: ['', Validators.required ],
      billingdescription: ['', Validators.required ],
      itemspecification: ['', Validators.required ],
      oldcode : ['', Validators.required ],
      specialcode: ['', Validators.required ],
      hsncode: ['', Validators.required ],
      taxrate: ['', Validators.required ],
      receivingunitid: ['', Validators.required ],
      issuingunitid : ['', Validators.required ],
      unitconversionfactor: ['', Validators.required ],
      itemimage:'',
      itemdrawing :'',
      lastpurchasedate:'',
      openingstock: ['', Validators.required ],
      openingstockissuingunit: ['', Validators.required ],
      openingrate: ['', Validators.required ],
      openingvalue: ['', Validators.required ],
      landedrate: ['', Validators.required ],
      lastpurchaserate: ['', Validators.required ],
      eoq: ['', Validators.required ],
      moq: ['', Validators.required ],
      itemclassABC: ['', Validators.required ],
      minlevel: ['', Validators.required ],
      maxlevel: ['', Validators.required ],
      rol: ['', Validators.required ]
    });
  }

  saveItem(data)
  { let formObj = this.ItemForm.getRawValue();
    let newArray: Array<any> = [];
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.id = '0';

    data = formObj;
     data.lastpurchasedate = formatDate(data.lastpurchasedate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    data.coid = this.coid.toString();
    data.boid = this.boid.toString();
    data.id = this.id.toString();
    //data.segmentid = '0';
    data.isactive = '1';
    data.deactivatedby = '0';
    data.deactivatedon = '';
    data.createdby = this.userinfo['userid'].toString();
    data.createdon = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');
    data.modifiedby = '0';
    data.modifiedon = '';
  
    if(data.previousitemid==undefined){data.previousitemid=""}
    if(data.itemcategoryid==undefined){data.itemcategoryid='1'}
    if(data.itemimage==undefined){data.itemimage=''}
    if(data.itemdrawing==undefined){data.itemdrawing=''}
    console.log("data", data);
    newArray.push(data);
    if(this.brands.length==0)
    {
      this.brands = [
        {id:'0',brandid:'0',itemid:'0',coid:'0',boid:'0'}
     
       ];
    }
    if(this.items.length==0)
    {
        this.items=[
         {id:'0', suplid:'0',itemid:'0',brandid:'0',suplitemcode:'0',suplitemrate:'0',leadtimeair:'0' ,leadtimesurface:'0',coid:'0' ,boid:'0',isactive:'0'}
        ];
    }    
    this.itemtypeAaray=[
      {id:'0',typeid:'1', itemid:'1',coid:this.coid,boid:this.boid}];


    let params = new HttpParams();
    params = params.append('1',JSON.stringify(newArray));
    params = params.append('2',JSON.stringify(this.brands));
    params = params.append('3',JSON.stringify(this.items));
    params = params.append('4',JSON.stringify(this.itemtypeAaray));
    console.log("paramas",params);

    this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/Masters/ItemMAster/Saveitemmaster?Entrytype=Insert&UserId=1&itemdataarray="+JSON.stringify(newArray)+"&supplieritemdataarray="+JSON.stringify(this.items)+"&itembranddataarray="+JSON.stringify(this.brands)+"&itemtypearray="+JSON.stringify(this.itemtypeAaray), {data: ''})
    .subscribe((res) => {
      console.log("hello","hello");
       this.itemMasterService.savePushData(data);
       //this.successDialog();
    });
   // this.itemMasterService.savePushData(data);
    this.dialogRef.close();
  }

  updateItemSave(data)
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
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    document.querySelector('#' + section)
    .scrollIntoView();
  }


}