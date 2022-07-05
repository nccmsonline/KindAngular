import { Component, OnInit,ViewChild, Inject } from '@angular/core';

import { HttpClient,HttpParams } from '@angular/common/http';  
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { parseNumber, formatDate } from '@progress/kendo-angular-intl';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-store-indent',
  templateUrl: './store-indent.component.html',
  styleUrls: ['./store-indent.component.css']
})
export class StoreIndentComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  itemPerPage = '10';
  original_url = environment.baseUrl;
  pageIndex: any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  itemCount: any;
  itemDisplay: any;
  sortSelection: any;
  sortOrder:any;
  page:any;
  userinfo:any;
  //sort:any;
  pagenumber:any;
  search:any;
  name:any;
  branch1info: any;
  coid:any;
  boid:any;
  deptList:Array<any>=[];
  DeptId:any;
  newData:any={};
  items:Array<any>=[];
  getStoreData:Array<any>=[];
  storeidchange:any;
  FYUSER:any;ServerIP:any;tmpDate=new Date();
  userid:any;token:any;WorkingDate:any;
  issuanceArray = new MatTableDataSource<any>();
  displayedColumns: string[] = ['chk','itemcode','itemname','pending',  'stockinhand', 'balanceqty','procure', 'action'];
  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) { 
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.tmpDate= new Date(CompanyData['WORKINGDATE']);
  }

  ngOnInit() {
    this.refreshRequisition();
    this.issuanceArray.sort = this.sort;
    this.issuanceArray.paginator=this.paginator;
  }
  applyFilter(filterValue: string) {
    this.issuanceArray.filter = filterValue.trim().toLowerCase();
  }
  onChange(event)
  {
    console.log("event", event);
    this.itemPerPage = event;
  }
  onCkhChange(chk, row)
  {
    let ItemDetail:Array<any>=[];
    if(chk.checked)
    {
      this.isLoadingResults=true;
      this.http.get(this.original_url+ "/PurachaseAndStore/Store/getStoreIndentItemDetail?token="+this.token+"&itemid="+row.ITEMID+"&qty="+row.BALANCEQTY).subscribe((data: any[]) => {
        this.itemDisplay=data;
        ItemDetail = this.itemDisplay;
        console.log("itemDetail", this.itemDisplay);
        row.detail=ItemDetail;
        row.TOPROCURE=row.BALANCEQTY;
        this.isLoadingResults=false;
        });
    }
    else
    {
      row.TOPROCURE=0;
      row.detail=  ItemDetail;
    }
  }

  refreshRequisition()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/PurachaseAndStore/Store/getRequisitionDataForIndentGeneration?token="+this.token).subscribe((data: any[]) => {
      this.itemDisplay=data;
      this.issuanceArray.data = this.itemDisplay.Table2;
      this.deptList= this.itemDisplay.Table1;
      this.isLoadingResults=false;
      });
  }
  
  GenerateIndent()
  {
    if(this.DeptId==undefined)
    {
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'Department not selected.'
        }
      });
      return;
    }

    this.isLoadingResults=true;
    let tmpData:any={};
    let mindentid=0;
    let indentarray: Array<any> = [];
    let header: Array<any> = [];
    let detail: Array<any> = [];
    tmpData.INDENTNO = ':A';
    tmpData.INDENTDATE = ':B';
    tmpData.INDENTID  = ':C';
    tmpData.EDATE = ':D';
    tmpData.INDENTORID=this.userid;
    tmpData.BRANCHID = this.boid;
    tmpData.USERID = this.userid;
    tmpData.DEPTID  = this.DeptId;
    tmpData.COSTCENTERID = 0;
    tmpData.ACTUALSLIPNO = '';
    tmpData.ISJOBWORK="N";
    tmpData.SUBCOSTCENTREID = 0;
    tmpData.REFERENCENO=0;
    tmpData.COMPANYID=1;
    tmpData.STATUS="P";
    header.push(tmpData);

    let nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 5 );

      let saveData:Array<any>=[];
      this.issuanceArray.data.forEach(el=>{
          if(el.checked)
          {
            let tmp:any={};
            tmp.INDENTID=":A";
            tmp.EDATE=formatDate(this.WorkingDate, 'dd-MMM-yyyy', 'en-US', '+0530'); 
            tmp.ITEMID=el.ITEMID;
            tmp.EXPECTEDDATE=formatDate(nextDate, 'dd-MMM-yyyy', 'en-US', '+0530'); 
            tmp.COMPANYID=1;
            tmp.USERID=this.userid;
            tmp.BRANCHID=this.boid;
            tmp.STOCKINHANDQTY=el.STOCKINHAND;
            tmp.QUANTITY=el.TOPROCURE;
            tmp.PACKSIZE=1;
            tmp.BRANDID=0;
            tmp.REMARKS='Indent against Store Requisation';
            tmp.TOOLDEVELOPORDERID=0;
      
            detail.push(tmp);
            
            let row=el.detail;
            row.forEach(r=>{
              let tmp:any={};
              tmp.INDENTID=":A";
              tmp.REQID=r.REQID;
              tmp.ITEMID=r.ITEMID;
              tmp.BRANCHID=this.boid;
              tmp.Qty=r.BALANCEQTY;
              saveData.push(tmp);
            })
          }
      });
      console.log("save data",saveData);
      let indentno:any;

      const  params = new  HttpParams()
      .set('list',JSON.stringify(saveData))
      .set('token', this.token)
      .set('header', JSON.stringify(header))
      .set('detail', JSON.stringify(detail));
      this.isLoadingResults=true;
    this.http.post(this.original_url+"/PurachaseAndStore/Store/saveStoreIndent", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      indentno=res;
      if (parseInt(indentno)>0)
      {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'sucess',
                  displayMsg:'Data Saved'
                }
              });
          this.refreshRequisition();
             
      }
      else
      {
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'wrongData',
                    displayMsg:'Somthing went wrong'
                  }
                });
      }
      this.isLoadingResults=false;
    });

  }
  ShowItemDetail(data)
  {
    let ItemDetail:Array<any>=[];
    const dialogRef1 = this.dialog.open(StoreIndentDetailComponent, {
      data: {
        itemData: data
      }
    });
    dialogRef1.afterClosed().subscribe(res=>{
      console.log("dialogRef1",res);
      if(res!='cancel')
      {
        this.itemDisplay=res;
        ItemDetail = this.itemDisplay;
        console.log("itemDetail", this.itemDisplay);
        data.detail=ItemDetail;
        let total:number;
        total=0;
        ItemDetail.forEach(el=>{
          total+=parseNumber(el.BALANCEQTY);
        });
  
        data.TOPROCURE=total;
      }
     
    });
  }
  
 }

 @Component({
  selector: 'itemdetail',
  templateUrl: './itemdetail.html',
  styleUrls: ['./store-indent.component.css']
})

