import { ConfirmAlertComponent } from './../../../../confirm-alert/confirm-alert.component';
import { SuccessDialogComponent } from './../../../../Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from './../../../../validation/validation.component';
import { Global } from './../../../../Global';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PasswordPopupComponent } from 'src/app/Modules/Maintenance/die-master/add-die-master/password-popup/password-popup.component';

@Component({
  selector: 'app-child-items-popup',
  templateUrl: './child-items-popup.component.html',
  styleUrls: ['./child-items-popup.component.css']
})
export class ChildItemsPopupComponent implements OnInit {
  parentunitarray:Array<any>=[];
  requisitionform: FormGroup;
  isLoadingResults: boolean;
  newContact:Array<any>=[];
  contacts:any;
  myDate:any;
  original_url = environment.baseUrl;
  newData: any = {};
  arrayItem='';
  allDataGet: any;
  itemlistget:Array<any> = [];
  arrayOldCode = '';
  arrayItemCode = '';
  arrayItemEdit = '';
  arrayItemCodeEdit = '';
  arrayOldCodeEdit = '';
  supplierlist:Array<any> = [];
  newItem: any = {};
  indentListToSave:Array<any> = [];
  itemname:any;
  dataGet:any;
  action: any;

  constructor(    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChildItemsPopupComponent>) { 

      this.dataGet=data;
      this.itemname=data.itemname;
      this.action= this.dataGet.action

}

  ngOnInit(): void {
    if(this.action=='rate'){
      this.isLoadingResults=true
      this.http.get(this.original_url + "/indentandpo/rateapproval/getRateApvlforallbranches?&itemid="+ this.dataGet.itemid + "&branchid=" + this.dataGet.unitid +"&token=" + this.globalVar.Token)
          .subscribe((response) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.contacts = this.allDataGet;
            this.isLoadingResults=false
          },
          error => {
            this.isLoadingResults = false;
          });
    }else if(this.action=='itemlist'){
      this.isLoadingResults=true;
         this.http.get(this.original_url+"/Production/DieAndTools/getallparentitems?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&search=&type=C&parentid="+ this.dataGet.itemid )
         .subscribe((res)=>{
          this.allDataGet=res;
          this.contacts=this.allDataGet.Table;
          this.isLoadingResults=false;
         },error => {
          this.isLoadingResults = false;
        }); 

    }else{
    this.refresh();
    }
  }

  refresh(){
    this.isLoadingResults=true
    this.http.get(this.original_url + "/Masters/CommonMaster/GetParentchilditems?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&Parentid=" +   this.dataGet.itemid + "&fyid=" + this.globalVar.fyid + "&userid=" + this.globalVar.userid+"&unitid=" +   this.dataGet.unitid )
        .subscribe((response) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.contacts = this.allDataGet;
          this.isLoadingResults=false
        },
        error => {
          this.isLoadingResults = false;
        });
  }
  

  
  onChangeOfItem(id, rowDetail) {
    this.arrayItem = '';
    this.arrayItemEdit='';
    this.arrayItemCode='';
    this.arrayItemCodeEdit='';
    this.arrayOldCodeEdit='';
    this.arrayOldCode='';
    
    var UOM = this.itemlistget.find(x=>x.itemid == id).uom;
    var itemcode = this.itemlistget.find(x=>x.itemid == id).itemcode;
    var oldcode = this.itemlistget.find(x=>x.itemid == id).oldcode;
    var itemname = this.itemlistget.find(x=>x.itemid == id).itemname;
    var itemid = this.itemlistget.find(x=>x.itemid == id).itemid;
    var stockinhand = this.itemlistget.find(x=>x.itemid == id).stockinhand;
    rowDetail.issuingunit=UOM;
    rowDetail.oldcode=oldcode;
    rowDetail.itemcode=itemcode;
    rowDetail.itemname=itemname;
    rowDetail.itemid=itemid;
    rowDetail.stockinhand=stockinhand;

    // this.getsupllist(rowDetail);
  }

  onChange(event, indent)
{
 if(event.checked == true)
  {
  this.indentListToSave.push(indent);
  }
  else
  {
    this.indentListToSave.splice (this.indentListToSave.indexOf(indent),1);
  }
  console.log(" this.indentListToSave", this.indentListToSave)
}



  validateBeforeSave(action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    if (this.indentListToSave.length == 0) { flag = false; msg = msg + "* Please Select at least one Item to Un-Confirm mapping.<br/>" }
   
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
      this.validateEdit(action);
    }
  }

  validateEdit(action){
    const dialogRef = this.dialog.open(PasswordPopupComponent, {
      width: '400px',
      data  : {
            action: 'new'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result)
        {
          let password= result.password
          if(password == 'Kind@123'){
            this.finalConfirm(action)
          }else{
            const dialogRef = this.dialog.open(ValidationComponent, {
              data: {
                msg: "Please enter a valid Password",
                action: ''
              }
            });
      
            dialogRef.afterClosed().subscribe(result => {
      
            });
          }
        }
      });
}


finalConfirm(action){
  const dialogRef = this.dialog.open(ConfirmAlertComponent, {
    width:'400px',
    data: {
      msg: '*All checked items will be released for fresh mapping. <br>  Are you sure to Proceed ?',
      action: ''
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result == 'ok') {
      this.save(action);
    }
    
  });
}

save(action){
  this.isLoadingResults=true
  var dtlarray: Array<any> = [];
  let i = 0;
  for (let mdata of this.indentListToSave) {
   
    dtlarray.push({
      ID: mdata.ID,
      PARENTUNITID	: mdata.PARENTUNITID,
      PARENTITEMID	: mdata.PARENTITEMID,
      CHILDUNITID   : mdata.BRANCHID,
      CHILDITEMID: mdata.ITEMID,
      CONFIRMED:'N',
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
    this.isLoadingResults = false;
    this.successDialog();
    this.refresh()
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
