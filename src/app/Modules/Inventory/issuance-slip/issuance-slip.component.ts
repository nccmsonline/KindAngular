import { Component, OnInit,ViewChild } from '@angular/core';
import { Goods } from './goods.modal';
import {IssuanceSlipService} from './issuance-slip.service';
import { HttpClient,HttpParams } from '@angular/common/http';  
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-issuance-slip',
  templateUrl: './issuance-slip.component.html',
  styleUrls: ['./issuance-slip.component.css']
})
export class IssuanceSlipComponent implements OnInit {

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

  newData:any={};
  items:Array<any>=[];
  getStoreData:Array<any>=[];
  storeidchange:any;
  FYUSER:any;ServerIP:any;tmpDate=new Date();
  userid:any;token:any;WorkingDate:any;
  issuanceArray = new MatTableDataSource<Goods>();
  displayedColumns: string[] = ['issuanceno','issuancedate',  'deptname', 'costcentre','store', 'reqno', 'ipono','productname', 'lotsize','print'];

  constructor(
    private issuance: IssuanceSlipService,
    private router: Router,
    private http: HttpClient
  ) { 
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
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


  refreshRequisition()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+ "/PurachaseAndStore/Store/getIssuanceList?token="+this.token).subscribe((data: any[]) => {
      this.itemDisplay=data;
      this.itemDisplay=this.itemDisplay.Table;
      this.issuanceArray.data = this.itemDisplay;
      this.isLoadingResults=false;
      });
  }

  // ngAfterContentInit() {
  //   this.http.get(this.original_url+"/MaterialManagement/requisition/getstore?coid="+this.coid+"&boid="+this.boid)
  //   .subscribe((respose: any[])=>{
  //     this.getStoreData=respose;
  //     this.isLoadingResults=false;
  //   });
  // }


 

editIssuance(data)
{
  
  var issuanceid=data.REQID;
  this.router.navigate(['/add-issuance-slip/'+issuanceid+'/view'], { queryParams:  filter, skipLocationChange: true});
}

printIssuance(id)
{
  this.isLoadingResults=true;
  this.http.get(this.original_url+"/PurachaseAndStore/Store/onIssuanceLoad?token="+this.token+"&ReqID="+id).subscribe((res)=>{
    console.log("res",res);
   

      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table5[0];
     // this.newData.REQID=this.id;
      this.newData.REQNO=this.itemDisplay.REQNO;
      this.newData.REQDATE=this.itemDisplay.REQDATE;
      this.newData.REQSLIPID=this.itemDisplay.REQSLIPID;
      this.newData.ACTUALSLIPNO=this.itemDisplay.ACTUALSLIPNO;
      this.newData.CONFIRM=this.itemDisplay.CONFIRM;
      this.newData.DEPTID=this.itemDisplay.DEPTID;
      this.newData.COSTCENTERID=this.itemDisplay.COSTCENTERID;
      this.newData.DEPTNAME=this.itemDisplay.DEPTNAME;
      this.newData.COSTCENTRE=this.itemDisplay.COSTCENTRE;
      this.newData.NOOFSETS=this.itemDisplay.NOOFSETS;
      this.newData.IPOID=this.itemDisplay.IPOID;
      this.newData.PRODUCTID=this.itemDisplay.PRODUCTID;
      this.newData.STOREID=this.itemDisplay.STOREID;
      this.newData.STORE=this.itemDisplay.STORE;
      this.newData.IPONO=this.itemDisplay.IPONO;
      this.newData.PRODUCTNAME=this.itemDisplay.PRODUCTNAME;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table6;
      
      this.items=[];
      let i=0;
      this.itemDisplay.forEach((el)=>{
        let tmp:any={};
        tmp.id=i++;
        tmp.SR=i;
        tmp.REQID=el.REQID;
        tmp.ITEMID=el.ITEMID;
        tmp.ITEMCODE=el.ITEMCODE;
        tmp.ITEMNAME=el.ITEMNAME;
        tmp.QUANTITYREQUESTED=el.QUANTITYREQUESTED;
        tmp.UOM=el.UOM;
        tmp.QUANTITYISSUED=el.QUANTITYISSUED;
        tmp.ISSUEDQUANTITY=el.QUANTITYISSUED;
        tmp.REMARKS=el.REMARKS;
        tmp.STOCKINHAND=el.STOCKINHAND;
        this.items.push(tmp);
      });
    
      let data:any={};
      data.header=this.newData;
      data.detail=this.items;
      data.title="Issuance Slip"
      data.backto='/issuance-slip';
     sessionStorage.setItem('issuance', JSON.stringify(data));
     this.router.navigate(['/print-issuance']);
     this.isLoadingResults=false;
 });
}
}

