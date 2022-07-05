import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import {PaymentRequirmentService } from '../payment-requirment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpParams, HttpClient } from '@angular/common/http';
// import { error } from 'util';

@Component({
  selector: 'app-add-new-payment-requirment',
  templateUrl: './add-new-payment-requirment.component.html',
  styleUrls: ['./add-new-payment-requirment.component.css']
})
export class AddNewPaymentRequirmentComponent implements OnInit {
  original_url = environment.baseUrl;
  arrayItemSupplier='';
  newData:any={};
  supplierlist:Array<any>=[];
  bankList:Array<any>=[];
  receiptStaffData:Array<any>=[];
  allReceiptStaffData: any;
  allDataList:any={};
  ReceiptallopCLBallance:any;
  isBankList='';
  routeID: any;
  routeAction: any;
  date = new Date();
  userid: any;
  isLoadingResults=false;
  token:any;
  workingDate:any;
  itemDisplay:any={};
  listPassedPayment : Array<any>=[];
  pendingBills : Array<any>=[];
  orderList : Array<any>=[];
  listCheque:Array<any>=[];
  openingDrCr:any;ClosingDrCr:any;
  YearOpeningBalance:number; ClosingBalance:number;
  accountStatement : Array<any>=[];
  billDueAmt=0;
  PartyAcId:any;
  // listOfBills : Array<any>=[];
  isBillsSelected=false;
  isOrdersSelected=false;
  isPayments=false;
  isCheques=false;
  constructor(
     private http: HttpClient,
     private paymentRequirmentService :PaymentRequirmentService,  
     public dialog: MatDialog,
     private router: Router, 
     private activatedRoute: ActivatedRoute) { 
     let currentBranch = sessionStorage.getItem("currentBranch");
     var CompanyData = JSON.parse(currentBranch);
     this.workingDate= new Date (CompanyData['WORKINGDATE']) ;
     let currentUser = sessionStorage.getItem("currentUser");
     currentUser = JSON.parse(currentUser);
     this.token = currentUser['TOKEN'];
     this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
     this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
     this.PartyAcId = this.activatedRoute.snapshot.paramMap.get('acid');
      if(this.routeID==null)
      {
        this.routeID=0;
        this.PartyAcId=0;
      }
    paymentRequirmentService.getRequirementDetail(this.routeID, this.PartyAcId).subscribe((res:any=[])=>{
      
      if(this.routeAction!='new')
      {
        this.allDataList=res;
        this.allDataList=this.allDataList.Table;
        this.allDataList=this.allDataList[0];
        this.newData=this.allDataList;
        this.allDataList=res;
        this.pendingBills=this.allDataList.Table1;
        this.orderList=this.allDataList.Table2;
        this.accountSTATEDESCment(this.PartyAcId);
      }
      else
      {
        this.allDataList=res;
        this.allDataList=this.allDataList.Table;
        this.allDataList=this.allDataList[0];
        this.newData.REQNO=this.allDataList.REQNO;
        this.newData.PAYMENTTYPE='C';
        this.newData.REQDATE=formatDate(Date(), 'yyyy-MM-dd', 'en-US'); 
        
      }
    });
  }

  ngOnInit() {

  }
  searchTermSupplier(term)
  {
    this.arrayItemSupplier = term;
    if(this.arrayItemSupplier !== '')
    {
      this.paymentRequirmentService.SupplierList(this.arrayItemSupplier)
        .subscribe((response) => {
          this.allDataList = response;
          this.allDataList = this.allDataList.Table;
          this.supplierlist = this.allDataList;
        });
    }
    else
    {
      this.supplierlist = [];
      this.arrayItemSupplier = '';
    }
  }

