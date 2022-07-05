
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
import { PurchaseOrderService } from './purchase-order.service';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { AddNewPurchaseOrderComponent } from './add-new-purchase-order/add-new-purchase-order.component';
import { Subscription, Observable, BehaviorSubject,merge,of as observableOf } from 'rxjs';
import { Purchase,GithubApi } from './purchase.modal';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  //public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;
  coid : any;
  boid : any;
  sortOrder :any;
  sortSelection  :any ;
 
  paginationDetail:any;

  // exampleDatabase: ExampleHttpDao | null;
  keys: string[]=[];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['po_no', 'po_date', 'Prepared_By', 'supplier', 'po_amt', 'your_ref'];
  fieldArray = new MatTableDataSource<Purchase>();
  isLoadingResults = true;
  page: any ;
  itemDisplay: any;
  isRateLimitReached = false;
  itemCount: any;
  resultsLength = 0;
  onfieldArrayPush: Subscription;
  // onfieldArrayPush: Subscription;
  
  // @ViewChild('closeBtn') closeBtn: ElementRef;
  // onfieldArrayPush: Subscription;

  constructor(
    private http: HttpClient,
    private purchaseOrderService: PurchaseOrderService,
    public dialog: MatDialog
  ) {
  
    this.purchaseOrderService.onDataChanged
      .subscribe(event => {
        console.log("data1",event)
          if(event){
            const data = this.fieldArray.data;
            data.push(event);
            this.fieldArray.data = data;
            console.log("data2",this.fieldArray.data)
          }
      })

  }
  
  ngOnInit() {

   this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
  
  //  this.exampleDatabase = new ExampleHttpDao(this.http);
  //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  //  merge(this.sort.sortChange, this.paginator.page)
  //    .pipe(
  //      startWith({}),
  //      switchMap(() => {
  //         this.isLoadingResults = true;
  //         console.log("Size1",this.sort);
  //         if(this.page == undefined)
  //         {
  //           this.page = 20;
  //         }
         

  //         if( this.sort.active==undefined)
  //         {
  //          this.sort.active = "";
  //          console.log("Size1",this.sort.active);
  //         }
  //         console.log("Size2",this.sort.active);
  //         if( this.sort.direction==undefined)
  //         {
  //          this.sort.direction="";
  //         }
         
  //         this.sortOrder=this.sort.active;
  //         this.sortSelection=this.sort.direction;
          
  //        return this.exampleDatabase!.getRepoIssues(
  //          this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.coid,this.boid);
         
         
          
  //      }),
  //      map(data => {
  //        this.itemCount = data;
  //        this.itemCount= this.itemCount.Table1;
  //        this.itemCount =this.itemCount[0];
  //        this.itemCount = this.itemCount.records-1;
  //       // this.accountGroupMasterService.savaRecords(this.itemCount);
  //        // this.itemDisplay=data;
  //        // this.itemDisplay=this.itemDisplay.Table;
  //        // this.itemDisplay=this.itemDisplay[0];
  //        // console.log("data1",this.itemDisplay);


  //        // Flip flag to show that loading has finished.
  //        this.isLoadingResults = false;
  //        this.isRateLimitReached = false;
  //        this.resultsLength = this.itemCount;
         
  //        return data;
  //      }),
       
  //      catchError(() => {
  //        this.isLoadingResults = false;
       
  //        this.isRateLimitReached = true;
  //        return observableOf([]);
  //      })
  //    ).subscribe((data: any[]) => {
       
  //      this.itemDisplay=data;
  //      this.itemDisplay=this.itemDisplay.Table;
  //      this.fieldArray.data = this.itemDisplay;
       
  //      console.log("data3",this.fieldArray.data);
  //      });

  }

  

  onChange(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }

  
  countryFunction()
  {
    $(document).ready(function(){
      $('#countryID').css("display", "block");
    });
  }

  stateFunction()
  {
    $(document).ready(function(){
      $('#stateID').css("display", "block");
    });
  }

  cityFunction()
  {
    $(document).ready(function(){
      $('#cityID').css("display", "block");
    });
  }

}

// export class ExampleHttpDao {
//   userinfo : any;
//   coid : any;
//   boid : any;
//   constructor(private http: HttpClient) {}
  
//   getRepoIssues(sort: string, order: string, page: number, paging: number,coid:number,boid:number): Observable<GithubApi> {
    
//     const requestUrl =
//         `http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountGroup/GetGLAllAccountGroup?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}`;
//     return this.http.get<GithubApi>(requestUrl);
//   }
// }
