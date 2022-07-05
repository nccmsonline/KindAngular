import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IndentEntryService } from '../indent-entry.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
declare var $: any;
declare var jQuery: any;
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-add-new-indent-entry',
  templateUrl: './add-new-indent-entry.component.html',
  styleUrls: ['./add-new-indent-entry.component.css']
})
export class AddNewIndentEntryComponent implements OnInit {

  fieldArray: Array<any> = [];
  newChangeData: any={};
  date = new FormControl(new Date());
  closeResult: string;
  newData: any={};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  indententry: FormGroup;
  allDataGet: any;
  departmentget:Array<any> = [];
  indentorget:Array<any> = [];
  costcentreget:Array<any> = [];
  subcostcentreget:Array<any> = [];
  brandlistget:Array<any> = [];
  itemuomget:Array<any> = [];
  itemlistget:Array<any> = [];
  action: string;
  myDate = new Date();

  // item
  newdataarray: Array<any> = [];
  items: Array<any> = [];
  newItem: any = {};
  editItemID: any={};
  Itemitemid : any;
  Itembrandid : any;
  Itemquantityrequired : any;
  Itemremarks : any;
  Itemrequiredby : any;
  Itemsuplid : any;

  userinfo: any;
  companyid:any;
  branchid: any;
  coid:any;
  boid:any;
  id: string;
  Itemcode:'';

  // config = {displayKey:"department",search:true , height: '200px' ,placeholder:'' ,customComparator: ()=>{} ,limitTo: this.departmentget.length,moreText: 'more' ,noResultsFound: 'No results found!',searchPlaceholder:'Search'}

  constructor(
    // public dialogRef: MatDialogRef<AddNewIndentEntryComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private indentEntryService: IndentEntryService,
    @Inject('BASE_URL') private original_url : string
    // public dialog: MatDialog
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

    // this.items = [
    //   {id: 1, item_code: '12', item_name: 'Raw Material', item_brand: 'Philips', quantity: '4', unit: 'KILOS', remarks: 'test', expecteddate: '1/11/2018', ifurgent: 'true', suggested_supplier: 'abcd'},
    //   {id: 2, item_code: '7', item_name: 'Raw Material', item_brand: 'Philips', quantity: '4', unit: 'KILOS', remarks: 'test', expecteddate: '1/11/2018', ifurgent: 'true', suggested_supplier: 'abcd'}
    //  ];
  }

