import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AddNewItemComponent} from './add-new-item/add-new-item.component';

@Component({
  selector: 'app-items-master',
  templateUrl: './items-master.component.html',
  styleUrls: ['./items-master.component.css']
})
export class ItemsMasterComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  displayedColumns: string[] = ['itemcode', 'itemname','maincategory','subcategory','itemmaterial','itemtype'];
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
  this.blank.ITEMID=0;
}

ngOnInit() {
 this.categoryArray.sort=this.sort;
 this.RefreshList();
}
editCategory(pdata)
{
  const dialogRef = this.dialog.open(AddNewItemComponent, {
    data: pdata
  });
  dialogRef.afterClosed().subscribe(result => {
    this.RefreshList();
  });
}
applyFilter(filterValue: string) {
 this.categoryArray.filter = filterValue.trim().toLowerCase();
}
RefreshList()
{
 this.isLoadingResults=true;
  this.http.get(this.original_url+"/Master/getItemMasterList").subscribe((res)=>{
   this.allData=res;
   this.isLoadingResults=false;
   this.categoryArray.data=this.allData.Table;
   console.log("ITEM ravi",res);
  });   
}

}