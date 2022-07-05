import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { error } from '@angular/compiler/src/util';
//import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
export interface DialogData {
  followupDate: string;
  followRemarks: string;
}

@Component({
  selector: 'app-requirment-folloup',
  templateUrl: './requirment-folloup.component.html',
  styleUrls: ['./requirment-folloup.component.css']
})
export class RequirmentFolloupComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  filterFlag:any;
  original_url = environment.baseUrl;
  indentdetail: Array<any>=[];
  indentListToSave : Array<any>=[];
  indentListToSave1 : Array<any>=[];
  indentpassing: any[] = [];isLoadingResults:boolean;
  userinfo : any;
  filterTypes: Array<any>=[];
  userid:any;token:any; 
  followupDate:string;
  followupRemarks:string;
  fieldArray = new MatTableDataSource<any>(this.indentpassing);
  displayedColumns: string[] = [ 'INDENTNO', 'INDENTDATE',  'ITEMCODE','ITEMNAME','NAME','QUANTITY','ORDERNO','ORDERDATE','FOLLOWUPDATE','NEXTFOLLOWUPDATE'];
  data:any;boid : any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(private http: HttpClient,public dialog: MatDialog) {
    
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.filterFlag="A";
    this.refreshFollowupList(this.filterFlag)
   }
   refreshFollowupList(flag)
   {
    this.isLoadingResults=true;
        this.http.get(this.original_url+"/indentandpo/RateApproval/getRequimentListForFollowup?token="+this.token+"&flag="+flag).subscribe((res: any[])=> {
          console.log("ts",res);
          this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay.Table;
          this.fieldArray.data = this.itemDisplay;
          this.isLoadingResults=false;
        },
        error=>{
          this.isLoadingResults=false;
        });
   }
ngOnInit() {
  this.fieldArray.sort = this.sort;
  this.fieldArray.paginator=this.paginator;
  this.filterTypes.push({id:'A',description:'All'});
  this.filterTypes.push({id:'T',description:'Today to be Followup'});
  this.filterTypes.push({id:'N',description:'Yet not Followup'});
  this.filterTypes.push({id:'F',description:'Incoming Follow up'});
  this.filterTypes.push({id:'7',description:'Missed in Past 7 Days'});
  this.filterTypes.push({id:'30',description:'Missed in Past 30 Days'});
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
  // save()
  // {
  //   console.log("checked", this.indentListToSave);
  //   let user = sessionStorage.getItem("currentUser");
  //   this.userinfo = JSON.parse(user);
  //   this.userid=this.userinfo['USERID'];
  //  }
  openDialog(data): void {
    const dialogRef = this.dialog.open(followup, {
     // width: '600px',
      data: {data: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed1', result);
      if(result!='')
      {
        var fdata:any={};
        var fdata1:any={};
        fdata=result;
        fdata1=  this.fieldArray.data.find(x=>x.INDENTID==fdata.INDENTID&&x.ITEMID==fdata.ITEMID&&x.BRANDID==fdata.BRANDID);
        fdata1.NEXTFOLLOWUPDATE=fdata.NEXTFOLLOWUPDATE;
        fdata1.FOLLOWUPDATE=fdata.FOLLOWUPDATE;
      }
      this.followupDate = result;
    });
  }

}
@Component({
  selector: 'followup',
  templateUrl: 'followup.html',
  styleUrls: ['./requirment-folloup.component.css']
})

export class followup {
  original_url = environment.baseUrl;
  allData:any={};
  newData:any={};boid : any;FYUSER:any;ServerIP:any;userid:any;token:any;
  pData:any={}; datePipe = new DatePipe("en-US");
  followUpList:Array<any>=[];
  followOrderList:Array<any>=[];
  constructor(private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<followup>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("itemanme",data);
      this.pData=data.data;
      this.newData.ITEMNAME=this.pData.ITEMNAME;
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
      http.get(this.original_url+"/indentandpo/RateApproval/ShowFollowup?token="+this.token+"&indentid="+this.pData.INDENTID+"&itemid="+this.pData.ITEMID).subscribe(res=>{
        this.allData=res;
        console.log("re",res);
        this.followUpList=this.allData.Table;
        this.followOrderList=this.allData.Table1;
      });
    }
  onNoClick(): void {
    var flag:boolean, msgBox:string;
    flag=true;
    console.log("this.newData.NEXTFOLLOWUPDATE",this.newData.NEXTFOLLOWUPDATE);

    var currDate=new Date();
    var selectedDate=new Date(this.newData.NEXTFOLLOWUPDATE);
    selectedDate.setHours(selectedDate.getHours() + 23);

    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    if(this.newData.REMARKS=='' ||this.newData.REMARKS==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Remarks not entred."+'</li>';
    }
    if(this.newData.NEXTFOLLOWUPDATE=='' ||this.newData.NEXTFOLLOWUPDATE==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Next Followupdate not entred."+'</li>';
    }
    if((this.newData.NEXTFOLLOWUPDATE!='' ||this.newData.NEXTFOLLOWUPDATE!=undefined) && selectedDate<currDate)
    {
      flag=false;
      msgBox=msgBox+"<li>Next Followup date should not before current date."+'</li>';
    }
    msgBox=msgBox+"</ul>";
    if(flag==false) {
     console.log("msgBox",msgBox);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'validation',
        displayMsg:msgBox
      }
    });
     }
    else
    {
      var arrayList:any=[];
      if(this.newData.chkd)
      {
        this.followOrderList.forEach(el=>{
          let tmp:any={};
          tmp.FOLLOWUPDATE=this.datePipe.transform(currDate, 'dd-MMM-yyyy');
          tmp.ITEMID=el.ITEMID;
          tmp.INDENTID=el.INDENTID;
          tmp.BRANDID=el.BRANDID;
          tmp.REMARKS=this.newData.REMARKS;
          tmp.NEXTFOLLOWUPDATE=this.datePipe.transform(this.newData.NEXTFOLLOWUPDATE, 'dd-MMM-yyyy');
          arrayList.push(tmp);
        });
      }
      else
      {
        this.newData.FOLLOWUPDATE=this.datePipe.transform(currDate, 'dd-MMM-yyyy');
        this.newData.ITEMID=this.pData.ITEMID;
        this.newData.INDENTID=this.pData.INDENTID;
        this.newData.BRANDID=this.pData.BRANDID;
        this.newData.NEXTFOLLOWUPDATE=this.datePipe.transform(this.newData.NEXTFOLLOWUPDATE, 'dd-MMM-yyyy');
        
        arrayList.push(this.newData);
      }
    
      this.http.post(this.original_url+"/indentandpo/RateApproval/saveFollowup?followuplist="+JSON.stringify(arrayList)+"&userid="+this.userid+"&token="+this.token, {data: ''}).subscribe((res: any)=> {
    
     console.log("ts",res);
     if(res==1)
     {
          this.dialogRef.close( this.newData);
     }
   

    });
    }
   
  }
}