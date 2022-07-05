
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { environment } from '../../../../environments/environment';

////import { error } from 'console';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  original_url=environment.baseUrl;
  allData:any;selectedDevice:any;
  newData:any;FYUSER:any;ServerIP:any; boid : any;  myDate = new Date();dateFormControl = new FormControl(new Date());datePipe = new DatePipe("en-US");TodayDay:any;
  sale: sale[] = []; item: item[] = [];isLoadingResults:boolean;userid:any;token:any; 
  saleFieldArray :Array<any>=[];criticalFieldArray:Array<any>=[];urgentFieldArray :Array<any>=[];
mydata:any={};
options: any;
  data: any;
  pcdata: any;
  cpoptions: any;
  minmumLevelStockList:Array<any>=[];
  pType="S";
  constructor(public dialog: MatDialog,private http: HttpClient) { 
    
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    
    var TodayDate = new FormControl(CompanyData['WORKINGDATE']);
    this.TodayDay=this.datePipe.transform(TodayDate.value, 'dd-MMM-yyyy') ;

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
  
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.options = {
      title: {
          display: true,
          text: 'Sale v/s Purchase',
          fontSize: 16
      },
      legend: {
          position: 'bottom'
      }
  };

  this.cpoptions = {
    title: {
        display: true,
        text: 'Purchase v/s Consumption',
        fontSize: 16
    },
    legend: {
        position: 'bottom'
    }
};

    this.isLoadingResults=true;
    //this.getchart();
    this.getData();
    
  }

  showChartData(data)
  {
    
    if(data=="Monthly")
    {
      this.newData = this.allData.Table3;
      this.data=this.newData[0];
      this.pcdata=this.newData[2];
    }
    else
    {
      this.newData = this.allData.Table3;
      this.data=this.newData[1];
      this.pcdata=this.newData[3];
    }
  }
  ngOnInit() {
  }
  openDialog(fromdate:any, todate:any) {
      const dialogRef = this.dialog.open(SaleDetailComponent, {
        data: {
          fromDate:fromdate,
          toDate:todate        }
      });
  }
  showMinimumLevel()
  {
    this.isLoadingResults=true;
    
    this.http.get(this.original_url+"/PurachaseAndStore/Store/getMinimumLevelStockList?flag="+this.pType+"&token="+this.token)
    .subscribe((res) => {
       this.allData=res; 
       this.minmumLevelStockList=this.allData.Table;
       this.isLoadingResults=false;
       console.log("ravi",  this.data);
    },
    error=>{alert("Some thing went Wrong"); this.isLoadingResults=false;});
  }
  showStockPopup(flag, itemid, qty)
  {
    if(qty<=0)
    {
      return;
    }
    var mhtml="";
    this.isLoadingResults=true;
    let list:Array<any>=[];
    this.http.get(this.original_url+"/PurachaseAndStore/Store/getStockListPopup?flag="+flag+"&itemid="+itemid+"&token="+this.token)
    .subscribe((res) => {
       this.allData=res; 
       list=this.allData.Table;
       mhtml="<table border='1'>"
       if(flag=='I')
       {mhtml=mhtml+"<tr><th  style='width: 100px;text-align: right;'>Indent No.</th><th style='width: 90px;text-align: right;'>Indent Date</th><th style='width: 90px;text-align: right;'>Pending Qty</th> <tr>";}
       else if(flag=='P')
       {mhtml=mhtml+"<tr><th style='width:200px;'>Party Name</th><th  style='width: 100px;text-align: right;'>Order No.</th><th style='width: 90px;text-align: right;'>Order Date</th><th style='width: 90px;text-align: right;'>Pending  Qty</th> <tr>";}
       else
       {mhtml=mhtml+"<tr><th style='width:200px;'>Party Name</th><th  style='width: 100px;text-align: right;'>MRIR No.</th><th style='width: 90px;text-align: right;'>MRIR Date</th><th style='width: 90px;text-align: right;'>Rect  Qty</th> <tr>";}

       list.forEach((el)=>{
            if(flag=='I')
            {
            mhtml=mhtml+"<tr><td style='width: 100px;text-align: right;'>"+ el.INDENTNO  + 
                      "</td><td style='width: 90px;text-align: right;'>"+formatDate(el.INDENTDATE, 'dd-MM-yyyy', 'en-US', '+0530')+
                      "</td><td style='width: 90px;text-align: right;'>"+el.PENDINGQTY+
                      "</td></tr>";
            }
            else if(flag=='P')
            {
              mhtml=mhtml+"<tr><td style='width: 200px;'>"+ el.NAME  + 
                    "</td><td style='width: 100px;text-align: right;'>"+ el.ORDERNO  + 
                    "</td><td style='width: 90px;text-align: right;'>"+formatDate(el.ORDERDATE, 'dd-MM-yyyy', 'en-US', '+0530')+
                    "</td><td style='width: 90px;text-align: right;'>"+el.PENDINGQTY+
                    "</td></tr>";
            }
            else
            {
              mhtml=mhtml+"<tr><td style='width: 200px;'>"+ el.NAME  + 
              "</td><td style='width: 100px;text-align: right;'>"+ el.INWARDNO  + 
              "</td><td style='width: 90px;text-align: right;'>"+formatDate(el.INWARDDATE, 'dd-MM-yyyy', 'en-US', '+0530')+
              "</td><td style='width: 90px;text-align: right;'>"+el.QTY+
              "</td></tr>";
            }
       });
       mhtml=mhtml+"</table>"
       this.isLoadingResults=false;
       console.log("res",res);
       const dialogRef = this.dialog.open(SuccessDialogComponent, {
         data: {
           wrongData: 'validation',
           displayMsg:mhtml
         }
       });



       this.isLoadingResults=false;
       console.log("ravi",  this.data);
    },
    error=>{alert("Some thing went Wrong"); this.isLoadingResults=false;});
  }
  showDetail(data)
  {
    this.openDialog(data.FROMDATE,data.TODATE);
  }
  // getchart()
  // {
  //   this.http.get("https://localhost:44398/api/accounts/payments/getChartData?serverip=112.196.6.170&fyuser=kind1920&boid=2&userid=10004&token=U2OQXN2NIN").subscribe((res)=>{
  //     this.mydata=res;
  //     this.data = this.mydata;
  //     console.log("Chart",this.data);
  //   });
  // }
  getData()
  {
    this.isLoadingResults=true;
   this.http.get(this.original_url+"/Accounts/Payments/getDashBoard?pdate="+this.TodayDay+"&token="+this.token)
   .subscribe((res) => {
    if(res=="Ravinder")
    {
      alert("Some thing went Wrong");
    }
    else
    {
      this.allData=res; // All data variable ki value main Bad me use ki Week and Month wise k liye
      this.newData = res;
      this.saleFieldArray=this.newData.Table;
      this.newData = res;
      this.criticalFieldArray=this.newData.Table1;
      this.newData = res;
      this.urgentFieldArray=this.newData.Table2;
      this.newData = this.newData.Table3;
      this.data=this.newData[0];
      this.pcdata=this.newData[2];
      this.isLoadingResults=false;
      console.log("ravi",  this.data);
    }
   });
  }
}
export class sale
{
  PARTICULAR:string;
  MGFWT:number;
  JOBWT:number;
  SCRAPWT:number;
  MGFAMT:number;
  JOBAMT:number;
  SCRAPAMT:number;
  FROMDATE:string;
  TODATE:string;
}
export class item
{
  ITEMNAME:string;
  STOCKINHAND:number;
  QUANTITY:number;

}