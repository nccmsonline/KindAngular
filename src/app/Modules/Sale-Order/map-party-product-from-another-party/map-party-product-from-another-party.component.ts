import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { Global } from 'src/app/Global';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-map-party-product-from-another-party',
  templateUrl: './map-party-product-from-another-party.component.html',
  styleUrls: ['./map-party-product-from-another-party.component.css']
})
export class MapPartyProductFromAnotherPartyComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  datePipe = new DatePipe("en-US");
  original_url = environment.baseUrl;
  customerFromList:Array<any>=[];
  customerToList:Array<any>=[];
  itemList:Array<any>=[];
  CUSTOMERID=0;
  ToCustomerId=0;
  allData:any={};isLoadingResults=false;
  fieldArray = new MatTableDataSource<any>();
  isShown=false;
  displayedColumns: string[] = ['chk', 'sr' ,'itemCode', 'frame','rate'];
 
  constructor( public dialog: MatDialog, private excelService: ExcelService, private http: HttpClient,private AppUser:Global) {
      
      
   }
  ngOnInit() {
    this.fieldArray.sort = this.sort;
    this.fieldArray.paginator=this.paginator;
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/Master/getAccountList?flag=C&search=&token="+this.AppUser.Token).subscribe((res)=>{
      console.log("ravi", res);
      this.allData=res;
      this.customerFromList=this.allData.Table;
      this.customerToList=this.allData.Table;
      this.isLoadingResults=false;
      });
  }
  
  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  ClearSearch()
  {
    this.isShown=false;
    this.CUSTOMERID=0;
    this.ToCustomerId=0;
    this.fieldArray.data=null;
  }
  ShowProductMapping(){
    console.log("CUSTOMERID", this.CUSTOMERID);
    console.log("ToCustomerId", this.ToCustomerId);

    this.isLoadingResults=true;
    this.http.get(this.original_url+"/SOP/SaleOrder/getPartyProductMapping?fromPartyId="+this.CUSTOMERID+"&toPartyId="+this.ToCustomerId+"&token="+this.AppUser.Token).subscribe((res)=>{
      console.log("ravi", res);
      this.allData=res;
      this.isShown=true;
      this.fieldArray.data=this.allData.Table;
      this.isLoadingResults=false;
      });
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
          if(this.CUSTOMERID==undefined||this.CUSTOMERID==0)
          {
            flag=false; msg=msg+"<li> From Party not seletect.</li>"
          }
          if(this.ToCustomerId==undefined||this.ToCustomerId==0)
          {
            flag=false; msg=msg+"<li> To Party not seletect.</li>"
          }

        this.fieldArray.data.forEach((el)=>{
          if(el.CHK==true)
          {
              let pdata:any={};
              pdata.itemId=el.ITEMID;
              pdata.customerFrom=el.CUSTOMERFRAMENO;
              pdata.rate=el.RATE;
              if(el.CUSTOMERFRAMENO ==null)
              {
                pdata.customerFrom='-';
              }
              this.itemList.push(pdata);
           }
        });
      }
      catch(error)
      {
      flag=false;
      msg=msg+"* Some Error occured<br/>"
      }

      if(flag==false) 
      {
        this.isLoadingResults=false;
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
    this.isLoadingResults=true;
    if(!this.validatedata())
    {
      this.isLoadingResults=false;
      return;
    }
    let returnval:any;
    const  params = new  HttpParams()
    .set('token', this.AppUser.Token)
    .set('list', JSON.stringify(this.itemList))
    .set('toPrtyId', this.ToCustomerId.toString());
    
    
  this.http.post(this.original_url+"/SOP/SaleOrder/SavePartyProductMapping", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    returnval=res;
    console.log("res", res);
    if (parseInt(returnval)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:'Data Saved'
              }
            });
            this.ClearSearch();
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
  exportToExcelDetail() {

    var data:Array<any>=[];
      // data.push(this.Header);
      var PName=this.customerFromList.find(x=>x.CUSTOMERID==this.CUSTOMERID).NAME;
      data.push({
        'Product Id':PName ,
       
      });
       this.fieldArray.data.forEach(el => {
       

         data.push({
           'Product Id': el.ITEMID,
           'Product Code': el.ITEMCODE,
           'Rate':el.RATE,
           'Product Weight':el.PRODUCTWEIGHT,
         });
           });
          this.excelService.exportAsExcelFile(data, 'PartyProduct');
         // });
         }
}

