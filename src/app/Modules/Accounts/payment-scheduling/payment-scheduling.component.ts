import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { AccountStatementComponent } from '../statement-account/account-statement/account-statement.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentConfirmationService } from '../payment-confirmation/payment-confirmation.service';
import { DatePipe } from '@angular/common';
import { PaymentChart1Component } from '../payment-chart1/payment-chart1.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaymentDetailComponent} from '../payment-confirmation/payment-detail/payment-detail.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-payment-scheduling',
  templateUrl: './payment-scheduling.component.html',
  styleUrls: ['./payment-scheduling.component.css']
})
export class PaymentSchedulingComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;newItem:any={};paymentlist:Array<any>=[];
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any; IsCEO:any;
  paymentMode: Array<any>=[];TotalAmt:any;
  myDate = new Date();editItemID:any;
  userid:any;PaymentListToSave : Array<any>=[];accountHeadList:any=[];
  PaymentDetail: PaymentDetail[] = [];isLoadingResults:boolean;
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'REQNO','MORE','REQDATE','NAME','MANAGEMENTNOTES','PASSEDAMT','BALANCEAMT','PAYMENTMODE','ISSUEDAMT'];
  displayedColumnsNew: string[] = [ 'PASS','DEL','REQNO','REQDATE','NAME','BALANCEAMT','MANAGEMENTNOTES'];
  data:any;FYUSER:any;ServerIP:any;token:any; 
  itemDisplay: any;
  constructor(public dialog: MatDialog,private http: HttpClient,private service:PaymentConfirmationService) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.myDate = CompanyData['SEVERDATE'];
    
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
  
  this.token = currentUser['TOKEN'];
  this.userid = currentUser['USERID'];
  
   

     this.http.get(this.original_url+"/Accounts/Payments/PaymentSchedulingList?token="+this.token).subscribe((res)=>{
      if(res=="Ravinder")
      {
        this.ShowMessageDialog("wrongData","Some thing went Wrong, Please login again or Connect to System Admin");
      }
      else if(res=="Ravinder1")
      {
      
      }
      else
      {
          this.data=res;
          this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay;
          this.fieldArray.data = this.itemDisplay;
          // this.itemDisplay=res;
          // this.accountHeadList=this.itemDisplay.Table1;
          this.http.get(this.original_url+"/Accounts/Accounts/getBankList?token="+this.token).subscribe((res)=>{
          if(res=="Ravinder")
          {
            this.ShowMessageDialog("wrongData","Some thing went Wrong");
          }
          else
          {
              this.itemDisplay=res;
              this.accountHeadList=this.itemDisplay.Table;
            console.log("res",res);
          }
          });
        console.log("res",res);
      }
        this.isLoadingResults=false;
      });

  }
  amountChnage(data)
  {
    console.log("jhjhj",data);
    data.TRANSDATE='';
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
   this.paymentMode.push({id:'C',description:'Cheque'}) ;
   this.paymentMode.push({id:'N',description:'NEFT'}) ;
   this.paymentMode.push({id:'O',description:'Cash'}) ;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  onDataChange(payment)
  {
      if ( payment.ISSUEDAMT>payment.BALANCEAMT) 
      {
        this.WrongDetailDialog("Can't Issue more the passed Amount.");
        payment.ISSUEDAMT=payment.PASSEDAMT;
      }
      if(payment.PAYMENTMODE==null||payment.PAYMENTMODE=='undefined') 
       payment.PAYMENTMODE="C";

      console.log("payment",payment);
  }
  onCkhChange(event, data)
  {
    data.PAYMENTMODE="C";
    if(event.checked == true)
    {
     data.delete=false;
    }
    if(this.boid=="2")
    {
      data.ACCOUNTID=1741;
      data.ACCOUNTHEAD= "CAPITAL SMALL FINANCE BANK LTD A/C NO.076105000063";
    }
  }
  onDelete(event, data)
  {
    if(event.checked == true)
    {
      data.checked=false;
    }
  }
  // ConfimPayments()
  // {
  //   var valide:boolean;
  //   valide=true;
  //   for(let data of this.PaymentListToSave)
  //   {
  //     if(data.ISSUEDAMT=='undined'||data.ISSUEDAMT==null||data.ISSUEDAMT==''||data.ISSUEDAMT==0)
  //     {
  //       valide=false;
  //     }
  //   }
  //   if(valide==true) 
  //   {
  //    this.saveConfirmation();
  //   //  this.WrongDetailDialog("thanks");
  //   }
  //   else
  //   {
  //     this.WrongDetailDialog("Payment or Payment date not entred.");

  //   }
  // }
// saveConfirmation()
// {
//   let paymentList : Array<any>=[];
//     let flag:any;
//     flag="P1";
//     var abc:boolean;
//     abc=false;
//     for(let data of this.PaymentListToSave)
//     {
//       let Payment:any={};
//       Payment.REQID=data.REQID;
//       Payment.ISSUEDAMT=data.ISSUEDAMT;
//       Payment.PAYMENTMODE=data.PAYMENTMODE;
//       Payment.PAYMENTDATE=this.datePipe.transform( this.myDate, 'dd/MMM/yyyy')  ;
//       if(data.PAYMENTMODE=="O")
//       {
//         paymentList.push(Payment);
//       }
//       else
//       {
//         abc=true;
//         const dialogRef = this.dialog.open(SuccessDialogComponent, {
//           data: {
//             wrongData: 'validation',
//             displayMsg:'You cannot pass Cheque or Neft for '+data.NAME
//           }
//         });
//       }
//     }
//     if(abc==false)
//     {
//     console.log("mydata",paymentList);
//     this.isLoadingResults=true;
//     this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, paymentList, flag).subscribe((res: any[])=> {
//       this.data=res;
//       this.itemDisplay=res;
//       this.itemDisplay=this.itemDisplay.Table;
//       this.fieldArray.data = this.itemDisplay;
//       this.isLoadingResults=false;
//       this.PaymentListToSave=[];
//       const dialogRef = this.dialog.open(SuccessDialogComponent, {
//         data: {
//           wrongData: 'sucess',
//           displayMsg:'Sucess'
//         }
//       });

//      // console.log("Ved",this.fieldArray.data);
      
//        });
//     }
// }

openMoreDialog(row:any) {
  console.log("row",row);
  const dialogRef = this.dialog.open(PaymentDetailComponent, {
      data: {
        AccountId:row.ACCOUNTID,
        FromDate:this.fstartDate,
        ToDate:this.fendDate ,
        Name:row.NAME
      }
    });
  }

  SaveSchedule(): void {
    var flag:boolean, msgBox:string;
    flag=true;
    var payment:Array<any>=[];
      this.isLoadingResults=true;
      var mReqId="0" 
      for(var row of this.fieldArray.data)
      {
          if(row.checked==true)
          {
              for(var el of  row.ScheduledList)
              {
                    var item:any={};
                    item.REQID=row.REQID;
                    item.PASSEDAMT=0;
                    item.MANAGEMENTNOTES='';
                    item.ISSUEDAMT=el.TRANAMT;
                    item.PAYMENTMODE=row.PAYMENTMODE;
                    item.PAYMENTDATE=el.TRANSDATE;
                    if( row.PAYMENTMODE!='O')
                    {
                      item.BANKACID=el.ACCOUNTID;
                    }
                    else{
                      item.BANKACID=0;
                    }
                    
                    item.CHEQUENO='.';
                    item.NAMEONCHEQUE=el.NAMEONCHEQUE;
                    payment.push(item);
              }
          }
          else if(row.delete==true)
          {
            mReqId=mReqId+", " + row.REQID;
          }
       }
       if( payment.length==0 )
       {
        var item:any={};
        item.REQID=0;
        item.PASSEDAMT=0;
        item.MANAGEMENTNOTES='';
        item.ISSUEDAMT=0;
        item.PAYMENTMODE='';
        item.PAYMENTDATE='';
        item.BANKACID=0;
        item.CHEQUENO='0';
        item.NAMEONCHEQUE='-';
        payment.push(item);
       }
      //  });
        console.log("Saved Data", payment);
        const params = new  HttpParams()
      
        .set('token', this.token)
        .set('flag', 'save')
        .set('ReqIds', mReqId)
        .set('list', JSON.stringify(payment));
        this.http.get(this.original_url+"/Accounts/Payments/PaymentSchedulingList?"+ params.toString())
        .subscribe((res) => {
         this.isLoadingResults=false;
         if(res=="Ravinder")
         {
          var erroremsg:any;
          erroremsg="Somthing went wrong, Please login again or Contact to Your System Admin";
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
           data: {
             wrongData: 'wrongData',
             displayMsg:erroremsg
           }
         });
         }
         else if(res=="Ravinder1")
         {
         
         }
         else
         {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess'
              }
            });
            this.data=res;
            this.itemDisplay=res;
            this.fieldArray.data = this.itemDisplay;
         }
          console.log("res",res);
          this.isLoadingResults=false;
        },
        error=>{
          var erroremsg:any;
          erroremsg=error.message;
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
           data: {
             wrongData: 'wrongData',
             displayMsg:erroremsg
           }
         });
         this.isLoadingResults=false;
        });
     
  }

  

  validateDetail( row)
  {
    var flag:boolean, msgBox:string;
    flag=true;
    //console.log("Row Data",data);

    var currDate=new Date();
    var selectedDate=new Date(row.TRANSDATE);
    selectedDate.setHours(selectedDate.getHours() + 23);

    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    if((row.ACCOUNTID==undefined || row.ACCOUNTID=='' ) && row.PAYMENTMODE!='O')
    {
      flag=false;
      msgBox=msgBox+"<li>Bank not selected."+'</li>';
    }
    // if((row.CHEQUENO=='' ||row.CHEQUENO==undefined) && row.PAYMENTMODE=='C')
    // {
    //   flag=false;
    //   msgBox=msgBox+"<li>Cheque no not entred."+'</li>';
    // }
    if((row.TRANSDATE=='' ||row.TRANSDATE==undefined) && row.PAYMENTMODE!='O')
    {
      flag=false;
      msgBox=msgBox+"<li>Payment date not entred."+'</li>';
    }

    if(row.TRANAMT=='' ||row.TRANAMT==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Payment not entred."+'</li>';
    }
    // else if((parseFloat(row.TRANAMT)+row.TOTALCHEQUES)>350000)
    // {
    //   flag=false;
    //   msgBox=msgBox+"<li>You can't issue cheques more 3,50,000 in this date."+'</li>';
    // }
    if((row.TRANSDATE!='' ||row.TRANSDATE!=undefined) && selectedDate<currDate)
    {
      flag=false;
      msgBox=msgBox+"<li>Payment date should not before current date."+'</li>';
    }
    this.paymentlist=row.ScheduledList;
    var total=parseFloat(row.TRANAMT);
    for(var item of this.paymentlist)
    {
      total=total+parseFloat(item.TRANAMT);
    }

    if(row.BALANCEAMT<total)
    {
      flag=false;
      msgBox=msgBox+"<li>Cannot Scheduled more than balance Amount."+'</li>';
    }

    msgBox=msgBox+"</ul>";
    if(flag==false) {
     console.log("msgBox",msgBox);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'validation',
        displayMsg:msgBox
      }
    });
     }
     return flag;
  }
  additem(row){
     console.log("this.newItem", this.newItem);
     this.paymentlist=row.ScheduledList;
    if(this.validateDetail( row))
    {
      var pDate= row.TRANSDATE;
      if(row.PAYMENTMODE=='O')
      {
        pDate=this.datePipe.transform(Date(), 'dd-MMM-yyyy') ;
      }
      this.paymentlist.push({'BANKACID':row.BANKACID,'TRANAMT':row.TRANAMT,'TRANSDATE':pDate,'CHEQUENO':row.CHEQUENO, 'ACCOUNTHEAD':row.ACCOUNTHEAD,'ACCOUNTID':row.ACCOUNTID,'NAMEONCHEQUE':row.NAMEONCHEQUE,'REQID':row.REQID,'ID':0,'PAYMENTMODE':row.PAYMENTMODE});    

    this.paymentlist.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
      
    });
    row.ScheduledList=this.paymentlist;
    var total=0;
    for(var item of this.paymentlist)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    row.TRANAMT='';
    row.TRANSDATE='';
    row.CHEQUENO='';
    row.TotalAmt=total;
    console.log("this.items", this.paymentlist);
    this.newItem = {};
}

}
accountHeadChange(id,  data )
{
 data.ACCOUNTHEAD= this.accountHeadList.find(x=>x.ACCOUNTID==id).ACCOUNTHEAD;
}
  removeItem(index){
    this.paymentlist.splice(index,1);
   
  }
  editItem(val){
   
    this.editItemID = val;
   
  }
  updateItem(val, row){
      this.editItemID = {};
      var total=0;
      this.paymentlist=row.ScheduledList;
      for(var item of this.paymentlist)
      {
        total=total+parseFloat(item.TRANAMT);
      }
      row.TotalAmt=total;
  }
  openCalendarDialog(data) {
    var payment:any=[];
    for(var row of this.fieldArray.data)
    {
        if(row.checked==true)
        {
            for(var el of  row.ScheduledList)
            {
                  var item:any={};
                  item.REQID=row.REQID;
                  item.PASSEDAMT=0;
                  item.MANAGEMENTNOTES='';
                  item.ISSUEDAMT=el.TRANAMT;
                  item.PAYMENTMODE=row.PAYMENTMODE;
                  item.PAYMENTDATE=el.TRANSDATE;
                  item.BANKACID=el.ACCOUNTID;
                  item.CHEQUENO='-';
                  item.NAMEONCHEQUE='';
                  payment.push(item);
            }
        }
      
     }
    const dialogRef = this.dialog.open(PaymentChart1Component, {
        data: {
          transtype:'S',
          payments:payment
      
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        data.TRANSDATE=result.date;
        data.TOTALCHEQUES=result.amount;
      });
  }

  openDialog(row:PaymentDetail) {
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
  // openCalendarDialog(data) {
  //   const dialogRef = this.dialog.open(PaymentChart1Component, {
  //       data: {
  //         transtype:'S'
  //      }
  //     });
  
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed',result);
  //       data.PAYMENTDATE=result;
  //     });
  // }

  // openMultiplrPayment(data): void {
  //   console.log("ravinder",data);
  //   // alert(data.PAYMENTMODE);
  //     if(data.PAYMENTMODE!="O")
  //     {
  //         const dialogRef = this.dialog.open(multiplecheques, {
  //           width: '800px',
  //           data: {data: data, bankList:this.accountHeadList}
  //         });

  //         dialogRef.afterClosed().subscribe(result => {
  //           console.log('The dialog was closed1', result);
  //           if(result!="problem"&&result!="")
  //           {
  //             this.fieldArray.data=result;
  //           }
  //         });
  //    }
  // }
  

  WrongDetailDialog(textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:textmsg
      }
    });
  }
}
export class PaymentDetail
{
  REQID:number;
  REQNO:number;
  REQDATE:string;
  CREDITDAYS :number;
  DUEAMT:number;
  PAYMENTTYPE:string;
  TOTALDUEAMT :number;
  REMARKS :string;
  AMOUNTTOPAY :number;
  NAME :string;
  PASSEDAMT :number;
  MANAGEMENTNOTES :string;
  BALANCEAMT:number;
  ACCOUNTID:number;
  ISSUEDAMT:number;
  PAYMENTMODE:string;
  PAYMENTDATE:Date;
}


