import { gateEntryPrintComponent } from './../../../../Inventory/gate-entry-list/add-new-gate-entry/add-new-gate-entry.component';
import { Global } from './../../../../../Global';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-parts-amt-calculator',
  templateUrl: './parts-amt-calculator.component.html',
  styleUrls: ['./parts-amt-calculator.component.css']
})
export class PartsAmtCalculatorComponent implements OnInit {


  original_url = environment.baseUrl;
  id: any;
  displayedColumns: string[] ; 
  ItemArray: Array<any> = [];
  userinfo : any;
  coid : any;
  boid : any;
  userid : any;
  branch1Data: any;
  branch2Data: any;
  fyid: any;
  allData: any;
  item: any;
  actionType: any;
  newData:any={};
  batchDetail:Array<any> = [];
  dataArray:Array<any> = [];
  totalQty:any;
  readAble:boolean=false;
  isLoadingResults: boolean;
  allDataget: any;
  grandTotal:any;
  mono: any;

  constructor(
    public dialogRef: MatDialogRef<PartsAmtCalculatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { 
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    // this.coid = this.userinfo['coid'];
    // this.userid=this.userinfo['userid'];

    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.boid = this.branch1Data['boid'];

    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];

    this.id = data.id;
    this.actionType = data.action;
    this.item = this.id;
    this.allDataget = data.itemData;

    if(this.actionType == 'new')
    {
      this.displayedColumns=['srno','itemname','reqnqty','issuedqty','consumedqty','rate','amount'];
      this.refresh(data);
    }

    if(this.actionType == 'teamwise')
    {
      this.displayedColumns=['srno','teamname','itemname','consumedqty','rate','amount'];
      this.teamwiseparts(this.allDataget);
    }
  }

  ngOnInit() {

  }

  refresh(data) {
    this.isLoadingResults = true;
    this.http.get(this.original_url+"/Maintenance/Ticket/getmoprogressdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + this.id)
      .subscribe((response) => {
        // this.isLoadingResults = false;
        var allDataGet: any;
        allDataGet = response;
        this.ItemArray = allDataGet.Table5;
        this.ItemArray.forEach((data) => {
          data.totalconsumedqty = data.pendingqty;
          this.calculation(data);
        });
        
        this.isLoadingResults = false;
        this.mono=allDataGet.Table4;
        this.mono=this.mono[0].mono;
        if(this.ItemArray.length > 0){
          if(data.itemData.batchDetail != undefined)
          {
            this.batchDetail = data.itemData.batchDetail;
          }
          if(this.batchDetail != undefined){
            for(let i=0;i<this.batchDetail.length;i++){
              for(let j=0;j<this.ItemArray.length;j++){
                if(this.ItemArray[j].id == this.batchDetail[i].id)
                {
                  this.ItemArray[j].totalconsumedqty = this.batchDetail[i].totalconsumedqty;
                  this.calculation(this.ItemArray[j]);
                }
              }
            }

          }
        }

      });
  }

  teamwiseparts(data){
    this.isLoadingResults = true;
    this.http.get(this.original_url+"/Maintenance/Ticket/getmoprogressdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&id=" + data.moid)
      .subscribe((response) => {
        // this.isLoadingResults = false;
        var allDataGet: any;
        allDataGet = response;
        this.mono=allDataGet.Table4;
        this.mono=this.mono[0].mono;
        this.dataArray = allDataGet.Table6;
        // this.dataArray= allDataGet;
        this.ItemArray = this.dataArray.filter(x => x.teamid == data.moassignedteamid);
       
        // for(let mdata of this.ItemArray)
        // {
        //   this.calculation(mdata);
        // }
        this.getGrandtotal();
        this.isLoadingResults = false;
        
      });
  }

  issueqtyCheck(data){
    // data.amount=0;
    if(data.totalconsumedqty == null || data.totalconsumedqty == undefined || data.totalconsumedqty == NaN || data.totalconsumedqty == '')
    {data.totalconsumedqty = 0;}
    else{
      data.totalconsumedqty= data.totalconsumedqty;
    }
    if(data.totalconsumedqty > data.pendingqty)
    {
      const msg = "* Consumption Qty. cannot be Greater than Issued Qty.";
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
      data.totalconsumedqty = data.pendingqty;
    }
    this.calculation(data);
  }

  calculation(data) {
    // data.amount=0;
    var netamount: number = 0;
    netamount = data.totalconsumedqty * data.itemrate;
    data.amount = netamount;
    this.getGrandtotal();
  }

  getGrandtotal(){
    let amount=0;
    for(let mdata of this.ItemArray)
    {
      if(mdata.amount==""||mdata.amount==undefined||mdata.amount==null||mdata.amount==NaN)  {mdata.amount=0 ;} else {mdata.amount=mdata.amount;}
      amount =amount + parseFloat(mdata.amount);
      this.grandTotal=amount;
    }
  
  }

  // Save
  ItemStockSelected(ItemArray)
  {
    // let amount=0;
    let DataArray:any=[];
   
    this.dialogRef.close({ batchDetail: ItemArray, amount: this.grandTotal });
  }
}
