import { Component, OnInit , ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RateApprovalServiceService } from './rate-approval-service.service';
import { RateApprovalModel } from './rate-approval-model';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { ConfirmationDialogComponent } from '../../../Dialog/confirmation-dialog/confirmation-dialog.component';
import { ChildItemsPopupComponent } from '../../Master/unique-item-codification-mapping/child-items-popup/child-items-popup.component';
@Component({
  selector: 'app-rate-approval-confirmaton',
  templateUrl: './rate-approval-confirmaton.component.html',
  styleUrls: ['./rate-approval-confirmaton.component.css']
})

export class RateApprovalConfirmatonComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any;
  coid : any;
  boid : any;isLoadingResults:any;
  userid:any;RateListToSave : Array<any>=[];
  rateAppDetail: RateApprovalModel[] = [];
  fieldArray = new MatTableDataSource<RateApprovalModel>(this.rateAppDetail);
  displayedColumns: string[] = ['CHECK', 'SERIES','ARDATE','NAME','ITEMCODE','ITEMNAME','RATE','DISCRATE','NETRATE','LASTPURCHASERATE','popup'];
  data:any;FYUSER:any;ServerIP:any;
  itemDisplay: any;
  constructor(public dialog: MatDialog,private service:RateApprovalServiceService,  private http: HttpClient) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.service.getratapprovalforconfirmation(this.ServerIP,this.FYUSER, this.boid).subscribe((res: any[])=> {
    this.data=res;
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
    this.RateListToSave.push(indent);
    }
    else
    {
      this.RateListToSave.splice (this.RateListToSave.indexOf(indent),1);
    }
    console.log("this.other", this.RateListToSave);
  }
  onDataChange( indent)
  {
    if(indent.DISCRATE=='undefined' || indent.DISCRATE=='')
    {
      indent.DISCRATE=0;
    }
    if(indent.RATE=='undefined' || indent.RATE=='')
    {
      indent.RATE=0;
    }
    var netrate:number;
    netrate=indent.RATE*(100-indent.DISCRATE)/100
     indent.NETRATE=netrate.toFixed(2);
  }
  ConfimRate()
  {
    let dailogResult="";
    
    if(this.boid==7)
    {
      this.isLoadingResults=true;
      let rateList : Array<any>=[];
      for(let data of this.RateListToSave)
      {
          let rate:any={};
          rate.ARID=data.ARID;
          rate.ITEMID=data.ITEMID;
          rate.RATE=data.RATE;
          rate.DISCRATE=data.DISCRATE;
          rate.NETRATE=data.NETRATE;
          rateList.push(rate);
      }
      console.log("mydata",rateList);
      
      this.service.ConfirmationRateApproval(this.ServerIP,this.FYUSER, this.boid, rateList, "Y").subscribe((res: any[])=> {
        this.data=res;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.fieldArray.data = this.itemDisplay;
       
        this.isLoadingResults=false;
        this.RateListToSave=[];
        } ,     
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
    else
    {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dailogType:'OTP',
        msg:'OTP for Rate Approval'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      dailogResult=result;
      console.log('The dialog was closed1',dailogResult);
    
    
      if(dailogResult=="ok")
      {
              let rateList : Array<any>=[];
              for(let data of this.RateListToSave)
              {
                  let rate:any={};
                  rate.ARID=data.ARID;
                  rate.ITEMID=data.ITEMID;
                  rate.RATE=data.RATE;
                  rate.DISCRATE=data.DISCRATE;
                  rate.NETRATE=data.NETRATE;
                  rateList.push(rate);
              }
              console.log("mydata",rateList);
              this.isLoadingResults=true;
              this.service.ConfirmationRateApproval(this.ServerIP,this.FYUSER, this.boid, rateList, "Y").subscribe((res: any[])=> {
                this.data=res;
                this.itemDisplay=res;
                this.itemDisplay=this.itemDisplay.Table;
                this.fieldArray.data = this.itemDisplay;
                console.log("Ved",this.fieldArray.data);
                this.isLoadingResults=false;
                this.RateListToSave=[];
                } ,     
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
      });
    }
  }

  // last item rate popup
  ItemOpen(rowDetail) {
    
      const dialogRef = this.dialog.open(ChildItemsPopupComponent, {
        width:"1000px",
        height:"550px",
        data  : {
          unitid: rowDetail.BRANCHID,
          itemid : rowDetail.ITEMID,
          itemname:rowDetail.ITEMNAME,
          action:'rate'
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
      });
    
  }


  KnockedOffRate()
  {
    let rateList : Array<any>=[];
    // let confirm:any;
    // confirm="K";
    this.isLoadingResults=true;
    for(let data of this.RateListToSave)
    {
      let rate:any={};
      rate.ARID=data.ARID;
      rate.ITEMID=data.ITEMID;
      rate.RATE=data.RATE;
      rate.DISCRATE=data.DISCRATE;
      rate.NETRATE=data.NETRATE;
      rateList.push(rate);
    }
    console.log("mydata",rateList);
  //  this.isLoadingResults=true;
    this.service.ConfirmationRateApproval(this.ServerIP,this.FYUSER, this.boid, rateList, "K").subscribe((res: any[])=> {
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
      console.log("Ved",this.fieldArray.data);
      this.isLoadingResults=false;
      this.RateListToSave=[];
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
