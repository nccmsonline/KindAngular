import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-rtgs-clearance',
  templateUrl: './rtgs-clearance.component.html',
  styleUrls: ['./rtgs-clearance.component.css']
})
export class RTGSClearanceComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  userid:any;NeftColumnListToSave : Array<any>=[];
  PaymentDetail: Array<any> = [];
  fieldArray = new MatTableDataSource<any>();accountHeadList:any=[];bankList:any=[];
  displayedColumns: string[] = [ 'TRANSDATE','NAME','BANKACNO','IFSC','TRANAMT','PASSEDAMT','CHEQUENO','DATED'];
  data:any;FYUSER:any;ServerIP:any;token:any;
  itemDisplay: any;BANKACID:any;BANKNAME:any;
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
          this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
          this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;
          http.get(this.original_url+"/Accounts/Payments/getNEFTList?token="+this.token).subscribe((res)=> {
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
 
  PrintNeft()
  {
    let paymentList : Array<any>=[];
    if( this.NeftValidate())
    {
      var ids='0'
      for(var data of this.NeftColumnListToSave)
      {
        var Payment:any={};
        Payment.ID=data.ID;
        Payment.PASSEDAMT=data.PASSEDAMT;
        Payment.CHEQUENO=data.CHEQUENO;
        Payment.BANKACNO=data.BANKACNO;
        Payment.IFSC=data.IFSC;
        ids=ids+", "+ data.ID;
        paymentList.push(Payment);
      }

    const params = new  HttpParams()
   
    .set('bankname', this.BANKNAME)
    .set('userid', this.userid)
    .set('token', this.token)
    .set('neftColList',JSON.stringify(paymentList))
    .set('ids', ids);
    debugger;
    this.http.get(this.original_url+"/Accounts/Payments/printNeftDetial", {params})
    .subscribe((res) => {
      this.isLoadingResults=false;
      if(res=="Ravinder")
      {
          this.ShowMessageDialog("wrongData","Some thing went Wrong");
      }
      else
      {
            console.log("res1",res);
            this.isLoadingResults=false
            sessionStorage.setItem('neftPrintfilter', JSON.stringify(res));
            this.router.navigate(['/print-neft-format/rtgs-clearing'], {skipLocationChange:true});
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
   
  
  onChange(event, payment)
  {
    //this.RateListToSave.splice (this.RateListToSave.indexOf(payment),1);
   // payment.PASSEDAMT=0;
  if(event.checked == true)
    {
      payment.PASSEDAMT=payment.TRANAMT;
    this.NeftColumnListToSave.push(payment);
    }
    else
    {
      payment.PASSEDAMT=0;
      this.NeftColumnListToSave.splice (this.NeftColumnListToSave.indexOf(payment),1);
    }
    console.log("this.other", this.NeftColumnListToSave);
  }
  onDataChange(payment)
  {
      if ( payment.PASSEDAMT>payment.TRANAMT) 
      {
        this.WrongDetailDialog("Can't pass more the requested Amount.");
        payment.PASSEDAMT=payment.TRANAMT;
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
  NeftValidate()
  {
    var IsOk:boolean;
    IsOk=true;
    var msg;
    debugger;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    for(var data of this.NeftColumnListToSave)
    {
       if(data.BANKACNO==''||data.BANKACNO==undefined) 
       {
        IsOk=false; msg=msg+"<li>Bank Account not entred for " + data.NAME +" </li>";
       }
       if(data.IFSC==undefined ||data.IFSC=='') 
       {
        IsOk=false; msg=msg+"<li>Bank IFSC not entred for " + data.NAME +" </li>";
       }
       if(data.PASSEDAMT==undefined ||data.PASSEDAMT=='') 
       {
        IsOk=false; msg=msg+"<li>Neft Amount not entred for " + data.NAME +" </li>";
       }
    }
    if(this.BANKNAME==undefined ||this.BANKNAME=='') 
    {
     IsOk=false; msg=msg+"<li>Please select bank Master.</li>";
    }
    if( this.NeftColumnListToSave.length<=0)
    {
      IsOk=false; msg=msg+"<li>Please select bank Master.</li>";
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

  Validate()
  {
    var IsOk:boolean;
    IsOk=true;
    var msg;
    debugger;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    for(var data of this.NeftColumnListToSave)
    {
       if(data.TRANSDATE>data.CHEQUECLEARDATE) 
       {
        IsOk=false; msg=msg+"<li>Neft Clear Date Should be after Cheque Date.</li>";
       }
       if(data.CHEQUECLEARDATE==null ||data.CHEQUECLEARDATE=='') 
       {
        IsOk=false; msg=msg+"<li>Neft Clear Date not entred.</li>";
       }
    }
    if(this.BANKACID==undefined ||this.BANKACID==0||this.BANKACID=='') 
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

  confirmNeft()
  {
    let paymentList : Array<any>=[];
   if( this.NeftColumnListToSave.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else if(this.Validate())
   {
    this.isLoadingResults=true;
    for(var data of this.NeftColumnListToSave)
    {
      var Payment:any={};
      Payment.ID=data.ID;
      Payment.PASSEDAMT=data.PASSEDAMT;
      Payment.CHEQUENO=data.CHEQUENO;
      Payment.BANKACID=this.BANKACID;
      Payment.BANKACNO=data.BANKACNO;
      Payment.IFSC=data.IFSC;

      debugger;
      if(data.CHEQUECLEARDATE!=''&&data.CHEQUECLEARDATE!=null)
      {
        Payment.CHEQUECLEARDATE= this.datePipe.transform(data.CHEQUECLEARDATE, 'dd/MMM/yyyy');
      }
      
      paymentList.push(Payment);
    }


    const params = new  HttpParams()
     .set('token', this.token)
    .set('flag', 'C')
    .set('recolist', JSON.stringify(paymentList));
    this.http.post(this.original_url+"/Accounts/Payments/UpdateNEFTDetail", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      this.isLoadingResults=false;
      if(res=='ravinder')
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
     console.log("res",res);
     this.itemDisplay=res;
     this.itemDisplay=this.itemDisplay.Table;
     this.fieldArray.data = this.itemDisplay;
     this.NeftColumnListToSave=[];
    this.isLoadingResults=false
    }
     ;
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

  saveData()
  {
    let paymentList : Array<any>=[];
   if( this.NeftColumnListToSave.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else
   {
    this.isLoadingResults=true;
    for(var data of this.NeftColumnListToSave)
    {
      var Payment:any={};
      Payment.ID=data.ID;
      Payment.PASSEDAMT=data.PASSEDAMT;
      Payment.CHEQUENO=data.CHEQUENO;
      Payment.BANKACNO=data.BANKACNO;
      Payment.IFSC=data.IFSC;
      debugger;
      if(data.CHEQUECLEARDATE!=''&&data.CHEQUECLEARDATE!=null)
      {
        Payment.CHEQUECLEARDATE= this.datePipe.transform(data.CHEQUECLEARDATE, 'dd/MMM/yyyy');
      }
      paymentList.push(Payment);
    }
    const params = new  HttpParams()
   
    .set('token', this.token)
    .set('flag', 'S')
    .set('recolist', JSON.stringify(paymentList));
    this.http.post(this.original_url+"/Accounts/Payments/UpdateNEFTDetail", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      this.isLoadingResults=false;
      if(res=='ravinder')
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
     console.log("res",res);
     this.itemDisplay=res;
     this.itemDisplay=this.itemDisplay.Table;
     this.fieldArray.data = this.itemDisplay;
     this.NeftColumnListToSave=[];
    this.isLoadingResults=false
    }
     ;
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
}

