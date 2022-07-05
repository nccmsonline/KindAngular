import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AddNewItemSubCategoryComponent} from './add-new-item-sub-category/add-new-item-sub-category.component';

@Component({
  selector: 'app-item-sub-category',
  templateUrl: './item-sub-category.component.html',
  styleUrls: ['./item-sub-category.component.css']
})
export class ItemSubCategoryComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  isLoading:any;
  displayedColumns: string[] = ['shortcode', 'category', 'maincategory'];
  categoryArray = new MatTableDataSource<any>();
  token:any;
  blank:any={};
  isLoadingResults=false;
  allData:any={};
  parameterList:Array<any>=[];
  mainCategory:Array<any>=[];
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
  pdata.mainCat=this.mainCategory;
  pdata.param=this.parameterList;
  const dialogRef = this.dialog.open(AddNewItemSubCategoryComponent, {
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
  this.http.get(this.original_url+"/Master/getItemSubCategoryList?token="+this.token).subscribe((res)=>{
   this.allData=res;
   this.categoryArray.data=this.allData.Table;
   this.mainCategory=this.allData.Table1;
   this.parameterList=this.allData.Table2;
   this.isLoadingResults=false;
  });   
}

}