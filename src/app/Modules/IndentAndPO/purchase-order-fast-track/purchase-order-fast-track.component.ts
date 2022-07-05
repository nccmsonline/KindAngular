import { item } from './../../Accounts/dashboard/dashboard.component';
import { Component, OnInit, ViewChild, Inject, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, formatDate } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ValidationComponent } from './../../../validation/validation.component';
import { SuccessDialogComponent } from '../../../Dialog/success-dialog/success-dialog.component';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';
@Component({
  selector: 'app-purchase-order-fast-track',
  templateUrl: './purchase-order-fast-track.component.html',
  styleUrls: ['./purchase-order-fast-track.component.css']
})
export class PurchaseOrderFastTrackComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;fendDate:any;
 
  newData:any={};isLoadingResults:any;
  userid:any;token:any;  original_url = environment.baseUrl;
  fstartDate:any;CompanyData:any={};allData:any={};
  WorkingDate:any;datePipe = new DatePipe("en-US");
  indentArrayList:Array<any>=[];supplierArrayList:Array<any>=[];edititemID:any;
  venderWiseArrayList:Array<any>=[];venderList:Array<any>=[];gstList:Array<any>=[];
  termsAndConditions:any={};
  purCategoryList:Array<any>=[];flag :any;
  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,  private http: HttpClient, private router: Router,private upload:FileDownloadUploadService) 
  {
    let currentBranch = sessionStorage.getItem("currentBranch");
    this.CompanyData = JSON.parse(currentBranch);
    this.fstartDate=   this.CompanyData['WORKINGDATE'] ;
    var currentDate: Date = new Date( this.fstartDate);
    var y=currentDate.getFullYear(),m=currentDate.getMonth();
    this.fstartDate=new Date(y,m,1);
    this.fendDate= new Date ( this.CompanyData['WORKINGDATE']) ;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
        
        this.refreshList();
      }
    });
   }

  ngOnInit() {
   
   
  }
  applyFilter(filterValue: string) {
    
  }

  refreshList()
  {
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getIndentListForFastTracPO?token="+this.token+"&flag="+this.flag).subscribe((res)=>{
      this.allData=res;
      this.indentArrayList=this.allData.Table;
      let i=0;
      this.indentArrayList.forEach(el=>{
        el.CHK=false;
        el.id=i++;
        el.ARID1=el.ARID;
        el.ARDNO1=el.ARDNO;
        el.supplierArrayList=[];
        el.QUANTITY1=el.QUANTITY;
        el.QUANTITY2=0;
        el.QUANTITY3=0;
      });
      this.gstList=this.allData.Table1;
      this.purCategoryList=this.allData.Table3;
      this.allData= this.allData.Table2;
       this.termsAndConditions= this.allData[0];
       this.allData=res;
       this.allData= this.allData.Table4;
       this.newData= this.allData[0];


      this.isLoadingResults=false;
     });   
  }
  onChangeofParty1(data, row)
  {
        if(data.CUSTOMERID==row.PARTYID2 ||data.CUSTOMERID==row.PARTYID3)
        {
          const dialogRef = this.dialog.open(ValidationComponent, {
            data: {
              msg: 'You can not select same party multiple time.',
              action: ''
            }
          });
          row.ARID1=0;
          row.PARTYID=0
          return;
        }
        row.PARTYID=data.CUSTOMERID;
        row.NAME=data.NAME;
        row.RATE=data.RATE;
        row.DISCRATE=data.DISCRATE;
        row.ARDNO1=data.ARDNO;
        row.WITHINSTATE=data.WITHINSTATE;
  }
  onChangeofParty2(data, row)
  {
      console.log("Data ", data);
        if(data.CUSTOMERID==row.PARTYID ||data.CUSTOMERID==row.PARTYID3)
        {
          const dialogRef = this.dialog.open(ValidationComponent, {
            data: {
              msg: 'You can not select same party multiple time.',
              action: ''
            }
          });
          row.ARID2=0;
          row.PARTYID2=0
          return;
        }
        row.PARTYID2=data.CUSTOMERID;
        row.NAME2=data.NAME;
        row.RATE2=data.RATE;
        row.DISCRATE2=data.DISCRATE;
        row.ARDNO2=data.ARDNO;
        row.WITHINSTATE2=data.WITHINSTATE;
  }
  onChangeofParty3(data, row)
  {
        if(data.CUSTOMERID==row.PARTYID2 ||data.CUSTOMERID==row.PARTYID)
        {
          const dialogRef = this.dialog.open(ValidationComponent, {
            data: {
              msg: 'You can not select same party multiple time.',
              action: ''
            }
          });
          row.ARID3=0;
          row.PARTYID3=0
          return;
        }
        row.PARTYID3=data.CUSTOMERID;
        row.NAME3=data.NAME;
        row.RATE3=data.RATE;
        row.DISCRATE3=data.DISCRATE;
        row.ARDNO3=data.ARDNO;
        row.WITHINSTATE3=data.WITHINSTATE;
  }
  onChnageOfQty1(row)
  {    
      if(row.QUANTITY1==''||row.QUANTITY1==undefined||row.QUANTITY1==null)
      {
        row.QUANTITY1=0;
      }
      row.QUANTITY2=parseFloat(row.QUANTITY)-parseFloat(row.QUANTITY1);
      if (parseFloat(row.QUANTITY1)<0)
      {
        row.QUANTITY1=0;
      }

      if (parseFloat(row.QUANTITY2)<0)
      {
        row.QUANTITY2=0;
      }
      if(this.checkQtyValidate(row))
      {
        row.QUANTITY1=0;
      }
  }
  onChnageOfQty2(row)
  {
      if(row.QUANTITY2==''||row.QUANTITY2==undefined||row.QUANTITY2==null)
      {
        row.QUANTITY2=0;
      }
      row.QUANTITY3=parseFloat(row.QUANTITY)-parseFloat(row.QUANTITY1)-parseFloat(row.QUANTITY2);
      if (parseFloat(row.QUANTITY3)<0)
      {
        row.QUANTITY3=0;
      }
     
      if(this.checkQtyValidate(row))
      {
        row.QUANTITY2=0;
      }
  }
  onChnageOfQty3(row)
  {
      if(row.QUANTITY3==''||row.QUANTITY3==undefined||row.QUANTITY3==null)
      {
        row.QUANTITY3=0;
      }
      if (parseFloat(row.QUANTITY3)<0)
      {
        row.QUANTITY3=0;
      }
      if(this.checkQtyValidate(row))
      {
        row.QUANTITY1=0;
      }
  }
  checkQtyValidate(row)
  {
    let qty=parseFloat(row.QUANTITY3)+parseFloat(row.QUANTITY1)+parseFloat(row.QUANTITY2);
    if(qty>row.QUANTITY)
    {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: 'Qty Should not be more than Pending.',
          action: ''
        }
      });
      return true;
    }
    else
    {
      return false;
    }
    
  }
  onGSTChange(item, row)
  {
      row.GSTID=item.GSTID;
      row.HSNCODE=item.HSNCODE;
      row.SGST=item.SGST;
      row.CGST=item.CGST;
      row.IGST=item.IGST;
  }
  OnIndentSelect(event,row)
  {
    if(event.checked)
    {
      console.log("Indent ", row);
      row.edititemID=row.id;
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getItemApprovedRateList?token="+this.token+"&itemid="+row.ITEMID).subscribe((res)=>{
       this.allData=res;
       console.log("Party Detail ", res);
       this.supplierArrayList=this.allData.Table;
       row.supplierArrayList=this.allData.Table;
       this.isLoadingResults=false;
      });  
    }
    else
    {
      this.edititemID={};
    }
  }

  PartyWiseAllocation()
  {
    this.venderWiseArrayList=[];
    this.venderList=[];
        this.indentArrayList.forEach(data=>{
          if(data.CHK)
          {
            if( data.PARTYID>0 && parseFloat( data.QUANTITY1)>0)
            {
                let tmp:any={};
                tmp.IndentId=data.INDENTID;
                tmp.ItemId=data.ITEMID;
                tmp.BrandId=data.BRANDID;
                tmp.VendorId=data.PARTYID;
                tmp.Rate=data.RATE;
                tmp.Qty=data.QUANTITY1;
                tmp.ARId=data.ARID1;
                tmp.ARRef=data.ARDNO1;
                tmp.ExpectedDate=formatDate(data.EXPECTEDDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 
                tmp.Remarks=data.REMARKS;
                // tmp.Disc=data.DISCRATE;
                if(data.DISCRATE>0)
                {tmp.Disc=data.DISCRATE;}
                else
                {tmp.Disc=0;}
                tmp.GSTID=data.GSTID;
                tmp.CGST=0;
                tmp.SGST=0;
                tmp.IGST=0;
                if(data.WITHINSTATE=='Y')
                {
                  tmp.CGST=data.CGST;
                  tmp.SGST=data.SGST;
                }
                else
                {
                  tmp.IGST=data.IGST;
                }
                tmp.Description=data.DESCRIPTION;
                this.venderWiseArrayList.push(tmp);
                this.venderList.push({partyid:data.PARTYID,party:data.NAME, IsJobWork:this.flag})
            }
            if(data.PARTYID2>0 && parseFloat(data.QUANTITY2)>0)
            {
                let tmp:any={};
                tmp.IndentId=data.INDENTID;
                tmp.ItemId=data.ITEMID;
                tmp.BrandId=data.BRANDID;
                tmp.VendorId=data.PARTYID2;
                tmp.Rate=data.RATE2;
                tmp.Qty=data.QUANTITY2;
                tmp.ARId=data.ARID2;
                tmp.ARRef=data.ARDNO2;
                tmp.ExpectedDate=formatDate(data.EXPECTEDDATE2, 'dd-MMM-yyyy', 'en-US', '+0530'); 
                tmp.Remarks=data.REMARKS;
                // tmp.Disc=data.DISCRATE2;
                if(data.DISCRATE2>0)
                {tmp.Disc=data.DISCRATE2;}
                else
                {tmp.Disc=0;}
                tmp.GSTID=data.GSTID;
                tmp.CGST=0;
                tmp.SGST=0;
                tmp.IGST=0;
                if(data.WITHINSTATE2=='Y')
                {
                  tmp.CGST=data.CGST;
                  tmp.SGST=data.SGST;
                }
                else
                {
                  tmp.IGST=data.IGST;
                }
                tmp.Description=data.DESCRIPTION;
                this.venderWiseArrayList.push(tmp);
                this.venderList.push({partyid:data.PARTYID2,party:data.NAME2, IsJobWork:this.flag})
            }
            if(data.PARTYID3>0 && parseFloat(data.QUANTITY3)>0)
            {
                let tmp:any={};
                tmp.IndentId=data.INDENTID;
                tmp.ItemId=data.ITEMID;
                tmp.BrandId=data.BRANDID;
                tmp.VendorId=data.PARTYID3;
                tmp.Rate=data.RATE3;
                tmp.Qty=data.QUANTITY3;
                tmp.ARId=data.ARID3;
                tmp.ARRef=data.ARDNO3;
                tmp.ExpectedDate=formatDate(data.EXPECTEDDATE3, 'dd-MMM-yyyy', 'en-US', '+0530'); 
                tmp.Remarks=data.REMARKS;
                // tmp.Disc=data.DISCRATE3;
                if(data.DISCRATE3>0)
                {tmp.Disc=data.DISCRATE3;}
                else
                {tmp.Disc=0;}
                tmp.GSTID=data.GSTID;
                tmp.CGST=0;
                tmp.SGST=0;
                tmp.IGST=0;
                if(data.WITHINSTATE2=='Y')
                {
                  tmp.CGST=data.CGST;
                  tmp.SGST=data.SGST;
                }
                else
                {
                  tmp.IGST=data.IGST;
                }
                tmp.Description=data.DESCRIPTION;
                this.venderWiseArrayList.push(tmp);
                this.venderList.push({partyid:data.PARTYID2,party:data.NAME2, IsJobWork:this.flag})
            }
          }
      }) ;
      this.venderList = this.venderList.filter(
        (thing, i, arr) => arr.findIndex(t => t.partyid === thing.partyid) === i
      );
  }
  validateDetail()
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    var currDate=new Date();
 

    msg="<h5>Before add please rectify following mistakes:-</h5>";
       try
       {
            this.indentArrayList.forEach(data=>{
                if(data.CHK)
                {
                  if(data.GSTID==null||data.GSTID==undefined)
                  {
                    flag=false; msg=msg+"<li> GST not seletect for item code : "+ data.ITEMCODE+ "</li>"
                  }

                  if(data.PARTYID==''||data.PARTYID==undefined||data.PARTYID==0)
                  {
                    flag=false; msg=msg+"<li> Party-1 not seletect for item code : "+ data.ITEMCODE+ "</li>"
                  }

                  var selectedDate=new Date(data.EXPECTEDDATE);
                  selectedDate.setHours(selectedDate.getHours() + 23);
                  if( selectedDate<currDate)
                  {
                    flag=false;
                    msg=msg+"<li> Expected date for party-1 should not before current date."+'</li>';
                  }
                  if(data.PARTYID2!=''&&data.PARTYID2!=undefined&&data.PARTYID2!=0)
                  {
                    if(data.EXPECTEDDATE2==null || data.EXPECTEDDATE2==undefined||data.EXPECTEDDATE2=='')
                    {
                      flag=false;
                      msg=msg+"<li> Expected date for party-2 not entred."+'</li>';
                    }
                    else
                    {
                      var selectedDate1=new Date(data.EXPECTEDDATE2);
                      selectedDate1.setHours(selectedDate1.getHours() + 23);
                      if( selectedDate1<currDate)
                      {
                        flag=false;
                        msg=msg+"<li> Expected date for party-2 should not before current date."+'</li>';
                      }
                    }
                   
                  }
                  if(data.PARTYID3!=''&&data.PARTYID3!=undefined&&data.PARTYID3!=0)
                  {
                    if(data.EXPECTEDDATE3==null || data.EXPECTEDDATE3==undefined||data.EXPECTEDDATE3=='')
                    {
                      flag=false;
                      msg=msg+"<li> Expected date for party-3 not entred."+'</li>';
                    }
                    else
                    {
                        var selectedDate3=new Date(data.EXPECTEDDATE3);
                        selectedDate3.setHours(selectedDate3.getHours() + 23);
                        if( selectedDate3<currDate)
                        {
                          flag=false;
                          msg=msg+"<li> Expected date for party-3 should not before current date."+'</li>';
                        }
                    }
                  }
                }
                let qty=parseFloat(data.QUANTITY3)+parseFloat(data.QUANTITY1)+parseFloat(data.QUANTITY2);
                if(qty>data.QUANTITY)
                {
                  flag=false;
                  msg=msg+"<li> Order qty should not be more than pending qty."+'</li>';
                }
            }) ;
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



  printPO()
  {
    let data:any={};
    this.isLoadingResults=true;
    this.upload.downloadPDF(this.original_url+ '/admin/InventoryPDF/PrintPurchaseOrder?token='+this.token+"&orderno="+this.newData.LASTPO).subscribe(res => {
      console.log(res);
       var newBlob = new Blob([res], { type: "application/pdf" });
       console.log("ravi",res);
       var newurl = window.URL.createObjectURL(newBlob);
       window.open(newurl);
       this.isLoadingResults=false;
    }, error => {
      this.isLoadingResults=false
      console.log(error);
    });

    //   this.http.get(this.original_url+"/PurachaseAndStore/Purchase/printPurchaseOrder?orderid=0&orderno="+this.newData.LASTPO+"&token="+this.token).subscribe((res)=>{
    //   this.allData=res;
    //   this.allData=this.allData.Table;
    //   data.header=this.allData[0];
    //   this.allData=res;
    //   data.detail=this.allData.Table1;
    //   if(this.flag=='N')
    //   {data.title="P u r c h a s e  O r d e r";}
    //   else
    //   {data.title="P u r c h a s e  O r d e r : J o b W o r k";}
    //   data.backto='/purchase-order-fasttrack/'+this.flag;
    //   sessionStorage.setItem('order', JSON.stringify(data));
    //   this.router.navigate(['/purchase-print']);
    //   this.isLoadingResults=false;
    //  },
    //  error=>{
    //    this.isLoadingResults=false;
    //  });  
    }
    GeneratePO()
    {
      this.isLoadingResults=true;
      if(!this.validateDetail())
      {
        this.isLoadingResults=false;
        return;
       
      }
      let newVenderList:Array<any>=[];
      this.PartyWiseAllocation();
      console.log("Data List",this.venderWiseArrayList);
      console.log("vender List",this.venderList);
      this.venderList.forEach((el)=>{
          let podata:any={};
          podata={...el,...this.termsAndConditions}; // Marge two objects

         newVenderList.push(podata);
      });
      
      this.SavePO(newVenderList);
    }

    async SavePO(vend) {
      let newVenderList:Array<any>=[];
      for (const action of vend) {
       // console.log("my data1",action);
          const dialogRef = this.dialog.open(poAdditionalInfo, {
            data: {pur:action,purCat:this.purCategoryList },
          });
          let podata:any={};
          dialogRef.afterClosed().subscribe(result => {
              podata=result;
             
              newVenderList.push(podata);
          });
          await dialogRef.afterClosed().toPromise();
          delete podata.CATEGORYDESC;
          delete podata.party;
        }
        console.log("New vender",newVenderList);


        let torderno:any;
        const  params = new  HttpParams()
        .set('token', this.token)
        .set('header', JSON.stringify(newVenderList))
        .set('detail', JSON.stringify(this.venderWiseArrayList));
        
      this.http.post(this.original_url+"/PurachaseAndStore/Purchase/SavePurchaseOrderFastTrack", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        torderno=res;
        if (parseInt(torderno)>0)
        {
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'sucess',
                    displayMsg:'Data Saved'
                  }
                });
                this.refreshList();
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
}



@Component({
  selector: 'poAdditionalInfo',
  templateUrl: './poAdditionalInfo.html',
  styleUrls: ['./purchase-order-fast-track.component.css']
})
export class poAdditionalInfo implements OnInit {
  filterPipe =new GrdFilterPipe;
  newData:any={};backto:any;
  DetailData:Array<any>=[];
  purCategoryList:Array<any>=[]; filteredpurCategoryList:Array<any>=[];
  title:any;telephone:any;GSTIn:any;fax:any; email:any;pan:any;
  repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;showDropDown:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<poAdditionalInfo> ) 
{
    this.newData=data.pur;  
    this.purCategoryList=data.purCat; 
    console.log("Module",this.newData);
}

ngOnInit() {
 
}
AllClose()
{
  console.log("Close Data");
  this.dialog.close(this.newData);
}
// onCategory(event, data)
// {
//   data.PurchaseCatgCode=event.CATEGORYCODE;
// }
searchCostCenter(term, flag)
{
    if(flag=='A'&&this.showDropDown=='CATEGORY')
    {
      this.showDropDown='';
    }
    else if(term !== ''||flag=='A' )
    {
      this.showDropDown='CATEGORY';
      if(flag=='A')
      {
        this.filteredpurCategoryList=this.purCategoryList;  
      }
      else
      {
        this.filteredpurCategoryList=this.filterPipe.transform(this.purCategoryList,term, 'CATEGORYDESC');  
      }
      
    }
    else
    {
      this.filteredpurCategoryList = [];
      this.showDropDown='';
    }
}
onCategory(row, data)
{
    data.PurchaseCatgCode=row.CATEGORYCODE;
    data.PurchaseCategId=row.CATEGORYID;  
    data.CATEGORYDESC=row.CATEGORYDESC;
    this.showDropDown='';
}

}

export class GrdFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchOn: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    
    searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it[searchOn].toLowerCase().includes(searchText);
        });
   } 
}