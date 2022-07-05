import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-finshing-bom',
  templateUrl: './finshing-bom.component.html',
  styleUrls: ['./finshing-bom.component.css']
})
export class FinshingBOMComponent implements OnInit {
  original_url=environment.baseUrl;progress:any;message:any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;SaleOrder: FormGroup;isLoadingResults:boolean;
  displayedColumns: string[] = ['DATED', 'ITEMCODE','ITEMNAME'];
  productArray = new MatTableDataSource<any>();
  itemDisplay: any;companyData:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  fstartDate:any;userid:any;token:any;
  fendDate:any;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  constructor( private router: Router, private fb: FormBuilder,private http: HttpClient) { 
    this.createForm();  
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
    this.fendDate=  this.companyData['FINANCIALYEARENDDATE'] ;
    this.fstartDate= this.companyData['FINANCIALYEARSTARTDATE'] ;
     


  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);

  this.token = currentUser['TOKEN'];
  this.userid = currentUser['USERID'];

    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);
    this.dateToControl.setValue(currentDate);
    this.ShowBOMList();
  }
  ShowBOMList()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/Production/DieAndTools/FinshingBOMList?token="+this.token).subscribe((res: any[])=> {
      console.log("ts",res);
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.productArray.data = this.itemDisplay;
      this.isLoadingResults=false
       });
  }
  ngOnInit() {
    this.productArray.sort = this.sort;
    this.productArray.paginator=this.paginator;
  
  }
  onToDateChanged1()
  {
    console.log("ravi");
    this.ShowBOMList();
  }
  applyFilter(filterValue: string) {
    console.log("data",filterValue.trim().toUpperCase());
    this.productArray.filter = filterValue.trim().toLowerCase();
    console.log("list", this.productArray.data);
  }
  createForm() {
    this.SaleOrder = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
  showBOM(bomid)
  {
    this.router.navigate(['/add-finishing-bom/'+bomid+'/edit'], { queryParams:  filter, skipLocationChange: true});
  }
}
