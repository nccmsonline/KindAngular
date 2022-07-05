import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator, MatDialogRef } from '@angular/material';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
import { DatePipe } from '@angular/common';
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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  indentdetail: Array<any>=[];
  indentListToSave : Array<any>=[];
  indentListToSave1 : Array<any>=[];
  indentpassing: any[] = [];isLoadingResults:boolean;
  userinfo : any;
  
  
  userid:any;
  followupDate:string;
  followupRemarks:string;
  fieldArray = new MatTableDataSource<any>(this.indentpassing);
  displayedColumns: string[] = [ 'INDENTNO', 'INDENTDATE',  'ITEMCODE','ITEMNAME','NAME','QUANTITY','ORDERNO','ORDERDATE','FOLLOWUPDATE','NEXTFOLLOWUPDATE'];
  data:any;boid : any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor( @Inject('BASE_URL') private original_url : string,private http: HttpClient,public dialog: MatDialog) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];

    this.http.get(this.original_url+"/indentandpo/RateApproval/getRequimentListForFollowup?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid).subscribe((res: any[])=> {
     // this.data=res;
     // this.indentdetail=this.data.Table;//this.data.Table as Indentlist[];
     console.log("ts",res);
   
   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table;
   this.fieldArray.data = this.itemDisplay;
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
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    //this.coid = this.userinfo['coid'];
    this.userid=this.userinfo['USERID'];
    //console.log("coid", this.coid);
    console.log("boid", this.boid);
    console.log("userid", this.userid);
    // this.service.getPassIndent(this.ServerIP,this.FYUSER,this.boid,this.indentListToSave).subscribe((res: any[])=> {
    //   this.itemDisplay=res;
    //   this.itemDisplay=this.itemDisplay.Table;
    //   this.fieldArray.data = this.itemDisplay;
    //   this.indentListToSave=this.indentListToSave1;
    // });
  }
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
  newData:any={};boid : any;FYUSER:any;ServerIP:any;
  pData:any={}; datePipe = new DatePipe("en-US");
  constructor(@Inject('BASE_URL') private original_url : string,private http: HttpClient,
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
      this.newData.FOLLOWUPDATE=this.datePipe.transform(currDate, 'dd-MMM-yyyy');
      this.newData.ITEMID=this.pData.ITEMID;
      this.newData.INDENTID=this.pData.INDENTID;
      this.newData.BRANDID=this.pData.BRANDID;

    //  this.dialogRef.close( this.newData);
      this.newData.NEXTFOLLOWUPDATE=this.datePipe.transform(this.newData.NEXTFOLLOWUPDATE, 'dd-MMM-yyyy');
      var arrayList:any=[];
      arrayList.push(this.newData);
      this.http.post(this.original_url+"/indentandpo/RateApproval/saveFollowup?serverip="+this.ServerIP+
                     "&fyuser="+this.FYUSER+"&boid="+this.boid+"&followuplist="+JSON.stringify(arrayList), {data: ''}).subscribe((res: any)=> {
    
     console.log("ts",res);
     if(res==1)
     {
          this.dialogRef.close( this.newData);
     }
   

    });
    }
   
  }
}