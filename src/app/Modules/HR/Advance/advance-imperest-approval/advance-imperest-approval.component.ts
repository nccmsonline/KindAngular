import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FileDownloadUploadService } from "../../../../../app/file-download-upload.service";
//import { GrdFilterPipe } from "../../../../../app/standard-function.service";

@Component({
  selector: 'app-advance-imperest-approval',
  templateUrl: './advance-imperest-approval.component.html',
  styleUrls: ['./advance-imperest-approval.component.css']
})
export class AdvanceImperestApprovalComponent implements OnInit {
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  @ViewChild('firstTableSort', { static: true }) public firstTableSort: MatSort;
  original_url=environment.baseUrl;
  arrayItemNameEdit=''; itemlistgetDesc:Array<any>=[];
  userinfo : any; newData:any={};isCEO:any;
  coid : any;datePipe = new DatePipe("en-US");WorkingDate=new Date();
  boid : any;empid:any; fstartDate:any;copanyName:any;Address1:any; Address2:any;
  userid:any;ListToSave : Array<any>=[]; datetype: Array<any>=[];token;any;flag:any;
  //rateAppDetail: RateApprovalModel[] = [];
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[];// = [ 'chk','EMPNO','NAME','DEPTNAME','DATED','ADVANCEAMT','PASSEDAMT','INSTALLMENTAMT','ADVANCETYPE','BILLNO','REASON','star'];
  displayedColumns1: string[] = ['advno', 'ADVANCETYPE', 'DATED', 'NAME', 'PASSEDAMT', 'REASON', 'VOUCHERDESC'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any;LoginUser:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private upload:FileDownloadUploadService) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fstartDate= CompanyData['FINANCIALYEARSTARTDATE'] ;
    this.copanyName = CompanyData['COMPANYNAME'];
    this.Address1 = CompanyData['ADDRESS'];
    this.Address2 = CompanyData['ADDRESS1'];
    this.WorkingDate= new Date(CompanyData['SEVERDATE']);
    this.WorkingDate.setDate(this.WorkingDate.getDate() -4);


    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.empid = currentUser['EMPID'];
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.LoginUser = currentUser['NAMEOFUSER'];
    this.isCEO= currentUser['ISCEO'];
    this.empid=10195;
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
          
