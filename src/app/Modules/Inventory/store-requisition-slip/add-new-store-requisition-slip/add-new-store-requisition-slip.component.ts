import { ValidationComponent } from './../../../../validation/validation.component';
import { Component, OnInit, ViewChildren, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoreRequisitionSlipService } from '../store-requisition-slip.service';
import { formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { ConfirmationDialogService } from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service';
import { isNull } from 'util';
import { environment } from '../../../../../environments/environment';
import  _ from '../../../../../../node_modules/lodash';


@Component({
  selector: 'app-add-new-store-requisition-slip',
  templateUrl: './add-new-store-requisition-slip.component.html',
  styleUrls: ['./add-new-store-requisition-slip.component.css']
})
export class AddNewStoreRequisitionSlipComponent implements OnInit, AfterContentInit {

  public mask = {
    guide: true,
    showMask : true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/]
  };
  @ViewChildren('codefocus') vc;
  batchsize:any;
  original_url = environment.baseUrl;
  newData: any = {};
  removevalue :any ;
  Value : any;
  requisitionform: FormGroup;
  allDataGet: any;
  newChangeData: any={};
  departmentget: Array<any> = [];
  costcentreget: Array<any> = [];
  storeget: Array<any> = [];
  itemlistget:Array<any> = [];
  ipoList:Array<any> = [];
  newitemtype : any={};
  removearray: Array<any> = [];
  date = new FormControl(new Date());
  myDate = new Date();
  item: Array<any> = [];
  dupplicateitem:Array<any> = [];
  Itemcode:'';
  unit:'';
  ITEMID:'';
  subscription: Subscription;
  message: any;
  show:boolean = false;
  isLoadingResults:boolean = false;
  userinfo: any;
  coid: any;
  boid: any;
  userid: any;
  action: any;
  id: any;
  versionlistget:Array<any>=[];
  branch1info: any;
  typeIDS:any;
  itemDisplay:any={};
  items: Array<any> = [];
  tempitems: Array<any> = [];
  newitem: any = {};
  edititemID: any = {};
  branch2info: any;
  fyid: any;
  BatchSizeData: any;
  itemlistgetDesc:Array<any>=[];
  bomDetail:Array<any>=[];
  FYUSER:any;ServerIP:any;
  token:any;WorkingDate:any;
  fstartdate:any;
  fenddate:any;
  isbranch3=false;
  itemCodeDesc="";
  itemNameDesc="";
  isLoadingItemCode=false;
  isLoadingItemName=false;
  isStoreUser:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private storerequisition: StoreRequisitionSlipService,
    private http: HttpClient,
    public dialog: MatDialog,
    private messageService: ConfirmationDialogService,

  ) {
this.createForm();
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fstartdate=  formatDate(CompanyData['FINANCIALYEARSTARTDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    this.fenddate=  formatDate(CompanyData['FINANCIALYEARENDDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.isStoreUser = currentUser['ISSTOREUSER'];

    this.WorkingDate= new Date(CompanyData['WORKINGDATE']); 
    this.newData.REQDATE= this.WorkingDate; 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    if(this.boid=="3")
    {
      this.isbranch3=true;
    }

  }

  ngOnInit() {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Store/onRequisitionLoad?token="+this.token+"&ReqID="+this.id).subscribe((res)=>{
      console.log("res",res);
      this.itemDisplay=res;
      this.departmentget=this.itemDisplay.Table;
      this.costcentreget=this.itemDisplay.Table1;
      this.storeget=this.itemDisplay.Table2;
      this.ipoList=this.itemDisplay.Table4;
      this.itemDisplay=this.itemDisplay.Table3[0];
      this.newData.REQNO=this.itemDisplay.REQNO;

      
      debugger;
      if(this.action == "edit")
      {
        this.itemDisplay=res;
        this.itemlistgetDesc=this.itemDisplay.Table7;
        this.bomDetail=this.itemDisplay.Table8;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table5[0];
        this.newData.REQID=this.id;
        this.newData.REQNO=this.itemDisplay.REQNO;
        this.newData.REQDATE=this.itemDisplay.REQDATE;
  
        this.newData.ACTUALSLIPNO=this.itemDisplay.ACTUALSLIPNO;
        this.newData.CONFIRM=this.itemDisplay.CONFIRM;
        this.newData.DEPTID=this.itemDisplay.DEPTID;
        this.newData.COSTCENTERID=this.itemDisplay.COSTCENTERID;
        this.newData.DEPTNAME=this.itemDisplay.DEPTNAME;
        this.newData.COSTCENTRE=this.itemDisplay.COSTCENTRE;
        this.newData.NOOFSETS=this.itemDisplay.NOOFSETS;
        this.newData.IPOID=this.itemDisplay.IPOID;
        this.newData.PRODUCTID=this.itemDisplay.PRODUCTID;
        this.newData.STOREID=this.itemDisplay.STOREID;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table6;
        
        this.items=[];
        let i=0;
        this.itemDisplay.forEach((el)=>{
          let tmp:any={};
          tmp.id=i++;
          tmp.sr=i;
          tmp.REQID=el.REQID;
          tmp.ITEMID=el.ITEMID;
          tmp.ITEMCODE=el.ITEMCODE;
          tmp.ITEMNAME=el.ITEMNAME;
          tmp.QUANTITYREQUESTED=el.QUANTITYREQUESTED;
          tmp.UOM=el.UOM;
          tmp.QUANTITYISSUED=el.QUANTITYISSUED;
          tmp.REMARKS=el.REMARKS;
          tmp.STOCKINHAND=el.STOCKINHAND;
          this.items.push(tmp);
        });
      }
      this.isLoadingResults=false;
   });
  }
  searchItemCode(search, data)
  {
      var str:string;
      str=search;
      this.itemCodeDesc = search;
      if(this.itemCodeDesc !== '')
      {
        data.ITEMNAME='';  
        data.ITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingItemCode=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=itemcode&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.itemlistget = this.allDataGet;
            this.isLoadingItemCode=false;
          });
        }
      }
      else
      {
        this.itemlistget = [];
        this.itemCodeDesc = '';
        data.ITEMCODE='';
        data.ITEMNAME='';  
        data.UOM='';  
        data.ITEMID=0;
      }
  }
  onChangeOfItemCode(row, data)
  {
       data.ITEMCODE=row.ITEMCODE;
       data.ITEMNAME=row.ITEMNAME;  
       data.UOM=row.RECTUOM;
       data.ITEMID=row.ITEMID;
       data.STOCKINHAND=row.STOCKINHAND;
       this.itemCodeDesc='';
  }
  searchItemName(search, data)
  {
      var str:string;
      str=search;
      this.itemNameDesc = search;
      if(this.itemNameDesc !== '')
      {
        data.ITEMCODE='';  
        data.ITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingItemName=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=ItemName&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.itemlistget = this.allDataGet;
            this.isLoadingItemName=false;
          });
        }
      }
      else
      {
        this.itemlistget = [];
        this.itemNameDesc = '';
        data.ITEMCODE='';
        data.ITEMNAME='';  
        data.UOM='';  
        data.ITEMID=0;
      }
  }
  onChangeOfItemName(row, data)
  {
       data.ITEMCODE=row.ITEMCODE;
       data.ITEMNAME=row.ITEMNAME;  
       data.ITEMID=row.ITEMID;
       data.UOM=row.RECTUOM;
       data.STOCKINHAND=row.STOCKINHAND;
       this.itemNameDesc='';
  }
  getproductList()
  {
    this.http.get(this.original_url+"/MaterialManagement/Requisition/commonapirequisition?coid="+this.coid+"&boid="+this.boid)
        .subscribe((res) => {
          this.allDataGet = res;
          this.departmentget = this.allDataGet.Table1;
          this.costcentreget = this.allDataGet.Table2;
    
          this.storeget = this.allDataGet.Table4;
          this.itemlistgetDesc = this.allDataGet.Table5;
          console.log("batch size", res);
        });
  }

  ngAfterContentInit() {
  }

  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
       if(data.ITEMID==undefined||data.ITEMID==0||data.ITEMID=='' )
       {flag=false; msg=msg+"* Product not seletect<br/>"}

       if(data.QUANTITYREQUESTED==undefined||data.QUANTITYREQUESTED==0||data.QUANTITYREQUESTED=='' )
       {flag=false; msg=msg+"* Quantity not entred<br/>"}
       if(flag==false) 
       {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
       }
     return flag;
  }

  additem() {
  var qty = 
  this.items.find(x=>x.ITEMID==this.newitem.ITEMID);
  if(qty!=undefined)
  {
    const msg = "* Duplicate item found";
    const dialogRef = this.dialog.open(ValidationComponent, {
      data: {
        msg: msg,
        action: ''
      }
    });
  }

  if(qty==undefined&&this.validateDetail(this.newitem))
  {
    this.vc.first.nativeElement.focus();
    this.items.push(this.newitem);
    this.newitemtype['id']=this.newitem.ITEMID;
    this.removearray.push(this.newitemtype);
    this.items.forEach((item, index) => {
      var num = 'id';
      var value = index + 1;
      item[num] = value;
      var num1 = 'sr';
      var value1 = index+1;
      item[num1] = value1;
      
    });
    console.log("this.conatcts",this.items);
    this.newitem = {};
    this.newitem.STOCKINHAND = '';
  }
}

