import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentConfirmationService } from '../payment-confirmation/payment-confirmation.service';
import { DatePipe, formatDate } from '@angular/common';
import { PaymentChart1Component } from '../payment-chart1/payment-chart1.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-payment-paasing-an-scheduling',
  templateUrl: './payment-paasing-an-scheduling.component.html',
  styleUrls: ['./payment-paasing-an-scheduling.component.css']
})
export class PaymentPaasingAnSchedulingComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;newItem:any={};paymentlist:Array<any>=[];
  isLoadingResults:boolean;accountHeadList:any=[];
  fieldArray = new MatTableDataSource<any>();
  myDate = new Date();data:any;itemDisplay: any;
  fstartDate:any;token:any; userid:any; paymentMode: Array<any>=[];
  filterTypes: Array<any>=[];
  editItemID:any;flag:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  displayedColumnsNew: string[] = ['NAME'];boid:any;
  constructor(public dialog: MatDialog,private http: HttpClient,private service:PaymentConfirmationService) 
  { 
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.boid = CompanyData['BRANCHID'];
    this.myDate = CompanyData['SEVERDATE'];
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' ) ;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.flag="A";
    this.showList("A");

  }
  editCheque(id)
  {
    this.editItemID=id;
  }
  updateCheque(data)
  {
    console.log("Cheque Data", data);
    this.isLoadingResults=true;
    let updateData:any={};
    updateData.TRANSDATE=this.datePipe.transform(new Date(data.TRANSDATE), 'dd-MMM-yyyy');
    updateData.ID=data.ROWID1;
    const params = new  HttpParams()
    .set('token', this.token)
    .set('recolist', JSON.stringify(updateData));

    this.http.post(this.original_url+"/Accounts/Payments/amendChequeDetailNew", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
    this.isLoadingResults=false;
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
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


    this.editItemID = {};
  }
  showList(flag)
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/Accounts/Payments/PaymentsList?token="+this.token+ "&flag="+flag).subscribe((res)=>{
     //console.log("payment res",res); 
     this.data=res;
     this.itemDisplay=res;
     this.fieldArray.data = this.itemDisplay;
     this.isLoadingResults=false;
    },
    error=>{
     this.isLoadingResults=false;
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
  onPartyChecked(checked, data)
  {
      var chequeList:Array<any>=[];
      var reqList:Array<any>=[];
     if(checked)
     {
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/Accounts/Payments/PartyPaymentsList?token="+this.token+"&accountid="+data.ACCOUNTID).subscribe((res)=>{
        this.itemDisplay=res;
        chequeList=this.itemDisplay.Table;
        reqList=this.itemDisplay.Table1;
        this.accountHeadList=this.itemDisplay.Table2;
       // console.log("payment chequeList",chequeList); 
        chequeList.forEach(el=>{
            el.TRANSDATE=this.datePipe.transform(el.TRANSDATE, 'dd-MM-yyyy');
        });
        console.log("payment chequeList",chequeList); 
        data.ISSUEDCHQ=chequeList;
        data.PAYMENTLIST=reqList;
        this.isLoadingResults=false;
       // console.log("payment data",data);
      },
      Error=>{
        this.isLoadingResults=false;
      });
     }
      
  }
  onCkhChange(event, data, mianrow)
  {
    let ScheduledList:Array<any>=[];
    data.PAYMENTMODE="C";
    data.PAYMENTMODEDESC='Cheque';
    if(event.checked == true)
    {
     data.ScheduledList=ScheduledList; 
     data.delete=false;
     mianrow.paymentchecked=true;
    }
    if(this.boid=="2")
    {
      data.ACCOUNTID=1741;
      data.ACCOUNTHEAD= "CAPITAL SMALL FINANCE BANK LTD A/C NO.076105000063";
    }
  }
  onDelete(event, data, mianrow)
  {
    let ScheduledList:Array<any>=[];
    if(event.checked == true)
    {
      data.checked=false;
      data.ScheduledList=ScheduledList; 
    }
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

     // console.log("payment",payment);
  }
  onPayModeChange(id,data)
  {
  //  console.log("i",id);
    data.PAYMENTMODEDESC=this.paymentMode.find(x=>x.id==id).description;
  }
  SaveSchedule(): void {
    var  msgBox:string;
    
    var payment:Array<any>=[];
      this.isLoadingResults=true;
      var mReqId="0" 
      for(var data of this.fieldArray.data)
      {
          if(data.checked==true)
          {
            for(var row of data.PAYMENTLIST)
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
                          item.PAYMENTMODE=el.PAYMENTMODE;
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
        .set('flag', this.flag)
        .set('ReqIds', mReqId)
        .set('list', JSON.stringify(payment));
        this.http.get(this.original_url+"/Accounts/Payments/SaveSchedulingNew?"+ params.toString())
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
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   this.paymentMode.push({id:'C',description:'Cheque'}) ;
   this.paymentMode.push({id:'N',description:'NEFT'}) ;
   this.paymentMode.push({id:'O',description:'Cash'}) ;

   this.filterTypes.push({id:'A',description:'All'});
   this.filterTypes.push({id:'P',description:'Pending'});
   this.filterTypes.push({id:'C',description:'Scheduled'}) ;
   }
   applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  WrongDetailDialog(textmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:textmsg
      }
    });
  }
  validateDetail( row)
  {
    var flag:boolean, msgBox:string;
    flag=true;
    var currDate=new Date();
    var selectedDate=new Date(row.TRANSDATE);
    selectedDate.setHours(selectedDate.getHours() + 23);
    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    if((row.ACCOUNTID==undefined || row.ACCOUNTID=='' ) && row.PAYMENTMODE!='O')
    {
      flag=false;
      msgBox=msgBox+"<li>Bank not selected."+'</li>';
    }
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
  //   console.log("this.newItem", row);
     this.paymentlist=row.ScheduledList;
    if(this.validateDetail( row))
    {
      var pDate= row.TRANSDATE;
      if(row.PAYMENTMODE=='O')
      {
        pDate=this.datePipe.transform(Date(), 'dd-MMM-yyyy') ;
      }
      this.paymentlist.push({'BANKACID':row.BANKACID,'TRANAMT':row.TRANAMT,'TRANSDATE':pDate,'CHEQUENO':row.CHEQUENO, 'ACCOUNTHEAD':row.ACCOUNTHEAD,'ACCOUNTID':row.ACCOUNTID,'NAMEONCHEQUE':row.NAMEONCHEQUE,'REQID':row.REQID,'ID':0,'PAYMENTMODE':row.PAYMENTMODE,'PAYMENTMODEDESC':row.PAYMENTMODEDESC});    

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
   // console.log("this.items", this.paymentlist);
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
  ShowBillsAgstRequirement(reqId)
  {
    
    this.isLoadingResults=true;
    let empWiseGatePass:Array<any>=[];
    let mhtml="";
    this.http.get(this.original_url+"/Accounts/Payments/getBillsAgstPaymentRequirment?token="+this.token+"&reqid="+reqId).subscribe((res)=>{
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        empWiseGatePass = this.itemDisplay;
        mhtml='<table border=1>'
        mhtml=mhtml+'<tr><th width ="100px" >Bill No.</th><th width ="120px" class="text-center">Bill Date</th><th width ="120px" class="text-center">Bill Amount</th> <th width ="120px" align="right">Pending Amount</th></tr>';

        empWiseGatePass.forEach((el)=>{
          //mhtml=mhtml+"<tr><td style='width: 90px;text-align: right;'>"+ formatDate(data.GPDATE, 'dd-MMM-yyyy', 'en-US', '+0530') +"</td><td style='width: 90px;text-align: right;'>"+formatDate(el.INTIME, 'HH:mm tt', 'en-US', '+0530')+"</td><td style='width: 90px;text-align: right;'>"+formatDate(el.OUTTIME, 'HH:mm t', 'en-US', '+0530')+"</td><td>"+el.REASON+"</td></tr>";
          mhtml=mhtml+'<tr><td width ="100px">'+ el.BILLNO + 
                    '</td><td width ="120px" align="right">'+formatDate(el.BILLDATE, 'dd-MM-yyyy', 'en-US', '+0530')+
                    '</td><td width ="120px" align="right">'+ el.BILLAMOUNT +
                    '</td><td width ="120px" align="right">'+el.PENDINGAMT+'</td></tr>';
        });
        mhtml=mhtml+'</table>'
        this.isLoadingResults=false;
        console.log("mhtml",mhtml);
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'validation',
            displayMsg:mhtml
          }
        });
    });
  }
  openCalendarDialog(data) {
    var payment:any=[];
    for(var main of this.fieldArray.data)
    {
      if(main.checked==true)
      {
        for(var row of main.PAYMENTLIST)
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
      }
     }
    const dialogRef = this.dialog.open(PaymentChart1Component, {
        data: {
          transtype:'S',
          payments:payment
      
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
     //   console.log('The dialog was closed',result);
        data.TRANSDATE=result.date;
        data.TOTALCHEQUES=result.amount;
      });
  }
  openCalendarDialog1(data) {
    var payment:any=[];
    
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
}
