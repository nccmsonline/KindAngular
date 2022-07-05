import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AddNewItemMaterialComponent} from './add-new-item-material/add-new-item-material.component';


@Component({
  selector: 'app-item-material',
  templateUrl: './item-material.component.html',
  styleUrls: ['./item-material.component.css']
})
export class ItemMaterialComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  displayedColumns: string[] = ['maincategory','subcategory', 'shortcode', 'category'];
  categoryArray = new MatTableDataSource<any>();
  token:any;
  blank:any={};
  isLoadingResults=false;
  allData:any={};
  mainCategory:Array<any>=[];
  subCategory:Array<any>=[];
  parameterList:Array<any>=[];
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
  pdata.subCat=this.subCategory;
  pdata.param=this.parameterList;
  const dialogRef = this.dialog.open(AddNewItemMaterialComponent, {
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
  this.http.get(this.original_url+"/Master/getItemMaterialCategoryList?token="+this.token).subscribe((res)=>{
   this.allData=res;
   this.categoryArray.data=this.allData.Table;
   this.mainCategory=this.allData.Table1;
   this.subCategory=this.allData.Table2;
  //  this.parameterList=this.allData.Table3;
   console.log("ravi",res);
   this.isLoadingResults=false;
  });   
}

}