export class StoreIndentDetailComponent implements OnInit {
  token:any;
  WorkingDate:any;
  tmpDate:any;
  parentData:any={};
  itemDetail:Array<any>=[];
  isLoadingResults=false;
  itemDisplay:any={};
  original_url = environment.baseUrl;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public dialogRef: MatDialogRef<StoreIndentDetailComponent>,
    private http: HttpClient
  ) { 
    this.parentData=data.itemData;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.tmpDate= new Date(CompanyData['WORKINGDATE']);
    this.getItemDetail();
  }
  ngOnInit() {

   }
   getItemDetail()
   {
    this.isLoadingResults=true;
    if(this.parentData.BALANCEQTY>0)
    {
      this.http.get(this.original_url+ "/PurachaseAndStore/Store/getStoreIndentItemDetail?token="+this.token+"&itemid="+this.parentData.ITEMID+"&qty="+this.parentData.BALANCEQTY).subscribe((data: any[]) => {
        this.itemDisplay=data;
        this.itemDetail = this.itemDisplay;
        console.log("itemDetail", this.itemDetail);
        this.isLoadingResults=false;
        });
    }
    else
    {
      this.http.get(this.original_url+ "/PurachaseAndStore/Store/getStoreIndentReqItemDetail?token="+this.token+"&itemid="+this.parentData.ITEMID+"&indentid="+this.parentData.INDENTID).subscribe((data: any[]) => {
        this.itemDisplay=data;
        this.itemDetail = this.itemDisplay;
        console.log("itemDetail", this.itemDetail);
        this.isLoadingResults=false;
        });
    }
   }
   saveCurrentSelection()
   {
     let list:Array<any>=[];
    this.itemDetail.forEach((el)=>{
        if(el.chkd)
        {
          list.push(el);
        }
    });
    this.dialogRef.close(list);
   }
   cancelDialog()
   {
    this.dialogRef.close("cancel");
   }
}