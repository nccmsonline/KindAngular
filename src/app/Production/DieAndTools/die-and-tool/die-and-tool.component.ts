import { Component, OnInit , ViewChild, Inject} from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-die-and-tool',
  templateUrl: './die-and-tool.component.html',
  styleUrls: ['./die-and-tool.component.css']
})
export class DieAndToolComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;isLoadingResults:boolean;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  boid : any;
  userid:any;
  fieldArray = new MatTableDataSource<any>();
  
  displayedColumns: string[] = [ 'DIENAME', 'DIETYPEDESC',  'NAME','MFGDATE','PLANNEDSTROKES','STROKESMADE','AVAILABLESTROKES'];
  FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(  private http: HttpClient, @Inject('BASE_URL') private original_url : string, private router: Router) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];

    http.get(this.original_url+"/Production/DieAndTools/getDieList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid).subscribe((res: any[])=> {
    
     console.log("ts",res);
   
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
  showExsitingDie(dieId)
  {
    this.router.navigate(['/add-new-die/'+dieId+'/edit']);
  }
}
