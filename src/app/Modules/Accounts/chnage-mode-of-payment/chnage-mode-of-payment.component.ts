import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../statement-account/account-statement/account-statement.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chnage-mode-of-payment',
  templateUrl: './chnage-mode-of-payment.component.html',
  styleUrls: ['./chnage-mode-of-payment.component.css']
})
export class ChnageModeOfPaymentComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  paymentMode: Array<any>=[];
  myDate = new Date();
  userid:any;PaymentListToSave : Array<any>=[];accountHeadList:any=[];
  PaymentDetail: Array<any>[] = [];isLoadingResults:boolean;
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'REQDATE','NAME','NAMEONCHEQUE','BANKNAME','CHEQUENO','TRANAMT','PAYMENTMODE'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any; token:any; 
  constructor(public dialog: MatDialog,private http: HttpClient) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];

    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;

    //=[{id:'C',description:'Cheque'}, 'NEFT', 'Cash'];
    
    console.log("Ved",this.fieldArray.data);
    this.http.get(this.original_url+"/Accounts/Payments/getPassedList?token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      
     console.log("res",res);
      });
    this.isLoadingResults=false;
    


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
    if(this.PaymentListToSave.length>0) 
    {
     this.saveConfirmation();
    //  this.WrongDetailDialog("thanks");
    }
    else
    {
      this.WrongDetailDialog("There is nothing for Save.");

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
      Payment.ID=data.ID;
      Payment.PAYMENTMODE=data.PAYMENTMODE;
      paymentList.push(Payment);
    }
    if(abc==false)
    {
    console.log("mydata",paymentList);
    this.isLoadingResults=true;
    console.log("mydata",paymentList);
    const params = new  HttpParams()
    .set('token', this.token)
    .set('recolist', JSON.stringify(paymentList));

    this.http.post(this.original_url+"/Accounts/Payments/UpdateModeOfPayment", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
    this.isLoadingResults=false;
    if(res=="Ravinder")
    {
       this.WrongDetailDialog("Some thing went Wrong");
    }
    else
    {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'sucess'
          }
        });
     
      this.PaymentListToSave=[];
      this.isLoadingResults=false;  
    } 
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
}

  openDialog(row) {
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
  

    

  WrongDetailDialog(textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:textmsg
      }
    });
  }
}