  onChangeOfSupplier(data, rowDetail) {
  
    if( data == null)
    {
      rowDetail.ADDRESS = '';
      rowDetail.CITYDESC = '';
      rowDetail.STATEDESC = '';
      rowDetail.COUNTRY = '';
      rowDetail.ACCOUNTID = '';
      rowDetail.BANKID= '';
      rowDetail.BANKACNO= '';
      rowDetail.IFSC= '';
      rowDetail.BANKER='';
      rowDetail.BRANCH='';
    }
    else{
      this.arrayItemSupplier = '';
      rowDetail.ACCOUNTID = data.ACCOUNTID;
      rowDetail.NAME = data.NAME;
      rowDetail.ADDRESS = data.ADDRESS;
      rowDetail.CITYDESC = data.CITYDESC;
     // rowDetail.suplpincode = data.pin;
      rowDetail.STATEDESC = data.STATEDESC;
      rowDetail.COUNTRY = data.COUNTRY;
      this.showBankList(data.ACCOUNTID);
      this.accountSTATEDESCment(data.ACCOUNTID);
      this.getPendingBills(data.ACCOUNTID);
    }
  }
  dropdownHide(){
      this.arrayItemSupplier = '';
  }
  radioChange()
  {
    this.isBillsSelected=false;
    this.isOrdersSelected=false;
    this.newData.AMOUNTTOPAY=0;
    this.orderList.forEach((el)=>{
      el.CHECKED=false;
      });

    this.pendingBills.forEach((el)=>{
      el.CHECKED=false;
      });
  
  }
  onOrderChecked(check, data)
  {
    this.newData.AMOUNTTOPAY=0;
    this.orderList.forEach((el)=>{
    if(el.CHECKED)
    {
      this.newData.AMOUNTTOPAY=parseFloat(this.newData.AMOUNTTOPAY)+parseFloat(el.AMOUNT);
      this.isOrdersSelected=true;
    }
    });
  }
  onBillNoChecked(check, data)
  {
    this.newData.AMOUNTTOPAY=0;
    this.pendingBills.forEach((el)=>{
      if(el.CHECKED)
      {
        this.newData.AMOUNTTOPAY=parseFloat(this.newData.AMOUNTTOPAY)+parseFloat(el.DUEAMOUNT);
        el.AMOUNT=parseFloat(el.DUEAMOUNT);
        this.isBillsSelected=true;
      }
      else
      {
        el.AMOUNT=0;
      }
    });
  }
  onTopayAmtChanged(amt)
  {
    this.isBillsSelected=false;
    this.isOrdersSelected=false;

    this.pendingBills.forEach((el)=>{
      el.CHECKED=false;
    });
    this.orderList.forEach((el)=>{
      el.CHECKED=false;
    });
    if(this.newData.PAYMENTTYPE!='A')
    {
      this.pendingBills.forEach((el)=>{
        if(parseFloat(el.DUEAMOUNT)<=parseFloat(amt))
        {
          el.AMOUNT=parseFloat(el.DUEAMOUNT);
          amt=parseFloat(amt)-parseFloat(el.DUEAMOUNT);
          el.CHECKED=true;
          this.isBillsSelected=true;
        }
        else
        {
          el.AMOUNT=amt;
          if(amt>0)
          {
            el.CHECKED=true;
          }
          amt=0;
          this.isBillsSelected=true;
        }
        amt=parseFloat(amt).toFixed(2);
      });
    }

  }
  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    if(data.sch==''||data.sch==undefined)
    {
      data.sch=false;
    }
    msg="<h5>Before add please rectify following mistakes:-</h5>";
      if(data.ACCOUNTID==undefined||data.ACCOUNTID==0||data.ACCOUNTID=='' )
      {flag=false; msg=msg+"* Supplier not seletected<br/>"}
      if(data.AMOUNTTOPAY==undefined||data.AMOUNTTOPAY==0||data.AMOUNTTOPAY=='' )
      {flag=false; msg=msg+"* Amount not entred<br/>"}
      if(this.newData.PAYMENTTYPE!='A' && this.orderList.length>0 && parseFloat( this.newData.DUEAMT)< parseFloat( this.newData.AMOUNTTOPAY) )
      {flag=false; msg=msg+"* You can't pay more than due amount<br/>"}
      if(this.newData.PAYMENTTYPE!='A' && this.pendingBills.length>0 && this.isBillsSelected==false )
      {flag=false; msg=msg+"* Bill not selected for payment<br/>"}
      if(this.newData.PAYMENTTYPE=='A' && this.orderList.length>0 && this.isOrdersSelected==false )
      {flag=false; msg=msg+"* Order not selected for Advance payment<br/>"}



