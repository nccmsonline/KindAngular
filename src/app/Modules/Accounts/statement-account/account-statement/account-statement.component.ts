import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {
  original_url=environment.baseUrl;
  listPassedPayment : Array<any>=[]; listCheque : Array<any>=[];isCheques=false;isPayments=false;
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;fstartDate:any;fendDate:any;PartyName:any;
  accountStatement : Array<any>=[];accountid:any;acount: Array<any>=[];openingDrCr:any;ClosingDrCr:any;companyName:any;
  YearOpeningBalance:number; ClosingBalance:number;userid:any;token:any;
  totalDr:any;totalCr:any;
  constructor(    public dialogRef: MatDialogRef<AccountStatementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private http:HttpClient) { 
      
      var datePipe = new DatePipe("en-US");
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.companyName=CompanyData['COMPANYNAME'];

      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      // let stacc = sessionStorage.getItem("accst");
      this.fstartDate= data.FromDate; // datePipe.transform(CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy') ;
      this.fendDate= data.ToDate //datePipe.transform(CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
      this.accountid=data.AccountId;
      // this.fstartDate= stacc['FromDate'];
      // this.fendDate= stacc['ToDate']; 
      // this.accountid=stacc['AccountId'];

      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];

      //value = datePipe.transform(value, 'dd/MM/yyyy');
      console.log("1",CompanyData);
      console.log("2",this.fstartDate);

      this.getAccountStatements(this.ServerIP,this.FYUSER, this.boid,this.fstartDate,this.fendDate,this.accountid).subscribe((res: any[])=> {
        this.data=res;
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
        console.log("listPassedPayment",this.listPassedPayment);
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        var i:Number;
        i=1;
        this.totalDr=0;this.totalCr=0;

        for(let data of this.itemDisplay)
        {
          var runBalance: any;
          this.PartyName=data.NAME;
          if(data.BALANCE>0)
            {runBalance = parseFloat(data.BALANCE).toFixed(2) +"Dr";}
          else if(data.BALANCE<0)
            {runBalance = (data.BALANCE*-1).toFixed(2) +"Cr";}
          else
            {runBalance="-";}
          this.totalDr  =parseFloat( this.totalDr)+parseFloat(data.DRAMT);
          this.totalCr  =parseFloat( this.totalCr)+parseFloat(data.CRAMT);
          this.YearOpeningBalance=data.YEAROPENINGBALANCE+data.OPENBALANCE;
          this.ClosingBalance=data.BALANCE;
          this.accountStatement.push({VOUCHERDATE:data.VOUCHERDATE,VOUCHERNO:data.VOUCHERTYPE+data.VOUCHERNO,DESCRIPTION:data.DESCRIPTION,DRAMT:data.DRAMT,CRAMT:data.CRAMT,BALANCE:runBalance});
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
        console.log("ravi",this.ClosingBalance);

        
         });
    }

  ngOnInit() {
  }
  public print(): void 
  { 
    
    let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
    virtualWindow.document.write('<html><head><title>Print</title>  '); 
    virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
    virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
    virtualWindow.document.write('<style type="text/css">table {border-spacing: 0 10px !important;} body {  line-height: 1.5; display: block; font-size: 1.2em; }  div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%;   bottom: 30px;} @page { /* switch to landscape */  /* set page margins */ margin: 1cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}</style>');
    //font: 12pt Georgia, "Times New Roman", Times, serif;
    virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
    
    virtualWindow.document.close(); 
    virtualWindow.focus(); 
        // necessary for IE >= 10 
    setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  }
  getAccountStatements(ServerIP, FYUSER,boid,  fromDate, toDate, accountids)
  {
    return this.http.get(this.original_url+"/Accounts/Accounts/getAccountStatements?fromDate="+fromDate+"&toDate="+toDate+"&accountids="+accountids+"&userid="+this.userid+"&token="+this.token).pipe(map((res : any[])=>{
      console.log("res",res);
      return res;
    }));
  }
  
}
