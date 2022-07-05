import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient ,HttpParams } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Subscription, Observable,BehaviorSubject,merge,of as observableOf } from 'rxjs';
import { GeneralLedgerService } from './general-ledger.service';
import { AddNewGeneralLedgerComponent } from './add-new-general-ledger/add-new-general-ledger.component';

import { General,GithubApi } from './general.modal';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.css']
})
export class GeneralLedgerComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  searchText : string;
   page :any;
   sorting:any;
   userinfo : any;
   coid : any;
   boid : any;
   exampleDatabase: ExampleHttpDao | null;
   pageIndex: any;
   resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  sortSelection: any;
  sortOrder:any;
  
   
  undergrouplist : Array<any> = [];
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['accounthead', 'groupname', 'yob'];
  fieldArray = new MatTableDataSource<General>();
  sortedData: General[];
  // paginationDetail = new BehaviorSubject(
  //   {
  //    length: 10,
  //    pageIndex: 0,
  //    pageSize: 10
  //   });

  constructor(
    private http: HttpClient,
    
    private generalLedgerService: GeneralLedgerService,
    public dialog: MatDialog
  ) {
    
    this.generalLedgerService.onDataChanged
      .subscribe(event => {
          if(event){
            const data = this.fieldArray.data;
            data.push(event);
            this.fieldArray.data = data;
            
          }
      });
      // this.sortedData = this.fieldArray.data.slice();
  }
  ngOnInit() {
    this.exampleDatabase = new ExampleHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
           this.isLoadingResults = true;
           console.log("Size1",this.sort);
           if(this.page == undefined)
           {
             this.page = 20;
           }
           if( this.sort.active==undefined)
           {
            this.sort.active = "";
            console.log("Size1",this.sort.active);
           }
           console.log("Size2",this.sort.active);
           if( this.sort.direction==undefined)
           {
            this.sort.direction="";
           }
          
           this.sortOrder=this.sort.active;
           this.sortSelection=this.sort.direction;
           
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page);
          
          
           
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
           this.itemCount = data;
          this.itemCount= this.itemCount.Table1;
          console.log("item0",this.itemCount);
          this.itemCount =this.itemCount[0];
          this.itemCount = this.itemCount.Column1;
          this.resultsLength = this.itemCount;
          console.log("item",this.itemCount);
          
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
        
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe((data: any[]) => {
        this.itemDisplay=data;
        this.itemDisplay=this.itemDisplay.Table;
        this.fieldArray.data = this.itemDisplay;
        
       
        });

    // this.generalLedgerService.getGetGLAccountHeads()
    // .subscribe((response) => {
    //   this.fieldArray.data = response;
    //   console.log("vivek", this.fieldArray);
    // });

    // this.fieldArray.data = [
    //   {account_head: 'test', undergroup: 'test1', year_open: '0000', drcr: 'dr'},
    //   {account_head: 'test1', undergroup: 'test12', year_open: '00001', drcr: 'cr'},
    //   {account_head: 'test2', undergroup: 'test1', year_open: '0000', drcr: 'dr'}
    // ];
   
    //  this.fieldArray.sort = this.sort;
    //  this.fieldArray.paginator=this.paginator;
   
    
  }

  // Search
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

 
  openDialog() {
    const dialogRef = this.dialog.open(AddNewGeneralLedgerComponent, {
        data: {
          action: 'new'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  editContact(contact): void {
    console.log("contact", contact);
    const dialogRef = this.dialog.open(AddNewGeneralLedgerComponent, {
    data  : {
          contact: contact,
          action : 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  } 
  sortData(event)
  {   this.sorting=event;
    this.sortData=this.sorting.active
    console.log("sortData",event);
      
    console.log("sortData",this.sortData);
  }
  getUpdate(event) {
    this.page=event
    this.page=this.page.pageSize;

    this.pageIndex=event
    this.pageIndex=this.pageIndex.pageIndex
    console.log("qwerty",event);
    console.log("qwerty",this.page);
      let params = new HttpParams();
      
     params = params.append('PageNumber',this.pageIndex+1);
     params = params.append('PageSize',  this.page);
     params = params.append('sort', this.sortOrder);
     params = params.append('sortorder', this.sortSelection);
     params = params.append('coid', "1");
     params = params.append('boid', "1");
    
     console.log("res", params);
     this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountHeads/GetGLAccountHeads", {params: params})
        .subscribe((res: any[]) => {
         // this.fieldArray = res;
          console.log("res", res);
        });
    

  }
}
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}
  
  getRepoIssues(sort: string, order: string, page: number, paging: number): Observable<GithubApi> {
    console.log("sort",sort);
  
     
    const requestUrl =
        `http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountHeads/GetGLAccountHeads?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&coid=1&boid=1&sortorder=${order}`;
    return this.http.get<GithubApi>(requestUrl);
  }
}