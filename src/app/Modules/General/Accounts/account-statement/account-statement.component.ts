import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {
  
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;fstartDate:any;fendDate:any;PartyName:any;
  accountStatement : Array<any>=[];accountid:any;acount: Array<any>=[];openingDrCr:any;ClosingDrCr:any;
  YearOpeningBalance:number; ClosingBalance:number;
  constructor(    public dialogRef: MatDialogRef<AccountStatementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private http:HttpClient,
    @Inject('BASE_URL') private original_url : string) { 
      
      var datePipe = new DatePipe("en-US");
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      this.fstartDate=data.FromDate; // datePipe.transform(CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy') ;
      this.fendDate= data.ToDate //datePipe.transform(CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
      this.accountid=data.AccountId;
      
        
      //value = datePipe.transform(value, 'dd/MM/yyyy');
      console.log("1",CompanyData);
      console.log("2",this.fstartDate);

      this.getAccountStatements(this.ServerIP,this.FYUSER, this.boid,this.fstartDate,this.fendDate,this.accountid).subscribe((res: any[])=> {
        this.data=res;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        var i:Number;
        i=1;
      
        for(let data of this.itemDisplay)
        {
          var runBalance: any;
          this.PartyName=data.NAME;
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
        console.log("ravi",this.ClosingBalance);
         });
    }

  ngOnInit() {
  }

  getAccountStatements(ServerIP, FYUSER,boid,  fromDate, toDate, accountids)
  {
    return this.http.get(this.original_url+"/Accounts/Accounts/getAccountStatements?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&fromDate="+fromDate+"&toDate="+toDate+"&accountids="+accountids).pipe(map((res : any[])=>{
      console.log("res",res);
      return res;
    }));
  }
  
}
