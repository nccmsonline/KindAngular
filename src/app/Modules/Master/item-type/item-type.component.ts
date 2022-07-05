import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AddNewItemTypeComponent} from './add-new-item-type/add-new-item-type.component';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  displayedColumns: string[] = ['maincategory','subcategory','itemmaterial', 'shortcode', 'category'];
  categoryArray = new MatTableDataSource<any>();
  token:any;
  blank:any={};
  isLoadingResults=false;
  allData:any={};
  mainCategory:Array<any>=[];
  subCategory:Array<any>=[];
  itemMaterial:Array<any>=[];
  parameterList:Array<any>=[];
  constructor(   
  private http: HttpClient,
  public dialog: MatDialog) {  
  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);
  this.token = currentUser['TOKEN'];
  this.blank.ITEMTYPEID=0;
}

ngOnInit() {
 this.categoryArray.sort=this.sort;
 this.paymentRefresh();
}
editCategory(pdata)
{
  pdata.mainCat=this.mainCategory;
  pdata.subCat=this.subCategory;
  pdata.itemMat=this.itemMaterial;
  pdata.param=this.parameterList;
  const dialogRef = this.dialog.open(AddNewItemTypeComponent, {
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
  this.http.get(this.original_url+"/Master/getItemTypeCategoryList?token="+this.token).subscribe((res)=>{
   this.allData=res;
   this.isLoadingResults=false;
   this.categoryArray.data=this.allData.Table;
   this.mainCategory=this.allData.Table1;
   this.subCategory=this.allData.Table2;
   this.itemMaterial=this.allData.Table3;
   this.parameterList=this.allData.Table4;
   console.log("ravi",res);
  });   
}

}