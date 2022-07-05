import { Component, OnInit, ElementRef, ViewChild , Inject  } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
import { Subscription, Observable, fromEventPattern } from 'rxjs';
import { Employee} from  './employee.modal';
import {NewEmployeeMasterComponent} from './new-employee-master/new-employee-master.component'

import { animate } from '@angular/animations';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;

  //fieldArray: Array<any> = [];
  displayedColumns: string[] = [ 'customer_name', 'customer_address','customer_gstIN'];
  fieldArray = new MatTableDataSource<Employee>();
  itemPerPage = '5';
  searchText : string;
  p: number = 1;

  constructor(
    public dialog: MatDialog
  ) {
  
   
  }

  ngOnInit() {

    this.fieldArray.data = [
      {id: 1, customer_name: 'Punjab', customer_address: 'Mohali', customer_gstIN: '123'},
      {id: 2, customer_name: 'Rahul', customer_address: 'Chandigarh', customer_gstIN: '456'},
      {id: 3, customer_name: 'Umesh', customer_address: 'Rajpura', customer_gstIN: '789'},
      {id: 4,  customer_name: 'Amit', customer_address: 'Zira', customer_gstIN: '000'}
   ];

   this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
  
  }

  onChangePage(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewEmployeeMasterComponent, {
    data: {
        action: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editContact(contact): void {
    console.log("contact", contact);
    const dialogRef = this.dialog.open(NewEmployeeMasterComponent, {
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
