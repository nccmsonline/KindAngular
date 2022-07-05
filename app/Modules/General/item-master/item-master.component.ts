import { Component, OnInit, ElementRef, ViewChild, Injectable  } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { ItemMasterService } from './item-master.service';
import { Item } from './item.modal';
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { AddNewItemMasterComponent } from './add-new-item-master/add-new-item-master.component';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css'],
})
export class ItemMasterComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  // fieldArray: Array<any> = [];
  supplierCategoryArray: Array<any> = [];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['itemcategory','itemcode','itemname','hsncode'];
  fieldArray = new MatTableDataSource<Item>();

  constructor(
    private http: HttpClient,
    private itemMasterService: ItemMasterService,
    public dialog: MatDialog
  ) {
    this.itemMasterService.onDataChanged
      .subscribe(event => {
          if(event){
            const data = this.fieldArray.data;
            data.push(event);
            this.fieldArray.data = data;
          }
      });
  }

  ngOnInit() {
  //  this.fieldArray.data = [
  //     {item_category: 'test', itemcode: '124', itemname: 'test', hsnode: '11'},
  //     {item_category: 'test1', item_code: '2342', item_name: 'test1', hsn_code: '22'},
  //     {item_category: 'test2', item_code: '2342', item_name: 'testw', hsn_code: '33'},
  //     {item_category: 'test1', item_code: '234', item_name: 'test1', hsn_code: '44s'},
  //     {item_category: 'test', item_code: '234', item_name: 'test', hsn_code: '55'},
  //     {item_category: 'test1', item_code: '567567', item_name: 'test1', hsn_code: '66'},
  //  ];

   this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
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
    const dialogRef = this.dialog.open(AddNewItemMasterComponent, {
      height: '',
        data: {
          action: 'new'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  editContact(contact): void {
    const dialogRef = this.dialog.open(AddNewItemMasterComponent, {
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