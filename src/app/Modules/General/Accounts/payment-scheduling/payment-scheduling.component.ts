import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../account-statement/account-statement.component';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator, MatDialogRef } from '@angular/material';
import { PaymentConfirmationService } from '../payment-confirmation/payment-confirmation.service';
import { DatePipe } from '@angular/common';
import { PaymentChart1Component } from './../payment-chart1/payment-chart1.component';
import { HttpClient } from '@angular/common/http';
import { partition } from 'rxjs/operators';
@Component({
  selector: 'app-payment-scheduling',
  templateUrl: './payment-scheduling.component.html',
  styleUrls: ['./payment-scheduling.component.css']
})
export class PaymentSchedulingComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  paymentMode: Array<any>=[];
  myDate = new Date();
  userid:any;PaymentListToSave : Array<any>=[];accountHeadList:any=[];
  PaymentDetail: PaymentDetail[] = [];isLoadingResults:boolean;
  fieldArray = new MatTableDataSource<PaymentDetail>(this.PaymentDetail);
  displayedColumns: string[] = [ 'REQNO','REQDATE','NAME','MANAGEMENTNOTES','PASSEDAMT','BALANCEAMT','PAYMENTMODE','ISSUEDAMT'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(public dialog: MatDialog,private http: HttpClient,private service:PaymentConfirmationService,@Inject('BASE_URL') private original_url : string) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;

    //=[{id:'C',description:'Cheque'}, 'NEFT', 'Cash'];

    this.service.getPaymentListForConfirmation(this.ServerIP,this.FYUSER, this.boid,'Y').subscribe((res: any[])=> {
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
    console.log("Ved",this.fieldArray.data);
    this.http.get(this.original_url+"/Accounts/Accounts/getBankList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid).subscribe((res)=>{
      this.itemDisplay=res;
      this.accountHeadList=this.itemDisplay.Table;

     console.log("res",res);
      });
    this.isLoadingResults=false;
     });


  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   this.paymentMode.push({id:'C',description:'Cheque'}) ;
   this.paymentMode.push({id:'N',description:'NEFT'}) ;
   this.paymentMode.push({id:'O',description:'Cash'}) ;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  onDataChange(payment)
  {
      if ( payment.ISSUEDAMT>payment.BALANCEAMT) 
      {
        this.WrongDetailDialog("Can't Issue more the passed Amount.");
        payment.ISSUEDAMT=payment.PASSEDAMT;
      }
      if(payment.PAYMENTMODE==null||payment.PAYMENTMODE=='undefined') 
       payment.PAYMENTMODE="C";

      console.log("payment",payment);
  }
  onChange(event, payment)
  {
    //this.RateListToSave.splice (this.RateListToSave.indexOf(payment),1);
   // payment.PASSEDAMT=0;
   console.log("this.PAYMENTDATE", payment.PAYMENTDATE);
  if(event.checked == true)
    {
    //  payment.PASSEDAMT=payment.AMOUNTTOPAY;
    this.PaymentListToSave.push(payment);
    }
    else
    {
      this.PaymentListToSave.splice (this.PaymentListToSave.indexOf(payment),1);
    }
    console.log("this.other", this.PaymentListToSave);
  }
  ConfimPayments()
  {
    var valide:boolean;
    valide=true;
    for(let data of this.PaymentListToSave)
    {
      if(data.ISSUEDAMT=='undined'||data.ISSUEDAMT==null||data.ISSUEDAMT==''||data.ISSUEDAMT==0)
      {
        valide=false;
      }
    }
    if(valide==true) 
    {
     this.saveConfirmation();
    //  this.WrongDetailDialog("thanks");
    }
    else
    {
      this.WrongDetailDialog("Payment or Payment date not entred.");

    }
  }
