
import { Component, Inject, OnInit,  ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { ConfirmAlertComponent } from '../../../confirm-alert/confirm-alert.component';
import { FileDownloadUploadService } from "../../../../app/file-download-upload.service";
import { environment } from '../../../../environments/environment';

import { parseNumber } from '@progress/kendo-angular-intl';
import { Global } from 'src/app/Global';


@Component({
  selector: 'app-proforma-list',
  templateUrl: './proforma-list.component.html',
  styleUrls: ['./proforma-list.component.css']
})

export class ProformaListComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  progress:any;
  myFile:any;
  lEmailid="";
  original_url=environment.baseUrl;
  invPro:any=[];proforma_invoice:any;
  toSaveInvList:Array<any>=[];
  SaleOrder: FormGroup;isLoadingResults:boolean;
  displayedColumns: string[] = ['pass','proforma','dated','amount','type', 'customer', 'billtocustomer', 'docno','pcs','weight','vehicleno','ewaybill', 'print','einvoice','printVehicle'];
  invlit:InvList[]=[];
  //fieldArray = new MatTableDataSource<any>();
  //fieldArray = new MatTableDataSource<InvList>(this.invlit);
  pType="E";
  fieldArray = new MatTableDataSource<any>();
  itemDisplay: any={};companyData:any;COMPANYGSTNO:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  fstartDate:any;userid:any;token:any;
  fendDate:any;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  filterTypes:Array<any>=[];
  currentRow:any={};
  constructor(private router: Router, private fb: FormBuilder,private http: HttpClient,  public dialog: MatDialog,private upload:FileDownloadUploadService) { 
    this.createForm();  
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    this.fendDate=  this.companyData['WORKINGDATE'] ;
    this.fstartDate= this.companyData['WORKINGDATE'] ;
    this.COMPANYGSTNO= this.companyData['COMPANYGSTNO'] ;
    
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);
    this.dateToControl.setValue(currentDate);
    this.proforma_invoice='P'
    this.invPro.push({id:'P',description:'Proforma'}) ;
    this.invPro.push({id:'I',description:'Invoice'}) ;

    this.filterTypes.push({id:'O',description:'Original'});
   this.filterTypes.push({id:'D',description:'Duplicate'});
   this.filterTypes.push({id:'T',description:'Triplicate'}) ;
   this.filterTypes.push({id:'E',description:'Extra'}) ;
   
   
    this.getInvoiceList();
  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
  }
  validateEwayBill(row)
  {
    var flag:boolean;
  flag=true;
  var mdate = new Date();
  var msg:any;
  console.log("row data",row);
  if(row.PROFORMAINV=="P")
  {
    return;
  }
  msg="Please rectify following mistakes:-"+'<br><br> <ul>';
  if((row.SHIPTOGSTNO==undefined||row.SHIPTOGSTNO==''||row.SHIPTOGSTNO==null) && row.SHIPTOCUSTOMERID!=row.CUSTOMERID)
  {
    flag=false; msg=msg+"<li>Ship to Customer GSTIn not entred.</li>";
  }  
  if((row.SHIPTOPIN==undefined||row.SHIPTOPIN==''||row.SHIPTOPIN==null) && row.SHIPTOCUSTOMERID!=row.CUSTOMERID)
  {
    flag=false; msg=msg+"<li>Ship to Customer Pin Code not entred.</li>";
  }  
  if((row.SHIPTODISTANCEKM==undefined||row.SHIPTODISTANCEKM==0||row.SHIPTOPIN==null) && row.SHIPTOCUSTOMERID!=row.CUSTOMERID)
  {
    flag=false; msg=msg+"<li>Ship to Customer Distance not entred.</li>";
  } 

  if(row.GSTNO==undefined||row.GSTNO==''||row.GSTNO==null)
  {
    flag=false; msg=msg+"<li>Customer GSTIn not entred.</li>";
  }  
  if(row.PIN==undefined||row.PIN==''||row.PIN==null)
  {
    flag=false; msg=msg+"<li>Customer Pin Code not entred.</li>";
  }  
  if(row.DISTANCEKM==undefined||row.DISTANCEKM==0||row.DISTANCEKM==null)
  {
    flag=false; msg=msg+"<li>Customer Distance not entred.</li>";
  } 
  if((row.BILLSERIESID==2||row.BILLSERIESID==3)&&(row.DCNO==null||row.DCNO==''))
  {
    flag=false; msg=msg+"<li>Delivery challan not generated.</li>";
  } 
     msg=msg+"</ul>";
     if(flag==false)
     {
      console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     }
     else
     {
     //  alert("hi ravi");
      if(row.EWAYBILLNO!=null)
      {
        this.printVehicleEwayBill(row);
      }
      else
      {
        this.generateEWayBill(row);
      }
       
     }
   
  }
  RefreshToken()
  {
    const params = new  HttpParams()
    .set('token', this.token)
      this.http.post(this.original_url+"/sop/SaleInvoice/RefreshGSTToken", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
    this.isLoadingResults=false;

    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
    this.getInvoiceList();
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
  CancelEInvoice()
  {
    let dailogResult="";
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg:'Do you want to Cancel E-Invoice?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    dailogResult=result;
    if(dailogResult=="ok")
    {
          this.isLoadingResults=true;
          let ewayBillList:Array<any>=[];
          this.fieldArray.data.forEach(el=>{
              if(el.checked)
              {
                let tmp:any={};
                try
                {
                  //let ewaybill=parseNumber( el.EWAYBILLNO);
                  tmp.INVID=el.INVID;
                  tmp.Irn=el.IRN;
                  tmp.CnlRsn=3;
                  tmp.CnlRem='Data Entry Mistake'; 
                  ewayBillList.push(tmp);
                }
                catch(error)
                {
      
                }
              }
          });
          if(ewayBillList.length>0)
          {
            const params = new  HttpParams()
            .set('token', this.token)
            .set('list', JSON.stringify(ewayBillList));
              this.http.post(this.original_url+"/sop/SaleInvoice/CancelEInvoice", params.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .subscribe((res) => {
            this.isLoadingResults=false;
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess'
              }
            });
            this.getInvoiceList();
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
        }
      });

  }
  CancelEwayBill()
  {
    let dailogResult="";
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg:'Do you want to Cancel E-Way Bill?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    dailogResult=result;
    if(dailogResult=="ok")
    {
          this.isLoadingResults=true;
          let ewayBillList:Array<any>=[];
          this.fieldArray.data.forEach(el=>{
              if(el.checked)
              {
                let tmp:any={};
                try
                {
                  let ewaybill=parseNumber( el.EWAYBILLNO);
                  tmp.INVID=el.INVID;
                  tmp.ewbNo=ewaybill;
                  tmp.cancelRsnCode=3;
                  tmp.cancelRmrk='Data Entry Mistake'; 
                  ewayBillList.push(tmp);
                }
                catch(error)
                {
      
                }
              }
          });
          if(ewayBillList.length>0)
          {
            const params = new  HttpParams()
            .set('token', this.token)
            .set('list', JSON.stringify(ewayBillList));
              this.http.post(this.original_url+"/sop/SaleInvoice/CancelEWayBill", params.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .subscribe((res) => {
            this.isLoadingResults=false;
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess'
              }
            });
            this.getInvoiceList();
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
        }
      });
  }
  onInvChecked(checked, data)
  {
    if(checked)
    {
      this.currentRow=data;
    }
  }
  generateEInvoice(row)
  {
    let retData:Array<any>=[];
    let myData:any={};
    let dailogResult="";
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg:'Do you want to Generate E-Invoice?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    dailogResult=result;
    if(dailogResult=="ok")
    {
      this.isLoadingResults=true;
            var Dated=this.datePipe.transform(row.INVDATE, 'dd/MMM/yyyy');
            const params = new  HttpParams()
            .set('token', this.token)
            .set('Dated', Dated)
            .set('vehicleno',row.VEHICLENO)
            .set('invid',row.INVID);
               this.http.post(this.original_url+"/sop/SaleInvoice/GenerateEInvoice", params.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .subscribe((res) => {
            console.log("Einv",res);
            myData=res;
            retData=myData;
            myData=retData[0];
            retData=myData.ErrorDetails;
            if(myData.Status=="0")
            {
                    let msg="";
                    msg="error found in following invoice:-"+'<br><br> <ul>';
                    retData.forEach((el)=>{
                      msg=msg+"<li>" + el.ErrorMessage+ ".</li>";
                    });
                    if(myData.error!=null)
                    {
                      msg=msg+"<li>" + myData.error+ ".</li>";
                    }
                    this.isLoadingResults=false;
                    msg=msg+"</ul>";
                    const dialogRef = this.dialog.open(SuccessDialogComponent, {
                      data: {
                        wrongData: 'validation',
                        displayMsg:msg
                      }
                    });
            }
            else
            {
              this.isLoadingResults=false;
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'sucess'
                }
              });
              this.getInvoiceList();
            }
            
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
      });
  }
  CompletePack()
  {
    let flag=false;
    this.fieldArray.data.forEach((el)=>{
      if(el.checked)
      {
        el.checked=false;
        flag=true;
      }
    });
    if(!flag)
    {
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'Please select atleast one Invoice'
        }
      });
      return;
    }
    this.isLoadingResults=true;
    var ToDate=this.datePipe.transform(this.currentRow.INVDATE, 'dd/MMM/yyyy');
    this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/VehicleWiseInvPackPrint?token='+this.token+"&VehicleNo="+this.currentRow.VEHICLENO+"&InvDate="+ToDate+"&copy="+this.pType).subscribe(res => {
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
  }
  printVehicleEwayBill(row)
  {
    this.isLoadingResults=true;
    var Dated=this.datePipe.transform(row.INVDATE, 'dd/MMM/yyyy');
    var InvList:Array<any>=[];
    var toSaveInvList:Array<any>=[];
    let dailogResult="";
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg:'Do you want to Print E-Way Bill?'
      }
    });
      dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      dailogResult=result;
      console.log('The dialog was closed1',dailogResult);
    if(dailogResult=="ok")
    {
      this.isLoadingResults=true;
       this.upload.downloadPDF(this.original_url+ '/sop/SaleInvoice/getDetailForPrinEwayBillNew?token='+this.token+"&invid=-1&Dated="+Dated+"&vehicleNo="+row.VEHICLENO).subscribe(res => {
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
    //   const params = new  HttpParams()
    //   .set('serverip', this.ServerIP)
    //   .set('fyuser', this.FYUSER)
    //   .set('boid', this.boid)
    //   .set('userid', this.userid)
    //   .set('token', this.token)
    //   .set('vehicleNo', row.VEHICLENO)
    //   .set('invid', "-1")
    //   .set('dated', Dated);
    //     this.http.get(this.original_url+"/sop/SaleInvoice/getDetailForPrinEwayBillNew?"+ params.toString(), {
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //   }).subscribe((res) => {
    //      this.itemDisplay=res;
    //      let tmpInvList:Array<any>=[];
    //      tmpInvList=this.itemDisplay;
    //      for(let i = 0; i < this.itemDisplay.length; i++)
    //      {
    //       this.ShowPDFFile( this.itemDisplay[i]);
    //      }
    //      console.log("InvLisyt", this.itemDisplay);
    
    //   },
    //   error=>{
    //     this.isLoadingResults=false
    //   var erroremsg:any;
    //   erroremsg=error.message;
    //   const dialogRef = this.dialog.open(SuccessDialogComponent, {
    //     data: {
    //       wrongData: 'wrongData',
    //       displayMsg:erroremsg
    //     }
    //   });
    // });
  }});
  }
  printEwayBill(row)
  {
    var Dated=this.datePipe.transform(row.INVDATE, 'dd/MMM/yyyy');
    var InvList:Array<any>=[];
    var toSaveInvList:Array<any>=[];
    let dailogResult="";
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg:'Do you want to Print E-Way Bill?'
      }
    });
      dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      dailogResult=result;
      console.log('The dialog was closed1',dailogResult);
    if(dailogResult=="ok")
    {
      this.isLoadingResults=true;
      const params = new  HttpParams()
     
      .set('token', this.token)
      .set('vehicleNo', row.VEHICLENO)
      .set('invid', row.INVID)
      .set('dated', Dated);
        this.http.get(this.original_url+"/sop/SaleInvoice/getDetailForPrinEwayBill?"+ params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).subscribe((res) => {
         this.itemDisplay=res;
         let tmpInvList:Array<any>=[];
         tmpInvList=this.itemDisplay;
         
         this.ShowPDFFile(tmpInvList[0]);
         if(tmpInvList[1]!=undefined)
         {
            this.ShowPDFFile(tmpInvList[1]);
         }
         console.log("InvLisyt", this.itemDisplay);
         // this.isLoadingResults=false
      },
      error=>{
        this.isLoadingResults=false
      var erroremsg:any;
      erroremsg=error.message;
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:erroremsg
        }
      });
    });
  }});
  }
  ShowPDFFile(data)
  {
    this.upload.downloadEwayBill1('1621852619','kind@1983',this.COMPANYGSTNO,data).subscribe(res => {
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
  }
  generateEWayBill(row)
  {
    let errorList:Array<any>=[];
    var iserror=false;
    var Dated=this.datePipe.transform(row.INVDATE, 'dd/MMM/yyyy');
    var InvList:Array<any>=[];
    var toSaveInvList:Array<any>=[];
    let dailogResult="";
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg:'Do you want to Generate E-Way Bill?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      dailogResult=result;
      console.log('The dialog was closed1',dailogResult);
    if(dailogResult=="ok")
    {
      this.isLoadingResults=true;
      const params = new  HttpParams()
    
      .set('token', this.token)
      .set('vehicleNo', row.VEHICLENO)
      .set('dated', Dated);
        this.http.get(this.original_url+"/sop/SaleInvoice/GenerateEWayBill?"+ params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).subscribe((res) => {
         this.itemDisplay=res;
          console.log("InvLisyt", this.itemDisplay);
          let tmp:Array<any>=[];
          tmp=this.itemDisplay;
          tmp.forEach((el) => {
              let data= this.fieldArray.data.find(x=>x.INVID==el.INVID);
              let tmp=el.error;
                if(el.ewayBillNo!=null)
                {
                  data.COLORCODE=el.COLORCODE;
                  data.EWAYBILLNO=el.ewayBillNo;
                }
                else if(tmp.error_cd!=null)
                {
                  //errorList.add;
                  errorList.push({invno:el.INVOICENO,error:tmp.message});
                  iserror=true;
                }
          });
          if(iserror)
          {
            let msg="";
            msg="error found in following invoice:-"+'<br><br> <ul>';
            errorList.forEach((el)=>{
              msg=msg+"<li>" + el.invno+ " --> "+ el.error+ ".</li>";
            });
           

            msg=msg+"</ul>";
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'validation',
                displayMsg:msg
              }
            });

          }
          console.log("return data",this.fieldArray.data);     
          this.isLoadingResults=false
      },
      error=>{
        this.isLoadingResults=false;
      var erroremsg:any;
      erroremsg=error.message;
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:erroremsg
        }
      });
    });
  }});
    console.log("ToSaveInvLisyt", toSaveInvList);
  } 
  
  getInvoiceList()
  {
    var FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy');
    var ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy');
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/sop/SaleInvoice/getProformaAndInvoiceList?serverip="+this.ServerIP+
    "&fyuser="+this.FYUSER+"&boid="+this.boid+"&fromdate="+FromDate+"&todate="+ToDate+"&userid="+this.userid+"&token="+this.token+"&p_i="+this.proforma_invoice).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.isLoadingResults=false
      });
  }

  applyFilter(filterValue: string) {
    //console.log("data",filterValue.trim().toUpperCase());
    this.fieldArray.filter = filterValue.trim().toLowerCase();
    //console.log("list", this.fieldArray.data);
  }
  
  onToDateChanged1()
  {
    console.log("ravi");
    this.getInvoiceList();
  }
  
  createForm() {
    this.SaleOrder = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
  openProforma(invid)
  {
    // this.router.navigate(['/add-new-customer-order/'+oaid+'/edit']);
 
  }
  print(invid)
  {
    //this.router.navigate(['/gstbill-print/'+invid]);
    this.isLoadingResults=true;


    this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/InvPrint?token='+this.token+"&invid="+invid+"&copy="+this.pType).subscribe(res => {
     // this.upload.downloadPDF(this.original_url+ '/sop/SaleInvoice/getDetailForPrinEwayBill?token='+this.token+"&invid="+invid).subscribe(res => {
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
    
  }
  sendMail()
  {
    this.isLoadingResults=true;
    let ewayBillList:Array<any>=[];
    let i=0, ids="";
    this.fieldArray.data.forEach(el=>{
        if(el.checked)
        {
          if(i>0)
          {ids=ids+", "+el.INVID}
          else
          {ids=el.INVID}
          i++;
        }
    });
    if(this.lEmailid==undefined||this.lEmailid=='')
    {
      this.showMsg( 'validation','Email id not entred.');
      this.isLoadingResults=false; 
    }
    else if(i>0)
    {
      const params = new  HttpParams()
      .set('token', this.token)
      .set('ids', ids)
      .set('emailid',this.lEmailid);
        this.http.post(this.original_url+"/sop/SaleInvoice/InitiateEmail", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
      this.isLoadingResults=false;
        let retVal=res;
        if(retVal>0)  
        {
          this.showMsg( 'sucess','');
          this.getInvoiceList();
        }
        else
        {
          this.showMsg( 'sucess','Some thing went wrong');
        }
      
      },
      error=>{
        var erroremsg:any;
        erroremsg=error.message;
        this.showMsg( 'wrongData',erroremsg);
        this.isLoadingResults=false; 
      });
    }
    else
    {
      this.showMsg( 'validation','Invoice not select.');
      this.isLoadingResults=false; 
    }
  }
  showMsg(pMsgType, pMsg)
  {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: pMsgType,
        displayMsg:pMsg
      }
    });
  }
  printVehicleWiseInvoice(vehicleno, invDate)
  {
    this.isLoadingResults=true;
    var ToDate=this.datePipe.transform(invDate, 'dd/MMM/yyyy');
    this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/VehicleWiseInvPrint?token='+this.token+"&VehicleNo="+vehicleno+"&InvDate="+ToDate+"&copy="+this.pType).subscribe(res => {
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
  }
  // test1()
  // {
  //   this.upload.downloadPDF('https://localhost:44398/api/tools/PFCreater/InvPrint?token='+this.token+"&invid=210837").subscribe(res => {
  //     console.log(res);
  //      var newBlob = new Blob([res], { type: "application/pdf" });
  //      console.log("ravi",res);
  //      var newurl = window.URL.createObjectURL(newBlob);
  //      window.open(newurl);
  //      this.isLoadingResults=false;
  //   }, error => {
  //     this.isLoadingResults=false
  //     console.log(error);
  //   });
  // }
  ravinder()
  {
    // console.log("My Data");
    // this.http.get(this.original_url+ "/tools/PFCreater/ConvertPdf1").subscribe(res=>{});
   this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/PrintAdvanceSlip?token='+this.token+"&pReqID=5145").subscribe(res => {
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

    // this.upload.downloadPDF('https://localhost:44398/api/tools/Pdf/ConvertPdf').subscribe(res => {
    //   console.log(res);
    //    var newBlob = new Blob([res], { type: "application/pdf" });
    //    console.log("ravi",res);
    //    var newurl = window.URL.createObjectURL(newBlob);
    //    window.open(newurl);
    //    this.isLoadingResults=false;
    // }, error => {
    //   this.isLoadingResults=false
    //   console.log(error);
    // });
  }
  AddExportInvDetail(data)
  {
    console.log("hi ravi");
    let ItemDetail:Array<any>=[];
    const dialogRef1 = this.dialog.open(ExportInvoiceShippingDetailComponent, {
      data: {
        invData: data
      }
    });
  }
}

