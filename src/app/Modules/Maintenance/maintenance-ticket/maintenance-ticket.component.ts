import { Global } from '../../../Global';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-maintenance-ticket',
  templateUrl: './maintenance-ticket.component.html',
  styleUrls: ['./maintenance-ticket.component.css']
})
export class MaintenanceTicketComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  original_url = environment.baseUrl;
  pageIndex: any;
  sortOrder: any;
  sortSelection: any;
  resultsLength = 0;
  isLoadingResults = true;
  itemCount: any;
  itemDisplay: any;
  userinfo: any;
  coid: any;
  boid: any;
  userid:any;
  page: any;
  search:any;
  name:any;
  pagenumber:any;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['mtno', 'mtdate', 'MachineName', 'mtduedate', 'mono', 'modate','mtassetlocation','empname','deptname','mtdelaydays', 'mtstatus'];
  ticketArray = new MatTableDataSource<Maintenace>();
  keys: string[] = [];
  searchText: string;
  p: number = 1;
  itemPerPage = '10';
  branch1info: any;
  branch2Data:any;
  fyid:any;
  appraiseltosave : Array<any>=[];
  statuschange: any;
  type:any;
  statusarray: Array<any> = [];
  myDate = new Date();
  fromDate:any;
  toDate:any;
  newData: any={};
  fystartdate:any;
  fyenddate:any;
  productname: any;
  ticketname: any;
  showreset: boolean= false;
  enqtype: any;
  filterarray:Array<any>=[];
  itemtype: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private globalVar: Global
  ) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    // // this.coid = this.userinfo['coid'];
    // // this.userid = this.userinfo['userid'];

    // // let branch1 = sessionStorage.getItem("branch1");
    // // this.branch1info = JSON.parse(branch1);
    // // this.boid = this.branch1info['boid'];

    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // // this.fyid = this.branch2Data['fyid'];
    // // this.fystartdate = this.branch2Data['fystartdate'];
    // this.fyenddate = this.branch2Data['fyenddate'];

    // this.newData.fromdate=this.fystartdate;
    // this.newData.todate=this.fyenddate;
    this.itemtype ="open";

    this.filterarray=[{id:"name",name:"Machine Name"},{id:"maintticketno",name:"Ticket No."}];
    this.enqtype=this.filterarray[0].id;

  

  }

  ngOnInit() {
    this.ticketArray.sort = this.sort;
    this.ticketArray.paginator=this.paginator;
    this.refresh();
  }


  applydateFilter(event){
    // this.fromDate = formatDate(event.fromdate, 'yyyy-MM-dd', 'en-US');
    // this.toDate = formatDate(event.todate, 'yyyy-MM-dd', 'en-US');
    this.paginator.pageIndex=0;
    this.refresh();
  }

  changetype(event)
  {
    this.itemtype=event.value;   
    this.refresh();
  }
  

  // changeStatus(event){
  //   if(event.length == 0)
  //   {
  //     this.statuschange = '';
  //   }
  //   else
  //   {
  //     this.statuschange = event[0];
  //     this.statuschange = this.statuschange.data;
  //     this.statuschange = this.statuschange.id;
  //     this.type='mtstatus';
  //   }
  //   this.paginator.pageIndex=0;
  //   this.refresh();
  // }

  // // Search Filter
  // applyFilter(event){
  //   if(event!=undefined){
  //     this.search=event;
  //     this.refresh();
  //   }
  // }
  // Search Filter
  applyFilter(event){

    // this.fromDate=formatDate(this.newData.fromdate, 'yyyy-MM-dd', 'en-US');
    // this.toDate=formatDate(this.newData.todate, 'yyyy-MM-dd', 'en-US');
    if(event!=undefined){
      if (this.enqtype == 'name') {
        this.ticketname = '';
        this.search = this.productname;
      }
      else if (this.enqtype == 'maintticketno') {
        this.productname = '';
        this.search = this.ticketname;
      }
      this.paginator.pageIndex=0;
      this.refresh();
    }
  }

  changefilter(){
    if(this.enqtype=='name'){
      this.ticketname="";
    }
    else if(this.enqtype=='maintticketno'){
      this.productname='';
    }
    }

    clearFilter(event){
      if(event==undefined|| event==null || event==''){
       this.showreset=false;
      }
      else{ this.showreset=true;
      }
    }

  // Pagination Filter
  getUpdate(event) {
    this.page=event;
    this.page=this.page.pageSize;
     this.refresh();
  }

  // Reset Close
  reset(event){
    this.search = '';
    this.productname = '';
    this.ticketname = '';
    this.showreset=false;
    this.refresh();
  }

  enqTypeChangeFunction(event)
  {
    // this.name = '';
    this.productname = '';
    this.ticketname = '';
    this.showreset=false;
  }

  // Edit Form
  editMaintenace(data)
  {
    // var id=data.id;
    // this.router.navigate(['/maintenance-ticket/add-maintenance-ticket/'+id+'/edit']);
    // if(data.canedit == 1)
    // {
      this.router.navigate(['/add-maintenance-ticket/'+data.ID+'/edit']);
    // } else if(data.canedit == 0)
    // {
      // this.router.navigate(['/add-maintenance-ticket/'+data.id+'/view']);
    }
  // }
  
  refresh()
{
     
  this.isLoadingResults=true;
  this.http.get(this.original_url+ "/Maintenance/Ticket/getticketslist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&PageNumber=1&Pagesize=100")
  .subscribe((data: any[]) => {
    this.itemDisplay=data;
    this.itemDisplay=this.itemDisplay.Table;
    this.ticketArray.data = this.itemDisplay;
    this.isLoadingResults=false;
    },error => {
      this.isLoadingResults = false;
    });
}  // refreshmachine()
}



export interface Maintenace{
  mtno: string;
  dated: string;
  asset:string;
  duedate: string;
  mono: string;
  modate: string;
  status:string;
  mtstatus:string;
  mostatus:string;
}

 

