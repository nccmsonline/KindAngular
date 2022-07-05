import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
import { animate } from '@angular/animations';
import { SupplierMasterService } from './supplier-master.service';
import { Supplier,GithubApi } from './supplier.modal';

import {merge, Observable,Subscription, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { AddNewSupplierMasterComponent } from './add-new-supplier-master/add-new-supplier-master.component';

@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.css']
})
export class SupplierMasterComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  keys: string[]=[]; 
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  allDataGet: any;
  page: any ;
  //  page ;
   exampleDatabase: ExampleHttpDao | null;
   pageIndex: any;
   sortOrder :any;
   sortSelection  :any ;
   resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  userinfo : any;
  coid : any;
  boid : any;
 
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['categoryname', 'name', 'gsTin', 'address1', 'city', 'country', 'email', 'pin'];
  fieldArray = new MatTableDataSource<Supplier>();

  constructor(
    private http: HttpClient,
    private supplierMasterService: SupplierMasterService,
    public dialog: MatDialog
  ) {
    this.supplierMasterService.onDataChanged
      .subscribe(event => {
          if(event){
            const data = this.fieldArray.data;
            data.push(event);
            this.fieldArray.data = data;
          }
      });
  }
  

  ngOnInit() {
    //this.getUpdate(event); 
    // this.supplierMasterService.SupplierList()
    //   .subscribe((response) => {
    //     this.allDataGet = response;
    //     this.allDataGet = this.allDataGet.Table;
    //     this.fieldArray.data = this.allDataGet;
    //     // this.keys= Object.keys(this.fieldArray[0]);
    //   });
      this.exampleDatabase = new ExampleHttpDao(this.http);
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            console.log("qwerty",this.sort)
            if(this.page== undefined)
           {
            this.page =20;
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
             //console.log("Size",this.page)
             console.log("Size",this.sort.active);
             console.log("Size",this.sort.direction);
            return this.exampleDatabase!.getRepoIssues(
              this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page);
             
          }),
          map(data => {
            this.itemCount = data;
            this.itemCount= this.itemCount.Table1;
            this.itemCount =this.itemCount[0];
            this.itemCount = this.itemCount.records;
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

      // this.fieldArray.sort = this.sort;
      // this.fieldArray.paginator = this.paginator;

      this.dropdownList = [
        { item_id: 1, item_text: 'Mumbai' },
        { item_id: 2, item_text: 'Bangaluru' },
        { item_id: 3, item_text: 'Pune' },
        { item_id: 4, item_text: 'Navsari' },
        { item_id: 5, item_text: 'New Delhi' }
      ];
      this.selectedItems = [
        
      ];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
  }

  // Search
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

  onChange(event)
  {
    this.itemPerPage = event;
  }
  
  
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewSupplierMasterComponent, {
        data: {
          action: 'new'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  editContact(contact): void {
    const dialogRef = this.dialog.open(AddNewSupplierMasterComponent, {
    data  : {
          contact: contact,
          action : 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  getUpdate(event) {
    this.page=event;
  this.page=this.page.pageSize;
   console.log("size0",this.page);
   this.pageIndex=event
   this.pageIndex=this.pageIndex.pageIndex
   // this.paginationDetail.next(event);

    let params = new HttpParams();
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    params = params.append('PageNumber', this.pageIndex+1);
    params = params.append('PageSize', this.page);
  
    params = params.append('coid', this.coid);
    params = params.append('boid', this.boid);
    params=params.append('sort',this.sortOrder);
    params=params.append('sortorder',this.sortSelection);
    params=params.append('supplierid',"0");
    console.log("Params",params);
   

    this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/SupplierMaster/SupplierList", {params: params})
       .subscribe((res: any[]) => {
        this.fieldArray.data = res;
        console.log("help",res);
        
       });
}
  
}
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}
  
  getRepoIssues(sort: string, order: string, page: number, paging: number): Observable<GithubApi> {
    const requestUrl =
        `http://suvidhaapi.suvidhacloud.com/api/Masters/SupplierMaster/SupplierList?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=1&boid=1&supplierid=0`;
    return this.http.get<GithubApi>(requestUrl);
  }
}