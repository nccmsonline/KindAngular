import { SuccessDialogComponent } from './../../../Dialog/success-dialog/success-dialog.component';
import { ConfirmAlertComponent } from './../../../confirm-alert/confirm-alert.component';
import { ValidationComponent } from './../../../validation/validation.component';
import { ChildItemsPopupComponent } from './child-items-popup/child-items-popup.component';
import { environment } from './../../../../environments/environment';
import { Global } from './../../../Global';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PasswordPopupComponent } from '../../Maintenance/die-master/add-die-master/password-popup/password-popup.component';

@Component({
  selector: 'app-unique-item-codification-mapping',
  templateUrl: './unique-item-codification-mapping.component.html',
  styleUrls: ['./unique-item-codification-mapping.component.css']
})
export class UniqueItemCodificationMappingComponent implements OnInit {

  original_url = environment.baseUrl;
  parentunitarray: Array<any> = [];
  newData: any = {};
  arrayItem='';
  requisitionform: FormGroup;
  isLoadingResults:boolean;
  allDataGet: any;
  itemlistget:Array<any> = [];
  arrayOldCode = '';
  arrayItemCode = '';
  arrayItemEdit = '';
  arrayItemCodeEdit = '';
  arrayOldCodeEdit = '';
  supplierlist:Array<any> = [];
  newItem: any = {};
  contacts:Array<any> = [];
  arrayItem1 ='';
  arrayItemEdit1='';
  arrayItemCode1='';
  arrayItemCodeEdit1='';
  arrayOldCodeEdit1='';
  arrayOldCode1='';
  searchTextForChild: any;
  timeout: any = null;
  itemListToSave:Array<any>=[];
  deactivateMsg:any;
  ismapped=true;

  isLoadingResults1:boolean;
  isLoadingResults2:boolean;
  isLoadingResults3:boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { 


        this.parentunitarray = [
      { id: 1, name: "Unit-1" },
      { id: 2, name: "Unit-2" },
      { id: 3, name: "Unit-3" }
    ]

    this.deactivateMsg='This item will be deactivated for future use.  However, old Transactions will be available for Stock Ledger.'

    this.http.get(this.original_url+"/Masters/CommonMaster/Getbranch?&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid)
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.parentunitarray = this.allDataGet;
    });
    this.isLoadingResults = true;
    this.http.get(this.original_url + "/Masters/CommonMaster/Getbranch?&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid=" + this.globalVar.fyid)
      .subscribe((response) => {
        this.allDataGet = response;
        this.allDataGet = this.allDataGet.Table;
        this.parentunitarray = this.allDataGet;
        this.isLoadingResults = false;
      },error => {
        this.isLoadingResults = false;
      });
   
    this.createForm();
  }

 

  ngOnInit(): void {
  }

  createForm() {
    this.requisitionform = this.fb.group({
      unit: '',
    });
  }

  dropdownHide(){
    this.arrayItem=''
    this.arrayItem1=''
  }

  searchTermItemNew(term, rowDetail)
  {
    clearTimeout(this.timeout);
    this.arrayItem = term;
    this.searchTextForChild = term;
    
    if(this.arrayItem !== '')
    {
      this.timeout = setTimeout(() => {
      this.arrayOldCode = '';
      this.arrayItemCode = '';
      this.isLoadingResults1=true;
      this.http.get(this.original_url+"/Masters/CommonMaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.newData.unit+"&sortorder=&search="+this.arrayItem+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&type=P")
        .subscribe((response) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          this.isLoadingResults1=false;
        },error => {
          this.isLoadingResults1 = false;
        });
      }, 700);
    }
    else
    {
      this.itemlistget = [];
      this.arrayItem = '';
      rowDetail.oldcode='';
      rowDetail.ITEMCODE='';
    }
  }

  searchTermItemNew1(term, rowDetail)
  {
    clearTimeout(this.timeout);
    this.arrayItem1 = term;
    if(this.arrayItem1 !== '')
    {
      this.timeout = setTimeout(() => {
      this.arrayOldCode1 = '';
      this.arrayItemCode1 = '';
      this.isLoadingResults2=true;
      this.http.get(this.original_url+"/Masters/CommonMaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.newData.childunit+"&sortorder=&search="+this.arrayItem1+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&token="+this.globalVar.Token+"&type=C")
        .subscribe((response) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          this.isLoadingResults2=false;
        },error => {
          this.isLoadingResults2 = false;
        });
      }, 700);
    }
    else
    {
      this.itemlistget = [];
      this.arrayItem1 = '';
      rowDetail.oldcode1='';
      rowDetail.itemcode1='';
    }
  }
  
  onChangeOfItem(id, rowDetail) {
    this.arrayItem = '';
    var ITEMNAME = this.itemlistget.find(x=>x.ITEMID == id).ITEMNAME;
    var ITEMID = this.itemlistget.find(x=>x.ITEMID == id).ITEMID;
    rowDetail.parentitemname=ITEMNAME;
    rowDetail.PARENTITEMID=ITEMID;
    this.itemlistget = [];

  }

  reset(data) {
    this.newData.parentitemname='';
    this.newData.PARENTITEMID='';
    this.arrayItem = '';
  }

  onChangeOfItem1(rowDetail) {
   
    let newArray:Array<any>=[]
    newArray = this.contacts.filter(x => x.BRANCHID == rowDetail.BRANCHID && x.ITEMID== rowDetail.ITEMID);
   
    if(newArray.length > 0){
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: "*Item -"+rowDetail.ITEMNAME+"  already added to the List",
          action: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }else{
      this.contacts.push(rowDetail);
    }
    // });
   

  }

  
  opendialog(data) {
    var flag: boolean;
  flag = true;
  var msg: any;
  msg = "<h5>Please rectify the following before Saving Data :-</h5>";
  if (this.newData.unit == undefined || this.newData.unit == '' || this.newData.unit == null) { flag = false; msg = msg + "* Please Select Parent Unit<br/>" }
  if (this.newData.PARENTITEMID == undefined || this.newData.PARENTITEMID == '' || this.newData.PARENTITEMID == null) { flag = false; msg = msg + "* Please Select Parent Item<br/>" }

  if (flag == false) {
    const dialogRef = this.dialog.open(ValidationComponent, {
      data: {
        msg: msg,
        action: ''
      }
    });
  }else
  {
    const dialogRef = this.dialog.open(ChildItemsPopupComponent, {
       width:"1000px",
       height:"550px",
      data: {
        unitid: this.newData.unit,
        itemid:this.newData.PARENTITEMID,
        itemname:this.newData.parentitemname,
        action:"unmap"
      }
    });
  }
  }


