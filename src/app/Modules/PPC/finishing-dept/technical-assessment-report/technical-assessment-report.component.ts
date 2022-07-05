import { Global } from './../../../../Global';
import { environment } from './../../../../../environments/environment';


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
import { Account } from 'src/app/Modules/General/account-group-master/account.modal';

@Component({
  selector: 'app-technical-assessment-report',
  templateUrl: './technical-assessment-report.component.html',
  styleUrls: ['./technical-assessment-report.component.css']
})
export class TechnicalAssessmentReportComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  original_url = environment.baseUrl;
  sortOrder :any;
  sortSelection  :any ;
  onDataChanged: Observable<any>;
  displayedColumns : string[] = [  'srno','party', 'date', 'drawingnost','drawingnort',];
  TARarray = new MatTableDataSource<MachineMaster>();

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
  }

  ngOnInit() {
    this.TARarray.sort = this.sort;
    this.TARarray.paginator=this.paginator;
      this.refreshmachine();
    
  }

  
  getUpdate(event: any) {
    this.page = event;
    this.page = this.page.pageSize;
    this.refreshmachine();
  }
  editmachine(data)
{
  var mcid=data.ID;
  this.router.navigate(['/add-technical-assessment-report/'+mcid+'/edit']);
}


refreshmachine()
{
     
  this.isLoadingResults=true;
  this.http.get(this.original_url+ "/Production/TechAccessReport/getTARlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&PageNumber=1&Pagesize=20")
  .subscribe((data: any[]) => {
    this.itemDisplay=data;
    this.itemDisplay=this.itemDisplay.Table;
    this.TARarray.data = this.itemDisplay;
    this.isLoadingResults=false;
    });
  } 
}


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

