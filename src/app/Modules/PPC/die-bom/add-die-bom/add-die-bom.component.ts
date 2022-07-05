import { Table } from 'primeng/table';
import { TimePickerCustomMessagesComponent } from '@progress/kendo-angular-dateinputs';
import { ConfirmationDialogService } from './../../../../Dialog/confirmation-dialog/confirmation-dialog.service';
import { Global } from './../../../../Global';
import { SuccessDialogComponent } from './../../../../Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from './../../../../validation/validation.component';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-die-bom',
  templateUrl: './add-die-bom.component.html',
  styleUrls: ['./add-die-bom.component.css']
})
export class AddDieBomComponent implements OnInit {

 
  original_url = environment.baseUrl;
  @ViewChildren('oldcodefocus') vc;
  fieldArray: Array<any> = [];
  allDataGet: any;
  itemlistget: Array<any> = [];
  itemlistbom: Array<any> = [];
  itemlistcustbom: Array<any> = [];
  itemNamelistget: Array<any> = [];
  itemsforOrderNo: Array<any> = [];
  subitemlistget: Array<any> = [];
  selectedItem: any;
  newItem: any = {};
  searchRMDesc = '';
  editItemID: any = {};
  newitemtype: any = {};
  removearray: Array<any> = [];
  rmtypeList: Array<any> = [];
  items: Array<any> = [];
  date = new FormControl(new Date());
  myDate = new Date();
  BOMentry: FormGroup;
  arraystandarBOM = '';
  arraycustomBOM = '';
  companyid: any;
  photos = [];
  photosBuffer = [];
  itemnamephotos = [];
  itemnamephotosBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  loadingItemName = false;
  newData: any = {};
  Data: any = {};
  bomData: any = {};
  searchEditRMDesc = '';
  brandlistget: Array<any> = [];
  UNIT: ''; BOMID: any; action: any;
  BRAND: '';
  bomtype: any;
  isLoadingResults: boolean = false;
  subscription: Subscription;
  message: any;
  arrayItemProductCode = '';
  PLANNEDSTROKES = '';
  DIENAME = '';
  arrayItemProductDesc = '';
  oldcode = '';
  orderlist: Array<any> = [];
  itemdesc = '';
  arrayItemOldCode = '';
  arrayNewItemOldCode = '';
  arrayNewItemDesc = '';
  arrayEditItemDesc = '';
  arrayEditItemOldCode = '';
  arrayNewItemCode = '';
  arrayEditItemCode = '';
  storeget: Array<any> = [];
  custbom: any;
  showaftercopy: any;
  showaftercheckcopy: any;
  checkbom: any;
  showstandard: any = true;
  selectedproductid: any;

  moduleid:any;
  functionalityid:any;
  userRightCheck:any={};
  canEditCommonClass = '';
  canCreateCommonClass ='';
  canDeleteCommonClass ='';