onChange(event, rowDetail)
{
 if(event.checked == true)
  {
   
    if(rowDetail.BRANCHID == this.newData.unit && rowDetail.ITEMID == this.newData.PARENTITEMID){
      rowDetail.checked=false;
      event.checked =false
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: 'Parent & child items NOT to be mapped for the same Unit',
          action: ''
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        rowDetail.checked=false;
      });
    }else{
  this.itemListToSave.push(rowDetail);
    }
  }
  else
  {
    this.itemListToSave.splice (this.itemListToSave.indexOf(rowDetail),1);
  }
  console.log(" this.itemListToSave", this.itemListToSave)
}

onChangeChildUnit(id){
  this.isLoadingResults3 = true;
  this.http.get(this.original_url + "/Masters/CommonMaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid=" + this.globalVar.CommpanyId + "&boid=" + this.newData.childunit + "&sortorder=&search=" + this.searchTextForChild + "&fyid=" + this.globalVar.fyid + "&userid=" + this.globalVar.userid + "&token=" + this.globalVar.Token + "&type=C")
    .subscribe((response) => {
      this.allDataGet = response;
      this.allDataGet = this.allDataGet.Table;
      this.contacts = this.allDataGet;
      this.isLoadingResults3 = false;
    },error => {
      this.isLoadingResults3 = false;
    });
}

deactivateValidate(data,rowDeatail){
  const dialogRef = this.dialog.open(ConfirmAlertComponent, {
    width:'400px',
    data: {
      msg: this.deactivateMsg,
      action: ''
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result == 'ok') {
      this.isLoadingResults=true
      this.http.post(this.original_url + "/Masters/CommonMaster/deactivateitem?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&Itemid="+data.ITEMID+"&branchid="+data.BRANCHID, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .subscribe((res) => {
          this.isLoadingResults = false;
          this.successDialog();
          rowDeatail.checked=false
          rowDeatail.isDisabled=true
        },error => {
          this.isLoadingResults = false;
        });
    }
    
  });
}

validateBeforeSave(hdata,action) {
  var flag: boolean;
  flag = true;
  var msg: any;
  msg = "<h5>Please rectify the following before Saving Data :-</h5>";
  if (this.newData.unit == undefined || this.newData.unit == '' || this.newData.unit == null) { flag = false; msg = msg + "* Please Select Parent Unit<br/>" }
  if (this.newData.PARENTITEMID == undefined || this.newData.PARENTITEMID == '' || this.newData.PARENTITEMID == null) { flag = false; msg = msg + "* Please Select Parent Item<br/>" }

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
    this.save(hdata, action);
  }
}

save(hdata,action){
  var dtlarray: Array<any> = [];
  let i = 0;
  for (let mdata of this.itemListToSave) {
   
    dtlarray.push({
      ID: '0',
      PARENTUNITID	: this.newData.unit,
      PARENTITEMID	: this.newData.PARENTITEMID,
      CHILDUNITID   : mdata.BRANCHID,
      CHILDITEMID: mdata.ITEMID,
      CONFIRMED:'Y',
    });
    i++;
  }

  const params = new HttpParams()
  .set('statementtype', action)
  .set('coid', this.globalVar.CommpanyId)
  .set('boid', this.globalVar.BranchId)
  .set('fyid', this.globalVar.fyid)
  .set('UserId', this.globalVar.UserId)
  .set('headerarray', JSON.stringify(dtlarray))
this.http.post(this.original_url + "/Production/DieAndTools/saveitemmapping", params.toString(), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
  .subscribe((res) => {
    this.ismapped=false
    this.isLoadingResults = false;
    this.successDialog();
    this.contacts=[]
    this.itemListToSave=[]
  },error => {
    this.isLoadingResults = false;
  });
}

successDialog() {
  const dialogRef = this.dialog.open(SuccessDialogComponent, {
    data: {
      wrongData: 'sucess'
    }
  });
}

}