removeitem(index) {
  this.items.splice(index, 1);
  this.removearray=[];
}

edititem(val) {
  this.edititemID = val;
}

updateitem(val) {
  if(this.validateDetail(val))
  {
    this.vc.first.nativeElement.focus();
    this.edititemID = {};
  }
}

  createForm() {
    this.requisitionform = this.fb.group({
      DEPTID: ['', Validators.required],
      COSTCENTERID: ['', Validators.required],
      STOREID: ['', Validators.required],
  
    });
  }
  onIPONOo(ipoid, rowDetail)
  {
    rowDetail.NOOFSETS='';
    this.http.get(this.original_url+"/PurachaseAndStore/Store/getIPOProductList?token="+this.token+"&ipoid="+ipoid)
    .subscribe((response) => {
      this.allDataGet = response;
       this.itemlistgetDesc = this.allDataGet.Table;
       console.log("itemlistgetDesc", this.itemlistgetDesc);
    });
 } 
 getOnChangeProduct(productid, rowDetail)
 {
   
   this.http.get(this.original_url+"/PurachaseAndStore/Store/getBOMDetail?token="+this.token+"&productid="+productid)
   .subscribe((response) => {
     this.allDataGet = response;
      this.bomDetail = this.allDataGet.Table;
      console.log("bomDetail", this.bomDetail);
   });
   rowDetail.BalancedNOOFSETS= this.itemlistgetDesc.find(x=>x.ITEMID==productid).NOOFSETS;
} 

