import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { PaymentConfirmationService } from './payment-confirmation.service';
import { PaymentConfirmation } from './payment-confirmation.model';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../account-statement/account-statement.component';
//import { StatementviewComponent} from '../../../../Dialog/statementview/statementview.component';

import { rootRenderNodes } from '@angular/core/src/view';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  userid:any;PaymentListToSave : Array<any>=[];
  PaymentDetail: PaymentConfirmation[] = [];
  fieldArray = new MatTableDataSource<PaymentConfirmation>(this.PaymentDetail);
  displayedColumns: string[] = [ 'REQNO','REQDATE','NAME','CREDITDAYS','REMARKS','TOTALDUEAMT','DUEAMT','PAYMENTTYPE','AMOUNTTOPAY','PASSEDAMT','MANAGEMENTNOTES'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(public dialog: MatDialog,private service:PaymentConfirmationService) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;

    this.service.getPaymentListForConfirmation(this.ServerIP,this.FYUSER, this.boid,'N').subscribe((res: any[])=> {
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
    console.log("Ved",this.fieldArray.data);
    this.isLoadingResults=false;
     });
  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  onDataChange(payment)
  {
      if ( payment.PASSEDAMT>payment.AMOUNTTOPAY) 
      {
        this.WrongDetailDialog("Can't pass more the requested Amount.");
        payment.PASSEDAMT=payment.AMOUNTTOPAY;
      }
  }
  onChange(event, payment)
  {
    //this.RateListToSave.splice (this.RateListToSave.indexOf(payment),1);
   // payment.PASSEDAMT=0;
  if(event.checked == true)
    {
      payment.PASSEDAMT=payment.AMOUNTTOPAY;
    this.PaymentListToSave.push(payment);
    }
    else
    {
      payment.PASSEDAMT=0;
      this.PaymentListToSave.splice (this.PaymentListToSave.indexOf(payment),1);
    }
    console.log("this.other", this.PaymentListToSave);
  }
  ConfimPayments()
  {
    
    let paymentList : Array<any>=[];
    // let flag:any;
    // flag="Y";
    this.isLoadingResults=false;
    for(let data of this.PaymentListToSave)
    {
      let Payment:any={};
      Payment.REQID=data.REQID;
      Payment.PASSEDAMT=data.PASSEDAMT;
      if (data.MANAGEMENTNOTES==null)
      {
        Payment.MANAGEMENTNOTES='';
      }
      else
      {
        Payment.MANAGEMENTNOTES=data.MANAGEMENTNOTES;
      }
 
      paymentList.push(Payment);
    }
    console.log("mydata",paymentList);
    this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, paymentList, "Y").subscribe((res: any[])=> {
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.PaymentListToSave=[];
      this.isLoadingResults=false;
       },     
       error=>{
        var erroremsg:any;
        erroremsg=error.message;
        //console.log("1212",erroremsg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:erroremsg
           
        }
      });
      this.isLoadingResults=false;
    });
  }

  openDialog(row:PaymentConfirmation) {
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
  
  KnockedOffRPayments()
  {
    this.isLoadingResults=true;
    let paymentList : Array<any>=[];
    // let flag:any;
    // flag="K";
    for(let data of this.PaymentListToSave)
    {
      let Payment:any={};
      Payment.REQID=data.REQID;
      Payment.PASSEDAMT=0;
      Payment.MANAGEMENTNOTES="";
 
      paymentList.push(Payment);
    }
    console.log("mydata",paymentList);
    this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, paymentList, "K").subscribe((res: any[])=> {
      
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      console.log("Ved",this.fieldArray.data);
      this.isLoadingResults=false;
      this.PaymentListToSave=[];
       },     
       error=>{
        var erroremsg:any;
        erroremsg=error.message;
        //console.log("1212",erroremsg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:erroremsg
           
        }
      });
      this.isLoadingResults=false;
    });
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