          if(event.url == '/advance-imperest-approval/A')
          {
            this.displayedColumns= [ 'chk','del','advno','EMPNO','NAME','DEPTNAME','DATED','ADVANCEAMT','PASSEDAMT','INSTALLMENTAMT','ADVANCETYPE','BILLNO','REASON','star'];
            this.gatDataGatePassList();
          }
          else if(event.url == '/advance-imperest-approval/I')
          {
            this.displayedColumns=  ['advno', 'ADVANCETYPE', 'DATED', 'NAME', 'PASSEDAMT', 'REASON', 'VOUCHERDESC'];
            this.gatDataGatePassList();
          }
          else if(event.url == '/advance-imperest-approval/H')
          {
            this.displayedColumns= [ 'chk','advno','EMPNO','NAME','DEPTNAME','DATED','ADVANCEAMT','PASSEDAMT','INSTALLMENTAMT','ADVANCETYPE','BILLNO','REASON','star'];
            this.gatDataGatePassList();
          }
        }
      });
      var currentDate: Date = new Date( this.fstartDate);
      this.dateFormControl.setValue(currentDate);
 }

  ngOnInit() {
    this.fieldArray.sort = this.firstTableSort;
   this.fieldArray.paginator=this.paginator;
  
  }
  onChange(event, data)
  {
    if(event.checked == true)
    {
      if(this.flag=="A")
      {
        data.PASSEDAMT=data.ADVANCEAMT;
      }
      this.ListToSave.push(data);
      data.delete=false;
    }
    else
    {
      if(this.flag=="A")
      {
        data.PASSEDAMT='';
      }
      
      this.ListToSave.splice (this.ListToSave.indexOf(data),1);
    }
  }
  onDelete(event, data)
  {
    if(event.checked == true)
    {
      data.checked=false;
      if(this.flag=="A")
      {
        data.PASSEDAMT='';
      }
    }
    
  }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  WrongDetailDialog(pmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pmsg
      }
    });
  }
  download(filename: string) {
    this.upload.downloadNoteReceipt("PaymentRequirment",filename).subscribe(res => {
      console.log(res);

      let checkFileType =  filename.split('.').pop();
      var fileType;
      debugger;
      checkFileType=checkFileType.toLowerCase();
      if(checkFileType == "txt")
      {
        fileType = "text/plain";
      }
      if(checkFileType == "pdf")
      {
        fileType = "application/pdf";
      }
      if(checkFileType == "doc")
      {
        fileType = "application/vnd.ms-word";
      }
      if(checkFileType == "docx")
      {
        fileType = "application/vnd.ms-word";
      }
      if(checkFileType == "xls"||checkFileType == "xlsx")
      {
        fileType = "application/vnd.ms-excel";
      }
      if(checkFileType == "png")
      {
        fileType = "image/png";
      }
      if(checkFileType == "jpg")
      {
        fileType = "image/jpeg";
      }
      if(checkFileType == "jpeg")
      {
        fileType = "image/jpeg";
      }
      if(checkFileType == "gif")
      {
        fileType = "image/gif";
      }
      if(checkFileType == "csv")
      {
        fileType = "text/csv";
      }
      // var newBlob = new Blob([res], { type: "application/pdf" });
      var newBlob = new Blob([res], { type: fileType });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }
   var newurl = window.URL.createObjectURL(newBlob);
   window.open(newurl);
//Following i had commnet bcz it download file on computer ravinder
    //  // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            // const data = window.URL.createObjectURL(newBlob);

            // var link = document.createElement('a');
            // link.href = data;
            // link.download = "receipt."+checkFileType;
            // // this is necessary as link.click() does not work on the latest firefox
            // link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            // setTimeout(function () {
            //     // For Firefox it is necessary to delay revoking the ObjectURL
            //     window.URL.revokeObjectURL(data);
            // }, 100);

    }, error => {
      console.log(error);
    })
  }
  saveDataForAccount()
  {
    var savelist : Array<any>=[]; 
    var ids='0';
    debugger;
    this.isLoadingResults=true;
   if( this.ListToSave.length<=0)
   {
     this.WrongDetailDialog("Sorry, Nothing to save.");
     this.isLoadingResults=false;
   }
   else if( this.newData.VOUCHERDATE==''|| this.newData.VOUCHERDATE==undefined)
   {
      this.WrongDetailDialog("Sorry, Voucher Date not selected.");
      this.isLoadingResults=false;
   }
   else if( this.newData.ACCOUNTID==undefined||this.newData.ACCOUNTID==0)
   {
      this.WrongDetailDialog("Sorry, Account not selected.");
      this.isLoadingResults=false;
   }
   else
   {
    this.ListToSave.forEach((el)=>{
      let data:any={};
       data.APPROVEDBYAC='Y';
       data.VOUCHERDESC=el.VOUCHERDESC;
       data.VOUCHERDATE= formatDate(this.newData.VOUCHERDATE, 'dd-MMM-yyyy', 'en-US', '+0530');
       data.ACCOUNTID=this.newData.ACCOUNTID;
       data.id=el.ID;
       ids=ids+", "+el.ID;
       savelist.push(data);
       
     }); 
     
   
    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('flag', this.flag)
    .set('userid', this.userid)
    .set('token', this.token)
    .set('ids', ids)
    .set('list', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/ApproveAdvanceImperest", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      debugger;
     this.isLoadingResults=false;
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'sucess'
       }
     });
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
       console.log("res",res);
       this.ListToSave=[];
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
  saveData()
  {
    var savelist : Array<any>=[]; 
    var ids='0';
    this.isLoadingResults=true;
    this.fieldArray.data.forEach((el)=>{
     let data:any={};
     if(el.checked==true)
     {
      data.PASSEDAMT=el.PASSEDAMT;
    
      if(this.flag=="A")
      {
        data.APPROVEDBYAUTHORITY='Y';
        if(el.INSTALLMENTAMT==undefined||el.INSTALLMENTAMT=='')
        {
          data.INSTALLMENTAMT=0;
        }
        else
        {
          data.INSTALLMENTAMT=el.INSTALLMENTAMT;
        }
      }
      if(this.flag=="H")
      {
        data.APPROVEDBYHR='Y';
      }
      data.id=el.ID;
      ids=ids+", "+el.ID;
      savelist.push(data);
    }else  if(el.delete==true)
    {
      data.APPROVEDBYAUTHORITY='R';
      data.INSTALLMENTAMT=0;
      data.PASSEDAMT=0;
      data.id=el.ID;
      savelist.push(data);
    }

      
    }); 

   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
     this.isLoadingResults=false;
   }
   else
   {
    
    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('flag', this.flag)
    .set('userid', this.userid)
    .set('token', this.token)
    .set('isCEO', this.isCEO)
    .set('ids', ids)
    .set('list', JSON.stringify(savelist));
    this.http.post(this.original_url+"/hr/hr/ApproveAdvanceImperest", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      debugger;
     this.isLoadingResults=false;
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'sucess'
       }
     });
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
       console.log("res",res);
       this.ListToSave=[];
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
   
   console.log("this.other", this.ListToSave);
  }
  gatDataGatePassList()
  {
    this.ListToSave=[];
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/getAdvancePaymentReqListForApproval?flag="+this.flag+"&userid="+this.userid+"&token="+this.token+"&isCEO="+this.isCEO).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table1;
    this.itemlistgetDesc= this.itemDisplay;
     console.log("res",res);
     this.isLoadingResults=false;
    });
  }
 
  searchTermItemNameEdit(term, rowDetail)
  {
    this.arrayItemNameEdit = term;
    if(this.arrayItemNameEdit !== '')
    {
     
    }
    else
    {
   //   this.itemListPO = [];
      this.arrayItemNameEdit = '';
    
      rowDetail.ACCOUNTHEAD='';
      rowDetail.ACCOUNTID=0;
    }
  }
  onChangeOfItemName(id, rowDetail)
  {
    this.arrayItemNameEdit = '';
debugger;
    var itemDetail = this.itemlistgetDesc.find(x=>x.ACCOUNTID == id);


      rowDetail.ACCOUNTHEAD=itemDetail.ACCOUNTHEAD;
      rowDetail.GROUPNAME=itemDetail.GROUPNAME;
      rowDetail.ACCOUNTID=id;
   
console.log("row data", rowDetail);
  }
  openPrintDialog(data)
  {
    debugger;
    if(this.flag=='H')
    {
      
      this.isLoadingResults=true;
      this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/PrintAdvanceSlip?token='+this.token+"&pReqID="+data.ID).subscribe(res => {
        console.log(res);
         var newBlob = new Blob([res], { type: "application/pdf" });
         console.log("ravi",res);
         var newurl = window.URL.createObjectURL(newBlob);
         window.open(newurl);
       
      

         this.isLoadingResults=false;
      }, error => {
        this.isLoadingResults=false
        console.log(error);
      });

      // var advanceSlipPrint:any={};
      // advanceSlipPrint={
      // companyName:this.copanyName,
      // Address1:this.Address1,
      // Address2:this.Address2,
      // name:data.NAME,
      // description:data.ADVANCETYPE + ' for ' + data.REASON ,
      // amountInWords:data.TRANAMTINWORD,
      // amount:data.PASSEDAMT,
      // advanceamt:data.ADVANCEAMT,
      // empno:data.EMPNO,
      // depthead:data.DEPTHEAD,
      // designation:data.DESIGNATION,
      // flag:'V',
      // LoginUser:data.APPROVEDBYAUTHORITYID,
      // dated:  this.datePipe.transform(Date(), 'dd-MM-yyyy')};
      // sessionStorage.setItem('chequeprint', JSON.stringify(advanceSlipPrint));
      // this.router.navigate(['/print-advance-slip']);
    }
  }
  openRectPrintDialog(data)
  {
    debugger;
    if(this.flag=='H')
    {
      this.isLoadingResults=true;
      this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/PrintAdvanceSlip?token='+this.token+"&pReqID="+data.ID).subscribe(res => {
        console.log(res);
         var newBlob = new Blob([res], { type: "application/pdf" });
         console.log("ravi",res);
         var newurl = window.URL.createObjectURL(newBlob);
         window.open(newurl);
         this.isLoadingResults=false;
      }, error => {
        this.isLoadingResults=false
        console.log(error);
      });
      // var advanceSlipPrint:any={};
      // advanceSlipPrint={
      // companyName:this.copanyName,
      // Address1:this.Address1,
      // Address2:this.Address2,
      // name:data.NAME,
      // description:data.ADVANCETYPE + ' for ' + data.REASON ,
      // amountInWords:data.TRANAMTINWORD,
      // amount:data.PASSEDAMT,
      // advanceamt:data.ADVANCEAMT,
      // empno:data.EMPNO,
      // designation:data.DESIGNATION,
      // depthead:data.DEPTHEAD,
      // flag:'R',
      // LoginUser:this.LoginUser,
      // dated:  this.datePipe.transform(Date(), 'dd-MM-yyyy')};
      // sessionStorage.setItem('chequeprint', JSON.stringify(advanceSlipPrint));
      // this.router.navigate(['/print-advance-slip']);
    }
  }
}

