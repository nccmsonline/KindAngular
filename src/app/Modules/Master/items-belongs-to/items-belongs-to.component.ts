import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AddNewItemBelongsToComponent} from './add-new-item-belongs-to/add-new-item-belongs-to.component';
@Component({
  selector: 'app-items-belongs-to',
  templateUrl: './items-belongs-to.component.html',
  styleUrls: ['./items-belongs-to.component.css']
})
export class ItemsBelongsToComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  displayedColumns: string[] = ['shortcode', 'category'];
  categoryArray = new MatTableDataSource<any>();
  token:any;
  blank:any={};
  isLoadingResults=false;
  allData:any={};
 
  constructor(   
  private http: HttpClient,
  public dialog: MatDialog) {  
  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);
  this.token = currentUser['TOKEN'];
 
  this.blank.CATEGORYID=0;
}

ngOnInit() {
 this.categoryArray.sort=this.sort;
 this.paymentRefresh();
}
editCategory(pdata)
{
  const dialogRef = this.dialog.open(AddNewItemBelongsToComponent, {
    data: pdata
  });
  dialogRef.afterClosed().subscribe(result => {
    this.paymentRefresh();
  });
}
applyFilter(filterValue: string) {
 this.categoryArray.filter = filterValue.trim().toLowerCase();
}
paymentRefresh()
{

 this.isLoadingResults=true;
  this.http.get(this.original_url+"/Master/getItemsBelongsTo?token="+this.token).subscribe((res)=>{
   this.allData=res;
   this.categoryArray.data=this.allData.Table;
   this.isLoadingResults=false;
  });   
}

}