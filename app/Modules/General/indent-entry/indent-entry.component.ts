import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IndentEntryService } from './indent-entry.service';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;

import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { AddNewIndentEntryComponent } from './add-new-indent-entry/add-new-indent-entry.component';
import { Subscription, Observable,BehaviorSubject,merge,of as observableOf } from 'rxjs';
import { Indent, GithubApi } from './indent.modal';

@Component({
  selector: 'app-indent-entry',
  templateUrl: './indent-entry.component.html',
  styleUrls: ['./indent-entry.component.css']
})
export class IndentEntryComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;
  coid : any;
  boid : any;
  sortOrder :any;
  sortSelection  :any ;

  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['indentnumber', 'indentorid', 'indentdate', 'departmentid', 'isjobwork','manualslipno'];
  fieldArray = new MatTableDataSource<Indent>();

  newData: any={};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  page: any ;
  // exampleDatabase: ExampleHttpDao | null;
  itemCount: any;
  itemDisplay: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private indentEntryService: IndentEntryService,
    public dialog: MatDialog
  ) {

    this.indentEntryService.onDataChanged
    .subscribe(event => {
       console.log("data1",event)
        if(event){
          const data = this.fieldArray.data;
          data.push(event);
          this.fieldArray.data = data;
           console.log("data2",this.fieldArray.data)
        }
    });

  }

  ngOnInit() {
    
  this.fieldArray.sort = this.sort;
  this.fieldArray.paginator=this.paginator;

  // this.exampleDatabase = new ExampleHttpDao(this.http);
  // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  // merge(this.sort.sortChange, this.paginator.page)
  // .pipe(
  //   startWith({}),
  //   switchMap(() => {
  //      this.isLoadingResults = true;
  //      console.log("Size1",this.sort);
  //      if(this.page == undefined)
  //      {
  //        this.page = 20;
  //      }
      

  //      if( this.sort.active==undefined)
  //      {
  //       this.sort.active = "";
  //       console.log("Size1",this.sort.active);
  //      }
  //      console.log("Size2",this.sort.active);
  //      if( this.sort.direction==undefined)
  //      {
  //       this.sort.direction="";
  //      }
      
  //      this.sortOrder=this.sort.active;
  //      this.sortSelection=this.sort.direction;
       
  //     return this.exampleDatabase!.getRepoIssues(
  //       this.sort.active, this.sort.direction, this.paginator.pageIndex, this.page,this.coid,this.boid);
      
      
       
  //   }),
  //   map(data => {
  //     this.itemCount = data;
  //     this.itemCount= this.itemCount.Table1;
  //     this.itemCount =this.itemCount[0];
  //     this.itemCount = this.itemCount.records-1;

  //     this.isLoadingResults = false;
  //     this.isRateLimitReached = false;
  //     this.resultsLength = this.itemCount;
      
  //     return data;
  //   }),
    
  //   catchError(() => {
  //     this.isLoadingResults = false;
    
  //     this.isRateLimitReached = true;
  //     return observableOf([]);
  //   })
  // ).subscribe((data: any[]) => {
    
  //   this.itemDisplay=data;
  //   this.itemDisplay=this.itemDisplay.Table;
  //   this.fieldArray.data = this.itemDisplay;
    
  //   console.log("data3",this.fieldArray.data);
  //   });

  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

  onChange(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }

  ItembrandFunction()
  {
    $(document).ready(function(){
      $('#item_brandID').css("display", "block");
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
//         `http://suvidhaapi.suvidhacloud.com/api/MaterialManagement/Indents/getindentlist?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}`;
//     return this.http.get<GithubApi>(requestUrl);
//   }
// }