  //bomid:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService,
    private globalVar: Global,
    // private service: BomService,
    public dialog: MatDialog,
    private messageService: ConfirmationDialogService) {


    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.subscription =
      this.messageService.getMessage()
        .subscribe(message => {
          this.message = message;

          if (this.message != null) {

          }

        });
    this.createForm();
    this.BOMID = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    // this.bomtype = this.activatedRoute.snapshot.paramMap.get('type');
    // this.moduleid= this.activatedRoute.snapshot.paramMap.get('moduleid');
    // this.functionalityid= this.activatedRoute.snapshot.paramMap.get('functionalityid');

    // User Right Data Get
    let Sidebar = sessionStorage.getItem("sidebar");
    let sidebarDataGet = JSON.parse(Sidebar);
    // let childSidebarDataGet = sidebarDataGet.find(x=>x.moduleid == this.moduleid);
    // this.userRightCheck = childSidebarDataGet.items.find(x=>x.functionalityid == this.functionalityid);
    if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    if(this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; } 
    if(this.userRightCheck.candelete == 'True') { this.canDeleteCommonClass = ''; }
    if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
    if(this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; } 
    if(this.userRightCheck.candelete == 'False') { this.canDeleteCommonClass = 'canDeleteCommonClass'; }

    this.newItem.lengthReadOnly = true;
    this.newItem.widthReadOnly = true;
    this.newItem.lengthDisableClass = 'readonly-disable';
    this.newItem.widthDisableClass = 'readonly-disable';
    this.newData.BATCHSIZE = 1;
    this.newItem.readonlyRMType = true;
    this.newItem.readonlyRMTypeClass = 'readonly-disable';

  //   if (this.action == "add") {
  //     this.bomData.checkbom = "S";
  //   }

  //   if(this.userRightCheck.canview == 'True')
  //   {
  //     if (this.action == 'edit') {
  //       this.http.get(this.original_url + "/MaterialManagement/bom/getbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + this.BOMID + "&type=" + this.bomtype)
  //         .subscribe((res) => {
  //           this.newData = res;
  //           if(this.bomtype=='P'){
  //             this.checkbom="S";
  //           }
  //           this.items = this.newData.Table1;
  //           this.newData = this.newData.Table;
  //           this.newData = this.newData[0];
  //           this.newData.PLANNEDSTROKES = this.newData.ITEMCODE;
  //           this.newData.DIENAME = this.newData.ITEMNAME;
  //           var i: number;
  //           i = 1;
  //           for (let data of this.items) {
  //             data.id = i;
  
  //             if (data.rmtype == 0) {
  //               data.readonlyRMType = true;
  //               data.readonlyRMTypeClass = 'readonly-disable';
  //             } else {
  //               data.readonlyRMType = false;
  //               data.readonlyRMTypeClass = '';
  //             }
  
  //             i++;
  //           }
  //         });
  //     }
  //   }
  }

  ngOnInit() {
    if (this.action == 'new') {
      // return this.http.get(this.original_url + "/Production/productionplan/commonapiplan?coid=" + this.coid + "&boid=" + this.boid + "&fyid=" + this.fyid + "&planid=" +  this.planid)
 this.http.get(this.original_url + "/MaterialMgmt/bom/getcommonApibom?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid)
 .subscribe((data: any[]) => {
   this.allDataGet = data;
   // this.orderlist = this.allDataGet.Table2;
   this.brandlistget=this.allDataGet.Table;
 });
  }
  else if (this.action == 'edit') {
    this.http.get(this.original_url + "/MaterialMgmt/bom/getbomdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&bomid="+this.BOMID)
    .subscribe((data: any[]) => {
      this.allDataGet = data;
      this.brandlistget=this.allDataGet.Table2
     this.newData = this.allDataGet.Table[0];
     this.items = this.allDataGet.Table1;
    });
  }


    if (this.bomtype == "O") {
      this.custbom = true;
      this.checkbom = "S";
    }
    else {
      this.custbom = false;
    }
    if(this.userRightCheck.canview == 'True')
    {
      // this.service.getbrandlist()
      //   .subscribe((response) => {
      //     this.allDataGet = response;
      //     this.allDataGet = this.allDataGet.Table;
      //     this.brandlistget = this.allDataGet;
      //   });
      // this.getOAList();
    }
  }

  createForm() {
    this.BOMentry = this.fb.group({
      PLANNEDSTROKES: [null, Validators.required],
      DIENAME: [null, Validators.required],
      STROKESMADE: '',
      BATCHSIZE: [null, Validators.required],
      PARTYNAME: '',
      name: ''
    });
  }
  additem(event) {
    var qty = this.items.find(x => x.CID == this.newItem.CID);

    if (qty != undefined) {
      alert("Duplicate item found");
    }
    if (this.validateDetail(this.newItem)) {
      // this.vc.first.nativeElement.focus();
      this.items.push(this.newItem);
      this.newitemtype['ID'] = this.newItem.CID;
      this.removearray.push(this.newitemtype);
      this.items.forEach((item, index) => {
        var num = 'ID';
        var value = index + 1;
        item[num] = value;
        if (item.CID !== this.newItem.CID) {
        }
      });
      this.newItem = {};
      this.oldcode = '';
      this.itemdesc = '';
    }
  }
  removeItem(index) {
    this.items.splice(index, 1);
    this.removearray = [];

  }
  editItem(val) {
    this.editItemID = val;
  }
  updateItem(val) {
    if (this.validateDetail(val)) {
      // this.vc.first.nativeElement.focus();
      this.editItemID = {};
    }
  }

  batchSizeLength(event) {
    if (event == '' || event == 0) {
      this.newData.BATCHSIZE = 1;
    }
  }

  iscopy(event) {
    if (event.checked == true) {
      this.showaftercheckcopy = true;
    }
    else {
      this.showaftercheckcopy = false;
    }
  }

  viewbom() {
    this.http.get(this.original_url + "/MaterialManagement/bom/getbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + this.BOMID + "&type=I")
      .subscribe((res) => {
        this.Data = res;
        this.items = this.Data.Table1;
      });
  }

  dropdownHide() {
    this.arrayItemProductDesc = '';
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayEditItemOldCode = '';
    this.arrayEditItemDesc = ''
    this.arrayEditItemCode = '';
    this.searchEditRMDesc = '';
    this.arrayNewItemOldCode = '';
    this.arrayNewItemDesc = ''
    this.arrayNewItemCode = '';
    this.searchRMDesc = '';
    this.arraystandarBOM = '';
    this.arraycustomBOM = '';
  }


  onOAChange(event) {
    if (event == null) {
      this.itemsforOrderNo = [];
      this.arraycustomBOM = '';
      this.arraystandarBOM = '';
      this.items = [];
      this.itemlistbom = [];
      this.itemlistcustbom = [];
    }
    else {
      this.showoItemDetail();
    }
  }
  showoItemDetail() {
    this.getCustomerOrderDetailnew(this.bomData.oaid).subscribe((response) => {
      this.allDataGet = response;
      var data1: any = [];
      data1 = this.allDataGet;
      this.itemsforOrderNo = [];
      var i = 0;;
      for (var data of data1) {
        var item: any = {};
        item.itemid = data.itemid;
        item.oldcode = data.oldcode;
        item.ITEMCODE = data.ITEMCODE;
        item.ITEMNAME = data.ITEMNAME;
        this.itemsforOrderNo.push(item);
      }
    });
  }

  changetype(event) {
    if (event == null) {
      this.showstandard = true;
    }
    else if (event.value == "S") {
      this.showstandard = true;
      this.checkbom = "S";
      this.arraycustomBOM = '';
      this.itemlistcustbom = [];
      this.items = [];
    }
    else if (event.value == "C") {
      this.showstandard = false;
      this.checkbom = "C";
      this.arraystandarBOM = '';
      this.itemlistbom = [];
      this.items = [];
    }
  }

  searchTermBOM(term, rowDetail) {
    this.arraystandarBOM = term;
    if (this.arraystandarBOM !== '') {
      let checkbomtype = this.checkbom;
      if (this.bomtype == "I" ||  this.bomtype == "P") {
        checkbomtype = "S";
      }
      this.http.get(this.original_url + "/MaterialManagement/bom/getstandardbomlist?PageNumber=1&PageSize=500&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + term + "&checkbomtype=" + checkbomtype)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.itemlistbom = this.allDataGet.Table;
        });
    }
    else {
      this.itemlistbom = [];
      rowDetail.ITEMNAME = '';
      rowDetail.VERSION = '';
    }
  }

  searchTermCustBOM(term, rowDetail) {
    this.arraycustomBOM = term;
    if (this.arraycustomBOM !== '') {
      let checkbomtype = this.checkbom;
      this.http.get(this.original_url + "/MaterialManagement/bom/getstandardbomlist?PageNumber=1&PageSize=500&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + term + "&checkbomtype=" + checkbomtype)
        //+this.selectedItem)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.itemlistcustbom = this.allDataGet.Table;
        });
    }
    else {
      this.itemlistbom = [];
      rowDetail.ITEMNAME = '';
      rowDetail.VERSION = '';
    }
  }

  getCustomerOrderDetailnew(orderid) {
    return this.http.get(this.original_url + "/Production/productionplan/getcustomerorderitems?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&oaid=" + orderid)
      .pipe(
        map((data: any[]) => {
          return data;
        })
      );
  }

  calculateWastage(rowDetail) {
    if (rowDetail.QTY > 0 && rowDetail.WASTAGEPERCENT > 0) {
      var q = rowDetail.QTY * rowDetail.WASTAGEPERCENT / 100;
      rowDetail.WASTAGEQTY = q.toFixed(3);
    }


    var basicamt = 0;
    if (this.newData.BATCHSIZE == undefined || this.newData.BATCHSIZE == null || this.newData.BATCHSIZE == "") { this.newData.BATCHSIZE = 0; }

    if (rowDetail.QTY == undefined || rowDetail.QTY == null || rowDetail.QTY == "") { rowDetail.QTY = 0; }

    if (rowDetail.QTY > 0) {
      basicamt =   parseFloat(rowDetail.QTY)/parseFloat(this.newData.BATCHSIZE);
    }
    rowDetail.quantityperunit = basicamt.toFixed(3);
  }

  calculateWastagePercent(item) {
    if (item.QTY > 0 && item.WASTAGEQTY > 0) {
      var q = item.WASTAGEQTY * 100 / item.QTY;
      item.WASTAGEPERCENT = q.toFixed(3);
    }

  }
  validateDetail(data) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Before add please rectify following mistakes:-</h5>";
    if (data.CID == undefined || data.CID == 0 || data.CID == '') { flag = false; msg = msg + "* Product not seletect<br/>" }
    //  if(data.BRANDID==undefined||data.BRANDID==0||data.BRANDID=='' )
    //  {flag=false; msg=msg+"BRAND not seletect"+'\n'}
    if (data.QTY == undefined || data.QTY == 0 || data.QTY == '') { flag = false; msg = msg + "* Quantity not entred<br/>" }

    // if (data.rmtype == undefined || data.rmtype == '' || data.rmtype == 0) {
    //   if (data.rmtype == 1) {
    //     { flag = false; msg = msg + "* Raw Material Item not Selected<br/>" }
    //   }
    // }

    if (data.WASTAGEQTY == undefined || data.WASTAGEQTY == '')
      data.WASTAGEQTY == 0;
    if (data.WASTAGEPERCENT == undefined || data.WASTAGEPERCENT == '')
      data.WASTAGEPERCENT == 0;

    if (flag == false) {
      //  alert(msg);
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }

    return flag;
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  //old code
  // searchTermOldCode(term, rowDetail) {
  //   this.arrayItemOldCode = term;
  //   if (this.arrayItemOldCode !== '') {
  //     this.arrayItemProductDesc = '';
  //     this.arrayItemProductCode = '';
  //     this.arrayNewItemDesc = '';
  //     this.arrayNewItemOldCode = '';
  //     this.arrayEditItemDesc = '';
  //     this.arrayEditItemOldCode = '';
  //     this.arrayNewItemCode = '';
  //     this.arrayEditItemCode = '';
  //     rowDetail.PLANNEDSTROKES = '';
  //     rowDetail.DIENAME = '';
  //     this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+this.arrayItemOldCode+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&searchtype=oldcode")
  //       .subscribe((response: any[]) => {
  //         this.allDataGet = response;
  //         this.allDataGet = this.allDataGet.Table;
  //         this.itemlistget = this.allDataGet;
  //       });
  //   }
  //   else {
  //     this.itemlistget = [];
  //     this.arrayItemOldCode = '';
  //     rowDetail.PLANNEDSTROKES = '';
  //     rowDetail.productid = '';
  //     rowDetail.DIENAME = '';
  //   }
  // }

  //Code
  searchTermProductCode(term, rowDetail) {
    this.arrayItemProductCode = term;
    if (this.arrayItemProductCode !== '') {
      this.arrayItemProductDesc = '';
      this.arrayItemOldCode = '';
      this.arrayNewItemDesc = '';
      this.arrayNewItemOldCode = '';
      this.arrayEditItemDesc = '';
      this.arrayEditItemOldCode = '';
      this.arrayNewItemCode = '';
      this.arrayEditItemCode = '';
      rowDetail.oldcode = '';
      rowDetail.DIENAME = '';
      this.http.get(this.original_url+"/Masters/CommonMaster/Getdieitemlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.arrayItemProductCode)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayItemProductCode = '';
      rowDetail.oldcode = '';
      rowDetail.PRODUCTID = '';
      rowDetail.DIENAME = '';
    }
  }



  //Desc 
  searchTermProductDesc(term, rowDetail) {
    this.arrayItemProductDesc = term;
    if (this.arrayItemProductDesc !== '') {
      this.arrayItemOldCode = '';
      this.arrayItemProductCode = '';
      this.arrayNewItemDesc = '';
      this.arrayNewItemOldCode = '';
      this.arrayEditItemDesc = '';
      this.arrayEditItemOldCode = '';
      this.arrayNewItemCode = '';
      this.arrayEditItemCode = '';
      this.http.get(this.original_url+"/Masters/CommonMaster/Getdieitemlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.arrayItemProductDesc)
      .subscribe((response: any[]) => {
        this.allDataGet = response;
        this.allDataGet = this.allDataGet.Table;
        this.itemlistget = this.allDataGet;
        // this.itemNamelistget = this.allDataGet;
      });
     
    }
    else {
      this.itemlistget = [];
      this.arrayItemProductDesc = '';
      rowDetail.PLANNEDSTROKES = '';
      rowDetail.PRODUCTID = '';
      rowDetail.oldcode = '';
    }
  }

  onChangebom(data, rowDetail) {
    this.BOMID = data.BOMID;
    this.arraystandarBOM = '';
    this.bomData.ITEMNAME = data.ITEMNAME;
  }

  onChangestandardbom(data, rowDetail) {
    rowDetail.ITEMNAME = this.itemlistbom.find(x => x.id == data.id).ITEMNAME;
    rowDetail.VERSION = this.itemlistbom.find(x => x.id == data.id).VERSION;
    this.selectedproductid = data.PRODUCTID;
    this.BOMID = data.BOMID;
    this.arraystandarBOM = '';
    this.http.get(this.original_url + "/MaterialManagement/bom/getbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + data.BOMID + "&type=I")
      .subscribe((res) => {
        this.newData = res;
        this.items = this.newData.Table1;
      });
  }

  onChangeCustBom(data, rowDetail) {
    rowDetail.customername = this.itemlistcustbom.find(x => x.itemid == data.id).customername;
    rowDetail.oano = this.itemlistcustbom.find(x => x.itemid == data.id).oano;
    rowDetail.oadate = this.itemlistcustbom.find(x => x.itemid == data.id).oadate;
    this.http.get(this.original_url + "/MaterialManagement/bom/getbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + data.BOMID + "&type=O")
      .subscribe((res) => {
        this.newData = res;
        this.items = this.newData.Table1;
      });
  }

  onChangeOldCode(data, rowDetail) {
    this.http.get(this.original_url + "/MaterialMgmt/bom/checkforduplicatebom?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&itemid="+data.ITEMID)
      .subscribe((res) => {
        let allDataGet: any;
        let BOMEXISTS:any;
        allDataGet = res;
        BOMEXISTS = allDataGet.Table[0].BOMEXISTS;
        if(BOMEXISTS == 0)
        {
          rowDetail.PRODUCTID = this.itemlistget.find(x => x.ITEMID == data.ITEMID).DIEID;
          // this.DIENAME = this.itemlistget.find(x => x.ITEMID == data.ITEMID).DIENAME;
          rowDetail.PLANNEDSTROKES = this.itemlistget.find(x => x.ITEMID == data.ITEMID).PLANNEDSTROKES;
          // rowDetail.oldcode = this.itemlistget.find(x => x.ITEMID == data.ITEMID).oldcode;
          rowDetail.DIENAME = this.itemlistget.find(x => x.ITEMID == data.ITEMID).DIENAME;
          rowDetail.STROKESMADE = this.itemlistget.find(x => x.ITEMID == data.ITEMID).STROKESMADE;
          rowDetail.PARTYNAME = this.itemlistget.find(x => x.ITEMID == data.ITEMID).PARTYNAME;
        }
        else if(BOMEXISTS == 1)
        {
          var flag: boolean;
          flag = true;
          var msg: any;
          msg = "<h5>Please rectify the following before Saving Data :-</h5>";
          msg = msg + "BOM Already Exists";
          const dialogRef = this.dialog.open(ValidationComponent, {
            data: {
              msg: msg,
              action: ''
            }
          });

        }
      });
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayItemProductDesc = '';
  }

  // ---------
  //old code
  // 1
  searchEditOldCode(term, rowDetail) {
    this.arrayEditItemOldCode = term;
    if (this.arrayEditItemOldCode !== '') {
      this.arrayItemOldCode = '';
      this.arrayItemProductCode = '';
      this.arrayNewItemDesc = '';
      this.arrayNewItemOldCode = '';
      this.arrayEditItemDesc = '';
      this.arrayNewItemCode = '';
      this.arrayEditItemCode = '';
      this.arrayItemProductDesc = '';
      this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+this.arrayEditItemOldCode+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&searchtype=oldcode")
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          // this.itemNamelistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayEditItemOldCode = '';
      rowDetail.ITEMNAME = '';
      rowDetail.ITEMCODE = '';
      rowDetail.unitdescription = '';
      if (rowDetail.rmtype == 0) {
        rowDetail.rmtypedesc = '';
        rowDetail.rmtype = '';
      }
    }
  }
  // 2
  searchEditTermItemDesc(term, rowDetail) {
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayNewItemDesc = '';
    this.arrayNewItemOldCode = '';
    this.arrayEditItemOldCode = '';
    this.arrayNewItemCode = '';
    this.arrayEditItemCode = '';
    this.arrayItemProductDesc = '';
    this.arrayEditItemDesc = term;
    if (this.arrayEditItemDesc !== '') {
      this.http.get(this.original_url+"/Masters/CommonMaster/Getitemlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.arrayEditItemDesc+"&userid="+this.globalVar.UserId)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          // this.itemNamelistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayEditItemDesc = '';
      rowDetail.oldcode = '';
      rowDetail.ITEMCODE = '';
      rowDetail.unitdescription = '';
      if (rowDetail.rmtype == 0) {
        rowDetail.rmtypedesc = '';
        rowDetail.rmtype = '';
      }
    }
  }
  // 3
  searchNewTermOldCode(term, rowDetail) {
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayNewItemDesc = '';
    this.arrayEditItemDesc = '';
    this.arrayEditItemOldCode = '';
    this.arrayNewItemCode = '';
    this.arrayEditItemCode = '';
    this.arrayItemProductDesc = '';
    this.arrayNewItemOldCode = term;
    if (this.arrayNewItemOldCode !== '') {
      this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+this.arrayNewItemOldCode+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&searchtype=oldcode")
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          // this.itemNamelistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayNewItemOldCode = '';
      rowDetail.ITEMNAME = '';
      rowDetail.ITEMCODE = '';
      rowDetail.unitdescription = '';
      if (rowDetail.rmtype == 0) {
        rowDetail.rmtypedesc = '';
        rowDetail.rmtype = '';
      }
    }
  }
  // 4
  searchNewTermItemDesc(term, rowDetail) {
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayNewItemOldCode = '';
    this.arrayEditItemDesc = '';
    this.arrayEditItemOldCode = '';
    this.arrayNewItemCode = '';
    this.arrayEditItemCode = '';
    this.arrayItemProductDesc = '';
    this.arrayNewItemDesc = term;
    if (this.arrayNewItemDesc !== '') {
      this.http.get(this.original_url+"/Masters/CommonMaster/Getitemlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.arrayNewItemDesc+"&userid="+this.globalVar.UserId)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          // this.itemNamelistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayNewItemDesc = '';
      rowDetail.oldcode = '';
      rowDetail.ITEMCODE = '';
      rowDetail.unitdescription = '';
      if (rowDetail.rmtype == 0) {
        rowDetail.rmtypedesc = '';
        rowDetail.rmtype = '';
      }
    }
  }
  //5
  searchEditItemCode(term, rowDetail) {
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayNewItemDesc = '';
    this.arrayNewItemOldCode = '';
    this.arrayEditItemDesc = '';
    this.arrayEditItemOldCode = '';
    this.arrayNewItemCode = '';
    this.arrayItemProductDesc = '';
    this.arrayEditItemCode = term;
    if (this.arrayEditItemCode !== '') {
      this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.arrayEditItemCode+"&userid="+this.globalVar.userid)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          // this.itemNamelistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayEditItemCode = '';
      rowDetail.ITEMNAME = '';
      rowDetail.oldcode = '';
      rowDetail.unitdescription = '';
      if (rowDetail.rmtype == 0) {
        rowDetail.rmtypedesc = '';
        rowDetail.rmtype = '';
      }
    }
  }
  //6
  searchNewTermItemCode(term, rowDetail) {
    this.arrayItemOldCode = '';
    this.arrayItemProductCode = '';
    this.arrayNewItemDesc = '';
    this.arrayNewItemOldCode = '';
    this.arrayEditItemDesc = '';
    this.arrayEditItemOldCode = '';
    this.arrayEditItemCode = '';
    this.arrayItemProductDesc = '';
    this.arrayNewItemCode = term;
    if (this.arrayNewItemCode !== '') {
      this.http.get(this.original_url+"/Masters/CommonMaster/Getitemlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search="+this.arrayNewItemCode+"&userid="+this.globalVar.UserId)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          // this.itemNamelistget = this.allDataGet;
        });
    }
    else {
      this.itemlistget = [];
      this.arrayNewItemCode = '';
      rowDetail.ITEMNAME = '';
      rowDetail.oldcode = '';
      rowDetail.unitdescription = '';
      if (rowDetail.rmtype == 0) {
        rowDetail.rmtypedesc = '';
        rowDetail.rmtype = '';
      }
    }
  }

  onChangeOfOldCode(data, rowDetail) {
    this.arrayNewItemDesc = '';
    this.arrayNewItemOldCode = '';
    this.arrayEditItemDesc = '';
    this.arrayEditItemOldCode = '';
    this.arrayNewItemCode = '';
    this.arrayEditItemCode = '';

    let id = this.itemlistget.find(x => x.ITEMID == data.ITEMID).ITEMID;
    if (id != null || id != undefined) {

      // this.http.get(this.original_url + "/MaterialMgmt/bom/Getitemdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&itemid="+id)
      //   .subscribe((res) => {
      //     rowDetail.lengthReadOnly = true;
      //     rowDetail.widthReadOnly = true;
      //     rowDetail.lengthDisableClass = 'readonly-disable';
      //     rowDetail.widthDisableClass = 'readonly-disable';
      //     let allDataGet: any;
      //     let dimensionArray = [];
      //     allDataGet = res;
      //     // dimensionArray = allDataGet.Table8;
      //     // if (dimensionArray.length > 0) {
      //     //   for (let mdata of dimensionArray) {
      //     //     if (mdata.name == 'length') {
      //     //       rowDetail.lengthDisableClass = '';
      //     //       rowDetail.lengthReadOnly = false;
      //     //     }

      //     //     if (mdata.name == 'Width') {
      //     //       rowDetail.widthDisableClass = '';
      //     //       rowDetail.widthReadOnly = false;
      //     //     }
      //     //   }
      //     // }
      //   });
      var UOM1 = this.itemlistget.find(x => x.ITEMID == id).UOM;
      var ITEMCODE = this.itemlistget.find(x => x.ITEMID == id).ITEMCODE;
      var ITEMNAME = this.itemlistget.find(x => x.ITEMID == id).ITEMNAME;
      var UNIT = this.itemlistget.find(x => x.ITEMID == id).UNIT;
      // var oldcode = this.itemlistget.find(x => x.ITEMID == id).oldcode;
      // var rmtype = this.itemlistget.find(x => x.ITEMID == id).rmtype;
      // this.oldcode = oldcode;
      this.itemdesc = ITEMNAME;
      // rowDetail.oldcode = oldcode;
      // rowDetail.unitdescription = UOM1;
      rowDetail.ITEMCODE = ITEMCODE;
      rowDetail.ITEMNAME = ITEMNAME;
      rowDetail.CID = id;
      rowDetail.ITEMID = id;
      rowDetail.UNIT = UNIT;

      // if (rmtype == 0) {
      //   rowDetail.readonlyRMType = true;
      //   rowDetail.readonlyRMTypeClass = 'readonly-disable';
      //   rowDetail.rmtypedesc = '';
      //   rowDetail.rmtype = '';
      // } else {
      //   rowDetail.readonlyRMType = false;
      //   rowDetail.readonlyRMTypeClass = '';
      // }
    }
  }
  // ---/----

  // onChangeOfItemDesc(data,rowDetail) {
  //   let id = this.itemlistget.find(x=>x.itemid==data.itemid).itemid;
  //   if(id !=null || id!=undefined){
  //   var UOM1 = this.itemlistget.find(x=>x.itemid == id).uom;
  //   var ITEMCODE = this.itemlistget.find(x=>x.itemid == id).ITEMCODE;
  //   var ITEMNAME = this.itemlistget.find(x=>x.itemid == id).ITEMNAME;
  //   var issuingunitid = this.itemlistget.find(x=>x.itemid == id).unitid;
  //   var oldcode=this.itemlistget.find(x=>x.itemid == id).oldcode;


  //   this.itemdesc=ITEMNAME;
  //   this.oldcode=oldcode;
  //   rowDetail.oldcode=oldcode;
  //   rowDetail.unitdescription=UOM1;
  //   rowDetail.ITEMCODE=ITEMCODE;
  //   rowDetail.ITEMNAME=ITEMNAME;
  //   rowDetail.CID=id;
  //   rowDetail.UNIT=issuingunitid;
  //   this.arrayItemItemDesc = '';
  //   }
  // }

  //QTY Calculate
  // calculateQuantity(rowDetail)
  // {
  //   var basicamt=0;
  //   if(this.newData.BATCHSIZE ==undefined || this.newData.BATCHSIZE ==null || this.newData.BATCHSIZE =="")
  //   {this.newData.BATCHSIZE=0;}

  //   if(rowDetail.quantitybatch ==undefined || rowDetail.quantitybatch ==null || rowDetail.quantitybatch =="")
  //   {rowDetail.quantitybatch=0;}

  //   if(rowDetail.quantitybatch > 0)
  //   {
  //     basicamt = parseFloat(this.newData.BATCHSIZE)/parseFloat(rowDetail.quantitybatch);
  //   }
  //   rowDetail.quantityperunit=basicamt.toFixed(3);
  // }

  onChangeOfBrand(id, rowDetail) {
    var BRAND = this.brandlistget.find(x => x.ID == id).NAME;
    rowDetail.BRAND = BRAND;
  }

  removeitem() {
    this.newItem.ITEMCODE = "";
    this.newItem.UNIT = "";
  }

  itemChange(event) {
    this.selectedItem = event[0].value;
    let checkbomtype = this.checkbom;
    if (checkbomtype == "S") {
      this.http.get(this.original_url + "/MaterialManagement/bom/getstandardbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&checkbomtype=" + checkbomtype)
        //+ this.selectedItem)
        .subscribe((response: any[]) => {
          this.allDataGet = response;

          this.itemlistbom = this.allDataGet.Table;
        });
    }
    else {
      this.http.get(this.original_url + "/MaterialManagement/bom/getstandardbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&checkbomtype=" + checkbomtype)
        //+ this.selectedItem)
        .subscribe((response: any[]) => {
          this.allDataGet = response;
          this.itemlistcustbom = this.allDataGet.Table;
        });

    }
  }

  validateBeforeSave(hdata, action) {
    // if (this.bomtype == "I" || this.bomtype == "P" ) {
      var flag: boolean;
      flag = true;
      var msg: any;
      msg = "<h5>Please rectify the following before Saving Data :-</h5>";
      if (this.newData.DIENAME == undefined || this.newData.DIENAME == null || this.newData.DIENAME == 0) { flag = false; msg = msg + "* Product not selected<br/>" }

      if (this.newData.BATCHSIZE == undefined || this.newData.BATCHSIZE == null || this.newData.BATCHSIZE == 0) { flag = false; msg = msg + "* Please add Batch size<br/>" }

      if (this.items.length <= 0) { flag = false; msg = msg + "* Atleast add one Item<br/>" }

      if (flag == false) {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
      }
      else {
        this.savebom(hdata, action);
      //   if (this.showaftercheckcopy == true){
      //     if (this.bomData.ITEMNAME!='' && this.bomData.ITEMNAME!=undefined ){
      //       this.savebom(hdata, action);
      //       // this.copybom();
          }          
    
      //   else{
      //     this.savebom(hdata, action);
      //   }
      // }
    // }
    // else {
    //   this.custbom = false;
    //   this.items = [];
    //   this.showaftercopy = true;
    //   this.newData.DIENAME = this.bomData.ITEMNAME;
    //   var BOMID = this.newData[0].BOMID;
    //   this.http.get(this.original_url + "/MaterialManagement/bom/getbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + BOMID + "&type=I")
    //     .subscribe((res) => {
    //       this.newData = res;
    //       var subdataitems = this.newData.Table1;
    //       this.newData = this.newData.Table;
    //       this.newData = this.newData[0];
    //       this.newData.PLANNEDSTROKES = this.newData.ITEMCODE;
    //       this.newData.DIENAME = this.newData.ITEMNAME;
    //       this.newData.PARTYNAME = this.newData.uom;
    //       for (var data of subdataitems) {
    //         var item: any = {};
    //         item.PRODUCTID = data.PRODUCTID;
    //         item.oldcode = data.oldcode;
    //         item.ITEMCODE = data.ITEMCODE;
    //         item.ITEMNAME = data.ITEMNAME;
    //         this.subitemlistget.push(item);
    //       }
    //     });
      // this.copybom();
    
  }

  // copybom() {
  //   if (this.bomtype == "I" || this.bomtype == "P") {
  //     this.http.get(this.original_url + "/MaterialManagement/bom/copybomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + this.BOMID + "&type=S&userid=" + this.globalVar.userid + "&productid=" + this.newData.PRODUCTID)
  //       .subscribe((res) => {

  //       });
  //   }
  //   else {
  //     this.http.get(this.original_url + "/MaterialManagement/bom/copycustbomdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&bomid=" + this.BOMID + "&type="+this.checkbom +"&userid=" + this.globalVar.userid + "&productid=" + this.newData.PRODUCTID)
  //     .subscribe((res) => {

  //     });
  //   }

  // }

  subitemChange(event) {
    this.selectedItem = event[0].data.ITEMNAME;
  }

  applyfilter() {
    var data = this.selectedItem;
    this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+data+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&searchtype=name")
      .subscribe((response: any[]) => {
        this.allDataGet = response;
        this.allDataGet = this.allDataGet.Table2;
        this.rmtypeList = this.allDataGet;
        this.items = this.allDataGet.Table2;
      });
  }

  savebom(data, action) {
    this.isLoadingResults = true;
    var bomHeader: Array<any> = [];
    var STROKESMADE = '';
    var BATCHSIZE = '';
    if (data.STROKESMADE == undefined) { STROKESMADE = '' } { STROKESMADE = data.STROKESMADE };
    if (data.BATCHSIZE == undefined) { BATCHSIZE = '0.00' } { BATCHSIZE = data.BATCHSIZE };
    bomHeader.push(
      {
        AMENDBY: "0",
        AMENDON: "",
        AMENREASON: "",
        APPROVEDBY: "0",
        APPROVEDON: "",
        BOID: this.globalVar.BranchId,
        COID: this.globalVar.CommpanyId,
        CONFIRMEDBY: "0",
        CONFIRMEDON: "",
        CREATEDBY: this.globalVar.userid,
        CREATEDON: formatDate(this.myDate, 'yyyy-MM-dd', 'en-US'),
        STROKESMADE: STROKESMADE,
        PRODUCTID: data.PRODUCTID,
        BATCHSIZE: BATCHSIZE,
        REMARKS: this.newData.REMARKS,
        REVISEDBY: "0",
        REVISEDON: "",
        REVISEDREASON: "",
        VERSION: "",
        BOMID: this.BOMID
      }
    );

    var bomDetail: Array<any> = [];
    var mWastageqty, mWastagePerm, mQty, mTolerance, mcomponentweight;

    for (let mdata of this.items) {
      if (mdata.TOLERANCE == undefined || mdata.TOLERANCE == '') { mdata.TOLERANCE = 0; }
      if (mdata.WASTAGEQTY == undefined || mdata.WASTAGEQTY == '') { mdata.WASTAGEQTY = 0; }
      if (mdata.WASTAGEPERCENT == undefined || mdata.WASTAGEPERCENT == '') { mdata.WASTAGEPERCENT = 0; }
      if (mdata.BRANDID == undefined || mdata.BRANDID == '') { mdata.BRANDID = 0; }
      if (mdata.rmtype == undefined || mdata.rmtype == '') { mdata.rmtype = 0; }
      if (mdata.COMPONENTWT == undefined || mdata.COMPONENTWT == '') { mdata.COMPONENTWT = 0; }

      if (mdata.LENGTH == undefined || mdata.LENGTH == undefined || mdata.LENGTH == '') { mdata.LENGTH = 0 }
      if (mdata.WIDTH == undefined || mdata.WIDTH == undefined || mdata.WIDTH == '') { mdata.WIDTH = 0 }

      mQty = mdata.QTY;
      mTolerance = mdata.TOLERANCE;
      mWastageqty = mdata.WASTAGEQTY;
      mWastagePerm = mdata.WASTAGEPERCENT;
      mcomponentweight = mdata.COMPONENTWT;
      mQty = parseFloat(mQty).toFixed(3);
      mTolerance = parseFloat(mTolerance).toFixed(2);
      mWastageqty = parseFloat(mWastageqty).toFixed(3);
      mWastagePerm = parseFloat(mWastagePerm).toFixed(2);
      mcomponentweight = parseFloat(mcomponentweight).toFixed(3);

      bomDetail.push({
        BOMID: this.BOMID,
        ID: mdata.ID,
        PID: data.PRODUCTID,
        CID: mdata.CID,
        BRANDID: mdata.BRANDID,
        UNIT: mdata.UNIT,
        QTY: mQty,
        TOLERANCE: mTolerance,
        LENGTH:0,
        WIDTH: 0,
        WASTAGEQTY: mWastageqty,
        WASTAGEPERCENT: mWastagePerm,
        COMPONENTWT: 0,
        TOEXPLODE:0,
        RMTYPE: 0,
        BOID: this.globalVar.BranchId,
        COID: this.globalVar.CommpanyId
      });
    }
    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('statementtype', action)
      .set('id', this.BOMID)
      .set('bomheaderarray', JSON.stringify(bomHeader))
      .set('bomdetailarray', JSON.stringify(bomDetail))
      .set( 'userid', this.globalVar.UserId)

    this.http.post(this.original_url + "/MaterialMgmt/bom/savebom", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/die-bom']);
      });
  }

  // onChangeRMType(data, rowDetail) {
  //   let id = this.rmtypeList.find(x => x.itemid == data.itemid).itemid;
  //   if (id != null || id != undefined) {
  //     // var UOM1 = this.rmtypeList.find(x=>x.itemid == id).uom;
  //     var ITEMCODE = this.rmtypeList.find(x => x.itemid == id).ITEMCODE;
  //     var ITEMNAME = this.rmtypeList.find(x => x.itemid == id).ITEMNAME;
  //     rowDetail.rmtypedesc = ITEMNAME;
  //     rowDetail.rmtype = id;
  //     this.searchRMDesc = '';
  //     this.searchEditRMDesc = '';
  //   }
  // }
  // searchRmTypeDesc(term, rowDetail) {
  //   this.searchRMDesc = term;
  //   if (this.searchRMDesc !== '') {
  //     this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+this.searchRMDesc+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&searchtype=name")
  //       .subscribe((response: any[]) => {
  //         this.allDataGet = response;
  //         this.allDataGet = this.allDataGet.Table2;
  //         this.rmtypeList = this.allDataGet;
  //         // this.itemNamelistget = this.allDataGet;
  //       });
  //   }
  //   else {
  //     rowDetail.rmtypedesc = '';
  //     rowDetail.rmtype = '';
  //     this.rmtypeList = [];
  //     this.searchRMDesc = '';
  //   }
  // }
  // searchEditRmTypeDesc(term, rowDetail) {
  //   this.searchEditRMDesc = term;
  //   if (this.searchEditRMDesc !== '') {
  //     this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+this.searchEditRMDesc+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&searchtype=name")
  //       .subscribe((response: any[]) => {
  //         this.allDataGet = response;
  //         this.allDataGet = this.allDataGet.Table2;
  //         this.rmtypeList = this.allDataGet;
  //         // this.itemNamelistget = this.allDataGet;
  //       });
  //   }
  //   else {
  //     rowDetail.rmtype = '';
  //     rowDetail.rmtypedesc = '';
  //     this.rmtypeList = [];
  //     this.searchEditRMDesc = '';
  //   }
  // }

}