// @Component({
//   selector: 'multiplecheques',
//   templateUrl: './multiplecheques.html',
//   styleUrls: ['./payment-scheduling.component.css']
// })

// export class multiplecheques {
//   newData:any={};boid : any;FYUSER:any;ServerIP:any;newItem:any={};paymentlist:any=[];lastChequeNo:any;isLoadingResults:any;
//   pData:any={}; datePipe = new DatePipe("en-US");editItemID:any;itemDisplay:any;accountHeadList:any=[];TotalAmt:any;userid:any;token:any; 
//   constructor(@Inject('BASE_URL') private original_url : string,private http: HttpClient,private service:PaymentConfirmationService,
//     public dialog: MatDialog,
//     public dialogRef: MatDialogRef<multiplecheques>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     @Inject(MAT_DIALOG_DATA) public bankList: any) {
//       console.log("itemanme",data);
//       this.pData=data.data;
//       this.newData=data.data;
//       console.log("itemanme1",bankList);

//       this.accountHeadList=bankList.bankList;

//       let currentBranch = sessionStorage.getItem("currentBranch");
//       var CompanyData = JSON.parse(currentBranch);
//       this.ServerIP=CompanyData['SERVERIP'];
//       this.FYUSER=CompanyData['FYUSER'];
//       this.boid = CompanyData['BRANCHID'];
//       let currentUser = sessionStorage.getItem("currentUser");
//       currentUser = JSON.parse(currentUser);
    