@Component({
  selector: 'print-advance-slip',
  templateUrl: './print-advance-slip.html',
  styleUrls: ['./advance-imperest-approval.component.css']
})
export class PrintAdvanceSlip implements OnInit {
   depthead:any;
   repeatHeaders=true;
   name:any;amountinword:any;amount:any;flag:any;companyName:any;Address1:any;Address2:any;description:any;
   rowdata:any;dated:string;designation:string;reqamount:any;empno:any;LoginUser:any;backTo:any;installment:any;
  constructor(private router: Router, public dialog: MatDialog) {
    let chequeprint = sessionStorage.getItem("chequeprint");
    var data = JSON.parse(chequeprint);
console.log("data",data);
    this.companyName=data['companyName'];
    this.Address1=data['Address1'];
    this.Address2=data['Address2'];
    this.name=data['name'];
    this.amount = data['amount'];
    this.dated=data['dated'];
    this.description=data['description'];
    this.amountinword=data['amountInWords'];
    this.empno=data['empno'];
    this.designation=data['designation'];
    this.reqamount = data['advanceamt'];
    this.flag = data['flag'];
    this.LoginUser= data['LoginUser'];
    this.depthead= data['depthead'];
    this.backTo=data['backto'];
    this.installment=data['installment'];
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
  debugger;
  if(this.backTo=="ADVSTATUS")
  {
    this.router.navigate(['/advance-status'], {skipLocationChange:true});
  }
  else
  {
  this.router.navigate(['/advance-imperest-approval/H'], {skipLocationChange:true});
  }
}
 
}


