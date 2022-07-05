import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddNewItemEnquiryComponent } from './add-new-item-enquiry/add-new-item-enquiry.component';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-item-enquiry',
  templateUrl: './item-enquiry.component.html',
  styleUrls: ['./item-enquiry.component.css']
})
export class ItemEnquiryComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }


openDialog(data) {
  const dialogRef = this.dialog.open(AddNewItemEnquiryComponent, {
      data: {
        action: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
}

}