//     this.token = currentUser['TOKEN'];
//     this.userid = currentUser['USERID'];
     
//     }
//   onNoClick(): void {
//     var flag:boolean, msgBox:string;
//     flag=true;
//     var payment:any=[];
//     if(this.validate())
//     {
//       this.isLoadingResults=true;
//       for(var el of  this.paymentlist)
//       {
//             var item:any={};
//             item.REQID=this.newData.REQID;
//             item.PASSEDAMT=0;
//             item.MANAGEMENTNOTES='';
//             item.ISSUEDAMT=el.TRANAMT;
//             item.PAYMENTMODE=this.newData.PAYMENTMODE;
//             item.PAYMENTDATE=el.TRANSDATE;
//             item.BANKACID=el.ACCOUNTID;
//             item.CHEQUENO=el.CHEQUENO;
//             item.NAMEONCHEQUE=el.NAMEONCHEQUE;
//             payment.push(item);
//       }
//       this.service.PaymentConfirmation(this.ServerIP,this.FYUSER, this.boid, payment, "P").subscribe((res: any[])=> {
//       this.data=res;
//       this.itemDisplay=res;
//       this.itemDisplay=this.itemDisplay.Table;
    
//       if(!(this.itemDisplay==undefined))
//       {

//         this.dialogRef.close(this.itemDisplay);
//       }
//       else
//       {
//         console.log("wrong");
//         const dialogRef = this.dialog.open(SuccessDialogComponent, {
//           data: {
//             wrongData: 'wrongData',
//             displayMsg:'Somthing went wrong'
//           }
//         });
//       }
//       this.isLoadingResults=false;
//       });

