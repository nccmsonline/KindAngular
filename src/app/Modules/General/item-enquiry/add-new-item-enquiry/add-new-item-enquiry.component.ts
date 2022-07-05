import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-add-new-item-enquiry',
  templateUrl: './add-new-item-enquiry.component.html',
  styleUrls: ['./add-new-item-enquiry.component.css']
})
export class AddNewItemEnquiryComponent implements OnInit {

  newData: any={};
  indententry: FormGroup;
  action: string;

  constructor(
    public dialogRef: MatDialogRef<AddNewItemEnquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.action = data.action;
    if(this.action == 'Stock')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'Reserved')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'underIOQ')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'ReceivedYTD')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'IssuedYTD')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'TotalIndentQty')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'PendingQty')
    {
      this.newData = data.contact;
    }
    else if(this.action == 'wipbatches')
    {
      this.newData = data.contact;
    }
  }

  ngOnInit() {
  }

}
