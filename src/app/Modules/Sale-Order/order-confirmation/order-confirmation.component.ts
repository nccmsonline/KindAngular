import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FormControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {


  original_url=environment.baseUrl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  userinfo : any; newData:any={};title:any;
  coid : any;datePipe = new DatePipe("en-US");
  boid : any;empid:any; isCEO:any;empWiseGatePass:Array<any>=[];
  userid:any;ListToSave : Array<any>=[]; datetype: Array<any>=[];token;any;flag:any;
  //rateAppDetail: RateApprovalModel[] = [];
  fieldArray = new MatTableDataSource<any>();
  displayedColumns: string[] = ['PASS','ORDERNO','ORDERDATE','ORDERTYPE', 'NAME','CUSTOMERPO'];
  data:any;FYUSER:any;ServerIP:any;TodayDay:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog,) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.empid = currentUser['EMPID'];
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.isCEO= currentUser['ISCEO'];
    this.empid= currentUser['EMPID'];
    
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
          if(this.flag=='C')
          {
            this.title="Order Confirmation By CEO";
          }
          else if(this.flag=='P')
          {
            this.title="Order Confirmation By Proction";
          }
          else if(this.flag=='M')
          {
            this.title="Order Confirmation By Marketing";
          }
          this.gatDataOrderList();
          // if(event.url == '/Gate-pass-approval/A')
          // {
          //   this.gatDataOrderList();
          // }
          // else if(event.url == '/Gate-pass-approval/G')
          // {
          //   this.gatDataOrderList();
          // }
        }
      });


   // this.isLoadingResults=false;
  }

  ngOnInit() {
    this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
  }
  onChange(event, data)
  {
    if(event.checked == true)
    {
     data.delete=false;
    }
   
  }
  onDelete(event, data)
  {
    if(event.checked == true)
    {
      data.checked=false;
    }
   
  }
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  WrongDetailDialog(pmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pmsg
      }
    });
  }
 

  saveData()
  {
    var savelist : Array<any>=[]; 
    var isError=false, mIds="0 ", isSelected=false;
    this.fieldArray.data.forEach((row)=>{
      let data:any={};
    
      if(row.checked==true)
      {
            isSelected=true;
            mIds=mIds+", "+row.ORDERREFID;
            if(this.flag=="P")
            {
              for(var el of  row.DETAIL)
              {
                  if(el.COMMITTEDDESPATCHDATE==='' || el.COMMITTEDDESPATCHDATE===null)
                  {
                      isError=true;
                  }
                  else 
                  {
                    savelist.push({COMMITTEDDESPATCHDATE: formatDate(el.COMMITTEDDESPATCHDATE, 'dd-MMM-yyyy', 'en-US', '+0530'),SRID:el.RSID, RATE:el.RATE, OrderQtyKgs:el.WEIGHT});
                  }
              }
            }
            else if(this.flag=="C")
            {
              for(var el of  row.DETAIL)
              {
                savelist.push({RATE:el.RATE, OrderQtyKgs:el.WEIGHT, SRID:el.RSID});
              }
            }
      }
    
     }); 
   if( isSelected==false)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else if( isError)
   {
     this.WrongDetailDialog('Committed Despatch Date not entred.');
   }
   else
   {
    this.isLoadingResults=true;
    this.TodayDay=this.datePipe.transform(this.TodayDay, 'dd-MMM-yyyy') ;
  
    const params = new  HttpParams()
   
    .set('flag', this.flag)
    .set('mode', "save")
    .set('token', this.token)
    .set('ids', mIds)
    .set('list', JSON.stringify(savelist));

    this.http.post(this.original_url+"/SOP/SaleOrder/CustomerOrderConfirmation", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      this.isLoadingResults=false;
      if (res=="Ravinder")
      {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Something went wrong, Login again or connect to System Admin'
          }
        });
      }
      else if (res=="-1")
      {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Something went wrong.'
          }
        });
      }
      else
      {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'sucess'
            }
          });
          this.data=res;
          this.itemDisplay=res;
          this.fieldArray.data = this.itemDisplay;
          this.fieldArray.data.forEach((el)=>
          {
            var pdate =new Date(el.ORDERDATE);
            el.ORDERDATE=pdate;
            let item:Array<any>=[];
            item=el.DETAIL;
            item.forEach(row => {
              if(row.COMMITTEDDESPATCHDATE!==null && row.COMMITTEDDESPATCHDATE!=='')
              {
                row.COMMITTEDDESPATCHDATE=new Date(row.COMMITTEDDESPATCHDATE);
              }  
            });
            
          });
         
          this.ListToSave=[];
          this.isLoadingResults=false;
      }
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
   
   console.log("this.other", this.ListToSave);
  }
  gatDataOrderList()
  {
    this.ListToSave=[];
    this.isLoadingResults=true;
    this.TodayDay=this.datePipe.transform(this.TodayDay, 'dd-MMM-yyyy') ;
    //this.flag
    const params = new  HttpParams()
   
    .set('flag', this.flag)
    .set('mode', "VIEW")
    .set('token', this.token)
   .set('list', JSON.stringify(this.ListToSave));
    this.http.post(this.original_url+"/SOP/SaleOrder/CustomerOrderConfirmation?" +params.toString(),{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
    .subscribe((res) => {
      
      console.log("Data", res);
     this.isLoadingResults=false;
      this.data=res;
      this.itemDisplay=res;
      if(res=="Ravinder")
      {
        this.fieldArray.data =[];
      }
      else
      {
        this.fieldArray.data = this.itemDisplay;
      }
      this.fieldArray.data.forEach((el)=>
      {
        var pdate =new Date(el.ORDERDATE);
        el.ORDERDATE=pdate;
        let item:Array<any>=[];
        item=el.DETAIL;
        item.forEach(row => {
          if(row.COMMITTEDDESPATCHDATE!==null && row.COMMITTEDDESPATCHDATE!=='')
          {
            row.COMMITTEDDESPATCHDATE=new Date(row.COMMITTEDDESPATCHDATE);
          }  
        });
        
      });

   //   this.itemDisplay=this.itemDisplay.Table;
      console.log("res",res);
      this.ListToSave=[];
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