import { Response } from '@angular/http';
import { Global } from './../../../Global';
import { environment } from './../../../../environments/environment.prod';
import { AddSingleColumnMasterComponent } from './add-single-column-master/add-single-column-master.component';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Subscription, Observable,merge,of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmAlertComponent } from 'src/app/confirm-alert/confirm-alert.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { GithubApi } from '../../Inventory/store-requisition-slip/store-requisition.modal';

@Component({
  selector: 'app-single-column-master',
  templateUrl: './single-column-master.component.html',
  styleUrls: ['./single-column-master.component.css']
})
export class SingleColumnMasterComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  sortSelection: any;
  sortOrder:any;
  page:any;
  search:any;
  searcharray:any;
  pagenumber:any;
  type:any;
  isLoading= false;
  myDate = new Date();
  menutype: any;
  title: any;
  displayedColumns: string[] = ['name', 'isactive'];
  SingleColumnArray = new MatTableDataSource<any>();
  allFieldArray: any;
  allDataGet: any;
  receiptFieldArray: Array<any> = [];
  arrayBuffer: any;
  file: File;
  private _routerSub = Subscription.EMPTY;

  public href: string = "";
  userRightCheck:any={};
  canCreateCommonClass ='';
  canViewCommonClass='';
  canImportCommonClass = '';
  singleColumnMasterService: any;
  menuGet: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private globalVar: Global,
    public dialog: MatDialog,
  ) { 
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.menutype = this.route.snapshot.paramMap.get("menutype");
    this.menuGet = this.route.snapshot.paramMap.get("menutype");

    // this.menutype=this.menutype.trim()

    this._routerSub = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          
          // User Right Data Get
          this.href = this.router.url;
          let Sidebar = sessionStorage.getItem("sidebar");
          let sidebarDataGet = JSON.parse(Sidebar);
          sidebarDataGet.forEach(element => { element.items.forEach(res => { if(res.routerLink == this.href) { this.userRightCheck = res; } }); });
          if(this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; } 
          if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
          if(this.userRightCheck.canimport == 'True') { this.canImportCommonClass = ''; }
          
          if(this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; } 
          if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
          if(this.userRightCheck.canimport == 'False') { this.canImportCommonClass = 'canImportCommonClass'; }
          if(this.userRightCheck.canview == 'True')
          {
            this.http.get(this.original_url+"/Masters/CommonMasters/GetsinglecolumnmastersList?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&type="+this.menuGet)
              .subscribe((res) => {
                this.allDataGet = res; 
                this.receiptFieldArray= this.allDataGet.Table1;
                if(this.receiptFieldArray.length > 0)
                {
                  this.title = this.receiptFieldArray[0].FROMNAME;
                  this.menutype = this.receiptFieldArray[0].TYPE;
                }
                this.type=this.menutype;
                this.isLoading=false;
                this.resultsLength=0;
                setTimeout(() => {
                  this.singlecolumnrefresh();
                }, 1000);
               },error => {
                this.isLoadingResults = false;
              }
               );
          }          
        }
      });

      // if(this.userRightCheck.canview == 'True')
      // {
      //   this.singleColumnMasterService.onDataChanged
      //     .subscribe(event => {
      //         if(event){
      //           this.SingleColumnArray.data = [];
      //           this.type=event;
      //           setTimeout(() => {
                  this.singlecolumnrefresh();
      //           }, 1000);
      //         }
      //     });
      // }
  }

  ngOnInit() {     
     
  }

  onFileChange(evt) {
    this.file = evt.target.files[0];
  }

  // Upload() {
  //   let fileReader = new FileReader();
  //   fileReader.onload = (e) => {
  //     let emparr;
  //     this.arrayBuffer = fileReader.result;
  //     var data = new Uint8Array(this.arrayBuffer);
  //     var arr = new Array();
  //     for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //     var bstr = arr.join("");
  //     var workbook = XLSX.read(bstr, { type: "binary" });
  //     var first_sheet_name = workbook.SheetNames[0];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     emparr = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  //     //this.empsalaryArray = emparr;
  //   }
  //   fileReader.readAsArrayBuffer(this.file);
  // }

  getmasterdata(urldata){
    this.http.get(this.original_url+"/Masters/CommonMasters/GetAllCountryList?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId)
      .subscribe((res) => {
      this.allDataGet = res;          
        this.receiptFieldArray=this.allDataGet.table2;
      },error => {
        this.isLoadingResults = false;
      });
  }

  applyFilter(event){
    if(event!=undefined){
      this.search=event;
      this.singlecolumnrefresh();
    }
  }

  reset(event){
    this.search='';
    this.singlecolumnrefresh();
  }
  singlecolumnrefresh()
  {
    this.http.get(this.original_url+"/Masters/CommonMaster/GetsinglecolumnmastersList?PageNumber=1&PageSize=100&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&id=&type="+this.menuGet)

    .subscribe((res) => {
            this.itemDisplay=res;
            this.itemDisplay=this.itemDisplay.Table;
            this.SingleColumnArray.data = this.itemDisplay;
            this.isLoadingResults=false;
            },error => {
              this.isLoadingResults = false;
            });
  }
  

  // singlecolumnrefresh()
  // { 
  //   this.SingleColumnArray.data=[];
  //   this.exampleDatabase = new ExampleHttpDao(this.http);
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  //   merge(this.sort.sortChange)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //          this.isLoadingResults = true;
  //          if(this.page == undefined)
  //          {
  //            this.page = 20;
  //          }
  //          if( this.sort.active==undefined)
  //          {
  //           this.sort.active = "";
  //          }
  //          if( this.sort.direction==undefined)
  //          {
  //           this.sort.direction="";
  //          }
          
  //          this.sortOrder=this.sort.active;
  //          this.sortSelection=this.sort.direction;
  //          this.pagenumber=this.paginator.pageIndex;
  //          if(this.search==undefined)
  //          {
  //            this.search="";
  //          }
  //          if(this.type==undefined)
  //          {
  //            this.type="G";
  //          }
         
  //         return this.exampleDatabase!.getRepoIssues(
  //           this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.globalVar.BranchId,this.globalVar.CommpanyId,this.search, this.original_url,this.type);
  //       }),
  //       map(data => {
  //         // Flip flag to show that loading has finished.
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = false;
  //          this.itemCount = data;
  //         this.itemCount= this.itemCount.Table1;
  //         this.itemCount =this.itemCount[0];
  //         this.itemCount = this.itemCount.records;
  //         this.resultsLength = this.itemCount;
  //         return data;
  //       }),
  //       catchError(() => {
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = true;
  //         return observableOf([]);
  //       })
  //     ).subscribe((data: any[]) => {
  //       this.itemDisplay=data;
  //       this.itemDisplay=this.itemDisplay.Table;
  //       this.SingleColumnArray.data = this.itemDisplay;
  //       });
  // }

  // openDialog(menutype)
  // {
  //   const dialogRef = this.dialog.open(AddNewSingleColumnMasterComponent, {
  //     width:'700px',
  //     data  : {
        
  //       menutype: menutype,
  //       action: 'new'
  //     }
  //    });
 
  //    dialogRef.afterClosed().subscribe(result => {
  //    });
  // }
  
  getUpdate(event) 
  {
    this.page=event;
    this.page=this.page.pageSize;
    this.singlecolumnrefresh();
  }
 
  activepy(event, row) {
    let id = row.id;
    let msg; let check: any;

    let convertDAte = formatDate(this.myDate, 'yyyy-MM-dd', 'en-US');
    if (event.checked == false) {
      check = true;
      msg = "* Are You Sure want to Deactive this grade?";
    }
    else {
      check = false;
      msg = "* Are You Sure want to Active this grade?";
    }
    const dialogRef = this.dialog.open(ConfirmAlertComponent, {
      data: {
        msg: msg,
        action: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        const  params = new  HttpParams()
          .set('coid', this.globalVar.CommpanyId)
          .set('boid', this.globalVar.BranchId)
          .set('userid', this.globalVar.UserId)
          .set('type', this.menutype)
          .set('statementtype', 'update')
          .set('id', id)
          .set('name', row.name)
          .set('isactive', event.checked)
          .set('dated', convertDAte);

          this.http.post(this.original_url+"/Masters/CommonMasters/savesinglecolumnmasters", params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          })
          .subscribe(res => {
            this.successDialog();
            this.singlecolumnrefresh();
          },
          error=> {
            row.isactive = check;
          });
      }
      else
      {
        row.isactive = check;
      }
    });
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  editContact(row, menutype,type)
  {
    const dialogRef = this.dialog.open(AddSingleColumnMasterComponent, {
      width:'700px',
      data  : {
        data: row,
        menutype: menutype,
        action: type,
        userRightCheck: this.userRightCheck
      }
     });
 
    dialogRef.afterClosed().subscribe(result => {
      this.singlecolumnrefresh();
    });
  }

  ngOnDestroy(){
    this._routerSub.unsubscribe();
  }
 
}

// export class ExampleHttpDao {
  
//   userinfo: any;
//   coid: any;
//   boid: any

//   constructor(private http: HttpClient) {}
  
//   getRepoIssues(sort: string, order: string, page: number, paging:number,boid:number,coid:number,search:string, url: String,type:String): Observable<GithubApi> {
    
//     const requestUrl =
//       `${url}/Masters/CommonMasters/GetsinglecolumnmastersList?PageNumber=${page+1}&PageSize=${paging}&sort=${sort}&coid=${coid}&boid=${boid}&sortorder=${order}&search=${search}&type=${type}`;
//     return this.http.get<GithubApi>(requestUrl);
//   }

// }
function AddNewSingleColumnMasterComponent(AddNewSingleColumnMasterComponent: any, arg1: { width: string; data: { data: any; menutype: any; action: any; userRightCheck: any; }; }) {
  throw new Error('Function not implemented.');
}