  ngOnInit() {

    this.indentEntryService.getdepartment()
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.departmentget = this.allDataGet;
    });

    this.indentEntryService.getindentor()
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.indentorget = this.allDataGet;
    });

    this.indentEntryService.getcostcentre()
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.costcentreget = this.allDataGet;
    });

    this.indentEntryService.getsubcostcentre()
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.subcostcentreget = this.allDataGet;
    });

    this.indentEntryService.getbrandlist()
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.brandlistget = this.allDataGet;
    });

    this.indentEntryService.GetitemUOM()
    .subscribe((response) => {
      this.allDataGet = response;
      this.itemuomget = this.allDataGet;
    });

    this.indentEntryService.getitemlist()
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.itemlistget = this.allDataGet;
    });

  }

  createForm() {
    this.indententry = this.fb.group({
      
      // indentnumber : ['', Validators.required ],
      indentdate : {disabled: true, value: ''},
      manualslipno: ['', Validators.required ],
      departmentid : ['',Validators.required],
      indentorid: ['',Validators.required],
      isjobwork: ['', Validators.required ],
      costcentreid: ['',Validators.required],
      subcostcentre: ['',Validators.required]
    });
  }

  // Contact Start
  additem(event){
    // console.log("event",event)
    // if(event.itemcode!=null && event.item_name !=null &&  event.item_brand !=null &&  event.quantity !=null &&  event.unit !=null && event.expecteddate != null
    //   && event.ifurgent!=null && event.suggested_supplier !=null &&  event.remarks !=null )
    // {
    this.items.push(this.newItem);
    this.items.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
    });
    this.newItem = {};
  // }
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
  // Conatct End

  saveindent(data)
  {
    let indentarray: Array<any> = [];
    let formObj = this.indententry.getRawValue();
    let newArray: Array<any> = [];
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    this.id = '0';

    data = formObj;
    data.coid = this.coid;
    data.boid = this.boid;
    data.indentid  = '0';
    data.indentnumber = '0';
    data.indentpriority  = '0';
    data.billingdescription  = '0';
    data.remarks = '';
    data.isactive = '1';
    data.deactivatedby = '0';
    data.deactivatedon = '';
    data.createdby = '1';
    data.createdon = '2018-12-07 12:00:00 AM';
    data.modifiedby = '0';
    data.modifiedon = '';
    
    newArray.push(data);

    if(data.indentdate == undefined) { data.indentdate = new Date(); }
    if(data.indentorid == undefined) { data.indentorid = ''; }
    if(data.manualslipno == undefined) { data.manualslipno = ''; }
    if(data.departmentid == undefined) { data.departmentid = ''; }
    if(data.costcentreid == undefined) { data.costcentreid = ''; }
    if(data.isjobwork == undefined) { data.isjobwork = ''; }
    if(data.subcostcentre == undefined) { data.subcostcentre = ''; }
    // if(data.indentdate == undefined) {data.vat_date = formatDate(this.myDate, 'yyyy-MM-dd hh:mm:ss a', 'en-US', '+0530');}

    if(this.newItem.itemid !== undefined || this.newItem.brandid!== undefined || this.newItem.quantityrequired !== undefined || this.newItem.remarks!== undefined
      || this.newItem.requiredby!== undefined || this.newItem.suplid!== undefined)
    {  
      // not click on plus
      if(this.newItem.itemid == undefined){this.newItem.itemid = '';}else{this.newItem.itemid = this.newItem.itemid}
      if(this.newItem.brandid == undefined){this.newItem.brandid = '';}else{this.newItem.brandid = this.newItem.brandid}
      if(this.newItem.quantityrequired == undefined){this.newItem.quantityrequired = '';}else{this.newItem.quantityrequired = this.newItem.quantityrequired}
      if(this.newItem.remarks == undefined){this.newItem.remarks = '';}else{this.newItem.remarks = this.newItem.remarks}
      if(this.newItem.requiredby == undefined){this.newItem.requiredby = '';}else{this.newItem.requiredby = this.newItem.requiredby}
      if(this.newItem.suplid == undefined){this.newItem.suplid = '';}else{this.newItem.suplid = this.newItem.suplid}

      indentarray.push(this.newItem);

    }

    if(this.newItem.itemid == undefined && this.newItem.brandid == undefined && this.newItem.quantityrequired == undefined && this.newItem.remarks == undefined && this.newItem.requiredby == undefined
      && this.newItem.suplid == undefined)
    {
      if(this.items.length == 0)
      {
        this.items=[
          {id: '', itemid: '', brandid: '', quantityrequired: '', remarks: '', requiredby: '', suplid: '', indentid:'0', quantityapproved:'0', quantitywoff:'0', itemrate:'0', poid:'1', coid:'1', boid:'1',
          approvedby:'1', approvedon:'2018-12-07 12:00:00 AM', deactivatedby:'0', deactivatedon:''  }
        ]
      }
      else
      {
          this.items.forEach((el) => {
            if(!el.itemid){this.Itemitemid = '';}else{this.Itemitemid = el.itemid;}
            if(!el.brandid){this.Itembrandid = '';}else{this.Itembrandid =el.brandid;}
            if(!el.quantityrequired){this.Itemquantityrequired = '';}else{this.Itemquantityrequired = el.quantityrequired;}
            if(!el.remarks){this.Itemremarks = '';}else{this.Itemremarks = el.remarks;}
            if(!el.requiredby){this.Itemrequiredby = '';}else{this.Itemrequiredby = el.requiredby;}
            if(!el.suplid){this.Itemsuplid = '';}else{this.Itemsuplid = el.suplid;}
            Object.assign(el, {
              itemid: this.Itemitemid,
              brandid: this.Itembrandid,
              quantityrequired: this.Itemquantityrequired,
              remarks: this.Itemremarks,
              requiredby: this.Itemrequiredby,
              suplid: this.Itemsuplid,
              id: '0',
              indentid:'0',
              quantityapproved:'0',
              quantitywoff:'0',
              itemrate:'0',
              poid:'0',
              coid:this.coid,
              boid:this.boid,
              approvedby:'0',
              approvedon:'2018-12-07 12:00:00 AM',
              deactivatedby:'0',
              deactivatedon:'0'


            });
          });
      }
    }
    if(this.items.length !== 0)
      {
        if(this.newItem.itemid !== undefined || this.newItem.brandid !== undefined || this.newItem.quantityrequired!== undefined || this.newItem.remarks !== undefined || this.newItem.requiredby!== undefined || this.newItem.suplid !== undefined)
        {
          if(this.newItem.itemid == undefined){this.newItem.itemid = '';}else{this.newItem.itemid = this.newItem.itemid}
          if(this.newItem.brandid == undefined){this.newItem.brandid = '';}else{this.newItem.brandid = this.newItem.brandid}
          if(this.newItem.quantityrequired == undefined){this.newItem.quantityrequired = '';}else{this.newItem.quantityrequired = this.newItem.quantityrequired}
          if(this.newItem.remarks == undefined){this.newItem.remarks = '';}else{this.newItem.remarks = this.newItem.remarks}
          if(this.newItem.requiredby == undefined){this.newItem.requiredby = '';}else{this.newItem.requiredby = this.newItem.requiredby}
          if(this.newItem.suplid == undefined){this.newItem.suplid = '';}else{this.newItem.suplid = this.newItem.suplid}
        }
      }

      this.items.forEach((el) => {
        if(!el.itemid){this.Itemitemid = '';}else{this.Itemitemid = el.itemid;}
        if(!el.brandid){this.Itembrandid = '';}else{this.Itembrandid =el.brandid;}
        if(!el.quantityrequired){this.Itemquantityrequired = '';}else{this.Itemquantityrequired = el.quantityrequired;}
        if(!el.remarks){this.Itemremarks = '';}else{this.Itemremarks = el.remarks;}
        if(!el.requiredby){this.Itemrequiredby = '';}else{this.Itemrequiredby = el.requiredby;}
        if(!el.suplid){this.Itemsuplid = '';}else{this.Itemsuplid = el.suplid;}
        delete el['itemcode'];
        delete el['unit'];
        console.log("el", el);
        Object.assign(el, {
          itemid: this.Itemitemid,
          brandid: this.Itembrandid,
          quantityrequired: this.Itemquantityrequired,
          remarks: this.Itemremarks,
          requiredby: this.Itemrequiredby,
          suplid: this.Itemsuplid,
          id: '0',
          indentid:'0',
          quantityapproved:'0',
          quantitywoff:'0',
          itemrate:'0',
          poid:'0',
          coid:this.coid,
          boid:this.boid,
          approvedby:'0',
          approvedon:'2018-12-07 12:00:00 AM',
          deactivatedby:'0',
          deactivatedon:'0'
        });
      });

   
    
    this.newdataarray = this.items.concat(indentarray);
    console.log("new array",this.newdataarray);

    let params = new HttpParams();
    params = params.append('1',JSON.stringify(newArray));
    params = params.append('2',JSON.stringify(this.newdataarray));
    console.log("hello",params)

    this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/MaterialManagement/Indents/saveindent?Entrytype=Insert&UserId=1&indentheaderarray="+JSON.stringify(newArray)+"&indentdetailarray="+JSON.stringify(this.newdataarray), {data: ''})
    .subscribe((res) => {
       console.log("data", res);
    // this.indentEntryService.savePushData(data);
    // this.router.navigate(['/indent-entry']);
  });
    
  
  }

