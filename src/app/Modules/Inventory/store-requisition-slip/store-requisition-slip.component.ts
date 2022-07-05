import { Component, OnInit,ViewChild, AfterContentInit, Inject } from '@angular/core';
import {StoreRequisitionSlipService} from  './store-requisition-slip.service';
import { StoreRequisition, GithubApi } from './store-requisition.modal';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import {catchError, filter, map, startWith, switchMap} from 'rxjs/operators';
import { Subscription, Observable,merge,of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-store-requisition-slip',
  templateUrl: './store-requisition-slip.component.html',
  styleUrls: ['./store-requisition-slip.component.css']
})
export class StoreRequisitionSlipComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  userinfo : any;
  coid : any;
  boid : any;
  sortOrder :any;
  sortSelection  :any ;
  enqtype:any;
  newData:any={};
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['action','reqnno','reqdate',  'deptname', 'costcentre', 'store','ipo','product','batch', 'print','status'];
  requisitionArray = new MatTableDataSource<StoreRequisition>();

  
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  page: any ;
  
  itemCount: any;
  itemDisplay: any;
  name:any;
  productname:any;
  branch1Data:any;
  search:any;
  pagenumber: any;
  filterarray:Array<any>=[];
  showreset:boolean=false;
  getStoreData:Array<any>=[];
  items:Array<any>=[];
  reqListForConf:Array<any>=[];
  filterTypes: Array<any>=[];
  storeidchange:any;
  FYUSER:any;ServerIP:any;
  userid:any;token:any;WorkingDate:any;
  fstartdate:any;
  fenddate:any;
  isStoreUser:any;
  filterFlag='A';
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: StoreRequisitionSlipService,
    public dialog: MatDialog
  ) {
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
      this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
      this.isStoreUser = currentUser['ISSTOREUSER'];
   }

  ngOnInit() {
   
    this.requisitionArray.sort = this.sort;
    this.requisitionArray.paginator=this.paginator;
    this.refreshRequisition(this.filterFlag);
    this.filterTypes.push({id:'A',description:'All'});
    this.filterTypes.push({id:'N',description:'Un-Confirm'});
    this.filterTypes.push({id:'Y',description:'Confirmed'}) ;

  }
  applyFilter(filterValue: string) {
    this.requisitionArray.filter = filterValue.trim().toLowerCase();
  }
  onChange(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }
  onCkhChange(chk, data)
  {
    if(chk.checked == true)
    {
       this.reqListForConf.push(data);
    }
    else
    {
       this.reqListForConf.splice (this.reqListForConf.indexOf(data),1);
    }
  }
  confirmewquiisition()
  {
    let preqno:any;
    let mReqIds="0";
    this.reqListForConf.forEach(el=>{
        mReqIds=mReqIds+", "+el.REQID;
    });
    const  params = new  HttpParams()
    .set('reqid', mReqIds)
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
           this.reqListForConf=[];
           this.refreshRequisition(this.filterFlag);
           
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
  knowStatus(data)
  {
    let ItemDetail:Array<any>=[];
    const dialogRef1 = this.dialog.open(StoreRequisationStatusComponent, {
      data: {
        itemData: data
      }
    });
  }
  refreshRequisition(flag)
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/PurachaseAndStore/Store/getRequisitionList?token="+this.token+"&fromdate="+this.fstartdate+"&todate="+this.fenddate+"&isStoreUser="+this.isStoreUser+"&filterTypes="+flag).subscribe((data: any[]) => {
      this.itemDisplay=data;
      this.itemDisplay=this.itemDisplay.Table;
      this.requisitionArray.data = this.itemDisplay;
      this.isLoadingResults=false;
      });
  }


editRequisition(data)
{
  var reqnid=data.REQID;
  this.router.navigate(['/add-requisition/'+reqnid+'/edit'], { queryParams:  filter, skipLocationChange: true});
}


printIssuance(id)
{
  this.isLoadingResults=true;
  this.http.get(this.original_url+"/PurachaseAndStore/Store/onRequisitionLoad?token="+this.token+"&ReqID="+id).subscribe((res)=>{
    console.log("res",res);
   

      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table5[0];
     // this.newData.REQID=this.id;
      this.newData.REQNO=this.itemDisplay.REQNO;
      this.newData.REQDATE=this.itemDisplay.REQDATE;
      this.newData.REQSLIPID=this.itemDisplay.REQSLIPID;
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
      this.newData.STORE=this.itemDisplay.STORE;
      this.newData.IPONO=this.itemDisplay.IPONO;
      this.newData.PRODUCTNAME=this.itemDisplay.PRODUCTNAME;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table6;
      
      this.items=[];
      let i=0;
      this.itemDisplay.forEach((el)=>{
        let tmp:any={};
        tmp.id=i++;
        tmp.SR=i;
        tmp.REQID=el.REQID;
        tmp.ITEMID=el.ITEMID;
        tmp.ITEMCODE=el.ITEMCODE;
        tmp.ITEMNAME=el.ITEMNAME;
        tmp.QUANTITYREQUESTED=el.QUANTITYREQUESTED;
        tmp.UOM=el.UOM;
        tmp.QUANTITYISSUED=el.QUANTITYISSUED;
        tmp.ISSUEDQUANTITY=el.QUANTITYISSUED;
        tmp.REMARKS=el.REMARKS;
        tmp.STOCKINHAND=el.STOCKINHAND;
        this.items.push(tmp);
      });
    
      let data:any={};
      data.header=this.newData;
      data.detail=this.items;
      data.title="Store Requisition"
      data.backto='/store-requisition';
     sessionStorage.setItem('issuance', JSON.stringify(data));
     this.router.navigate(['/print-issuance']);
     this.isLoadingResults=false;
 });
}
}



