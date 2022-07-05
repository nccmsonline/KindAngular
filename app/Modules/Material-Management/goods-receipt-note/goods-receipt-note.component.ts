
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;

import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';

import { Subscription, Observable, from } from 'rxjs';
import { Goods } from './goods.modal';
import {GoodsReceiptNoteService} from './goods-receipt-note.service';
import {AddNewGoodsReceiptNoteComponent} from './add-new-goods-receipt-note/add-new-goods-receipt-note.component';


@Component({
  selector: 'app-goods-receipt-note',
  templateUrl: './goods-receipt-note.component.html',
  styleUrls: ['./goods-receipt-note.component.css']
})
export class GoodsReceiptNoteComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator)  paginator:MatPaginator;

  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['grnCat', 'grn_no', 'supplier', 'challan_no','gate_entry_no','date','bill_no','bill_amt'];
  fieldArray = new MatTableDataSource<Goods>();
  
  keys: string[]=[];
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  @ViewChild('closeBtn') closeBtn: ElementRef;
  onfieldArrayPush: Subscription;

  constructor(
    private http: HttpClient,
    private goodsReceiptNoteService: GoodsReceiptNoteService,
    public dialog: MatDialog
  ) {
    this.goodsReceiptNoteService.onDataChanged
      .subscribe(event => {
          if(event){
            const data = this.fieldArray.data;
            data.push(event);
            this.fieldArray.data = data;
          }
      })
   }

  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
  }
  
}