//   public doSelect = (value: any) =>{ this.countryID=value;  console.log('hello', this.countryID);
//   this.countryChange();};
//    public doSelect1 = (value: any) => { this.StateId=value;  console.log('hello', this.StateId);
//   this.stateChange();};
//   public doSelect2 = (value: any) =>    {
//  };
//  public doSelect3 = (value: any) => {console.log('value', value);   this.zoneID=value;
//  this.zoneChange();
// };
// public doSelect4 = (value: any) => {console.log('value', value);   this.regionID=value;
// this.regionChange();
// };
// public doSelect5 = (value: any) => {console.log('value', value);   
// }

//  public doRemove = (value: any) => console.log('SingleDemoComponent.doRemove', value);

//  public doSelectOptions = (options: INgxSelectOption[]) => {console.log('SingleDemoComponent.doSelectOptions', options); 
//  };

onChange(id) {
    console.log("id", id);
  this.http.get(this.original_url+"/MaterialManagement/Indents/getitemlist?coid="+this.coid+"&boid="+this.boid)
      .subscribe((res) => {
        
        this.newChangeData = res;
        console.log("test",res);
        this.newChangeData = this.newChangeData.Table;
        
        this.newChangeData = this.newChangeData[0];
        if(this.newChangeData !== undefined)
        {
        this.Itemcode = this.newChangeData.itemcode;
        }
        
        console.log("changedata",this.newChangeData);
        
      });
}

}
