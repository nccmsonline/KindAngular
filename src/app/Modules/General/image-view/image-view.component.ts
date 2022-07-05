import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {


  imageinfo:any;

  constructor(
    public dialogRef: MatDialogRef<ImageViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.imageinfo = data.data;
  }

  ngOnInit() {
  }

}
