import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog,  MatSort, MatTableDataSource,MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../account-statement/account-statement.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-print-cheque',
  templateUrl: './print-cheque.component.html',
  styleUrls: ['./print-cheque.component.css']
})
export class PrintChequeComponent implements OnInit {

  original_url=environment.baseUrl;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  userid:any;PaymentListToSave : Array<any>=[];
  PaymentDetail: Array<any> = [];
  fieldArray = new MatTableDataSource<any>();accountHeadList:any=[];StatusList:any=[];
  displayedColumns: string[] = [ 'TRANSDATE','CHEQUENO','NAME','NAMEONCHEQUE','BANKACID','TRANAMT', 'ACTION'];
  data:any;FYUSER:any;ServerIP:any;
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
          this.StatusList.push({STATUS:'Not Present'});
          this.StatusList.push({STATUS:'Stop Cheque'});
          this.StatusList.push({STATUS:'Cheque Return'});
          this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
          this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;
          http.get(this.original_url+"/Accounts/Payments/getChequePrintList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid).subscribe((res: any[])=> {
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
    var chequeprint:any={};
    chequeprint={
    name:data.NAME,
    amountInWords:data.TRANAMTINWORD,
    amount:data.TRANAMT,
    dated:  this.datePipe.transform(data.TRANSDATE, 'dd-MM-yyyy')};
    sessionStorage.setItem('chequeprint', JSON.stringify(chequeprint));
    this.router.navigate(['/print-cheque-view']);
  }


  openDialog(data): void {
    const dialogRef = this.dialog.open(EditChequeComponent, {
     // width: '600px',
      data: {data: data}
    });
  
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed1', result);
    if(result!='Ravinder')
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
   rowdata:any;dated:string;
  constructor(public dialog: MatDialog) {
    let chequeprint = sessionStorage.getItem("chequeprint");
    var data = JSON.parse(chequeprint);
    this.name=data['name'];
    this.amountinword=data['amountInWords'];
    this.amount = data['amount'];
    this.rowdata=data['rowdata'];
    this.dated=data['dated'];
    debugger;
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
   original_url=environment.baseUrl; boid : any;
   userid:any;  isLoadingResults:any;FYUSER:any;ServerIP:any;
   accountHeadList:any=[]; itemDisplay:any;
  constructor(private http:HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public dialogRef: MatDialogRef<EditChequeComponent>) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.pData=data.data;
    this.newData.NAME=this.pData.NAME;
    this.newData.CHEQUENO=this.pData.CHEQUENO;
    this.newData.TRANSDATE=this.pData.TRANSDATE;
    this.newData.BANKACID=this.pData.BANKACID;
    this.newData.ID=this.pData.ID;
    this.isLoadingResults=true;
    http.get(this.original_url+"/Accounts/Accounts/getBankList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid).subscribe((res: any[])=> {
      this.itemDisplay=res;
      this.accountHeadList=this.itemDisplay.Table;
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