getBomComponentDetail(data)
{
  //console.log("My Form",this.bomDetail);
  if(data.NOOFSETS>data.BalancedNOOFSETS)
  {
    data.NOOFSETS=0;
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'You can create requisition only for maximum '+data.BalancedNOOFSETS+' Sets'
      }
    });
    return;
  }
  this.items=[];
     let i=0;
     this.bomDetail.forEach((el)=>{
       let tmp:any={};
       var qty =parseFloat(el.QUANTITY)*parseFloat(this.newData.NOOFSETS)
       tmp.id=i++;
       tmp.sr=i;
       tmp.REQID=el.REQID;
       tmp.ITEMID=el.ITEMID;
       tmp.ITEMCODE=el.ITEMCODE;
       tmp.ITEMNAME=el.ITEMNAME;
       tmp.QUANTITYREQUESTED=qty.toFixed(3);
       tmp.UOM=el.UNIT;
       tmp.QUANTITYISSUED=0;
       tmp.REMARKS=el.PROCESSDESC;
       tmp.STOCKINHAND=el.STOCKINHAND;
       this.items.push(tmp);
     });

}



  validateBeforeSave(hdata,action){
    var flag: boolean;
      flag = true;
      var msg: any;
      msg = "<h5>Please rectify the following before Saving Data :-</h5>";
      if (this.newData.DEPTID == undefined || this.newData.DEPTID == '' || this.newData.DEPTID == null) { flag = false; msg = msg + "* Department not selected<br/>" }

      if (this.newData.COSTCENTERID == undefined || this.newData.COSTCENTERID == '' || this.newData.COSTCENTERID == null) { flag = false; msg = msg + "* Cost Centre not selected<br/>"}

      if (this.newData.STOREID == undefined || this.newData.STOREID == '' || this.newData.STOREID == null) { flag = false; msg = msg + "* Store not selected<br/>"}

      if (this.items.length == undefined || this.items.length == 0) { flag = false; msg = msg + "* No detail for save<br/>"}

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
        this.savePurchase(hdata, action);
      }
  }
  confirmewquiisition()
  {
    let preqno:any;
    const  params = new  HttpParams()
  
    .set('reqid', this.newData.REQID.toString())
    .set('token', this.token);
   
    this.isLoadingResults=true;
  this.http.post(this.original_url+"/PurachaseAndStore/store/confirmRequisition", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    preqno=res;
    if (parseInt(preqno)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:'Data Saved'
              }
            });
           this.newData={};
           this.items=[];
           this.router.navigate(['/store-requisition']);
    }
    else
    {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'wrongData',
                  displayMsg:'Somthing went wrong'
                }
              });
    }
    this.isLoadingResults=false;
  });
  }
  savePurchase(data,  actions) {
      if (this.items.length == 0) {
        this.show=true
      }
      else{
        this.isLoadingResults=true;
        let newArray: Array<any> = [];
        let batchDetail:Array<any>=[];
        if(data.ACTUALSLIPNO == undefined || data.ACTUALSLIPNO == null) { data.ACTUALSLIPNO = 0; }
        if(data.IPOID == undefined || data.IPOID == null) { data.IPOID = 0; }
        if(data.NOOFSETS == undefined || data.NOOFSETS == null) { data.NOOFSETS = 0 }
        if(data.PRODUCTID == undefined || data.PRODUCTID == null) { data.PRODUCTID = 0 }
        let mreqid=0;
        let tmpData:any={};
        let header: Array<any> = [];
        let detail: Array<any> = [];
        debugger;
        if(actions=='Insert')
        {
          tmpData.REQNO = ':A';
          tmpData.REQDATE = ':B';
          tmpData.REQID  = ':C';
          tmpData.EDATE = ':D';
          tmpData.USERID = this.userid;
        }
        else
        {
          tmpData.MDATE = ':A';
          mreqid=data.REQID;
        }
      
        tmpData.BRANCHID = this.boid;
        tmpData.DEPTID  = data.DEPTID;
        tmpData.COSTCENTERID = data.COSTCENTERID;
        tmpData.ACTUALSLIPNO = data.ACTUALSLIPNO;
        tmpData.STOREID=data.STOREID;
        tmpData.REFERENCENO=0;
        tmpData.COMPANYID=1;
        tmpData.STATUS="N";
        tmpData.IPOID=data.IPOID;
        tmpData.PRODUCTID=data.PRODUCTID;
        tmpData.NOOFSETS=data.NOOFSETS;

        header.push(tmpData);
    
      this.items.forEach((el)=>{
        let tmp:any={};
        tmp.REQID=":A";
  
        if(actions=='Insert')
        {
        tmp.EDATE=formatDate(this.WorkingDate, 'dd-MMM-yyyy', 'en-US', '+0530'); 
        }
        else
        {
          tmp.MDATE=formatDate(this.WorkingDate, 'dd-MMM-yyyy', 'en-US', '+0530'); 
        }
        tmp.ITEMID=el.ITEMID;
        tmp.USERID=this.userid;
        tmp.BRANCHID=this.boid;
        tmp.QUANTITYREQUESTED=el.QUANTITYREQUESTED;
        tmp.QUANTITYISSUED=el.QUANTITYISSUED;
        tmp.COMPANYID=1;
        tmp.BRANCHID = this.boid;
        tmp.USERID = this.userid;
        tmp.AccountId=0;
        tmp.CostCentreId=data.COSTCENTERID;
        tmp.REMARKS=el.REMARKS;
       
        detail.push(tmp);
      })
    
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);


      let indentno:any;

      const  params = new  HttpParams()
    
      .set('reqid', mreqid.toString())
      .set('token', this.token)
      .set('header', JSON.stringify(header))
      .set('detail', JSON.stringify(detail));
      this.isLoadingResults=true;
    this.http.post(this.original_url+"/PurachaseAndStore/store/saveRequisition", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      indentno=res;
      if (parseInt(indentno)>0)
      {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'sucess',
                  displayMsg:'Data Saved'
                }
              });
             this.newData={};
             this.items=[];
             this.router.navigate(['/store-requisition']);
      }
      else
      {
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'wrongData',
                    displayMsg:'Somthing went wrong'
                  }
                });
      }
      this.isLoadingResults=false;
    });


    }
  }

  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
}
