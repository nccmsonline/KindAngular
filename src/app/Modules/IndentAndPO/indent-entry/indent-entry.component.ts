import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IndentEntryService } from './indent-entry.service';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;

import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddNewIndentEntryComponent } from './add-new-indent-entry/add-new-indent-entry.component';
import { Subscription, Observable,BehaviorSubject,merge,of as observableOf } from 'rxjs';
import { Indent, GithubApi } from './indent.modal';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-indent-entry',
  templateUrl: './indent-entry.component.html',
  styleUrls: ['./indent-entry.component.css']
})
export class IndentEntryComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;
  coid : any;
  boid : any;
  sortOrder :any;
  sortSelection  :any ;
  original_url=environment.baseUrl;
  onDataChanged: Observable<any>;
  displayedColumns: string[] = ['indentno',  'indentdate', 'department','costcentre', 'isjobwork','manualslipno', 'print'];
  fieldArray = new MatTableDataSource<Indent>();

  newData: any={};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  onfieldArrayPush: Subscription;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  page: any ;
  items:Array<any>=[];
  // exampleDatabase: ExampleHttpDao | null;
  itemCount: any;
  itemDisplay: any;
  FYUSER:any;ServerIP:any;
  userid:any;token:any;WorkingDate:any;
  fstartdate:any;
  fenddate:any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder, private router: Router,
    private http: HttpClient,
    private indentEntryService: IndentEntryService,
    public dialog: MatDialog
  ) {

    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fstartdate=  formatDate(CompanyData['FINANCIALYEARSTARTDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    this.fenddate=  formatDate(CompanyData['FINANCIALYEARENDDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
  }

  printIndent(indentid)
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/indentandpo/indent/onIndentLoad?token="+this.token+"&indentid="+indentid).subscribe((res)=>{
      console.log("res",res);
      this.itemDisplay=res;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table4[0];
        this.newData.INDENTNO=this.itemDisplay.INDENTNO;
        this.newData.INDENTDATE=this.itemDisplay.INDENTDATE;
        if(this.itemDisplay.ISJOBWORK=="Y")
        {
          this.newData.ISJOBWORK=1;
          this.newData.JOBWORK='Yes';
        }
        else
        {
          this.newData.ISJOBWORK=0;
          this.newData.JOBWORK='No';
        }
        this.newData.ACTUALSLIPNO=this.itemDisplay.ACTUALSLIPNO;
        this.newData.ISCONFIRM=this.itemDisplay.ISCONFIRM;
        this.newData.DEPTID=this.itemDisplay.DEPTID;
        this.newData.COSTCENTERID=this.itemDisplay.COSTCENTERID;
        this.newData.DEPTNAME=this.itemDisplay.DEPTNAME;
        this.newData.COSTCENTRE=this.itemDisplay.COSTCENTRE;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table4;
        this.items=[];
        let i=0;
        this.itemDisplay.forEach((el)=>{
          let tmp:any={};
          tmp.id=i++;
          tmp.SR=i;
          tmp.INDENTID=el.INDENTID;
          tmp.ITEMID=el.ITEMID;
          tmp.ITEMCODE=el.ITEMCODE;
          tmp.ITEMNAME=el.ITEMNAME;
          tmp.QUANTITY=el.QUANTITY;
          tmp.UOM=el.UOM;
          tmp.ITEMSBRANDID=el.ITEMSBRANDID;
          tmp.ITEMSBRAND=el.ITEMSBRAND;
          tmp.REMARKS=el.REMARKS;
          tmp.ISEMERGENCY=el.ISEMERGENCY;
          tmp.STOCKINHAND=el.STOCKINHAND;
          if(el.ISEMERGENCY=="Y")
          {
            this.newData.ISEMERGENCY=1;
          }
          else
          {
            this.newData.ISEMERGENCY=0;
          }
          tmp.EXPECTEDDATE=el.EXPECTEDDATE;
          tmp.LASTPURCHASEQTY=el.LASTPURCHASEQTY;
          tmp.LASTPURCHASERATE=el.LASTPURCHASERATE;
          tmp.LASTPURCHASEDATE=el.LASTPURCHASEDATE;
          this.items.push(tmp);
        });
    
        let data:any={};
        data.header=this.newData;
        data.detail=this.items;
        data.backto='/indent-entry';
        sessionStorage.setItem('indent', JSON.stringify(data));
        this.router.navigate(['/print-indent'], {skipLocationChange:true});
        this.isLoadingResults=false;
   });
  }
  ngOnInit() {
        this.getIndentList(this.ServerIP,this.FYUSER,this.boid);
        this.fieldArray.sort = this.sort;
        this.fieldArray.paginator=this.paginator;
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

  onChange(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }

  ItembrandFunction()
  {
    $(document).ready(function(){
      $('#item_brandID').css("display", "block");
    });
  }
  getIndentList(ServerIP, FYUSER,boid)
  {
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/indentandpo/indent/getindentlist?token="+this.token+"&fromdate="+this.fstartdate+"&todate="+this.fenddate).subscribe((res : any[])=>{
      console.log("res",res);
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      this.isLoadingResults=false;
    });
  }
  ShowIndentDetail(indentid)
  {
    this.router.navigate(['/add-new-indent-entry/'+indentid+'/edit'], {skipLocationChange:true});
  }
}



// export class ExampleHttpDao {
//   userinfo : any;
//   coid : any;
//   boid : any;
//   constructor(private http: HttpClient) {}
  
//   getRepoIssues(sort: string, order: string, page: number, paging: number,coid:number,boid:number): Observable<GithubApi> {
    
//     const requestUrl =
//         `http://suvidhaapi.suvidhacloud.com/api/MaterialManagement/Indents/getindentlist?PageNumber=${page + 1}&PageSize=${paging}&sort=${sort}&sortorder=${order}&coid=${coid}&boid=${boid}`;
//     return this.http.get<GithubApi>(requestUrl);
//   }
// }
