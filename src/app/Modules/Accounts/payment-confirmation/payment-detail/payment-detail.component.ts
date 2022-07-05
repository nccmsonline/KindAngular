import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {
  original_url=environment.baseUrl;
 
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;fstartDate:any;fendDate:any;PartyName:any;
  listPassedPayment : Array<any>=[];accountid:any;acount: Array<any>=[];userid:any;token:any; 
  listCheque : Array<any>=[];
  constructor(    public dialogRef: MatDialogRef<PaymentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private http:HttpClient,
    ) { 
      
      var datePipe = new DatePipe("en-US");
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      this.fstartDate=data.FromDate; // datePipe.transform(CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy') ;
      this.fendDate= data.ToDate //datePipe.transform(CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
      this.accountid=data.AccountId;
      this.PartyName=data.Name;
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
    
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
      //value = datePipe.transform(value, 'dd/MM/yyyy');
      console.log("1",CompanyData);
      console.log("2",this.fstartDate);

      this.getAccountStatements(this.ServerIP,this.FYUSER, this.boid,this.accountid).subscribe((res: any[])=> {
        this.itemDisplay=res;
        this.listPassedPayment=this.itemDisplay.Table;
        this.itemDisplay=res;
        this.listCheque=this.itemDisplay.Table1;
      
      console.log(this.listPassedPayment);
         });
    }

  ngOnInit() {
  }

  getAccountStatements(ServerIP, FYUSER,boid,  accountids)
  {
    return this.http.get(this.original_url+"/Accounts/Payments/getMoreDetailForParty?accountids="+accountids+"&userid="+this.userid+"&token="+this.token).pipe(map((res : any[])=>{
      console.log("res",res);
      return res;
    }));
  }
  
}