saveConfirmation()
{
  let paymentList : Array<any>=[];
    let flag:any;
    flag="P";
    var abc:boolean;
    abc=false;
    for(let data of this.PaymentListToSave)
    {
      let Payment:any={};
      Payment.REQID=data.REQID;
      Payment.ISSUEDAMT=data.ISSUEDAMT;
      Payment.PAYMENTMODE=data.PAYMENTMODE;
      Payment.PAYMENTDATE=this.datePipe.transform( data.PAYMENTDATE, 'dd/MMM/yyyy')  ;
      if(data.PAYMENTMODE=="O")
      {
        paymentList.push(Payment);
      }
      else
      {
        abc=true;
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'validation',
            displayMsg:'You cannot pass Cheque or Neft for '+data.NAME
          }
        });
      }
    }
    if(abc==false)
    {
    console.log("mydata",paymentList);
    this.isLoadingResults=true;
    this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, paymentList, flag).subscribe((res: any[])=> {
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.isLoadingResults=false;
      this.PaymentListToSave=[];
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'sucess',
          displayMsg:'Sucess'
        }
      });

     // console.log("Ved",this.fieldArray.data);
      
       });
    }
}

  openDialog(row:PaymentDetail) {
    const dialogRef = this.dialog.open(AccountStatementComponent, {
        data: {
          AccountId:row.ACCOUNTID,
          FromDate:this.fstartDate,
          ToDate:this.fendDate 
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }
  openCalendarDialog(data) {
    const dialogRef = this.dialog.open(PaymentChart1Component, {
        data: {
          transtype:'S'
       }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        data.PAYMENTDATE=result;
      });
  }

  openMultiplrPayment(data): void {
    console.log("ravinder",data);
    // alert(data.PAYMENTMODE);
      if(data.PAYMENTMODE!="O")
      {
          const dialogRef = this.dialog.open(multiplecheques, {
            width: '800px',
            data: {data: data, bankList:this.accountHeadList}
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed1', result);
            if(result!="problem"&&result!="")
            {
              this.fieldArray.data=result;
            }
          });
     }
  }
  

  WrongDetailDialog(textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:textmsg
      }
    });
  }
}
export class PaymentDetail
{
  REQID:number;
  REQNO:number;
  REQDATE:string;
  CREDITDAYS :number;
  DUEAMT:number;
  PAYMENTTYPE:string;
  TOTALDUEAMT :number;
  REMARKS :string;
  AMOUNTTOPAY :number;
  NAME :string;
  PASSEDAMT :number;
  MANAGEMENTNOTES :string;
  BALANCEAMT:number;
  ACCOUNTID:number;
  ISSUEDAMT:number;
  PAYMENTMODE:string;
  PAYMENTDATE:Date;
}


@Component({
  selector: 'multiplecheques',
  templateUrl: 'multiplecheques.html',
  styleUrls: ['./payment-scheduling.component.css']
})