//     }
   
//   }
//   validate()
//   {
//     var flag:boolean, msgBox:string;
//     flag=true;
//     msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
//     var total=0;
//     for(var item of this.paymentlist)
//     {
//       total=total+parseFloat(item.TRANAMT);
//     }
//     if(this.newData.BALANCEAMT<total)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Cannot Scheduled more than balance Amount."+'</li>';
//     }
//     if(total==0)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Nothing to save."+'</li>';
//     }

//     msgBox=msgBox+"</ul>";
//     if(flag==false) {
//      console.log("msgBox",msgBox);
//      const dialogRef = this.dialog.open(SuccessDialogComponent, {
//       data: {
//         wrongData: 'validation',
//         displayMsg:msgBox
//       }
//     });
//      }
//      return flag;
//   }

//   validateDetail(data)
//   {
//     var flag:boolean, msgBox:string;
//     flag=true;
//     console.log("Row Data",data);

//     var currDate=new Date();
//     var selectedDate=new Date(this.newItem.TRANSDATE);
//     selectedDate.setHours(selectedDate.getHours() + 23);

//     msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
//     if(this.newItem.ACCOUNTID==undefined || this.newItem.ACCOUNTID=='' )
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Bank not selected."+'</li>';
//     }
//     if(this.newItem.CHEQUENO=='' ||this.newItem.CHEQUENO==undefined)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Cheque no not entred."+'</li>';
//     }
//     if(this.newItem.TRANSDATE=='' ||this.newItem.TRANSDATE==undefined)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Payment date not entred."+'</li>';
//     }

