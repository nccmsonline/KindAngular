import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountGroupMasterService } from './account-group-master.service';
import { HttpClient,HttpParams } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
//import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddNewAccountGroupMasterComponent } from './add-new-account-group-master/add-new-account-group-master.component';
import { Subscription, Observable,BehaviorSubject,merge,of as observableOf } from 'rxjs';
import { Account,GithubApi } from './account.modal';


@Component({
  selector: 'app-account-group-master',
  templateUrl: './account-group-master.component.html',
  styleUrls: ['./account-group-master.component.css']
})
export class AccountGroupMasterComponent implements OnInit {
   
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  userinfo : any;
  coid : any;
  boid : any;
  sortOrder :any;
  sortSelection  :any ;
 
  paginationDetail:any;
 
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['NAME', 'parentgroup', 'position'];
  fieldArray = new MatTableDataSource<Account>();
  // fieldArray : any;
  page: any ;
  sorting:any;
  //  page ;
   exampleDatabase: ExampleHttpDao | null;
   pageIndex: any;
   generalledgerForm: FormGroup;
  undergrouplist : Array<any> = [];
  accountgrouplist : Array<any> = [];
  onfieldArrayPush: Subscription;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;

  constructor(
    private http: HttpClient,
    private  accountGroupMasterService:  AccountGroupMasterService,
    public dialog: MatDialog
  ) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    
    this.accountGroupMasterService.onDataChanged
      .subscribe((event) => {
          if(event){
            console.log("event", event);
            const data = this.fieldArray.data;
            data.push(event);
            this.fieldArray.data = data;
          }
      });

    
    
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
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.coid,this.boid);
          
          
           
        }),
        map(data => {
          this.itemCount = data;
          this.itemCount= this.itemCount.Table1;
          this.itemCount =this.itemCount[0];
          this.itemCount = this.itemCount.records-1;
         // this.accountGroupMasterService.savaRecords(this.itemCount);
          // this.itemDisplay=data;
          // this.itemDisplay=this.itemDisplay.Table;
          // this.itemDisplay=this.itemDisplay[0];
          // console.log("data1",this.itemDisplay);


          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = this.itemCount;
          
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
        
        console.log("data3",this.fieldArray.data);
        });
       
     
  

    // this.accountGroupMasterService.getAccountGroupsList()
    //   .subscribe((response) => {
    //     this.fieldArray.data = response;
    //   });
  
    // this.fieldArray.sort = this.sort;
    // this.fieldArray.paginator=this.paginator;
    
  }

  // Search
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

 

  openDialog() {
    const dialogRef = this.dialog.open(AddNewAccountGroupMasterComponent, {
        data: {
          action: 'new'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  editContact(contact): void {
    const dialogRef = this.dialog.open(AddNewAccountGroupMasterComponent, {
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
    this.page=event;
    this.page=this.page.pageSize;

    this.pageIndex=event
    this.pageIndex=this.pageIndex.pageIndex
    
   
     let params = new HttpParams();
     
     params = params.append('PageNumber', this.pageIndex+1);
     params = params.append('PageSize', this.page);
  // params = params.append('sort', "Name");
     params = params.append('coid', this.coid);
     params = params.append('boid', this.boid);
     params=params.append('sort',this.sortOrder);
     params=params.append('sortorder',this.sortSelection);
     console.log("Params",params);
    

     this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountGroup/GetGLAllAccountGroup", {params: params})
        .subscribe((res: any[]) => {
         this.fieldArray.data = res;
         console.log("help",res);
         
        });
        // this.fieldArray.sort = this.sort;
        // this.fieldArray.paginator = this.paginator;
}

}
export class ExampleHttpDao {
  userinfo : any;
  coid : any;
  boid : any;
  constructor(private http: HttpClient) {}
  
  getRepoIssues(sort: string, order: string, page: number, paging: number,coid:number,boid:number): Observable<GithubApi> {
    
    const requestUrl =
        `http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountGroup/GetGLAllAccountGroup?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}`;
    return this.http.get<GithubApi>(requestUrl);
  }
}
