import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import {IndentpassingService} from './indentpassing.service';
import {Indentpassing} from './indentpassing.model';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-indent-passing',
  templateUrl: './indent-passing.component.html',
  styleUrls: ['./indent-passing.component.css']
})
export class IndentPassingComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;isLoadingResults:boolean;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  indentdetail: Array<Indentpassing>=[];
  indentListToSave : Array<any>=[];
  indentListToSave1 : Array<any>=[];
  indentpassing: Indentpassing[] = [];
  userinfo : any;
  coid : any;
  boid : any;
  userid:any;
  fieldArray = new MatTableDataSource<Indentpassing>(this.indentpassing);
  displayedColumns: string[] = [ 'INDENTNO', 'INDENTDATE',  'ITEMCODE','ITEMNAME','DEPTNAME','REMARKS','STOCKINHAND','PENDINGQTY'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(private service:IndentpassingService,  private http: HttpClient, public dialog: MatDialog,@Inject('BASE_URL') private original_url : string) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];

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

  onChange(event, indent)
  {
        if(event.checked == true)
        {
          this.indentListToSave.push(indent);
        }
        else
        {
          this.indentListToSave.splice (this.indentListToSave.indexOf(indent),1);
        }
        console.log("this.other", this.indentListToSave);
  }
  save()
  {
    console.log("checked", this.indentListToSave);
    // let user = sessionStorage.getItem("currentUser");
    // this.userinfo = JSON.parse(user);
    // this.userid=this.userinfo['USERID'];
    // console.log("boid", this.boid);
    // console.log("userid", this.userid);
    // this.isLoadingResults=true;
    // this.service.getPassIndent(this.ServerIP,this.FYUSER,this.boid,this.indentListToSave).subscribe((res: any[])=> {
    //       this.itemDisplay=res;
    //       this.itemDisplay=this.itemDisplay.Table;
    //       this.fieldArray.data = this.itemDisplay;
    //       this.indentListToSave=this.indentListToSave1;
    //       this.isLoadingResults=false;
    // });
 
    console.log("mydata",this.indentListToSave);
    const params = new  HttpParams()
    .set('serverip', this.ServerIP)
    .set('fyuser', this.FYUSER)
    .set('boid', this.boid)
    .set('indentdetail', JSON.stringify(this.indentListToSave));

    // return this.http.get(this.original_url+"/indentandpo/rateapproval/IndentConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&indentdetail="+JSON.stringify(indentListToSave)).pipe(map((res : Indentpassing[])=>{
    //   console.log("res",res);
    //   return res;

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
      //console.log("1212",erroremsg);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:erroremsg
       }
     });
     this.isLoadingResults=false;
    });

  }
 
}
