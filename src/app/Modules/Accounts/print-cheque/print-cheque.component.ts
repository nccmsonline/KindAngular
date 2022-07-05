import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../statement-account/account-statement/account-statement.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-print-cheque',
  templateUrl: './print-cheque.component.html',
  styleUrls: ['./print-cheque.component.css']
})
export class PrintChequeComponent implements OnInit {

  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  userid:any;PaymentListToSave : Array<any>=[];
  PaymentDetail: Array<any> = [];
  fieldArray = new MatTableDataSource<any>();accountHeadList:any=[];StatusList:any=[];
  displayedColumns: string[] = [ 'TRANSDATE','CHEQUENO','NAME','NAMEONCHEQUE','BANKACID','TRANAMT', 'ACTION'];
  data:any;FYUSER:any;ServerIP:any;token:any;
  itemDisplay: any;
  constructor(private router: Router,public dialog: MatDialog,private http:HttpClient) {
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
          http.get(this.original_url+"/Accounts/Payments/getChequePrintList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid+"&userid="+this.userid+"&token="+this.token).subscribe((res: any[])=> {
          this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay.Table;
          this.fieldArray.data = this.itemDisplay;
          // this.itemDisplay=res;
          // this.accountHeadList=this.itemDisplay.Table1;
        
          this.isLoadingResults=false;
    console.log("res",res);
    });
   

  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
 

  printChque(data)
  {
    let nameonCheque:any;
    if(data.NAMEONCHEQUE==''||data.NAMEONCHEQUE==undefined)
    {
      nameonCheque=data.NAME;
    }
    else
    {
      nameonCheque=data.NAMEONCHEQUE;
    }
    var chequeprint:any={};
    chequeprint={
    name:nameonCheque,
    amountInWords:data.TRANAMTINWORD,
    amount:data.TRANAMT,
    BANKACNO:data.BANKACNO,
    IFSC:data.IFSC,
    BANKNAME:data.BANKNAME,
    CHEQUEORNEFT:data.CHEQUEORNEFT,
    dated:  this.datePipe.transform(data.TRANSDATE, 'dd-MM-yyyy')};
    sessionStorage.setItem('chequeprint', JSON.stringify(chequeprint));
    this.router.navigate(['/print-cheque-view'], {skipLocationChange:true});
   
  }