export class multiplecheques {
  newData:any={};boid : any;FYUSER:any;ServerIP:any;newItem:any={};paymentlist:any=[];lastChequeNo:any;isLoadingResults:any;
  pData:any={}; datePipe = new DatePipe("en-US");editItemID:any;itemDisplay:any;accountHeadList:any=[];TotalAmt:any;
  constructor(@Inject('BASE_URL') private original_url : string,private http: HttpClient,private service:PaymentConfirmationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<multiplecheques>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public bankList: any) {
      console.log("itemanme",data);
      this.pData=data.data;
      this.newData=data.data;
      console.log("itemanme1",bankList);

      this.accountHeadList=bankList.bankList;

      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];

     
    }
  onNoClick(): void {
    var flag:boolean, msgBox:string;
    flag=true;
    var payment:any=[];
    if(this.validate())
    {
      this.isLoadingResults=true;
      for(var el of  this.paymentlist)
      {
            var item:any={};
            item.REQID=this.newData.REQID;
            item.PASSEDAMT=0;
            item.MANAGEMENTNOTES='';
            item.ISSUEDAMT=el.TRANAMT;
            item.PAYMENTMODE=this.newData.PAYMENTMODE;
            item.PAYMENTDATE=el.TRANSDATE;
            item.BANKACID=el.ACCOUNTID;
            item.CHEQUENO=el.CHEQUENO;
            item.NAMEONCHEQUE=el.NAMEONCHEQUE;
            payment.push(item);
      }
      this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, payment, "P").subscribe((res: any[])=> {
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
    
      if(!(this.itemDisplay==undefined))
      {

        this.dialogRef.close(this.itemDisplay);
      }
      else
      {
        console.log("wrong");
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
  validate()
  {
    var flag:boolean, msgBox:string;
    flag=true;
    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    var total=0;
    for(var item of this.paymentlist)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    if(this.newData.BALANCEAMT<total)
    {
      flag=false;
      msgBox=msgBox+"<li>Cannot Scheduled more than balance Amount."+'</li>';
    }
    if(total==0)
    {
      flag=false;
      msgBox=msgBox+"<li>Nothing to save."+'</li>';
    }

    msgBox=msgBox+"</ul>";
    if(flag==false) {
     console.log("msgBox",msgBox);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'validation',
        displayMsg:msgBox
      }
    });
     }
     return flag;
  }

  validateDetail(data)
  {
    var flag:boolean, msgBox:string;
    flag=true;
    console.log("this.newData.NEXTFOLLOWUPDATE",this.newItem.TRANSDATE);

    var currDate=new Date();
    var selectedDate=new Date(this.newItem.TRANSDATE);
    selectedDate.setHours(selectedDate.getHours() + 23);

    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    if(this.newItem.ACCOUNTID==undefined || this.newItem.ACCOUNTID=='' )
    {
      flag=false;
      msgBox=msgBox+"<li>Bank not selected."+'</li>';
    }
    if(this.newItem.CHEQUENO=='' ||this.newItem.CHEQUENO==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Cheque no not entred."+'</li>';
    }
    if(this.newItem.TRANSDATE=='' ||this.newItem.TRANSDATE==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Payment date not entred."+'</li>';
    }

    if(this.newItem.TRANAMT=='' ||this.newItem.TRANAMT==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Payment not entred."+'</li>';
    }

    if((this.newItem.TRANSDATE!='' ||this.newItem.TRANSDATE!=undefined) && selectedDate<currDate)
    {
      flag=false;
      msgBox=msgBox+"<li>Payment date should not before current date."+'</li>';
    }

    var total=parseFloat(this.newItem.TRANAMT);
    for(var item of this.paymentlist)
    {
      total=total+parseFloat(item.TRANAMT);
    }

    if(this.newData.BALANCEAMT<total)
    {
      flag=false;
      msgBox=msgBox+"<li>Cannot Scheduled more than balance Amount."+'</li>';
    }

    msgBox=msgBox+"</ul>";
    if(flag==false) {
     console.log("msgBox",msgBox);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'validation',
        displayMsg:msgBox
      }
    });
     }
     return flag;
  }
  additem(){
     console.log("this.newItem", this.newItem);
    if(this.validateDetail(this.newItem))
    {
    this.paymentlist.push(this.newItem);    

    this.paymentlist.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
      
    });
    var total=0;
    for(var item of this.paymentlist)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    this.TotalAmt=total;
    console.log("this.items", this.TotalAmt);
    this.newItem = {};
  
}

}
accountHeadChange(id, data)
{
 data.ACCOUNTHEAD= this.accountHeadList.find(x=>x.ACCOUNTID==id).ACCOUNTHEAD;
}
  removeItem(index){
    this.paymentlist.splice(index,1);
   
  }
  editItem(val){
   
    this.editItemID = val;
   
  }
  updateItem(val){
    this.editItemID = {};
    var total=0;
    for(var item of this.paymentlist)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    this.TotalAmt=total;
  }
  openCalendarDialog(data) {
    const dialogRef = this.dialog.open(PaymentChart1Component, {
        data: {
          transtype:'S'
      
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        data.TRANSDATE=result;
      });
  }
}