@Component({
  selector: 'print-tour-form',
  templateUrl: './print-tour-form.html',
  styleUrls: ['./advance-imperest-approval.component.css']
})
export class PrintTourForm implements OnInit {
   depthead:any;
   repeatHeaders=true;
   name:any;amountinword:any;amount:any;flag:any;companyName:any;Address1:any;Address2:any;description:any;
   rowdata:any;dated:string;designation:string;reqamount:any;empno:any;LoginUser:any;
  constructor(private router: Router, public dialog: MatDialog) {
    let chequeprint = sessionStorage.getItem("chequeprint");
    var data = JSON.parse(chequeprint);
    console.log("data",data);
    this.companyName=data['companyName'];
    this.Address1=data['Address1'];
    this.Address2=data['Address2'];
    this.name=data['name'];
    this.amount = data['amount'];
    this.dated=data['dated'];
    this.description=data['description'];
    this.amountinword=data['amountInWords'];
    this.empno=data['empno'];
    this.designation=data['designation'];
    this.reqamount = data['advanceamt'];
    this.flag = data['flag'];
    this.LoginUser= data['LoginUser'];
    this.depthead= data['depthead'];
    
    
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
  
    this.router.navigate(['/advance-imperest-approval/H'], {skipLocationChange:true});
  
}
 
}