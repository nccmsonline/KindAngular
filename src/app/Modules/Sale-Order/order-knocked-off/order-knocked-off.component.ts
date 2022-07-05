import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { Global } from 'src/app/Global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-knocked-off',
  templateUrl: './order-knocked-off.component.html',
  styleUrls: ['./order-knocked-off.component.css']
})
export class OrderKnockedOffComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  datePipe = new DatePipe("en-US");
  original_url = environment.baseUrl;
  billseriesList:Array<any>=[];
  miniDate=new Date();maxDate=new Date();
  userid:any;token:any;
  customerList:Array<any>=[];
  itemList:Array<any>=[];
  CUSTOMERID=0;
  BILLSERIESID=0;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  allData:any={};isLoadingResults=false;
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = ['act','orderno','orderdate','billtype','party' ,'itemCode', 'orderpcs','orderkg', 'Despatchpcs', 'Despatchkgs', 'balancepcs', 'balancewt'];
  constructor(public dialog: MatDialog, private http: HttpClient,public AppUser:Global) {
      this.miniDate = new Date( AppUser.FinancialYearStartDate);
      this.maxDate = new Date( AppUser.FinancialYearEndDate);
      this.userid = AppUser.UserId;
      this.token = AppUser.Token;
      this.dateFormControl.setValue(this.miniDate);
      this.dateToControl.setValue(this.maxDate);
   }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleOrder/getOrderLoadEvent?token="+this.token).subscribe((res)=>{
      console.log("ravi", res);
      this.allData=res;
      this.customerList=this.allData.Table;
      this.billseriesList=this.allData.Table1;
      this.isLoadingResults=false;
      });

    
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  SaveKnockedoffOrder()
  {
    this.isLoadingResults=true;
    let list:Array<any>=[];
    let returnval:any;
    this.fieldArray.data.forEach((el)=>{
      let tmp:any={};
      if(el.CHK==true)
      {
        tmp.BALANCEQTYPCS=el.BALANCEQTYPCS;
        tmp.BALANCEQTYKGS=el.BALANCEQTYKGS;
        tmp.SRID=el.SRID;
        list.push(tmp);
      }
    });
    console.log("data",list);
    const  params = new  HttpParams()
    .set('token', this.AppUser.Token)
    .set('list', JSON.stringify(list));
    
    
    this.http.post(this.original_url+"/SOP/SaleOrder/KnockOffSaleOrder?", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).subscribe((res) => {
        returnval=res;
        console.log("res", res);
        if (parseInt(returnval)>0)
        {
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'sucess',
                    displayMsg:'Data Saved'
                  }
                });
                this.onCustomerChange();
        }
        else
        {
                  const dialogRef = this.dialog.open(SuccessDialogComponent, {
                    data: {
                      wrongData: 'wrongData',
                      displayMsg:'Somthing went wrong'
                    }
                  });
        }
        this.isLoadingResults=false;
      },
      error=>{
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Somthing went wrong'
          }
        });
        this.isLoadingResults=false;
      });
  }
  onCustomerChange(){
    var FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy');
    var ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy');

    this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleOrder/GetPendingOrderList?fromdate="+FromDate+"&todate="+ToDate+"&partyid="+this.CUSTOMERID+"&billSeriesId="+this.BILLSERIESID+"&token="+this.token).subscribe((res)=>{
      console.log("ravi", res);
      this.allData=res;
      this.fieldArray.data=this.allData.Table;
      this.isLoadingResults=false;
      });
  }
}
