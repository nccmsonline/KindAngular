import { Component, OnInit, ElementRef, ViewChild, PipeTransform  } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';  
import { SupplierMasterService } from './supplier-master.service';
import { Supplier,GithubApi } from './supplier.modal';
import {merge, Observable,Subscription, of as observableOf} from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddNewSupplierMasterComponent } from './add-new-supplier-master/add-new-supplier-master.component';
import { environment } from '../../../../environments/environment';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.css']
})
export class SupplierMasterComponent implements OnInit {
  original_url=environment.baseUrl;
  filterPipe =new GrdFilterPipe;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  keys: string[]=[]; 
  allSuppliers:Array<any>=[];
  searchText : string;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  allDataGet: any;
  page: any ;
  resultsLength = 0;
  isLoadingResults = true;
  userinfo : any;
  coid : any;
  boid : any;
  userid:any;
  token:any;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['checked','gsTin', 'name', 'address1', 'address2','city', 'country','balance', 'email', 'pin'];
  fieldArray = new MatTableDataSource<any>();
  constructor(
    private http: HttpClient,
    private supplierMasterService: SupplierMasterService,
    public dialog: MatDialog
  ) {
      let user = sessionStorage.getItem("currentUser");
      this.userinfo = JSON.parse(user);
      this.token = this.userinfo['TOKEN'];
      this.userid = this.userinfo['USERID'];
      this.boid = this.userinfo['boid'];
  }
  ApproveSupplier()
  {
    this.isLoadingResults=true;
    let updateData:Array<any>=[];
    this.fieldArray.data.forEach(el=>{
      if(el.checked)  
      {
        var tmp:any={};
        tmp.Approved='Y';
        tmp.CustomerId=el.CUSTOMERID;
        updateData.push(tmp);
      }
    });
    const params = new  HttpParams()
    .set('token', this.token)
    .set('list', JSON.stringify(updateData));
    this.http.post(this.original_url+"/Master/ApproveVender", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
    this.isLoadingResults=false;
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
    },
    error=>{
      var erroremsg:any;
      erroremsg=error.message;
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:erroremsg
      }
    });
    this.isLoadingResults=false; 
    });
  }
  ngOnInit() {
    this.isLoadingResults=true;
    this.supplierMasterService.SupplierList().subscribe(res=>{
      console.log("res",res);
        this.allDataGet=res;
        this.fieldArray.data=this.allDataGet.Table;
        this.allSuppliers=this.allDataGet.Table;
        this.isLoadingResults=false;
    });
  }
  // Search
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();

    //this.fieldArray.data=this.filterPipe.transform(this.allSuppliers,filterValue, 'NAME'); 

  }
  onChange(event)
  {
    this.itemPerPage = event;
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
  
}


export class GrdFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchOn: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it[searchOn].toLowerCase().includes(searchText);
        });
   } 
}