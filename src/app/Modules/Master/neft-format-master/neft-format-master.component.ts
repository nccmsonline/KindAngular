import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-neft-format-master',
  templateUrl: './neft-format-master.component.html',
  styleUrls: ['./neft-format-master.component.css']
})
export class NeftFormatMasterComponent implements OnInit {
  original_url=environment.baseUrl;
  bankList:Array<any>=[]; userid:any;token:any; 
  newData:any={};boid : any;FYUSER:any;ServerIP:any;newItem:any={};NeftFormatList:any=[];lastChequeNo:any;isLoadingResults:any;
  pData:any={}; datePipe = new DatePipe("en-US");editItemID:any;itemDisplay:any;ColumnList:any=[];TotalAmt:any;
  constructor(private http: HttpClient,    public dialog: MatDialog
) {
    
 
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];

     


        let currentUser = sessionStorage.getItem("currentUser");
        currentUser = JSON.parse(currentUser);

        this.token = currentUser['TOKEN'];
        this.userid = currentUser['USERID'];

      ///////Please do not change theses namecolumns because these column have same reference in API
      this.ColumnList.push({ColumnName:'Sr'});
      this.ColumnList.push({ColumnName:'Name'});
      this.ColumnList.push({ColumnName:'Amount'});
      this.ColumnList.push({ColumnName:'AccountNo'});
      this.ColumnList.push({ColumnName:'IFSC'});
      this.ColumnList.push({ColumnName:'Other'});

      this.isLoadingResults=true;
      this.http.get(this.original_url+"/Masters/Accounts/showBankName?token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.bankList= this.itemDisplay;
      console.log("res",res);
      this.isLoadingResults=false;
      });
    }
    showNeftFormat(id)
    {
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/Masters/Accounts/showNEFTFormat?bankname="+id+"&userid="+this.userid+"&token="+this.token).subscribe((res)=>{
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.NeftFormatList= this.itemDisplay;
       
        this.isLoadingResults=false;
        });
    }
    ngOnInit() {
      
     }
  onNoClick(): void {
    var flag:boolean, msgBox:string;
    flag=true;
    var listToSave:any=[];
    if(this.validate())
    {
      this.isLoadingResults=true;
      for(var el of  this.NeftFormatList)
      {
            var item:any={};
            item.BANKNAME=this.newData.BANKNAME;
            item.VALUEFROM=el.VALUEFROM;
            item.TITLE=el.TITLE;
            item.FIXEDVALUE=el.FIXEDVALUE;
            listToSave.push(item);
      }
      
      const params = new  HttpParams()
    
    .set('neftfieldList', JSON.stringify(listToSave));
    this.http.post(this.original_url+"/Masters/Accounts/SaveNEFTFormat", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      if(res!="Ravinder")
      {
          this.isLoadingResults=false;
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'sucess'
            }
          });
          this.itemDisplay=res;
          this.itemDisplay=this.itemDisplay.Table;
          this.NeftFormatList = this.itemDisplay;
            console.log("res",res);
            var i=0;
            this.NeftFormatList.data.forEach((el)=>{
            el.ID=i;
            i++;
          }); 
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
  validate()
  {
    var flag:boolean, msgBox:string;
    flag=true;
    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    var total=0;
    for(var item of this.NeftFormatList)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    if(this.newData.BALANCEAMT<total)
    {
      flag=false;
      msgBox=msgBox+"<li>Cannot Scheduled more than balance Amount."+'</li>';
    }
    if(total==0)
    {
      flag=false;
      msgBox=msgBox+"<li>Nothing to save."+'</li>';
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
     return flag;
  }

  validateDetail(data)
  {
    var flag:boolean, msgBox:string;
    flag=true;
    console.log("this.newData.NEXTFOLLOWUPDATE",this.newItem.TRANSDATE);

    var currDate=new Date();
    var selectedDate=new Date(this.newItem.TRANSDATE);
    selectedDate.setHours(selectedDate.getHours() + 23);

    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';

 
    if(this.newItem.VALUEFROM==undefined || this.newItem.VALUEFROM=='' )
    {
      flag=false;
      msgBox=msgBox+"<li>Value from Column not selected."+'</li>';
    }
   
    if(this.newItem.TITLE=='' ||this.newItem.TITLE==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Title not entred."+'</li>';
    }

    if((this.newItem.FIXEDVALUE=='' ||this.newItem.FIXEDVALUE==undefined) && this.newItem.VALUEFROM=='Other')
    {
      flag=false;
      msgBox=msgBox+"<li>Static value not entred."+'</li>';
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
     return flag;
  }
  additem(){
     console.log("this.newItem", this.newItem);
    if(this.validateDetail(this.newItem))
    {
    this.NeftFormatList.push(this.newItem);    

    this.NeftFormatList.forEach((item,index) => {
      var num = 'id';
      var value = index+1;
      item[num] = value;
      
    });
    var total=0;
    for(var item of this.NeftFormatList)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    this.TotalAmt=total;
    console.log("this.items", this.TotalAmt);
    this.newItem = {};
    }
}

  removeItem(index){
    this.NeftFormatList.splice(index,1);
   
  }
  editItem(val){
   
    this.editItemID = val;
   
  }
  updateItem(val){
    this.editItemID = {};
    var total=0;
    for(var item of this.NeftFormatList)
    {
      total=total+parseFloat(item.TRANAMT);
    }
    this.TotalAmt=total;
  }

}