@Component({
  selector: 'exportSaleDetail',
  templateUrl: './exportSaleDetail.html',
  styleUrls: ['./proforma-list.component.css']
})
export class ExportInvoiceShippingDetailComponent implements OnInit {
  newData:any={};allData:any={};
  isLoadingResults=false;
  original_url = environment.baseUrl;
  CountryCodeArry:Array<any>=[];
  PortCodeArry:Array<any>=[];
  CurrencyCodeArry:Array<any>=[];
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private router: Router, public dialog: MatDialog, public AppUser:Global, private http: HttpClient) {
    this.isLoadingResults=true;
    this.allData=data.invData;
    this.http.get(this.original_url+"/SOP/SaleInvoice/GetExportInvDetailOnLoad?token="+this.AppUser.Token+"&invid="+this.allData.INVID).subscribe((res)=>{
      this.allData=res;
      console.log("inv detail",res);
      this.CountryCodeArry=this.allData.Table2;
      this.PortCodeArry=this.allData.Table1;
      this.CurrencyCodeArry=this.allData.Table;
      this.newData=this.allData.Table3[0];
      console.log("inv newData",this.newData);
      if(this.newData.REFUNDCLAIM=="Y")
      {
        this.newData.REFUNDCLAIM=1;
      }
      else
      {
        this.newData.REFUNDCLAIM=0;
      }
      this.isLoadingResults=false;
     });  
   }

  ngOnInit() {

}
onNoClick()
{
  this.isLoadingResults=true;
      if(this.newData.REFUNDCLAIM==1)
      {
        this.newData.REFUNDCLAIM1="Y";
      }
      else
      {
        this.newData.REFUNDCLAIM1="N";
      }

      if(this.newData.SHIPPINGBILLDATE!=""&&this.newData.SHIPPINGBILLDATE!=null)
      {
        this.newData.SHIPPINGBILLDATE1=formatDate(this.newData.SHIPPINGBILLDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); ;
      }

      this.allData=this.data.invData;
      const params = new  HttpParams()
      .set('token', this.AppUser.Token)
      .set('invid', this.allData.INVID)
      .set('expData',JSON.stringify(this.newData))
        this.http.get(this.original_url+"/sop/SaleInvoice/SaveExportInvDetail?"+ params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).subscribe((res) => {
         this.allData=res;
          this.isLoadingResults=false
          this.dialog.closeAll();
      },
      error=>{
        this.isLoadingResults=false;
      var erroremsg:any;
      erroremsg=error.message;
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:erroremsg
        }
      });
    });

}
}

export class InvList
{
  SRNO: number;
INVID: number;
INVDATE: string;
INVNO: number;
SHIPTOPIN: string;
SHIPTODISTANCEKM: number;
SHIPTOGSTNO: string;
PROFORMATYPE: string;
CUSTOMER: string;
GSTNO: string;
PIN: string;
DISTANCEKM: number;
BILLTOCUSTOMER: string;
CUSTOMERID: number;
SHIPTOCUSTOMERID: number;
CONFIRMEDINVID: number;
TOTALAMT: number;
TOTALQTY: number;
NETWT: number;
VEHICLENO: string;
COLORCODE:string;
BILLSERIESID: number;
DCNO: number;
DCRATE: number;
INPUTSALE: string;
BRANCHID: number;
ACCOUNTID: number;
CURRENTBALANCE: number;
CREDITLIMIT: number;
EWAYBILLNO: string;
PROFORMAINV: string;
EINVACKNO:number;
}