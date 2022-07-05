import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../statement-account/account-statement/account-statement.component';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-neft-format',
  templateUrl: './neft-format.component.html',
  styleUrls: ['./neft-format.component.css']
})
export class NeftFormatComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;accountHeadList:any=[];bankList:any=[];
  userid:any;PaymentListToSave : Array<any>=[];
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'DATED','NEFTAMT', 'FROMAMT','UPTOAMT','PERCENTAGE','NAME','ACCOUNT','CHEQUENO','CHEQUECLEARDATE','ACTION','ACTION1'];
  data:any;FYUSER:any;ServerIP:any;token:any;
  itemDisplay: any;
  constructor(public dialog: MatDialog,private http:HttpClient, private router: Router) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
  
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    // this.service.getPaymentListForConfirmation(this.ServerIP,this.FYUSER, this.boid,'N').subscribe((res: any[])=> {
    // this.data=res;
    // this.itemDisplay=res;
    // this.itemDisplay=this.itemDisplay.Table;
    // this.fieldArray.data = this.itemDisplay;
    // console.log("Ved",this.fieldArray.data);
    //  this.isLoadingResults=false;
    //  });

    http.get(this.original_url+"/Accounts/Payments/getSalaryNEFT?token="+this.token).subscribe((res)=> {

      if(res=="Ravinder")
      {
        this.ShowMessageDialog("wrongData","Some thing went Wrong");
      }
      else
      {
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.fieldArray.data = this.itemDisplay;
        this.itemDisplay=res;
        this.accountHeadList=this.itemDisplay.Table1;
        this.bankList= this.itemDisplay.Table2;
      }
      this.isLoadingResults=false;
      console.log("res",res);
});

  }
  ShowMessageDialog(msgtype, textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: msgtype,
        displayMsg:textmsg
      }
    });
  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  showExsitingNEFT(row)
  {
    this.router.navigate(['/new-salary-neft-format/'+row.ID+'/edit/'+row.FROMAMT+'/'+row.UPTOAMT+'/'+row.PERCENTAGE], {skipLocationChange:true});
  }
  ConfimPayments(data)
  {
    if(this.Validate(data))
    {
      const params = new  HttpParams()
    
      .set('token', this.token)
      .set('BankAcId', data.BANKACID)
      .set('ChequeNo',data.CHEQUENO)
      .set('ChequeClearingDate',this.datePipe.transform(data.CHEQUECLEARDATE, 'dd/MMM/yyyy'))
      .set('neftid', data.ID);
      debugger;
      this.http.get(this.original_url+"/Accounts/Payments/UpdateSalaryNEFTDetail", {params})
      .subscribe((res) =>{

        if(res=="Ravinder")
        {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'wrongData',
              displayMsg:'Somthing went wrong'
            }
          });
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
      }
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
  }

  Validate(data)
  {
    var IsOk:boolean;
    IsOk=true;
    var msg;
    debugger;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';

       if(data.TRANSDATE>data.CHEQUECLEARDATE) 
       {
        IsOk=false; msg=msg+"<li>Neft Clear Date Should be after Cheque Date.</li>";
       }
       if(data.CHEQUECLEARDATE==null ||data.CHEQUECLEARDATE=='') 
       {
        IsOk=false; msg=msg+"<li>Neft Clear Date not entred.</li>";
       }
       if(data.CHEQUENO==null ||data.CHEQUENO=='') 
       {
        IsOk=false; msg=msg+"<li>Cheque No. not entred.</li>";
       }
      if(data.BANKACID==undefined ||data.BANKACID==0||data.BANKACID=='') 
      {
      IsOk=false; msg=msg+"<li>Please select bank accountid.</li>";
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

  // openDialog(row:PaymentConfirmation) {
  //   const dialogRef = this.dialog.open(AccountStatementComponent, {
  //       data: {
  //         AccountId:row.ACCOUNTID,
  //         FromDate:this.fstartDate,
  //         ToDate:this.fendDate 
  //       }
  //     });
  
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //     });
  //}
  PrintNeft(data)
  {
    let paymentList : Array<any>=[];

    if(data.BANKNAME==undefined  || data.BANKNAME=='')
    {
      this.WrongDetailDialog("Bank Name not selected");
    }
    else
    {
    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('bankname', data.BANKNAME)
    .set('pflag','S')
    .set('userid', this.userid)
    .set('token', this.token)
    .set('neftid', data.ID);
    debugger;
    this.http.get(this.original_url+"/Accounts/Payments/printNeftDetial", {params})
    .subscribe((res) =>{
    // this.http.get(this.original_url+"/Accounts/Payments/printNeftDetial?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ 
    //             this.boid+"&bankname="+data.BANKNAME+"&pflag='S'&neftid="+data.ID).subscribe((res: any[])=> {
      this.isLoadingResults=false;
      if(res=="Ravinder")
      {
        this.ShowMessageDialog("wrongData","Some thing went Wrong");
      }
      else
      {
       sessionStorage.setItem('neftPrintfilter', JSON.stringify(res));
       this.router.navigate(['/print-neft-format/salary-neft-format'], {skipLocationChange:true});
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
 
  WrongDetailDialog(textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:textmsg
      }
    });
  }
}