      if(flag==false) {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'validation',
            displayMsg:msg
          }
        });
      }
    return flag;
  }
  saveData(row, action)
  {
    let data:any={};
    let hrddata:Array<any>=[];
    let dtldata:Array<any>=[];
    let orderdata:Array<any>=[];
    this.isLoadingResults=true;
    let mReqId=0;
    if(this.validateDetail(row))
    {
      
        if(action=="Insert")
        {
          data.ReqId=":A";
          data.REQNO=":B";
          data.REQDATE=":C";
          data.Edate=":D";
          data.BranchId=":E";
          
        }
        else
        {
          data.MDATE=":A";
          mReqId=this.routeID;
        }
        data.AMOUNTTOPAY=row.AMOUNTTOPAY;
        data.DUEAMT=row.DUEAMT;
        if(this.ClosingDrCr="Cr")
        {
          data.TotalDueAmt=this.ClosingBalance;
        }
        else
        {
          data.TotalDueAmt=0;
        }
        data.PAYMENTTYPE=row.PAYMENTTYPE;
        data.REMARKS=row.REMARKS;
        data.userid=this.userid;
        data.ACCOUNTID=row.ACCOUNTID;
        if(row.REMARKS==undefined)
        {
          data.REMARKS='';
        }
        else
        {
          data.REMARKS=row.REMARKS;
        }
        data.Confirmed="N";
        hrddata.push(data);

        this.orderList.forEach((el)=>{
          let tmp:any ={};
            if(el.CHECKED)
            {
              let tmp:any ={};
              tmp.ReqId=":A";
              tmp.OrderId=el.ORDERID;
              tmp.OrderAmount=el.AMOUNT;
              tmp.BranchId=":B";
              orderdata.push(tmp);
            }
          });
    
        this.pendingBills.forEach((el)=>{
            if(el.CHECKED)
            {
              let tmp:any ={};
              tmp.ReqId=":A";
              tmp.InwardId=el.INWARDID;
              tmp.ReqAmount=el.AMOUNT;
              tmp.BranchId=":B";
              dtldata.push(tmp);
            }
          });


        const  params = new  HttpParams()
        .set('reqid', mReqId.toString())
        .set('header', JSON.stringify(hrddata))
        .set('detail', JSON.stringify(dtldata))
        .set('orderlist', JSON.stringify(orderdata))
        .set('token', this.token);

        this.http.post(this.original_url+"/Accounts/payments/SavePaymentReq", params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .subscribe((res) => {
          this.isLoadingResults=false;
          let reqno1:any;
          reqno1=res;
          if (parseInt(reqno1)>0)
          {
              this.successDialog('sucess','Data Saved');
              this.newData={};
              this.orderList=[];
              this.pendingBills=[];
              this.router.navigate(['/payment-requirment'], {skipLocationChange:true});
          }
          else
          {
            this.successDialog('wrongData','Some Error has been occurred!');
          }
        },
        error=>{
          this.isLoadingResults=false;
          this.successDialog('validation','Some Error has been occurred!');
        }
        );
    }
    else
    {
      this.isLoadingResults=false;
    }
  }
  successDialog(type, msg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: type,
        displayMsg:msg
      }
    });
  }
  onBankerClick()
  {
    this.isBankList="Y";
  }
  onBankerSelect(row, data)
  {
    this.isBankList="";
    data.BANKID= row.BANKID;
    data.BANKACNO= row.BANKACNO;
    data.IFSC= row.IFSC;
    data.banker=row.bankname;
    data.branch=row.branch;
  }
  reset(rowDetail)
  {
    rowDetail.suplid =0;
    rowDetail.ADDRESS = '';
    rowDetail.address2 = '';
    rowDetail.supltaxregistrationnumber = '';
    rowDetail.CITYDESC = '';
    rowDetail.STATEDESC = '';
    rowDetail.suplpincode = '';
    rowDetail.COUNTRY = '';
    rowDetail.suplid = '';
    rowDetail.headname = '';
    rowDetail.BANKID= '';
    rowDetail.BANKACNO= '';
    rowDetail.IFSC= '';
    rowDetail.banker='';
    rowDetail.branch='';
  }
  showBankList(supplieracid)
  {
    this.paymentRequirmentService.getSupplierBankList(supplieracid).subscribe((res:any[])=>{
      this.allDataList=res;
      this.bankList=this.allDataList.Table;
      
    });
  }
  getPendingBills(supplieracid)
  {
    this.paymentRequirmentService.getPendingBills(supplieracid).subscribe((res:any[])=>{
      this.allDataList=res;
    
      this.pendingBills=this.allDataList.Table;
      this.orderList=this.allDataList.Table1;
      this.billDueAmt=0;
      this.pendingBills.forEach((el)=>{
        this.billDueAmt=this.billDueAmt+parseFloat(el.DUEAMOUNT);
      });
      this.newData.DUEAMT=this.billDueAmt;
    });
  }
  accountSTATEDESCmentSelect(data)
  {
    
  }
  accountSTATEDESCment(term){
    //this.http.get(this.original_url+"/FA/VOUCHER/MiniAccountSTATEDESCment?coid="+this.coid+"&boid="+this.coid+"&ACCOUNTID="+term+"&PageNumber=1&PageSize=100&sort=id&sortorder=desc&fromdate=2018-01-01&todate=2019-01-28&fyid="+this.fyid)
    this.paymentRequirmentService.StatementOfAccounts(term).subscribe((res: any[]) => { 
      
        this.itemDisplay=res;
        this.listPassedPayment=this.itemDisplay.Table2;
        this.itemDisplay=res;
        this.listCheque=this.itemDisplay.Table1;

        if(this.listCheque.length>0)
        {
          this.isCheques=true;
        }
        
        if(this.listPassedPayment.length>0)
        {
          this.isPayments=true;
        }
   
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        var i:Number;
        i=1;
      
        for(let data of this.itemDisplay)
        {
          var runBalance: any;
      //    this.PartyName=data.NAME;
          if(data.BALANCE>0)
            runBalance = data.BALANCE +"Dr";
          else if(data.BALANCE<0)
            runBalance = data.BALANCE*-1 +"Cr";
          else
            runBalance="-";
          this.YearOpeningBalance=data.YEAROPENINGBALANCE+data.OPENBALANCE;
          this.ClosingBalance=data.BALANCE;
          this.accountStatement.push({VOUCHERDATE:data.VOUCHERDATE,VOUCHERNO:data.VOUCHERNO,DESCRIPTION:data.DESCRIPTION,DRAMT:data.DRAMT,CRAMT:data.CRAMT,BALANCE:runBalance});
        }
        this.openingDrCr="";
        if(this.YearOpeningBalance<0) 
        {
            this.openingDrCr="Cr";
            this.YearOpeningBalance= this.YearOpeningBalance*-1;
        }
        else if(this.YearOpeningBalance>0) 
        {
            this.openingDrCr="Dr";
        }
        this.ClosingDrCr="";
        if(this.ClosingBalance<0) 
        {
            this.ClosingDrCr="Cr";
            this.ClosingBalance= this.ClosingBalance*-1;
        }
        else if(this.ClosingBalance>0) 
        {
            this.ClosingDrCr="Dr";
        }
      

    });
  }
}
