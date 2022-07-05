import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../statement-account/account-statement/account-statement.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cheque-reco',
  templateUrl: './cheque-reco.component.html',
  styleUrls: ['./cheque-reco.component.css']
})
export class ChequeRecoComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;token:any; 

  userid:any;PaymentListToSave : Array<any>=[];
  PaymentDetail: Array<any> = [];
  fieldArray = new MatTableDataSource<any>();accountHeadList:any=[];StatusList:any=[];
  displayedColumns: string[] = [ 'TRANSDATE','NAME','NAMEONCHEQUE','BANKACID','CHEQUENO','TRANAMT', 'STATUS','DATED'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(public dialog: MatDialog,private http:HttpClient) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.StatusList.push({STATUS:'Not Present'});
    this.StatusList.push({STATUS:'Stop Cheque'});
    this.StatusList.push({STATUS:'Cheque Return'});
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;

    http.get(this.original_url+"/Accounts/Payments/getChequeReco?token="+this.token).subscribe((res: any[])=> {
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.itemDisplay=res;
      this.accountHeadList=this.itemDisplay.Table1;
      this.isLoadingResults=false;
    });
    // this.service.getPaymentListForConfirmation(this.ServerIP,this.FYUSER, this.boid,'N').subscribe((res: any[])=> {
    // this.data=res;
    // this.itemDisplay=res;
    // this.itemDisplay=this.itemDisplay.Table;
    // this.fieldArray.data = this.itemDisplay;
    // console.log("Ved",this.fieldArray.data);
    // this.isLoadingResults=false;
    //  });

  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
 
  onChange(event, payment)
  {
  
    if(event.checked == true)
    {
      this.PaymentListToSave.push(payment);
    }
    else
    {
      this.PaymentListToSave.splice (this.PaymentListToSave.indexOf(payment),1);
    }
    console.log("this.other", this.PaymentListToSave);
  }
  Validate()
  {
    var IsOk:boolean;
    IsOk=true;
    var msg;
    debugger;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    for(var data of this.PaymentListToSave)
    {
       if(data.TRANSDATE>data.CHEQUECLEARDATE) 
       {
        IsOk=false; msg=msg+"<li>Cheque Clear Date Should be after Cheque Date.</li>";
       }
       if(data.CHEQUECLEARDATE==undefined ||data.CHEQUECLEARDATE=='') 
       {
        IsOk=false; msg=msg+"<li>Cheque Clear Date not entred.</li>";
       }
    }
    msg=msg+"</ul>";
     if(IsOk==false)
     {
      console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     } //alert(msg);
   return IsOk;
  }
  ValidateReeco()
  {
    var IsOk:boolean;
    IsOk=true;
    var msg;
    debugger;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    for(var data of this.PaymentListToSave)
    {
       
       if(data.STATUS==undefined ||data.STATUS=='') 
       {
        IsOk=false; msg=msg+"<li>Status not selected.</li>";
       }
    }
    msg=msg+"</ul>";
     if(IsOk==false)
     {
      console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     } //alert(msg);
   return IsOk;
  }
  UpDateChequeReco()
  {
    
    var paymentList : Array<any>=[];
    
    if(this.ValidateReeco())
    {
      debugger;
      this.isLoadingResults=true;  
            for(var data of this.PaymentListToSave)
            {
              var Payment:any={};
              Payment.ID=data.ID;
              Payment.STATUS=data.STATUS;
              paymentList.push(Payment);
            }
            console.log("mydata",paymentList);
            const params = new  HttpParams()
            .set('token', this.token)
            .set('recolist', JSON.stringify(paymentList));

            this.http.post(this.original_url+"/Accounts/Payments/UpdateChequeReco", params.toString(), {
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
                  this.itemDisplay=res;
                  this.itemDisplay=this.itemDisplay.Table;
                  this.fieldArray.data = this.itemDisplay;
                  this.PaymentListToSave=[];
                  this.itemDisplay=res;
                  this.accountHeadList=this.itemDisplay.Table1;
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
  ConfimPayments()
  {
    
    var paymentList : Array<any>=[];
    let flag:any;
    flag="Y";
    if(this.Validate())
    {
      debugger;
      this.isLoadingResults=true;  
            for(var data of this.PaymentListToSave)
            {
              var Payment:any={};
              Payment.ID=data.ID;
              Payment.BANKACID=data.BANKACID;
              Payment.CHEQUECLEARDATE= this.datePipe.transform(data.CHEQUECLEARDATE, 'dd/MMM/yyyy');
              paymentList.push(Payment);
            }
            console.log("mydata",paymentList);
            const params = new  HttpParams()
         
            .set('token', this.token)
            .set('recolist', JSON.stringify(paymentList));

            this.http.post(this.original_url+"/Accounts/Payments/saveChequeReco", params.toString(), {
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
              this.itemDisplay=res;
              this.itemDisplay=this.itemDisplay.Table;
              this.fieldArray.data = this.itemDisplay;
              this.PaymentListToSave=[];
              this.itemDisplay=res;
              this.accountHeadList=this.itemDisplay.Table1;
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
    // this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, paymentList, flag).subscribe((res: any[])=> {
    //   this.data=res;
    //   this.itemDisplay=res;
    //   this.itemDisplay=this.itemDisplay.Table;
    //   this.fieldArray.data = this.itemDisplay;
    //   console.log("Ved",this.fieldArray.data);
      
   //    });
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
