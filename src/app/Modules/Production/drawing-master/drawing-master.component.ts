import { Global } from 'src/app/Global';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogService } from 'src/app/Dialog/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-drawing-master',
  templateUrl: './drawing-master.component.html',
  styleUrls: ['./drawing-master.component.css']
})
export class DrawingMasterComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  original_url = environment.baseUrl;
  allDataGet: any;
  newItemDetail: any = {};
  editItemID: any={};
  editMachineEditID: any={};
  displayedColumns: string[] = ['DrawingNo', 'Department', 'Category', 'Createdon', 'Revno', ];  
  date = new FormControl(new Date());
  myDate = new Date();
  companyid:any;
  newData:any= {};
  jobid:any;
  action:any;
  isLoadingResults:boolean=false;
  subscription: Subscription;
  message:any;
  itemsArray:Array<any>=[];
  machineArray:Array<any>=[];
  newMachine:any={};
  supervisorArray:Array<any>=[];
  toSectionArray:Array<any>=[];
  reasonArray:Array<any>=[];
  batchArray:Array<any>=[];
  itemsDropdownArray:Array<any>=[];
  reworkReasonArray:Array<any>=[];
  rejReasonArray:Array<any>=[];
  inspectionDoenByArray:Array<any>=[];
  machineItemArray:Array<any>=[];
  eqptMachineArray:Array<any>=[];
  operatorArray:Array<any>=[];
  inpectorArray:Array<any>=[];
  items: Array<any> = [];
  fystartdate:any;
  fyenddate:any;
  resultsLength:any;
  drawingmasterArray= new MatTableDataSource<DrawingMasterComponent>();
  moduleid:any;
  functionalityid:any;
  userRightCheck:any={};
  canEditCommonClass = '';
  canCreateCommonClass ='';
  canDeleteCommonClass ='';
  itemCount: any;
  isRateLimitReached: boolean;
  page: any;
  itemDisplay: any;
  search: any;
  pagenumber: any;
  filterarray: Array<any> = [];
  showreset: boolean = false;
  sortOrder: any;
  sortSelection: any;
  searchtype: any;
  filtertype: any;
  deptArray:Array<any>=[];
  CatgArray:Array<any>=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private globalVar : Global,
    private translate: TranslateService,
    private http: HttpClient,
    public dialog: MatDialog,
    private messageService: ConfirmationDialogService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.subscription = 
    this.messageService.getMessage()
      .subscribe(message => 
      {
        this.message= message;
        if(this.message != null)
        {
        }
      });

    this.jobid = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.moduleid= this.activatedRoute.snapshot.paramMap.get('moduleid');
    this.functionalityid= this.activatedRoute.snapshot.paramMap.get('functionalityid');


        // User Right Data Get
        let Sidebar = sessionStorage.getItem("sidebar");
        let sidebarDataGet = JSON.parse(Sidebar);
        // let childSidebarDataGet = sidebarDataGet.find(x=>x.moduleid == this.moduleid);
        // this.userRightCheck = childSidebarDataGet.items.find(x=>x.functionalityid == this.functionalityid);
        if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
        if(this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; } 
        if(this.userRightCheck.candelete == 'True') { this.canDeleteCommonClass = ''; }
        if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
        if(this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; } 
        if(this.userRightCheck.candelete == 'False') { this.canDeleteCommonClass = 'canDeleteCommonClass'; }
   }

  ngOnInit() {
    this.drawingmasterArray.sort = this.sort;
    this.drawingmasterArray.paginator=this.paginator;
    this.refreshlist()
  }


  refreshlist(){
     this.isLoadingResults=true;
     if (this.page == undefined) {
      this.page = 20;
    }
    if (this.sort.active == undefined) {
      this.sort.active = "";
    }
    if (this.sort.direction == undefined) {
      this.sort.direction = "";
    }
    this.sortOrder = this.sort.active;
    this.sortSelection = this.sort.direction;
    this.pagenumber = this.paginator.pageIndex;
    if (this.search == undefined) {
      this.search = "";
    }


     this.searchtype =this.globalVar.checknull(this.newData.searchtype ,"string");
     this.filtertype =this.globalVar.checknull(this.newData.filtertype ,"string");
     this.search =this.globalVar.checknull(this.newData.name ,"string");
    this.http.get(this.original_url + "/Masters/CommonMaster/getdrawingmasterlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.UserId+"&Pagenumber=1&Pagesize=0&sort="+this.sort.active+"&sortorder="+this.sort.direction+"&search="+this.search+"&searchtype="+this.searchtype+"&filtertype="+this.filtertype)
    .subscribe((response) => {
      let allDataget
      allDataget = response;
      this.itemDisplay = allDataget.Table;
      this.drawingmasterArray.data = this.itemDisplay;
      this.deptArray=allDataget.Table2;
      this.CatgArray=allDataget.Table3;
      this.isLoadingResults=false;
    });
  }
  editmachine(data) {
    var mcid = data.ID;
    this.router.navigate(['/add-drawing-master/' + mcid + '/edit']);
  }
  typeDDChange()
  {
    this.refreshlist();
  }
  removeCatgChange() {
    this.newData.filtertype = '';
    this.refreshlist();
  }
  removeDeptChange() {
    this.newData.searchtype = '';
    this.refreshlist();
  }
  reset(data){
    this.newData.name='';
    this.refreshlist();
  }


}