//     if(this.newItem.TRANAMT=='' ||this.newItem.TRANAMT==undefined)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Payment not entred."+'</li>';
//     }
//     else if((parseFloat(this.newItem.TRANAMT)+this.newItem.TOTALCHEQUES)>350000)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>You can't issue cheques more 3,50,000 in this date."+'</li>';
//     }
//     if((this.newItem.TRANSDATE!='' ||this.newItem.TRANSDATE!=undefined) && selectedDate<currDate)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Payment date should not before current date."+'</li>';
//     }

//     var total=parseFloat(this.newItem.TRANAMT);
//     for(var item of this.paymentlist)
//     {
//       total=total+parseFloat(item.TRANAMT);
//     }

//     if(this.newData.BALANCEAMT<total)
//     {
//       flag=false;
//       msgBox=msgBox+"<li>Cannot Scheduled more than balance Amount."+'</li>';
//     }

//     msgBox=msgBox+"</ul>";
//     if(flag==false) {
//      console.log("msgBox",msgBox);
//      const dialogRef = this.dialog.open(SuccessDialogComponent, {
//       data: {
//         wrongData: 'validation',
//         displayMsg:msgBox
//       }
//     });
//      }
//      return flag;
//   }
//   additem(){
//      console.log("this.newItem", this.newItem);
//     if(this.validateDetail(this.newItem))
//     {
//     this.paymentlist.push(this.newItem);    

