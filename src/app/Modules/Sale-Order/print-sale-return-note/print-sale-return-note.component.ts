import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';
import { Global } from 'src/app/Global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-print-sale-return-note',
  templateUrl: './print-sale-return-note.component.html',
  styleUrls: ['./print-sale-return-note.component.css']
})
export class PrintSaleReturnNoteComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  progress:any;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  filterTypes:Array<any>=[];isLoadingResults=false; debiteNote: FormGroup;
  original_url=environment.baseUrl;datePipe = new DatePipe("en-US");
  fieldArray = new MatTableDataSource<any>();itemDisplay:any={};pType="E";
  displayedColumns: string[] = ['proforma','dated','amount','gstin','customer', 'print'];
  constructor(private router: Router, private fb: FormBuilder,private http: HttpClient,public AppUser:Global,  public dialog: MatDialog,private upload:FileDownloadUploadService) { 
    this.createForm();  
    this.filterTypes.push({id:'O',description:'Original'});
    this.filterTypes.push({id:'D',description:'Duplicate'});
    this.filterTypes.push({id:'T',description:'Triplicate'}) ;
    this.filterTypes.push({id:'E',description:'Extra'}) ;
    this.getInvoiceList();
  }
  print(inwadid)
  {
    this.isLoadingResults=true;


    this.upload.downloadPDF(this.original_url+ '/tools/PFCreater/PrintSaleReturnNote?token='+this.AppUser.Token+"&inwaedId="+inwadid+"&copy="+this.pType).subscribe(res => {
      console.log(res);
       var newBlob = new Blob([res], { type: "application/pdf" });
       console.log("ravi",res);
       var newurl = window.URL.createObjectURL(newBlob);
       window.open(newurl);
       this.isLoadingResults=false;
    }, error => {
      this.isLoadingResults=false
      console.log(error);
    });
    
  }
  onToDateChanged1()
  {
    console.log("ravi");
    this.getInvoiceList();
  }
  applyFilter(filterValue: string) {
    //console.log("data",filterValue.trim().toUpperCase());
    this.fieldArray.filter = filterValue.trim().toLowerCase();
    //console.log("list", this.fieldArray.data);
  }
  getInvoiceList()
  {
    var FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy');
    var ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy');
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/sop/SaleInvoice/getSaleReturnNoteList?fromdate="+FromDate+"&todate="+ToDate+"&userid="+this.AppUser.UserId+"&token="+this.AppUser.Token).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.isLoadingResults=false
      });
  }
  ngOnInit(): void {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
  }
  createForm() {
    this.debiteNote = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
}
