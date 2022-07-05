import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpParams } from '@angular/common/http'
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { EditChequeComponent } from '../../print-cheque/print-cheque.component';

@Component({
  selector: 'app-add-new-format',
  templateUrl: './add-new-format.component.html',
  styleUrls: ['./add-new-format.component.css']
})
export class AddNewFormatComponent implements OnInit {
  selectedfile=null;

  public progress: number;
  public message: string;

  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;isLoadingResults:boolean;
  coid : any; fstartDate:any;
  fendDate:any;datePipe = new DatePipe("en-US");
  boid : any;
  userid:any;NeftColumnListToSave : Array<any>=[];
  PaymentDetail: Array<any> = [];newData:any={};TotalAmt=0;
  fieldArray = new MatTableDataSource<any>();accountHeadList:any=[];bankList:any=[];token:any;
  displayedColumns: string[] = [ 'TRANSDATE','NAME','PAYMENTTYPE','BANKACNO','IFSC','TRANAMT','BALANCEAMT','PASSEDAMT'];
  data:any;FYUSER:any;ServerIP:any;routeID=0;routeAction='';
  itemDisplay: any;BANKACID:any;BANKNAME:any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,public dialog: MatDialog,private http:HttpClient) {
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
          this.fstartDate= this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy' );
          this.routeID = parseInt( this.activatedRoute.snapshot.paramMap.get('id'));
          this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
          if(this.routeAction=='edit')
          {
            this.newData.fromamt=parseInt( this.activatedRoute.snapshot.paramMap.get('fromamt'));
            this.newData.uptoamt=parseInt( this.activatedRoute.snapshot.paramMap.get('uptoamt'));
            this.newData.percentage=parseInt( this.activatedRoute.snapshot.paramMap.get('percentage'));
          }
          this.getNeftList();
  }
  getNeftList()
  {
    this.http.get(this.original_url+"/Accounts/Payments/getSalaryNEFTList?neftid="+
    this.routeID+"&userid="+this.userid+"&token="+this.token).subscribe((res)=> {
    if(res=="Ravinder")
    {
        this.ShowMessageDialog("wrongData","Some thing went Wrong");
    }
    else
    {
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.fieldArray.data = this.itemDisplay;
        this.TotalAmt=0;
        this.fieldArray.data.forEach((data)=>{
          if(data.PASSEDAMT>0)
          {
            data.checked=true;
            this.NeftColumnListToSave.push(data);
            this.TotalAmt=this.TotalAmt+parseInt( data.PASSEDAMT);
          }
        });
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

  onFileSelected(files) {
    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);

    const uploadReq = new HttpRequest('POST', `https://localhost:44398/api/Master/upload/UploadFile?pPath=purchase`, formData, {
      reportProgress: true,
    });

    this.http.request(uploadReq).subscribe(event => {
      console.log("event", event);
      if (event.type === HttpEventType.UploadProgress){
        this.progress = Math.round(100 * event.loaded / event.total);
        console.log("this.progress", this.progress);}
      else if (event.type === HttpEventType.Response){
        this.message = event.body.toString();
        console.log(" this.message",  this.message);
      }

    });
  }

  // onFileSelected(event)
  // {
  //   console.log(event);
  //   this.selectedfile=event.target.files[0];
  // }
  // uploadfile()
  // {

  // }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  backtoSource()
  {
   
    this.router.navigate(['/salary-neft-format'], {skipLocationChange:true});
  }
  claculateTotal()
  {
    this.TotalAmt=0;
    for(var data of this.NeftColumnListToSave)
    {
      this.TotalAmt=this.TotalAmt+parseInt( data.PASSEDAMT);
    }
  }
  filterData()
  {
    var percentage=0,uptoAmt=0, fromamt=0;
    this.NeftColumnListToSave=[];
    if(this.newData.percentage==undefined||this.newData.percentage==0||this.newData.percentage=='')
    {
      percentage=100;
      this.newData.percentage=100;
    }
    else
    {
      percentage=this.newData.percentage;
    }
    if(this.newData.uptoamt==undefined||this.newData.uptoamt==0||this.newData.uptoamt=='')
    {
      uptoAmt=1000000;
    }
    else
    {
      uptoAmt=this.newData.uptoamt;
    }
    if(this.newData.fromamt==undefined||this.newData.fromamt==0||this.newData.fromamt=='')
    {
      fromamt=0;
      this.newData.fromamt=0;
    }
    else
    {
      fromamt=this.newData.fromamt;
    }

    this.fieldArray.data.forEach((el)=>{
      el.checked=false;
      el.PASSEDAMT=0;
      if (el.TRANAMT>= fromamt &&  el.TRANAMT<= uptoAmt)
      {
       
        if(el.PAYMENTDESC=='Salary')
        {
          el.checked=true;
          el.PASSEDAMT=(el.BALANCEAMT*percentage/100).toFixed(0);
          this.NeftColumnListToSave.push(el);
        }
        // else
        // {el.PASSEDAMT=el.BALANCEAMT;}
       
      }
       
     });
     this.claculateTotal(); 
  }

   
  
  onChange(event, payment)
  {
    var percentage=0;
   if(this.newData.percentage==undefined||this.newData.percentage==0||this.newData.percentage=='')
    {
      percentage=100;
    }
    else
    {
      percentage=this.newData.percentage;
    }

  if(event.checked == true)
    {
      payment.PASSEDAMT=(payment.BALANCEAMT*percentage/100).toFixed(0);
    this.NeftColumnListToSave.push(payment);
    }
    else
    {
      payment.PASSEDAMT=0;
      this.NeftColumnListToSave.splice (this.NeftColumnListToSave.indexOf(payment),1);
    }
    this.claculateTotal();
  }
  onDataChange(payment)
  {

      if ( payment.PASSEDAMT>payment.BALANCEAMT) 
      {
        this.WrongDetailDialog("Can't pass more the Balance Amount.");
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
      this.getNeftList();
    }
    
  });
  }

  confirmNeft()
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
      Payment.CHEQUENEFTID=data.CHEQUENEFTID;
      Payment.PASSEDAMT=data.PASSEDAMT;
      paymentList.push(Payment);
    }
    let fromAmt=0,toAmt=0,mpercentage=0;
    if(this.newData.fromamt>0)
    {
      fromAmt=this.newData.fromamt;
    }
    if(this.newData.uptoamt>0)
    {
      toAmt=this.newData.uptoamt;
    }
    if(this.newData.percentage>0)
    {
      mpercentage=this.newData.percentage;
    }

    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('neftid', this.routeID.toString())
    .set('totalamt', this.TotalAmt.toString())
    .set('fromamt',fromAmt.toString())
    .set('uptoamt', toAmt.toString())
    .set('userid', this.userid)
    .set('token', this.token)
    .set('percentage',mpercentage.toString())
    .set('datalist', JSON.stringify(paymentList));
    this.http.post(this.original_url+"/Accounts/Payments/SaveSalaryNeft", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      this.isLoadingResults=false;
      if(res==-1||res=="Ravinder")
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
     
     this.NeftColumnListToSave=[];
    this.isLoadingResults=false
    this.backtoSource();
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
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('userid', this.userid)
    .set('flag', 'S')
    .set('userid', this.userid)
    .set('token', this.token)
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