  openDialog(data): void {
    const dialogRef = this.dialog.open(EditChequeComponent, {
     // width: '600px',
      data: {data: data}
    });
  
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed1', result);
    debugger;
    if(result!='Ravinder' && result!="")
    {
      this.itemDisplay=result;
          this.itemDisplay=this.itemDisplay.Table;
          this.fieldArray.data = this.itemDisplay;
    }
    
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


@Component({
  selector: 'my-print-cheque',
  templateUrl: './my-print-cheque.html',
  styleUrls: ['./print-cheque.component.css']
})
export class PrintChequeReportComponent implements OnInit {
   name:any;amountinword:any;amount:any;day1:any;day2:any;month1:any;month2:any;year1:any;year2:any;year3:any;year4:any;
   rowdata:any;dated:string;CHEQUEORNEFT:any;
  constructor(private router: Router, public dialog: MatDialog) {
    let chequeprint = sessionStorage.getItem("chequeprint");
    var data = JSON.parse(chequeprint);

    
    this.amountinword=data['amountInWords'];
    this.amount = data['amount'];
    this.rowdata=data['rowdata'];
    this.dated=data['dated'];
    this.CHEQUEORNEFT=data['CHEQUEORNEFT'];
    if(this.CHEQUEORNEFT=='Neft')
    {
      this.name="Your Self NEFT";
    }
    else
    {
      this.name=data['name'];
    }
    this.day1=this.dated.substr(0,1);
    this.day2=this.dated.substr(1,1);
    this.month1=this.dated.substr(3,1);
    this.month2=this.dated.substr(4,1);
    this.year1=this.dated.substr(6,1);
    this.year2=this.dated.substr(7,1);
    this.year3=this.dated.substr(8,1);
    this.year4=this.dated.substr(9,1);

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
  if(this.CHEQUEORNEFT=='Neft')
  {
    this.router.navigate(['/print-single-neft'], {skipLocationChange:true});
  }
  else
  {
    this.router.navigate(['/print-cheque'], {skipLocationChange:true});
  }
 
}
 
}
@Component({
  selector: 'print-single-neft',
  templateUrl: './print-single-neft.html',
  styleUrls: ['./print-cheque.component.css']
})
export class PrintSinghNeftComponent implements OnInit {
   name:any;bankacno:any;amount:any;day1:any;day2:any;month1:any;month2:any;year1:any;year2:any;year3:any;year4:any;
   IFSC:any;dated:string;bankname:any;
  constructor(private router: Router, public dialog: MatDialog) {
    let chequeprint = sessionStorage.getItem("chequeprint");
    var data = JSON.parse(chequeprint);
    this.name=data['name'];
    this.bankacno=data['BANKACNO'];
    this.amount = data['amount'];
    this.IFSC=data['IFSC'];
    this.dated=data['dated'];
    this.bankname=data['BANKNAME'];
    this.day1=this.dated.substr(0,1);
    this.day2=this.dated.substr(1,1);
    this.month1=this.dated.substr(3,1);
    this.month2=this.dated.substr(4,1);
    this.year1=this.dated.substr(6,1);
    this.year2=this.dated.substr(7,1);
    this.year3=this.dated.substr(8,1);
    this.year4=this.dated.substr(9,1);

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
  this.router.navigate(['/print-cheque'], {skipLocationChange:true});
}
 
}
// getBankList
@Component({
  selector: 'edit-cheque',
  templateUrl: './edit-cheque.html',
  styleUrls: ['./print-cheque.component.css']
})
export class EditChequeComponent implements OnInit {
  newData:any={};pData:any={};datePipe = new DatePipe("en-US");
   name:any;amountinword:any;amount:any;day1:any;day2:any;month1:any;month2:any;year1:any;year2:any;year3:any;year4:any;
   original_url=environment.baseUrl; boid : any;isCEO:any;
   userid:any;  isLoadingResults:any;FYUSER:any;ServerIP:any;iseditable:boolean=true;
   accountHeadList:any=[];  bankList:any=[]; itemDisplay:any;token:any;
   paymentMode: Array<any>=[];
  constructor(private http:HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public dialogRef: MatDialogRef<EditChequeComponent>) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.isCEO= currentUser['ISCEO'];
    
    if(this.isCEO=="Y")
    {
      this.iseditable=false;
    }
    this.paymentMode.push({id:'C',description:'Cheque'}) ;
    this.paymentMode.push({id:'N',description:'NEFT'}) ;
    this.pData=data.data;
    this.newData.NAME=this.pData.NAME;
    this.newData.CHEQUENO=this.pData.CHEQUENO;
    this.newData.TRANSDATE=this.pData.TRANSDATE;
    this.newData.BANKACID=this.pData.BANKACID;
    this.newData.ID=this.pData.ID;
    this.newData.NAMEONCHEQUE=this.pData.NAMEONCHEQUE;
    this.newData.IFSC=this.pData.IFSC;
    this.newData.BANKACNO=this.pData.BANKACNO;
    this.newData.BANKID=this.pData.BANKID;
    debugger;
    this.newData.CHEQUENEFT=this.pData.CHEQUENEFT;

    this.isLoadingResults=true;

    http.get(this.original_url+"/Accounts/Accounts/getBankList?token="+this.token).subscribe((res: any[])=> {
      this.itemDisplay=res;
      this.accountHeadList=this.itemDisplay.Table;
      this.bankList=this.itemDisplay.Table1;
      this.isLoadingResults=false;
    });

   }
  ngOnInit() {
  
  }
   amendCheque()
   {
    this.newData.TRANSDATE=this.datePipe.transform(this.newData.TRANSDATE, 'dd-MMM-yyyy');
    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('userid', this.userid)
    .set('token', this.token)
    .set('recolist', JSON.stringify(this.newData));

    this.http.post(this.original_url+"/Accounts/Payments/amendChequeDetail", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
    this.isLoadingResults=false;
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
      this.itemDisplay=res;
      // this.itemDisplay=this.itemDisplay.Table;
      this.isLoadingResults=false;  
      this.dialogRef.close(res);
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