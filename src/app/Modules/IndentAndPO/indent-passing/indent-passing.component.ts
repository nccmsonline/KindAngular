import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import {IndentpassingService} from './indentpassing.service';
import {Indentpassing} from './indentpassing.model';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../environments/environment';
import {StoreIndentDetailComponent } from '../../Inventory/store-indent/store-indent.component';
@Component({
  selector: 'app-indent-passing',
  templateUrl: './indent-passing.component.html',
  styleUrls: ['./indent-passing.component.css']
})
export class IndentPassingComponent implements OnInit {
  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;isLoadingResults:boolean;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  indentdetail: Array<Indentpassing>=[];
  indentListToSave : Array<any>=[];
  indentListToSave1 : Array<any>=[];
  indentpassing: Indentpassing[] = [];
  userinfo : any;
  coid : any;
  boid : any;
  userid:any;token:any; 
  fieldArray = new MatTableDataSource<Indentpassing>(this.indentpassing);
  displayedColumns: string[] = ['PASS','DELETE', 'INDENTNO', 'INDENTDATE',  'ITEMCODE','ITEMNAME','DEPTNAME','REMARKS','STOCKINHAND','PENDINGQTY','status'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(private service:IndentpassingService,  private http: HttpClient, public dialog: MatDialog) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];



    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
   this.service.getIndentList(this.ServerIP,this.FYUSER, this.boid).subscribe((res: any[])=> {
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.fieldArray.data = this.itemDisplay;
        console.log("Ved",this.fieldArray.data);
        this.isLoadingResults=false;
    });
   }

ngOnInit() {
  this.fieldArray.sort = this.sort;
  this.fieldArray.paginator=this.paginator;
 
  }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }

  // onChange(event, indent)
  // {
  //       if(event.checked == true)
  //       {
  //         this.indentListToSave.push(indent);
  //       }
  //       else
  //       {
  //         this.indentListToSave.splice (this.indentListToSave.indexOf(indent),1);
  //       }
  //       console.log("this.other", this.indentListToSave);
  // }
  onChange(event, data)
  {
    if(event.checked == true)
    {
    //this.ListToSave.push(data);
     data.delete=false;
    }
    // else
    // {
    //   this.ListToSave.splice (this.ListToSave.indexOf(data),1);
    // }
  }
  onDelete(event, data)
  {
    if(event.checked == true)
    {
      data.checked=false;
    }
   
  }
  save()
  {
    this.isLoadingResults=true;
      this.indentListToSave = []; 
    this.fieldArray.data.forEach((el)=>{
      let data:any={};
       data.INDENTID=el.INDENTID;
       data.ITEMID=el.ITEMID;
      if(el.checked==true)
      {
        data.PENDINGQTY=el.PENDINGQTY;
        data.KNOCKEDOFFQTY=0;
        this.indentListToSave.push(data);
      }
      else if(el.delete==true)
      {
        data.PENDINGQTY=0;
        data.KNOCKEDOFFQTY=el.PENDINGQTY;
        this.indentListToSave.push(data);
      }
     }); 
    const params = new  HttpParams()
    .set('token', this.token)    
    .set('indentdetail', JSON.stringify(this.indentListToSave));

    this.http.post(this.original_url+"/indentandpo/rateapproval/IndentConfirmation", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
     this.isLoadingResults=false;
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'sucess'
       }
     });
        this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay.Table;
          this.fieldArray.data = this.itemDisplay;
          this.indentListToSave=[];
          this.isLoadingResults=false;
    },
    error=>{
      var erroremsg:any;
      erroremsg=error.message;
      
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:erroremsg
       }
     });
     this.isLoadingResults=false;
    });

  }
  ShowItemDetail(data)
  {
    let tmp:any={};
    let ItemDetail:Array<any>=[];
    tmp.ITEMID=data.ITEMID;
    tmp.ITEMCODE=data.ITEMCODE;
    tmp.ITEMNAME=data.ITEMNAME;
    tmp.INDENTID=data.INDENTID;
    tmp.BALANCEQTY=-1;
    const dialogRef1 = this.dialog.open(StoreIndentDetailComponent, {
      data: {
        itemData: tmp
      }
    });
  }
}
