import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Global } from 'src/app/Global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tentative-plan-for-rdc',
  templateUrl: './tentative-plan-for-rdc.component.html',
  styleUrls: ['./tentative-plan-for-rdc.component.css']
})
export class TentativePlanForRdcComponent implements OnInit {

 
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  sortOrder: any;
  sortSelection: any;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['DIENAME', 'DIETYPE', 'PARTYNAME', 'MFGDATE'];
  machinearray = new MatTableDataSource<MachineMaster>();

  itemPerPage = '10';
  resultsLength = 0;
  isLoadingResults: boolean;
  page: any;
  itemCount: any;
  itemDisplay: any;
  search: any;
  pagenumber: any;
  isRateLimitReached = false;
  filterarray: Array<any> = [];
  showreset: boolean = false;
  public href: string = "";
  userRightCheck: any = {};
  canCreateCommonClass = '';
  canViewCommonClass = '';

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
    this.machinearray.sort = this.sort;
    this.machinearray.paginator = this.paginator;
    this.refreshmachine();
  }

  applyFilter(name) {

  }

  reset(name) {

  }

  openPopup(rowDetail) {

  }


  editmachine(data) {
    var DIEID = data.DIEID;
    // this.router.navigate(['/add-die-master/' + DIEID + '/edit']);
  }


  refreshmachine() {

    // this.isLoadingResults = true;
    // this.http.get(this.original_url + "/Maintenance/DieMaint/Getdiemasterlist?PageNumber=1&PageSize=100&coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId)
    //   .subscribe((data: any[]) => {
    //     this.itemDisplay = data;
    //     this.itemDisplay = this.itemDisplay.Table;
    //     this.machinearray.data = this.itemDisplay;
    //     this.isLoadingResults = false;
    //   }, error => {
    //     this.isLoadingResults = false;
    //   }
    //   );
  }
}
export interface MachineMaster {
  id: string;
  machinename: string;
  category: string;
  srno: string;
  model: string;
  chasisno: string;
}


