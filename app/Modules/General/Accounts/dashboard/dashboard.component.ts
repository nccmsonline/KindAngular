
import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { HttpClient } from "@angular/common/http";
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  newData:any;FYUSER:any;ServerIP:any; boid : any;  myDate = new Date();dateFormControl = new FormControl(new Date());datePipe = new DatePipe("en-US");TodayDay:any;
  sale: sale[] = []; item: item[] = [];isLoadingResults:boolean;
  saleFieldArray :Array<any>=[];criticalFieldArray:Array<any>=[];urgentFieldArray :Array<any>=[];
  constructor(public dialog: MatDialog,private http: HttpClient,@Inject('BASE_URL') private original_url : string) { 
    
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    var TodayDate = new FormControl(CompanyData['WORKINGDATE']);
    this.TodayDay=this.datePipe.transform(TodayDate.value, 'dd-MMM-yyyy') ;
    //console.log("CompanyData",TodayDate);
    this.isLoadingResults=true;
    this.getData();
    
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
  showDetail(data)
  {
    this.openDialog(data.FROMDATE,data.TODATE);
  }
  getData()
  {
   
   this.http.get(this.original_url+"/Accounts/Payments/getDashBoard?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&pdate="+this.TodayDay)
   .subscribe((res) => {
      this.newData = res;
      this.saleFieldArray=this.newData.Table;
      // this.saleFieldArray = this.newData;

      this.newData = res;
      this.criticalFieldArray=this.newData.Table1;
      // this.criticalFieldArray = this.newData;

      this.newData = res;
      this.urgentFieldArray=this.newData.Table2;
      // this.urgentFieldArray = this.newData;
      this.isLoadingResults=false;
    //  console.log(" this.urgentFieldArray", this.urgentFieldArray);
    //  console.log(" this.criticalFieldArray", this.criticalFieldArray);
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