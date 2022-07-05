import { ValidationComponent } from './../../../../validation/validation.component';
import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IssuanceSlipService } from '../issuance-slip.service';
//import { NotifierService } from 'angular-notifier';
import { ConfirmationDialogService } from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service'
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';
import { ConfirmAlertComponent } from '../../../../confirm-alert/confirm-alert.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-add-new-issunace-slip',
  templateUrl: './add-new-issunace-slip.component.html',
  styleUrls: ['./add-new-issunace-slip.component.css']
})
export class AddNewIssunaceSlipComponent implements OnInit {
  // @ViewChild("issuedquantity") inputEl: ElementRef;
  original_url = environment.baseUrl;
  newData: any={};
  issunaceform: FormGroup;
  userinfo:any;
  coid:any;
  boid:any;
  myDate = new Date();
  sendArray:any;
  butDisabled: boolean = false; 
  check: boolean = true; 
  checkarray: Array<any> = [];
  isLoadingResults = false;
  cancelDisabled:boolean=true;
  productData: any;
   // contact
   items: Array<any> = [];
   fakeContacts: Array<any> = [];
   batchArray: Array<any> = [];
   newContact: any = {};
   editContactID: any={};
   allDataGet :any;
   pendingreq: Array<any>=[];
   lastisssuance:any;
   reqnid:any;
   newarray:any;
   userid:any;
   newData1:any;
   data:any={};
   action:any;
   id: any;
   branch1info: any;
   branch2info:any;
   fyid:any;
   batchDetail: Array<any>=[];
   //notifier: NotifierService;
   headerDivShow = 'show';
   itemCategory: Array<any>=[];
   childCategory: Array<any>=[];
   childSingleCategory: Array<any>=[];
   categorychange: any;
   childId: any;
   FYUSER:any;ServerIP:any;
   token:any;WorkingDate:any;
   fstartdate:any;
   fenddate:any;
   itemDisplay:any={};
   departmentget: Array<any> = [];
   costcentreget: Array<any> = [];
   storeget: Array<any> = [];

  constructor(
    private issuance: IssuanceSlipService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: ConfirmationDialogService,
    private activatedRoute: ActivatedRoute,  
    private http: HttpClient,
   // notifier: NotifierService,
    public dialog: MatDialog
  ) {
  //  this.notifier = notifier;
  //  this.createForm();
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
    this.newData.REQDATE= this.WorkingDate; 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
  
   }
   
   

