import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Global } from 'src/app/Global';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gstsummary',
  templateUrl: './gstsummary.component.html',
  styleUrls: ['./gstsummary.component.css']
})
export class GSTSummaryComponent implements OnInit {
  gstSummaryFG: FormGroup;
  fendDate:any;isLoadingResults=false;original_url=environment.baseUrl;
  fstartDate:any;sale_Purchase:any;itemDisplay:any={};fieldArray = new MatTableDataSource<any>();
  categoryArray= new MatTableDataSource<any>();
  GSTFor:any=[];datePipe = new DatePipe("en-US");

  BranchList:Array<any>=[];branchid="";
  displayedColumns: string[] = ['IGST','HSN','DESCRIPTION','TaxableAmt','IGSTAMT','CGSTAMT','SGSTAMT'];
  displayedColumns1: string[] = ['action','description'];
  filterTypes:Array<any>=[];pType="";
  dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  constructor( private fb: FormBuilder, private http: HttpClient,public AppUser:Global,private excelService:ExcelService) { 
    this.fendDate=  AppUser.WorkingDate ;
    this.fstartDate= AppUser.WorkingDate;
    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);
    this.dateToControl.setValue(currentDate);
    this.sale_Purchase='S'
    this.GSTFor.push({id:'S',description:'Sale'}) ;
    this.GSTFor.push({id:'P',description:'Purchase'}) ;
    this.createForm();
    this.getBranchList();
    this.onTypeChangee();
  }

  ngOnInit(): void {
  }
  createForm() {
    this.gstSummaryFG = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
  exportToExcelNotInReturn()
  {
    var data:Array<any>=[];
    this.fieldArray.data.forEach((el)=>{
      data.push({
        'GST': el.IGST,
        'HSN':el.TARIFFHEAD ,
        'Description':el.DESCRIPTION ,
        'Taxable Amt':el.TAXABLEAMT ,
        'IGST': el.IGSTAMT,
        'CGST': el.CGSTAMT,
        'SGST': el.SGSTAMT
       });
    });
    this.excelService.exportAsExcelFile(data, 'GST Summary');
  }
  getSummaryList()
  {
    var FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy');
    var ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy');
    this.isLoadingResults=true;
    let category:any;
    category="0"
    this.categoryArray.data.forEach((el)=>{
      if(el.CHK==true)
      {
        category=category+","+el.ID;
      }
    });

    this.http.get(this.original_url+"/sop/SaleInvoice/GSTSummary?type="+this.sale_Purchase+
    "&fromDate="+FromDate+"&toDate="+ToDate+"&token="+this.AppUser.Token+"&categoryid="+category+"&branchid="+this.branchid).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.fieldArray.data = this.itemDisplay.Table;
      this.isLoadingResults=false
      },
      Error=>{
        this.isLoadingResults=true;
      });
  }
  applyFilter(filterValue: string) {
    //console.log("data",filterValue.trim().toUpperCase());
    this.fieldArray.filter = filterValue.trim().toLowerCase();
    //console.log("list", this.fieldArray.data);
  }
  onTypeChangee()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/sop/SaleInvoice/GSTSummaryFillterType?token="+this.AppUser.Token+"&type="+this.sale_Purchase).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.categoryArray.data = this.itemDisplay.Table;
      this.isLoadingResults=false
      this.categoryArray.data.forEach((el)=>{
        el.CHK=true;
      });
      });
  }
  getBranchList()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/sop/SaleInvoice/getBranchMaster?token="+this.AppUser.Token).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.BranchList= this.itemDisplay.Table;
      this.isLoadingResults=false
     
      });
  }
}