@Component({
  selector: 'itemdetail',
  templateUrl: './itemdetail.html',
  styleUrls: ['./store-requisition-slip.component.css']
})

export class StoreRequisationStatusComponent implements OnInit {
  token:any;
  WorkingDate:any;
  tmpDate:any;
  parentData:any={};
  itemDetail:Array<any>=[];
  isLoadingResults=false;
  itemDisplay:any={};
  original_url = environment.baseUrl;
  newData: any={};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public dialogRef: MatDialogRef<StoreRequisationStatusComponent>,
    private http: HttpClient
  ) { 
    this.parentData=data.itemData;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.tmpDate= new Date(CompanyData['WORKINGDATE']);
    this.getItemDetail();
  }
  ngOnInit() {

   }
   getItemDetail()
   {
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/PurachaseAndStore/Store/getRequisitionStatus?token="+this.token+"&reqid="+this.parentData.REQID).subscribe((data: any[]) => {
      this.itemDisplay=data;
      this.itemDetail = this.itemDisplay;
      console.log("itemDetail", this.itemDetail);

      this.isLoadingResults=false;
      });
   }
   OkDialog()
   {
       this.dialogRef.close("OK");
   }
   printIndent(indentid)
   {
    
     debugger;
     let items:Array<any>=[];
     this.isLoadingResults=true;
     this.http.get(this.original_url+"/indentandpo/indent/onIndentLoad?token="+this.token+"&indentid="+indentid).subscribe((res)=>{
       console.log("res",res);
       this.itemDisplay=res;
         this.itemDisplay=res;
         this.itemDisplay=this.itemDisplay.Table4[0];
         this.newData.INDENTNO=this.itemDisplay.INDENTNO;
         this.newData.INDENTDATE=this.itemDisplay.INDENTDATE;
         if(this.itemDisplay.ISJOBWORK=="Y")
         {
           this.newData.ISJOBWORK=1;
           this.newData.JOBWORK='Yes';
         }
         else
         {
           this.newData.ISJOBWORK=0;
           this.newData.JOBWORK='No';
         }
         this.newData.ACTUALSLIPNO=this.itemDisplay.ACTUALSLIPNO;
         this.newData.ISCONFIRM=this.itemDisplay.ISCONFIRM;
         this.newData.DEPTID=this.itemDisplay.DEPTID;
         this.newData.COSTCENTERID=this.itemDisplay.COSTCENTERID;
         this.newData.DEPTNAME=this.itemDisplay.DEPTNAME;
         this.newData.COSTCENTRE=this.itemDisplay.COSTCENTRE;
         this.itemDisplay=res;
         this.itemDisplay=this.itemDisplay.Table4;
         items=[];
         let i=0;
         this.itemDisplay.forEach((el)=>{
           let tmp:any={};
           tmp.id=i++;
           tmp.SR=i;
           tmp.INDENTID=el.INDENTID;
           tmp.ITEMID=el.ITEMID;
           tmp.ITEMCODE=el.ITEMCODE;
           tmp.ITEMNAME=el.ITEMNAME;
           tmp.QUANTITY=el.QUANTITY;
           tmp.UOM=el.UOM;
           tmp.ITEMSBRANDID=el.ITEMSBRANDID;
           tmp.ITEMSBRAND=el.ITEMSBRAND;
           tmp.REMARKS=el.REMARKS;
           tmp.ISEMERGENCY=el.ISEMERGENCY;
           tmp.STOCKINHAND=el.STOCKINHAND;
           if(el.ISEMERGENCY=="Y")
           {
             this.newData.ISEMERGENCY=1;
           }
           else
           {
             this.newData.ISEMERGENCY=0;
           }
           tmp.EXPECTEDDATE=el.EXPECTEDDATE;
           tmp.LASTPURCHASEQTY=el.LASTPURCHASEQTY;
           tmp.LASTPURCHASERATE=el.LASTPURCHASERATE;
           tmp.LASTPURCHASEDATE=el.LASTPURCHASEDATE;
           items.push(tmp);
         });
         this.OkDialog();
         let data:any={};
         data.header=this.newData;
         data.detail=items;
         data.backto='/store-requisition';
         sessionStorage.setItem('indent', JSON.stringify(data));
         this.router.navigate(['/print-indent']);
         this.isLoadingResults=false;
        
    });
   }
}