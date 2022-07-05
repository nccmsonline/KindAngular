import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-gate-entry-list',
  templateUrl: './gate-entry-list.component.html',
  styleUrls: ['./gate-entry-list.component.css']
})
export class GateEntryListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;fendDate:any;
  newData:any={};isLoadingResults:any;
  userid:any;token:any;  original_url = environment.baseUrl;
  fstartDate:any;CompanyData:any={};allData:any={};
  WorkingDate:any;datePipe = new DatePipe("en-US");
  mrirArrayList = new MatTableDataSource<any>();
  displayedColumns: string[] = ['category','GINNo',  'dated', 'party','billno', 'billdate','challanno','challandate', 'print'];

  constructor(public dialog: MatDialog,  private http: HttpClient, private router: Router) 
  {
    let currentBranch = sessionStorage.getItem("currentBranch");
    this.CompanyData = JSON.parse(currentBranch);

    this.fstartDate=   this.CompanyData['WORKINGDATE'] ;
    var currentDate: Date = new Date( this.fstartDate);
    var y=currentDate.getFullYear(),m=currentDate.getMonth();
    this.fstartDate=new Date(y,m,1);
    this.fendDate= new Date ( this.CompanyData['WORKINGDATE']) ;
  
    
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
   }

  ngOnInit() {
    this.mrirArrayList.sort=this.sort;
    this.refreshMRIRList();
  }
  applyFilter(filterValue: string) {
    this.mrirArrayList.filter = filterValue.trim().toLowerCase();
  }
  refreshMRIRList()
  {
    let sDate= this.datePipe.transform( this.fstartDate, 'dd/MMM/yyyy') ;
    let eDate= this.datePipe.transform(this.fendDate, 'dd/MMM/yyyy') ;
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Store/getGateEnrtryList?fromdate="+sDate+"&todate="+eDate+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      this.mrirArrayList.data=this.allData.Table;
      this.isLoadingResults=false;
     });   
  }
  ShowGateEntryDetail(data)
  {
    if(data.STATUS=='E')
    {
      this.router.navigate(['/add-gate-entry/'+data.GINID+'/edit'], { queryParams:  filter, skipLocationChange: true});
    }
   else
   {
    this.router.navigate(['/add-gate-entry/'+data.GINID+'/view'], { queryParams:  filter, skipLocationChange: true});
   }
  }
  // printMRIR(INWARDID)
  // {
  //   let data:any={};
  //   this.isLoadingResults=true;
  //    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/PrintMRIR?inwardid="+INWARDID+"&token="+this.token).subscribe((res)=>{
  //     this.allData=res;
  //     console.log("Mrir Load", res);
  //     this.allData=this.allData.Table;
  //     data.header=this.allData[0];
  //     this.allData=res;
  //     data.detail=this.allData.Table1;
      
  //     data.title="MRIR";
  //     data.backto='/mrir-entery-list';
  //     sessionStorage.setItem('mrir', JSON.stringify(data));
  //     this.router.navigate(['/print-mrir']);

      
  //     this.isLoadingResults=false;
  //    },
  //    error=>{
  //      this.isLoadingResults=false;
  //    });  
  // }

}
