import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
 
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { Component, OnInit, Inject, OnDestroy , ViewChild  } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { animate } from '@angular/animations';
import {Statement} from './statement.modal'  ;
import { environment } from 'src/environments/environment';
//import { StatementviewComponent } from '../../../../Dialog/statementview/statementview.component';
declare var $: any;
 declare var jQuery: any;
@Component({
  selector: 'app-statement-account',
  templateUrl: './statement-account.component.html',
  styleUrls: ['./statement-account.component.css']
})
export class StatementAccountComponent implements OnInit {
  original_url = environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;Date1 = new FormControl(new Date());
  coid : any; AcStatement: FormGroup;isLoadingResults:boolean;
  boid : any;
  datePipe = new DatePipe("en-US");
  fstartDate:any;
  fendDate:any;dateFormControl = new FormControl(new Date());dateToControl = new FormControl(new Date());
  FYUSER:any;ServerIP:any;accountid:any;
  accountStatement : Array<any>=[]; itemDisplay: any;
  displayedColumns: string[] = ['NAME', 'GROUPNAME', 'ADDRESS1','ADDRESS2','CITY'];
  fieldArray = new MatTableDataSource<Statement>();
//  fieldArray: Array<any> = [];
  closeResult: string;
  searchText : string; userid:any;token:any; 
  p: number = 1;
  itemPerPage = '10';newData:any={};
  onfieldArrayPush: Subscription;
  
  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
   // this.isLoadingResults=true;
    this.createForm();  
  
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];

   // this.fstartDate= this.datePipe.transform(CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MM/yyyy') ;
    this.fendDate=  CompanyData['FINANCIALYEARENDDATE'] ;
    this.fstartDate= CompanyData['FINANCIALYEARSTARTDATE'] ;
    
   


  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);

this.token = currentUser['TOKEN'];
this.userid = currentUser['USERID'];
    console.log("this.AcStatement.value.fromdate", this.AcStatement.value);
    console.log("this.fstartDate",this.fstartDate);

   // this.accountid=data.AccountId;
    // this.getAccountStatements('A').subscribe((res: any[])=> {
    //   this.itemDisplay=res;
    //   this.itemDisplay=this.itemDisplay.Table;
    //   this.fieldArray.data = this.itemDisplay;
    //   console.log("ravi",this.fieldArray.data);
    //   this.isLoadingResults=false;
    //  });
  }
 
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.fendDate);
    this.dateToControl.setValue(currentDate);
  }
  applyFilter(filterValue: string) {
  //  this.fieldArray.filter = filterValue.trim().toLowerCase();
  this.fieldArray = new MatTableDataSource<Statement>();
   let search = filterValue.trim().toUpperCase();
   if(search.length>1)
   {
    this.getAccountStatements(search).subscribe((res: any[])=> {
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      console.log("ravi",this.fieldArray.data);
      this.isLoadingResults=false;
     });
   }
    
  
  }

  createForm() {
    this.AcStatement = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }

  
  openDialog(row:any) {
    console.log("row",row);
    let  data:any= {};
          
    // data.AccountId=row.ACCOUNTID,
    // data.FromDate=this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy'),
    // data.ToDate=this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy')
    
    const dialogRef = this.dialog.open(AccountStatementComponent, {
        data: {
          
          AccountId:row.ACCOUNTID,
          FromDate:this.datePipe.transform(this.dateFormControl.value, 'dd/MMM/yyyy'),
          ToDate:this.datePipe.transform(this.dateToControl.value, 'dd/MMM/yyyy')
        }
      });
    }

  onToDateChanged1()
  {
    //console.log("d1",this.dateToControl.value);
  }

  onDateChanged()
  {
    //console.log("d1",this.datePipe.transform(this.dateToControl.value, 'dd/MM/yyyy') );
  }
  getAccountStatements(search)
  {
    // return this.http.get(this.original_url+"/Accounts/Accounts/getAccountList?token="+this.token+"&").pipe(map((res : any[])=>{
    //   console.log("res",res);
    //   return res;
      
    // }));
    return this.http.get(this.original_url+"/Accounts/Accounts/getAccountList?token="+this.token+"&term="+search).pipe(map((res : any[])=>{
      console.log("res",res);
      return res;
      
    }));
  }
}
