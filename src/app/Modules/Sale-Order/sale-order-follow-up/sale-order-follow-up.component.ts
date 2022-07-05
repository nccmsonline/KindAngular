import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from '.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {ExcelService} from '../../../services/excel/excel.service';
@Component({
  selector: 'app-sale-order-follow-up',
  templateUrl: './sale-order-follow-up.component.html',
  styleUrls: ['./sale-order-follow-up.component.css']
})
export class SaleOrderFollowUpComponent implements OnInit {
  customerOrderArray= new MatTableDataSource<any>();
  allData:any={};isLoadingResults:boolean;
  ServerIP:any;
  FYUSER:any;
  boid:any;
  userid:any;
  token:any;
  fendDate:any;
  fstartDate:any;
  datePipe = new DatePipe("en-US");
  displayedColumns: string[] = ['action', 'ORDERNO', 'ORDERDATE', 'NAME', 'ITEMCODE', 'ORDERQTY', 'BALANCEQTY', 'COMMITTEDDESPATCHDATE', 'FOLLOWUPDATE', 'NEXTFOLLOWUPDATE', 'print'];
  original_url=environment.baseUrl;
  dateFormControl = new FormControl(new Date());
  dateToControl = new FormControl(new Date());
  constructor(private http: HttpClient, public dialog: MatDialog,private excelService:ExcelService) { 
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.fendDate=  CompanyData['WORKINGDATE'] ;
    //this.fstartDate= CompanyData['FINANCIALYEARSTARTDATE'] ;

    var pdate =new Date(CompanyData['WORKINGDATE']);
    //var y=this.dated.getFullYear(),m=this.dated.getMonth();
    var y=pdate.getFullYear(),m=pdate.getMonth();
    this.fstartDate=new Date(y,m,1);

    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);
    this.dateToControl.setValue(currentDate);
    this.getData();
  }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    console.log("data",filterValue.trim().toUpperCase());
    this.customerOrderArray.filter = filterValue.trim().toLowerCase();
    console.log("list", this.customerOrderArray.data);
  }
  exportToExcel() {
    debugger;
    var data:Array<any>=[];
   // data.push(this.Header);
    this.customerOrderArray.data.forEach(el => {
      data.push({
        'Order No': el.ORDERREFNO,
        'Order Date':this.datePipe.transform(el.ORDERDATE, 'dd/MMM/yyyy') ,
        'Customer PO': el.CUSTOMERPO,
        'Name':el.NAME,
        'Item Code': el.ITEMCODE,
        'Order PCS': el.ORDERQTYPCS,
        'Dispatch PCS': el.DISPATCHQTYPCS,
        'Balance PCS': el.BALANCEQTYPCS,
        'Rate': el.RATE,
        'Committed Disp Dt':this.datePipe.transform(el.COMMITTEDDESPATCHDATE, 'dd/MMM/yyyy') 
      });
    });
    this.excelService.exportAsExcelFile(data, 'order list');
    
    }
  getData()
  {


    var FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy');
    var ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy');
    this.isLoadingResults=true;

    this.http.get(this.original_url+"/SOP/SaleOrder/PendingCustomerOrderFollowupList?fromdate="+FromDate+"&todate="+ToDate+"&token="+this.token+"&partyId=0&billSeriesId=0").subscribe((res)=>{
      this.allData=res;
      this.allData=this.allData.Table;
      this.customerOrderArray.data = this.allData;
      console.log("res",res);
      this.isLoadingResults=false;
});
  } 
  openMoreDialog(data): void {
    data.showEntry=false; 
    const dialogRef = this.dialog.open(DespatchFollowUp, {
      width: '600px',
      data: {data: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed1', result);
      if(result!='')
      {
        var fdata:any={};
        var fdata1:any={};
        fdata=result;
        fdata1=  this.customerOrderArray.data.find(x=>x.ORDERREFID==fdata.ORDERREFID&&x.ITEMID==fdata.ITEMID&&x.BRANDID==fdata.BRANDID);
        fdata1.NEXTFOLLOWUPDATE=fdata.NEXTFOLLOWUPDATE;
        fdata1.FOLLOWUPDATE=fdata.FOLLOWUPDATE;
      }
    });
  }
  openDialog(data): void {
    data.showEntry=true; 
    const dialogRef = this.dialog.open(DespatchFollowUp, {
      width: '600px',
      data: {data: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed1', result);
      if(result!='')
      {
        var fdata:any={};
        var fdata1:any={};
        fdata=result;
        fdata1=  this.customerOrderArray.data.find(x=>x.ORDERREFID==fdata.ORDERREFID&&x.ITEMID==fdata.ITEMID&&x.BRANDID==fdata.BRANDID);
        fdata1.NEXTFOLLOWUPDATE=fdata.NEXTFOLLOWUPDATE;
        fdata1.FOLLOWUPDATE=fdata.FOLLOWUPDATE;
      }
    });
  }
}



@Component({
  selector: 'followup',
  templateUrl: 'followup.html',
  styleUrls: ['./sale-order-follow-up.component.css']
})

export class DespatchFollowUp {
  original_url=environment.baseUrl;
  followupArray:Array<any>=[];
  showEntry:boolean=true;orderrefid:any;itemid:any;
  newData:any={};boid : any;FYUSER:any;ServerIP:any;userid:any;token:any;curDate:any;
  pData:any={}; datePipe = new DatePipe("en-US");
  constructor(private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DespatchFollowUp>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("itemanme",data);
      this.pData=data.data;
      
      this.newData.ITEMCODE=this.pData.ITEMCODE;
      this.orderrefid=this.pData.ORDERREFID;
      this.itemid=this.pData.ITEMID;
      this.showEntry=this.pData.showEntry;
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      this.curDate= CompanyData['WORKINGDATE'] ;
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
      http.get(this.original_url+"/SOP/SaleOrder/getSaleOrderFollowUp?token="+this.token+"&orderrefid="+this.orderrefid+"&itemid="+this.itemid).subscribe((res: any)=> {
              this.pData=res;
              console.log("MyData",res);
              this.followupArray=this.pData.Table;
             });
  }
  onNoClick(): void {
    var flag:boolean, msgBox:string;
    flag=true;
    console.log("this.newData.NEXTFOLLOWUPDATE",this.newData.NEXTFOLLOWUPDATE);

    var currDate1=new Date(this.curDate);
    var selectedDate=new Date(this.newData.NEXTFOLLOWUPDATE);
    selectedDate.setHours(selectedDate.getHours() + 23);

    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    if(this.newData.REMARKS=='' ||this.newData.REMARKS==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Remarks not entred."+'</li>';
    }
    if(this.newData.NEXTFOLLOWUPDATE=='' ||this.newData.NEXTFOLLOWUPDATE==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Next Followupdate not entred."+'</li>';
    }
    if((this.newData.NEXTFOLLOWUPDATE!='' ||this.newData.NEXTFOLLOWUPDATE!=undefined) && selectedDate<=currDate1)
    {
      flag=false;
      msgBox=msgBox+"<li>Next Followup date should not before current date."+'</li>';
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
    else
    {
      this.newData.FOLLOWUPDATE=this.datePipe.transform(currDate1, 'dd-MMM-yyyy');
      this.newData.ITEMID=this.pData.ITEMID;
      this.newData.ORDERREFID=this.pData.ORDERREFID;
      this.newData.BRANDID=this.pData.BRANDID;

    //  this.dialogRef.close( this.newData);
      this.newData.NEXTFOLLOWUPDATE=this.datePipe.transform(this.newData.NEXTFOLLOWUPDATE, 'dd-MMM-yyyy');
      var arrayList:any=[];
      arrayList.push(this.newData);
      this.http.post(this.original_url+"/SOP/SaleOrder/saveFollowup?followuplist="+JSON.stringify(arrayList)+"&userid="+this.userid+"&token="+this.token, {data: ''}).subscribe((res: any)=> {
    
     console.log("ts",res);
     if(res==1)
     {
          this.dialogRef.close( this.newData);
     }
   

    });
    }
   
  }
}