//     this.paymentlist.forEach((item,index) => {
//       var num = 'id';
//       var value = index+1;
//       item[num] = value;
      
//     });
//     var total=0;
//     for(var item of this.paymentlist)
//     {
//       total=total+parseFloat(item.TRANAMT);
//     }
//     this.TotalAmt=total;
//     console.log("this.items", this.TotalAmt);
//     this.newItem = {};
  
// }

// }
// accountHeadChange(id, data)
// {
//  data.ACCOUNTHEAD= this.accountHeadList.find(x=>x.ACCOUNTID==id).ACCOUNTHEAD;
// }
//   removeItem(index){
//     this.paymentlist.splice(index,1);
   
//   }
//   editItem(val){
   
//     this.editItemID = val;
   
//   }
//   updateItem(val){
//     this.editItemID = {};
//     var total=0;
//     for(var item of this.paymentlist)
//     {
//       total=total+parseFloat(item.TRANAMT);
//     }
//     this.TotalAmt=total;
//   }
//   openCalendarDialog(data) {
//     const dialogRef = this.dialog.open(PaymentChart1Component, {
//         data: {
//           transtype:'S'
      
//         }
//       });
  
//       dialogRef.afterClosed().subscribe(result => {
//         console.log('The dialog was closed',result);
//         data.TRANSDATE=result.date;
//         data.TOTALCHEQUES=result.amount;
//       });
//   }
// }