  ngOnInit() {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Store/onIssuanceLoad?token="+this.token+"&ReqID="+this.id).subscribe((res)=>{
      console.log("res",res);
      this.itemDisplay=res;
      this.departmentget=this.itemDisplay.Table;
      this.costcentreget=this.itemDisplay.Table1;
      this.storeget=this.itemDisplay.Table2;
      this.pendingreq=this.itemDisplay.Table4;
console.log("pendingreq",this.pendingreq);

      this.itemDisplay=this.itemDisplay.Table3[0];
      this.newData.REQNO=this.itemDisplay.REQNO;

      
      
      if(this.action == "view")
      {
        this.itemDisplay=res;
        // this.itemlistgetDesc=this.itemDisplay.Table7;
        // this.bomDetail=this.itemDisplay.Table8;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table5[0];
        this.newData.REQID=this.id;
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
        debugger;
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
      }
      this.isLoadingResults=false;
   });
  }

  createForm() {
    this.issunaceform = this.fb.group({
      REQID: ['', Validators.required ],
      DEPTNAME: '',
      COSTCENTRE: '',
      // issueslipno: '',
      // reqndate:'',
      // store: '',
      // manualslipno: '',
      // batchno: '',
    });
  }

  
  // Cancel Req. No.
  cancelReqNoFunction()
  {
    const msg = "Are you sure you want to delete the Req. No. " + this.newData.reqnno;
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg: msg,
        action: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'ok')
      {
        const params = new HttpParams()
        .set('coid', this.coid)
        .set('boid', this.boid)
        .set('reqnid', this.newData.reqnid);

        this.http.post(this.original_url + "/MaterialManagement/Requisition/cancelreqn", params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .subscribe((res) => {
          this.router.navigate(['/issuance-slip']);
        });
      }
    });
  }

  // Hide Show Div
  hideCloseDiv()
  {
    this.headerDivShow = 'close';
  }

  showHeaderDiv()
  {
    this.headerDivShow = 'show';
  }
  

  itemStockOpen(data)
  {
    
  }

  checkIsuueQty(event, rowDetail){
    console.log("event", event);
    if(rowDetail.STOCKINHAND < event)
    {
     // this.notifier.notify( 'info', 'To Issue Qty. can not be Greater then Stock in Hand' );
     this.showWorning("To Issue Qty. can not be Greater then Stock in Hand.");
      rowDetail.ISSUEDQUANTITY = 0;
    }
    if((rowDetail.QUANTITYREQUESTED-rowDetail.QUANTITYISSUED) < event)
    {
     // this.notifier.notify( 'info', 'To Issue Qty. can not be Greater then Stock in Hand' );
     this.showWorning("To Issue Qty. can not be Greater then Requested Quantity.");
      rowDetail.ISSUEDQUANTITY = 0;
    }
  }

  saveStoreIssuance(data,actions)
  {

      this.isLoadingResults=true;
      let newArray: Array<any> = [];
      let batchDetail:Array<any>=[];
      if(data.ACTUALSLIPNO == undefined || data.ACTUALSLIPNO == null) { data.ACTUALSLIPNO = 0; }
    
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
        
      }
      else
      {
        tmpData.MDATE = ':A';
        mreqid=data.REQID;
      }
    
      tmpData.BRANCHID = this.boid;
      tmpData.USERID = this.userid;
      tmpData.DEPTID  = data.DEPTID;
      tmpData.COSTCENTERID = data.COSTCENTERID;
      tmpData.ACTUALSLIPNO = data.ACTUALSLIPNO;
      tmpData.STOREID=data.STOREID;
      tmpData.REFERENCENO=0;
      tmpData.COMPANYID=1;
      tmpData.IPOID=data.IPOID;
      tmpData.REQSLIPID=data.REQSLIPID;
      var mreqslipno=this.pendingreq.find(x=>x.REQID==data.REQSLIPID).REQNO;
      tmpData.REQSLIPNO=mreqslipno;

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
      tmp.QUANTITYISSUED=el.ISSUEDQUANTITY;
      tmp.COMPANYID=1;
      tmp.BRANCHID = this.boid;
      tmp.USERID = this.userid;
      tmp.AccountId=0;
      tmp.CostCentreId=data.COSTCENTERID;
      tmp.REMARKS=el.REMARKS;
      tmp.InHandQty=el.STOCKINHAND
     
      detail.push(tmp);
    })
  
    setTimeout(() => {
      this.isLoadingResults=false;
    }, 3000);


    let indentno:any;

    const  params = new  HttpParams()
   
    .set('token', this.token)
    .set('header', JSON.stringify(header))
    .set('detail', JSON.stringify(detail));
    this.isLoadingResults=true;
  this.http.post(this.original_url+"/PurachaseAndStore/store/saveStoreIssance", params.toString(), {
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
           this.router.navigate(['/issuance-slip'],{ queryParams:  filter, skipLocationChange: true});
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

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  showWorning(msg) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:msg
      }
    });
  }

  public doSelect = (value: any) => {
    if(value != undefined)
    {
      console.log("1");
      this.reqnid = value.REQID;
      this.cancelDisabled = false;
      this.getrequisitiondata();
    }
    else
    {
      console.log("2");
      this.cancelDisabled = true;
      this.items = [];
      this.newData = '';
    }
    
  }
  getrequisitiondata()
  {
    this.http.get(this.original_url+"/PurachaseAndStore/Store/getRequisitionData?token="+this.token+"&ReqID="+this.reqnid).subscribe((res)=>{
      console.log("res",res);
      this.itemDisplay=res;
      
      
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table[0];
        debugger;
        try
        {
          this.newData.ACTUALSLIPNO=this.itemDisplay.ACTUALSLIPNO;
          this.newData.DEPTID=this.itemDisplay.DEPTID;
          this.newData.COSTCENTERID=this.itemDisplay.COSTCENTERID;
          this.newData.DEPTNAME=this.itemDisplay.DEPTNAME;
          this.newData.COSTCENTRE=this.itemDisplay.COSTCENTRE;
          this.newData.STOREID=this.itemDisplay.STOREID;
          this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay.Table1;
          
          this.items=[];
          let i=0;
         
          this.itemDisplay.forEach((el)=>{
            let tmp:any={};
            let qty=parseFloat( el.QUANTITYREQUESTED)-parseFloat(el.QUANTITYISSUED);
            if(qty>0)
            {
           //   debugger;
              tmp.id=i++;
              tmp.SR=i;
              tmp.REQID=el.REQID;
              tmp.ITEMID=el.ITEMID;
              tmp.ITEMCODE=el.ITEMCODE;
              tmp.ITEMNAME=el.ITEMNAME;
              tmp.QUANTITYREQUESTED=el.QUANTITYREQUESTED;
              tmp.UOM=el.UOM;
              tmp.QUANTITYISSUED=el.QUANTITYISSUED;
              
              if( qty> parseFloat(el.STOCKINHAND))
              {
                if( parseFloat(el.STOCKINHAND)>0)
                {
                  qty=el.STOCKINHAND;
                  tmp.ISSUEDQUANTITY=qty.toFixed(3);
                }
                else
                {
                  tmp.ISSUEDQUANTITY=0;
                }
              }
              else
              {
                tmp.ISSUEDQUANTITY=qty.toFixed(3);
              }
            
              tmp.REMARKS=el.REMARKS;
              tmp.STOCKINHAND=el.STOCKINHAND;
              this.items.push(tmp);
            }
  
          });
        }
        catch(error)
        {
          
        }
      
   });
  }
  printIssuance()
  {
    let data:any={};
    data.header=this.newData;
    data.detail=this.items;
    data.title="Issuance Slip";
    data.backto='/add-issuance-slip/'+this.id+'/view';
   sessionStorage.setItem('issuance', JSON.stringify(data));
   this.router.navigate(['/print-issuance'], {skipLocationChange:true});
  }
}



@Component({
  selector: 'issuanceprint',
  templateUrl: './issuanceprint.html',
  styleUrls: ['./add-new-issunace-slip.component.css']
})
export class PrintIssuanceComponent implements OnInit {
  newData:any={};backto:any;
  DetailData:Array<any>=[];
  title:any;
  repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;
 constructor(private router: Router ) {
  let indent = sessionStorage.getItem("issuance");
  var data = JSON.parse(indent);

  let currentBranch = sessionStorage.getItem("currentBranch");
  var CompanyData = JSON.parse(currentBranch);
  this.companyName=CompanyData['COMPANYNAME'];
  this.Address1=CompanyData['ADDRESS'];
  this.Address2 = CompanyData['ADDRESS1'];
  this.title=data['title'];
  this.newData=data['header'];
  this.DetailData=data['detail'];
  this.backto=data['backto'];
  sessionStorage.removeItem('issuance');
  }

 ngOnInit() {
   setTimeout(() => {
     window.print();
   });
  setTimeout(() => {
     this.backToView();
   });
}
backToView()
{
   this.router.navigate([this.backto]);
}

}