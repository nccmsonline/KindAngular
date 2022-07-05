import { Purchase } from './../../IndentAndPO/purchase-order/purchase.modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';

@Component({
  selector: 'app-update-critical-items',
  templateUrl: './update-critical-items.component.html',
  styleUrls: ['./update-critical-items.component.css']
})
export class UpdateCriticalItemsComponent implements OnInit {

  original_url = environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;isLoadingResults=false;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any;itemDisplay:any={};
  displayedColumns: string[] = ['itemcode', 'itemname', 'action','type','emailto','enduser'];
  fieldArray = new MatTableDataSource<any>();
  userList:Array<any>=[];
  itemList:Array<any>=[];
  userid:any;
  token:any; 
  p: number = 1;
  itemPerPage = '10';newData:any={};
  tyList:Array<any>=[];
  constructor(public dialog: MatDialog, private http: HttpClient
  ) {
   
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    http.get(this.original_url+"/user/getUserList").subscribe((res)=>{
      this.itemDisplay=res;
      this.userList =this.itemDisplay.Table;
    });
    this.tyList.push({id:'W',desc:'Weekly'});
    this.tyList.push({id:'O',desc:'Bimonthly'});
    this.tyList.push({id:'M',desc:'Monthly'});
  }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
  }
  onChange(event, data)
  {
    console.log("event",event);
    console.log("data",data);
    if(event.checked == true)
    {
      data.ISCRITICALITEMS="Y";
    }
    else
    {
      data.ISCRITICALITEMS="N";
    }
   
  }
  applyFilter(filterValue: string) {
   this.fieldArray = new MatTableDataSource<any>();
   let search = filterValue.trim().toUpperCase();
   if(search.length>1)
   {
    this.isLoadingResults=true;
    this.getListOfItems(search).subscribe((res: any[])=> {
      this.itemDisplay=res;
     this.fieldArray.data =this.itemDisplay.Table;
     this.fieldArray.data.forEach((el)=>{
        if(el.ISCRITICALITEMS=="Y")
        {
          el.CHK=true;
        }
        else
        {
          el.CHK=false;
        }
     });
    // this.itemList =this.itemDisplay.Table;
      console.log("ravi",this.fieldArray.data);
      this.isLoadingResults=false;
    });
   }
  }
  validatedata()
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    this.itemList=[];
    
      msg="<h5>Before add please rectify following mistakes:-</h5>";
      try
      {
        this.fieldArray.data.forEach((el)=>{
          if(el.ISCRITICALITEMS=='Y' &&(el.USERID==undefined||el.USERID==0||el.USERID===null))
          {
            flag=false; msg=msg+"<li> User not seletect for item code : "+ el.ITEMCODE+ "</li>"
          }
          if(el.ISCRITICALITEMS=='Y' &&(el.CALCULATEDBY==undefined||el.CALCULATEDBY===null))
          {
            flag=false; msg=msg+"<li> Calculated by not seletect for item code : "+ el.ITEMCODE+ "</li>"
          }
          // if(el.ISCRITICALITEMS=='Y' &&(el.ENDUSERID==undefined||el.ENDUSERID==0||el.ENDUSERID===null))
          // {
          //   flag=false; msg=msg+"<li> End User not seletect for item code : "+ el.ITEMCODE+ "</li>"
          // }
          
          let pdata:any={};
          pdata.ITEMID=el.ITEMID;
          pdata.ISCRITICALITEMS=el.ISCRITICALITEMS;
          debugger;
          if( el.ENDUSERID!==undefined && el.ENDUSERID!==0 && el.ENDUSERID!==null)
          { pdata.ENDUSERID=el.ENDUSERID;}
          else
          {pdata.ENDUSERID=0;}
          pdata.calculatedBy=el.CALCULATEDBY;
        
          if(el.USERID>0)
          {
            pdata.USERID=el.USERID;
          }
          else
          {
            pdata.USERID=0;
          }
          this.itemList.push(pdata);
        });
      }
      catch(error)
      {
      flag=false;
      msg=msg+"* Some Error occured<br/>"
      }

      if(flag==false) 
      {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
      }
      return flag;
  }
  updatedata()
  {
    if(!this.validatedata())
    {
      return;
    }
    let returnval:any;
    const  params = new  HttpParams()
    .set('token', this.token)
    .set('list', JSON.stringify(this.itemList))
    
    
  this.http.post(this.original_url+"/Master/UpdateCriticalItems", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    returnval=res;
    if (parseInt(returnval)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:'Data Saved'
              }
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
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'Somthing went wrong'
      }
    });
    this.isLoadingResults=false;
  });
  }
  getListOfItems(search)
  {
    return this.http.get(this.original_url+"/Master/getItemListForCeritical?token="+this.token+"&search="+search).pipe(map((res : any[])=>{
      console.log("res",res);
      return res;
      
    }));
  }
}
