import { Global } from './../../../Global';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bom-preparation',
  templateUrl: './bom-preparation.component.html',
  styleUrls: ['./bom-preparation.component.css']
})
export class BomPreparationComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  sortOrder :any;
  sortSelection  :any ;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = [  'itemcode', 'itemname', 'viewbom','version'];
  fieldArray = new MatTableDataSource<any>();
  newData: any={};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  page: any ;
  exampleDatabase: ExampleHttpDao | null;
  itemCount: any;
  itemDisplay: any;
  bomtype: any;
  search:any;
  name: any;
  custbom:any;
  public href: string = "";
  userRightCheck:any={};
  canViewCommonClass='';
  canCreateCommonClass ='';
  Data: any;

  constructor(
   // private modalService: NgbModal,
   // private fb: FormBuilder,
   private router: Router,
   private translate: TranslateService,
   private globalVar: Global,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    // private Service: BOMService,
    public dialog: MatDialog
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    // User Right Data Get
    this.href = this.router.url;
    let Sidebar = sessionStorage.getItem("sidebar");
    let sidebarDataGet = JSON.parse(Sidebar);
    // sidebarDataGet.forEach(element => { element.items.forEach(res => { if(res.routerLink == this.href) { this.userRightCheck = res; } }); });
    if(this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; }
    if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }

    if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }
    if(this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; }

    // this.bomtype = this.activatedRoute.snapshot.paramMap.get('type');

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.bomtype = this.activatedRoute.snapshot.paramMap.get('type');
          if(this.userRightCheck.canview == 'True')
          {
            if(event.url == '/bom/I')
            {
              this.custbom=false;
              // this.refresh();
            }
            else if(event.url == '/bom/P')
            {
              this.custbom=false;
              // this.refresh();
            }
            else if(event.url == '/bom/O')
            {
              this.custbom=true;
              // this.refresh();
            }
          }
        }
      });

    if(this.userRightCheck.canview == 'True')
    {
      // this.Service.onDataChanged
      // .subscribe(event => {
      //     if(event){
      //       const data = this.fieldArray.data;
      //       data.push(event);
      //       this.fieldArray.data = data;
      //       this.refresh();
          // }
      // });
    }
  }

  ngOnInit() {
    this.isLoadingResults = true;
    // this.http.get(this.original_url + "/MaterialMgmt/bom/getbomlist?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&PageNumber=1&Pagesize=100")
    //   .subscribe((res) => {
    //     this.Data = res;
    //     this.fieldArray.data = this.Data.Table;
    //     this.isLoadingResults = false;
    //   });
  }

  // refresh(){
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
  //       if( this.search==undefined)
  //       {
  //         this.search="";
  //       }
  //       this.sortOrder=this.sort.active;
  //       this.sortSelection=this.sort.direction;
        
  //       return this.exampleDatabase!.getRepoIssues(
  //         this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.globalVar.coid,this.globalVar.boid, this.original_url, this.bomtype, this.search);
        
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
  //     this.fieldArray.data = this.itemDisplay;
      
  //     });
  // }

  applyFilter(event){
    if(event!=undefined){
      this.search=event;
      // this.refresh();
    }
  }

  reset(event){
    this.search='';
    this.name='';
    // this.refresh();
  }

  onChange(event)
  {
    this.itemPerPage = event;
  }
  editbom(data)
  {    
    var bomid=data.BOMID;
    this.router.navigate(['/add-die-bom/'+bomid+'/edit']);
  }

  getUpdate(event) {
    this.page=event;
    this.page=this.page.pageSize;
    //  this.refresh();
}
}

export class ExampleHttpDao {
  userinfo : any;
  coid : any;
  boid : any;
  constructor(private http: HttpClient) {}
  
  // getRepoIssues(sort: string, order: string, page: number, paging: number,coid:number,boid:number, url: string, bomtype:any, search:any): Observable<GithubApi> {
    
    // const requestUrl =
    //     `${url}/MaterialManagement/bom/getbomlist?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}&type=${bomtype}&search=${search}`;
    // return this.http.get<GithubApi>(requestUrl);
  // }
}
