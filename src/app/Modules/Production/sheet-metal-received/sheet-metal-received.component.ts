import { Global } from './../../../Global';
import { environment } from './../../../../environments/environment';

import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http'; 
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Observable,merge,of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sheet-metal-received',
  templateUrl: './sheet-metal-received.component.html',
  styleUrls: ['./sheet-metal-received.component.css']
})
export class SheetMetalReceivedComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  sortOrder :any;
  sortSelection  :any ;
  onDataChanged: Observable<any>;
  displayedColumns : string[] = [  'MachineName','MCSRNo', 'MCCatgName', 'MCModel','location','MCCapacity','MCManufacturer','action'];
  machinearray = new MatTableDataSource<MachineMaster>();

  itemPerPage = '10';
  resultsLength = 0;
  isLoadingResults = true;
  page: any ;
  itemCount: any;
  itemDisplay: any;
  search:any;
  pagenumber: any;
  isRateLimitReached = false;
  filterarray:Array<any>=[];
  showreset:boolean=false;
  public href: string = "";
  userRightCheck:any={};
  canCreateCommonClass ='';
  canViewCommonClass='';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private globalVar: Global,
    private translate: TranslateService,
    public dialog: MatDialog
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    // User Right Data Get
    // this.href = this.router.url;
    // let Sidebar = sessionStorage.getItem("sidebar");
    // let sidebarDataGet = JSON.parse(Sidebar);
    // sidebarDataGet.forEach(element => { element.items.forEach(res => { if(res.routerLink == this.href) { this.userRightCheck = res; } }); });
    // if(this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; } 
    // if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    // if(this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; } 
    // if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 

   
  }

  ngOnInit() {
    this.machinearray.sort = this.sort;
    this.machinearray.paginator=this.paginator;
      this.refreshmachine();
    
  }

  applyFilter(name)
  {

  }

  reset(name)
  {

  }

  openPopup(rowDetail)
  {
    // const dialogRef = this.dialog.open(MachineListPopupComponent, {
      
    //   data: {
    //     actionData: rowDetail
    //   }
    // });
  
    // dialogRef.afterClosed().subscribe(result => {
    //   this.refreshmachine();
    // });
  }

  getUpdate(event: any) {
    this.page = event;
    this.page = this.page.pageSize;
    this.refreshmachine();
  }
  editmachine(data)
{
  var mcid=data.id;
  this.router.navigate(['/add-new-machine-master/'+mcid+'/edit']);
}


refreshmachine()
{
     
  this.isLoadingResults=true;
  this.http.get(this.original_url+ "/Masters/MachineMaster/MachineMasterList?Pagenumber=1&PageSize=20&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId).subscribe((data: any[]) => {
    this.itemDisplay=data;
    this.itemDisplay=this.itemDisplay.Table;
    this.machinearray.data = this.itemDisplay;
    this.isLoadingResults=false;
    });
}  // refreshmachine()
  // {
  //   this.exampleDatabase = new ExampleHttpDao(this.http);
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

   

  //   merge(this.sort.sortChange)
  //   .pipe(
  //     startWith({}),
  //     switchMap(() => {
  //       this.isLoadingResults = true;
  //       if(this.page == undefined)
  //       {
  //         this.page = 20;
  //       }
  //       if( this.sort.active==undefined)
  //       {
  //         this.sort.active = "";
  //       }
  //       if( this.sort.direction==undefined)
  //       {
  //         this.sort.direction="";
  //       }
        
  //       this.sortOrder=this.sort.active;
  //       this.sortSelection=this.sort.direction;

  //       this.pagenumber=this.paginator.pageIndex;
  //       if(this.search==undefined)
  //       {
  //         this.search="";
  //       }

        
        
  //       return this.exampleDatabase!.getRepoIssues(
  //         this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.globalVar.coid,this.globalVar.boid,this.search, this.original_url);
  //     }),
  //     map(data => {
  //       this.itemCount = data;
  //       this.itemCount= this.itemCount.Table1;
  //       this.itemCount =this.itemCount[0];
  //       this.itemCount = this.itemCount.records;

  //       this.isLoadingResults = false;
  //       this.isRateLimitReached = false;
  //       this.resultsLength = this.itemCount;
        
  //       return data;
  //     }),
      
  //     catchError(() => {
  //       this.isLoadingResults = false;
      
  //       this.isRateLimitReached = true;
  //       return observableOf([]);
  //     })
  //   ).subscribe((data: any[]) => {
      
  //     this.itemDisplay=data;
  //     this.itemDisplay=this.itemDisplay.Table;
  //     this.machinearray.data = this.itemDisplay;
  //     });
  // }
}

//   export class ExampleHttpDao {
//   userinfo : any;
//   coid : any;
//   boid : any;
//   constructor(private http: HttpClient
//     ) {}
  
//   getRepoIssues(sort: string, order: string, page: number, paging: number,coid:number,boid:number,search:string, url: String ): Observable<GithubApi> {
//     const requestUrl =
//         `${url}/Masters/MachineMaster/MachineMasterList?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}`;
//         return this.http.get<GithubApi>(requestUrl);
//   }
// }

  export interface MachineMaster {
  id: string;
  machinename: string;
  category:string;
  srno: string;
  model: string;
  chasisno: string;
}


  export interface GithubApi {
  items: Account[];
  total_count: number;
}

