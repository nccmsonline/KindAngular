import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Subscription, Observable,BehaviorSubject,merge,of as observableOf } from 'rxjs';

import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { CustomerMasterService } from './customer-master.service';
import { AddNewCustomerMasterComponent} from './add-new-customer-master/add-new-customer-master.component';
import { Customer,GithubApi } from './customer.modal';

@Component({
  selector: 'app-customer-master',
  templateUrl: './customer-master.component.html',
  styleUrls: ['./customer-master.component.css']
})
export class CustomerMasterComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // fieldArray: Array<any> = [];
 
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  customerForm: FormGroup;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  private baseUrl = 'http://suvidhaapi.suvidhacloud.com/api';

  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['categoryname', 'name', 'address1', 'gsTin'];
  customers: Customer[] = [];
  fieldArray = new MatTableDataSource<Customer>(this.customers);
  

// contact
contacts: Array<any> = [];
newContact: any = {};
editContactID: any={};

// Licence
licences: Array<any> = [];
newlicence: any = {};
editLicenceID: any={};
exampleDatabase: ExampleHttpDao | null;
   pageIndex: any;
   resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  sortSelection: any;
  sortOrder:any;
  page:any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private customerMasterService: CustomerMasterService
  ) {
    // this.customerMasterService.onDataChanged
    //   .subscribe(event => {
    //       if(event){
    //         console.log("event", event);
    //         const data = this.fieldArray.data;
    //         data.push(event);
    //         this.fieldArray.data = data;
    //       }
    //   });
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
           console.log( this.paginator.pageIndex," this.paginator.pageIndex");
           
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page);
          
          
           
        }),
        map(data => {
          console.log(data,"data");
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
           this.itemCount = data;
          this.itemCount= this.itemCount.Table1;
          console.log("item0",this.itemCount);
          this.itemCount =this.itemCount[0];
          this.itemCount = this.itemCount.records;
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
        console.log("hello",this.itemDisplay);
        
       
        });
      }

  // Search
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

  onChange(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddNewCustomerMasterComponent, {
        data: {
          action: 'new'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  editContact(contact): void {
    const dialogRef = this.dialog.open(AddNewCustomerMasterComponent, {
    data  : {
          contact: contact,
          action : 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  


}
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}
  
  getRepoIssues(sort: string, order: string, page: number, paging:number): Observable<GithubApi> {
    console.log("sort",sort);
    console.log("page",page);
    console.log("page1",paging);
  
     
    const requestUrl =
        `http://suvidhaapi.suvidhacloud.com/api/Masters/customermaster/CustomerList?PageNumber=${page+1}&PageSize=${paging}&sort=${sort}&coid=1&boid=1&sortorder=${order}`;
        console.log("requestUrl",requestUrl);
    return this.http.get<GithubApi>(requestUrl);
  }
}
