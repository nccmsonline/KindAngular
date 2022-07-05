import { Account } from './../../../General/account-group-master/account.modal';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { ConfirmationDialogService } from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service';
import { ValidationComponent } from './../../../../validation/validation.component';
import { TimePickerCustomMessagesComponent } from '@progress/kendo-angular-dateinputs';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-add-new-mrir',
  templateUrl: './add-new-mrir.component.html',
  styleUrls: ['./add-new-mrir.component.css']
})
export class AddNewMRIRComponent implements OnInit {
  filterPipe =new GrdFilterPipe;
  newData:any={};isLoadingResults:any;WorkingDate:any;
  dropDownListFor="";
  userid:any;token:any; routeID:any;routeAction:any;mrirnoplaceholder="MRIR No.";
  items:Array<any>=[];original_url = environment.baseUrl;newitem:any={};edititemID:any={};
  allData:any={};categoryList:Array<any>=[];gateEntryList:Array<any>=[];imprestAcList:Array<any>=[];purchaseAcList:Array<any>=[];
  showCategory=false;showTogleCategory=false;showGateEntry=false;showTogleGateEntry=false;showImpresetAc=false;showTogleImpresetAc=false;
  showParty=false;showTogleParty=false;partyNameList:Array<any>=[];showPurchaseAc=false;showToglePurchaseAc=false;POList:Array<any>=[];filteredPOList:Array<any>=[];
  filteredcategoryList:Array<any>=[];filteredgateEntryList:Array<any>=[];filteredimprestAcList:Array<any>=[];filteredpurchaseAcList:Array<any>=[];
  showItemCode=false;showItemName=false; showTogleItemCode=false;showTogleItemName=false;showEditGSTHsn=false;WeighMaxWeight:any;
  gstHSNList:Array<any>=[];filteredgstHSNList:Array<any>=[];showGSTHsn=false;showTogleGSTHsn=false;showEditItemCode=false;showEditItemName=false;
  isLoadingItemName=false;isLoadingItemCode=false;miniInwardDate:any;uomList:Array<any>=[];
  constructor(public dialog: MatDialog,   private router: Router,  private activatedRoute: ActivatedRoute, private http: HttpClient) 
  {
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.newData.INDENTDATE= new Date(CompanyData['WORKINGDATE']);
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.miniInwardDate= new Date(CompanyData['WORKINGDATE']);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.newData.AGAINSTCASH=false;
   }
  ngOnInit() {
    this.uomList.push({id:'PCS'});
    this.uomList.push({id:'KGS'});
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getMRIRLoad?inwardid="+this.routeID+"&token="+this.token).subscribe((res)=>{
     this.allData=res;
     console.log("Mrir Load", res);
     this.categoryList=this.allData.Table;
     this.gateEntryList=this.allData.Table1;
     this.purchaseAcList=this.allData.Table2;
     this.imprestAcList=this.allData.Table3;
     this.gstHSNList=this.allData.Table6;
     if(this.routeAction!='new')
     {
      this.items=this.allData.Table5;
      let i=1;
      this.items.forEach(el=>{
        el.id=i++;
      });
      this.allData=this.allData.Table4;
      this.newData=this.allData[0];
      if(this.newData.AGAINSTCASH1=='Y')
      {this.newData.AGAINSTCASH=true;}
      else
      {this.newData.AGAINSTCASH=false;}
      if(this.newData.POREQUIRED=='Y')
      {this.getPOList();}
     
     }
     
     this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    });   
  }
  searchMRIRCategory(term, flag)
  {
    if(term !== '' || flag=='A')
    {
      this.showCategory=true;
      
      if(flag=='A')
      {
        this.filteredcategoryList=this.categoryList;  
        //this.showTogleCategory=!this.showTogleCategory;
        //this.showCategory=this.showTogleCategory;
        if(this.dropDownListFor=='MRIRCATEGORY')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='MRIRCATEGORY';
        }
      }
      else
      {
        this.dropDownListFor='MRIRCATEGORY';
        this.filteredcategoryList=this.filterPipe.transform(this.categoryList,term, 'GROUPNAME');  
      }
      
    }
    else
    {
      this.filteredcategoryList = [];
      this.showCategory = false;
      this.showTogleCategory=false;
      this.dropDownListFor='';
    }
  }
  refreshDates()
  {
    this.newData.BILLDATE='';
    this.newData.CHALLANDATE='';
    this.newData.GRDATE='';
  }
  onChangeOfCategory(row, data)
  {
    
    data.GROUPNAME=row.GROUPNAME;  
    data.MRIRCATGID=row.ITEMGROUPID;
    data.SHORTNAME=row.SHORTNAME;
    data.POREQUIRED=row.POREQUIRED;
    data.GATEINWARDNO='';
    data.NAME='';
    this.items=[];
    this.newitem={};
    this.showCategory = false;
    this.showTogleCategory=false;
    this.dropDownListFor='';
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getLastMRIRNo?catgid="+data.MRIRCATGID+"&token="+this.token).subscribe((res)=>{
    this.allData=res;
    this.allData=this.allData.Table;
    this.allData=this.allData[0];
    this.newData.INWARDNO=this.allData.INWARDNO;  
    this.newData.INWARDDATE=this.allData.INWARDDATE;
    this.miniInwardDate=this.allData.INWARDDATE;
    this.mrirnoplaceholder="Last MRIR No.";
    this.isLoadingResults=false;
    },
    Error=>{
      this.isLoadingResults=false;
    });   
  }
  searchGateEntry(term, flag)
  {
   
    if(term !== '' || flag=='A')
    {
      this.showGateEntry=true;
      if(flag=='A')
      {
        this.filteredgateEntryList=this.gateEntryList;  
        //this.showTogleGateEntry=!this.showTogleGateEntry;
        //this.showGateEntry=this.showTogleGateEntry;
        if(this.dropDownListFor=='GATEENRTY')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='GATEENRTY';
        }
      }
      else
      {
        this.dropDownListFor='GATEENRTY';
        this.filteredgateEntryList=this.filterPipe.transform(this.gateEntryList,term, 'GINNO');  
       
      }
    }
    else
    {
      this.filteredgateEntryList = [];
      this.showGateEntry = false;
      this.showTogleGateEntry=false;
      this.dropDownListFor='';
    }
    
  }
  onChangeGateEntry(row, data)
  {
    data.GATEINWARDNO=row.GINNO;  
    data.GINID=row.GINID;
    this.showGateEntry = false;
    this.showTogleGateEntry=false;
    this.isLoadingResults=true;
    this.dropDownListFor='';
    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getMRIRGateEntryDetail?ginid="+row.GINID+"&token="+this.token).subscribe((res)=>{
    this.allData=res;
    this.allData=this.allData.Table;
    this.allData=this.allData[0];
    this.newData.BILLNO=this.allData.BILLNO;  
    this.newData.BILLDATE=this.allData.BILLDT;
    this.newData.CHALLANNO=this.allData.CHALLANNO;  
    this.newData.CHALLANDATE=this.allData.CHALLANDT;
    this.newData.GRNO=this.allData.GRNO;  
    this.newData.GRDATE=this.allData.GRDATE;
    this.newData.NAME=this.allData.SNAME;
    this.newData.PARTYID=this.allData.PID;
    this.newData.STATEID=this.allData.STATEID;
    this.newData.WITHINSTATE=this.allData.WITHINSTATE;
    this.isLoadingResults=false;
    this.items=[];
    this.newitem={};
    if(this.newData.POREQUIRED=='Y')
    {this.getPOList();}

    },
    error=>{
      this.isLoadingResults=false;
    });   
  }
  searchParty(term, flag)
  {
    
    if(term !== '' )
    {
      let cusSup='S';
      this.showParty=true;
      if(this.newData.SHORTNAME=='CMR'||this.newData.SHORTNAME=='REJ')
      {cusSup='C'}
      if(flag=='A')
      {
        if(this.dropDownListFor=='PARTYNAME')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='PARTYNAME';
        }
      }
      else
      {
        this.dropDownListFor='PARTYNAME';
      }
      this.http.get(this.original_url+"/Master/getAccountList?flag="+cusSup+"&search="+term+"&token="+this.token).subscribe((res)=>{
        this.allData=res;
        this.partyNameList=this.allData.Table;
        this.isLoadingResults=false;
        },
        error=>{
          this.isLoadingResults=false;
        });   
      
    }
    else
    {
      this.newData.PARTYID=0;
      this.partyNameList = [];
      this.showParty = false;
      this.showTogleParty=false;
      this.dropDownListFor='';
    }
  }
  onChangeOfParty(row, data)
  {
    data.NAME=row.NAME;  
    data.PARTYID=row.CUSTOMERID;
    data.STATEID=row.STATEID;
    data.WITHINSTATE=row.WITHINSTATE;
    this.newitem={};
    this.showParty = false;
    this.showTogleParty=false;
    this.dropDownListFor='';
    if(this.newData.POREQUIRED=='Y')
    {this.getPOList();}
    

  }
  getPOList()
  {
    this.isLoadingResults=true;
    let isJob='N';
    if(this.newData.SHORTNAME=='RGP')
    {isJob='Y'}
    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getPartyPOList?partyid="+this.newData.PARTYID+"&stateid="+this.newData.STATEID+"&token="+this.token+"&isjobwork="+isJob).subscribe((res)=>{
    this.allData=res;
    this.POList=this.allData.Table;
    this.filteredPOList=this.allData.Table;
    this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    });   
  }

  searchCashAc(term, flag)
  {
    if(term !== ''||flag=='A' )
    {
      // this.showImpresetAc=true;
      if(flag=='A')
      {
        this.filteredimprestAcList=this.imprestAcList;  
        // this.showTogleImpresetAc=!this.showTogleImpresetAc;
        // this.showImpresetAc=this.showTogleImpresetAc;
        if(this.dropDownListFor=='CASHAC')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='CASHAC';
        }
      }
      else
      {
        this.dropDownListFor='CASHAC';
        this.filteredimprestAcList=this.filterPipe.transform(this.imprestAcList,term, 'ACCOUNTHEAD');  
      }
      
    }
    else
    {
      this.filteredimprestAcList = [];
      this.dropDownListFor='';
      // this.showImpresetAc = false;
      // this.showTogleImpresetAc=false;
    }
  }
  onChangeOfCashAc(row, data)
  {
    data.IMPRESTACID=row.ACCOUNTID;  
    data.CASHAC=row.ACCOUNTHEAD;
    this.dropDownListFor='';
    // this.showImpresetAc = false;
    // this.showTogleImpresetAc=false;
  }
  searchPurchaseAc(term, flag)
  {
    
    if(term !== ''||flag=='A' )
    {
      // this.showPurchaseAc=true;
      if(flag=='A')
      {
        this.filteredpurchaseAcList=this.purchaseAcList;  
        // this.showToglePurchaseAc=!this.showToglePurchaseAc;
        // this.showPurchaseAc=this.showToglePurchaseAc;
        if(this.dropDownListFor=='PURCHASEAC')
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor='PURCHASEAC';
        }
      }
      else
      {
        this.dropDownListFor='PURCHASEAC';
        this.filteredpurchaseAcList=this.filterPipe.transform(this.purchaseAcList,term, 'ACCOUNTHEAD');  
      }
    }
    else
    {
      this.filteredpurchaseAcList = [];
      this.dropDownListFor='';
      // this.showPurchaseAc = false;
      // this.showToglePurchaseAc=false;
    }
  }
  onChangeOfPurchaseAc(row, data)
  {
    data.PURCHASEACID=row.ACCOUNTID;  
    data.PURCHASEAC=row.ACCOUNTHEAD;
    this.dropDownListFor='';
    // this.showPurchaseAc = false;
    // this.showToglePurchaseAc=false;
  }

  searchItemCode(term,  flag, mode)
  {
    var DropFor="";
    if(mode=='A')
    {DropFor="ADDITEMCODE"}
    else
    {DropFor="EDITITEMCODE"}
    if((term !== ''||flag=='A') && this.newData.POREQUIRED=='Y')
    {
      // if(mode=='A')
      // {this.showItemCode=true;}
      // else
      // {this.showEditItemCode=true;}


      if(flag=='A')
      {
        this.filteredPOList=this.POList;  
        if(this.dropDownListFor==DropFor)
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor=DropFor;
        }
        // this.showTogleItemCode=!this.showTogleItemCode;
        
        // if(mode=='A')
        // {this.showItemCode=this.showTogleItemCode;}
        // else
        // {this.showEditItemCode=this.showTogleItemCode;}
      }
      else
      {
        this.dropDownListFor=DropFor;
        this.filteredPOList=this.filterPipe.transform(this.POList,term, 'ITEMCODE');  
      }
      
    }
    else if(term !== '' && this.newData.POREQUIRED=='N')
    {
      if(term.length>2 )
      {
        // if(mode=='A')
        // {this.showItemCode=true;}
        // else
        // {this.showEditItemCode=true;}
        
        this.dropDownListFor=DropFor;
        
         let pori='I';
        if(this.newData.SHORTNAME=='REJ')
        { pori='P';}
        this.isLoadingItemCode=true;
        this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+term.toUpperCase()+"&searchon=ITEMCODE&pori="+pori)
        .subscribe((response: any[]) => {
          console.log("response", response);
          this.allData = response;
          this.filteredPOList = this.allData.Table;
          this.isLoadingItemCode=false;
        });
      }
    }
    else
    {
      this.filteredPOList = [];
      this.dropDownListFor='';
      // this.showItemCode = false;
      // this.showTogleItemCode=false;
      // this.showEditItemCode = false;
    }
  }
  searchItemName(term,  flag, mode)
  {
    console.log("item name", term);
    console.log("flag", flag);
    console.log("mode", mode);
    console.log("PO Req", this.newData.POREQUIRED);
    var DropFor="";
    if(mode=='A')
    {DropFor="ADDITEMNAME"}
    else
    {DropFor="EDITITEMNAME"}

    if((term !== ''||flag=='A')  && this.newData.POREQUIRED=='Y' )
    {
      if(flag=='A')
      {
        this.filteredPOList=this.POList;  
        if(this.dropDownListFor==DropFor)
        {
          this.dropDownListFor='';
        }
        else
        {
          this.dropDownListFor=DropFor;
        }
      }
      else
      {
        this.dropDownListFor=DropFor;
        this.filteredPOList=this.filterPipe.transform(this.POList,term, 'ITEMNAME');  
      }
      
    }
    else if(term !== '' && this.newData.POREQUIRED=='N')
    {
      console.log("term name", term);
      if(term.length>2 )
      {
        this.dropDownListFor=DropFor;
        let pori='I';
        if(this.newData.SHORTNAME=='REJ')
        { pori='P';}
        this.isLoadingItemName=true;
        this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+term.toUpperCase()+"&searchon=ITEMNAME&pori="+pori)
        .subscribe((response: any[]) => {
          console.log("response", response);
          this.allData = response;
          this.filteredPOList = this.allData.Table;
          this.isLoadingItemName=false;
        });
      }
    }
    else
    {
      this.filteredPOList = [];
      this.dropDownListFor='';

    }
  }

  onChangeOfItemNameCode(row, data)
  {
    data.ITEMID=row.ITEMID;  
    data.ORDERID=row.ORDERID;
    data.PONO=row.ORDERNO;
    data.ORDERNO=row.ORDERNO;
    data.INDENTID=row.INDENTID;
    data.ITEMNAME=row.ITEMNAME;  
    data.ITEMCODE=row.ITEMCODE;
    data.QUANTITYBILLED=row.PENDINGQTY;
    data.QUANTITYRECEIVED=row.PENDINGQTY;
    data.PENDINGQTY=row.PENDINGQTY;
    data.RATE=row.ORDERRATE;
    data.ORDERRATE=row.ORDERRATE;
    data.UNIT=row.UNIT;
    data.IGST=row.IGST;
    data.SGST=row.SGST;
    data.CGST=row.CGST;
    data.GSTID=row.GSTID;
    data.HSNCODE=row.HSNCODE;
    data.DISCOUNTAMOUNT=0;
    data.ORDERDATE=row.ORDERDATE;
    if( data.RATE==undefined|| data.RATE=='')
    { data.RATE=0;data.ORDERRATE=0;}
    this.dropDownListFor='';
    
    // this.showItemCode = false;
    // this.showTogleItemCode=false;
    // this.showItemName = false;
    // this.showTogleItemName=false;
    // this.showEditItemCode = false;
    // this.showEditItemName = false;
    this.CalculateAmount(data);
  }
  CalculateAmount(data)
  {
    let amount:number;
    let goodsamt:number;
    try
    {
      console.log("entred");
      if(this.newData.SHORTNAME!='REJ')
      {goodsamt=parseFloat((data.QUANTITYBILLED*data.RATE).toFixed(2));}
      else if(this.newData.SHORTNAME=='REJ' && data.UOM=='KGS')
      {goodsamt=parseFloat((data.BILLEDWT*data.RATE).toFixed(2));}
      else
      {goodsamt=parseFloat((data.QUANTITYBILLED*data.RATE).toFixed(2));}

      if(data.DISCOUNTPERCENT>0)
      {
        data.DISCOUNTAMOUNT=parseFloat((goodsamt*data.DISCOUNTPERCENT/100).toFixed(2));
      }
      goodsamt=parseFloat((goodsamt-data.DISCOUNTAMOUNT).toFixed(2));
      data.IGSTAMT=parseFloat((goodsamt*data.IGST/100).toFixed(2));
      data.CGSTAMT=parseFloat((goodsamt*data.CGST/100).toFixed(2));
      data.SGSTAMT=parseFloat((goodsamt*data.SGST/100).toFixed(2));
      data.AMOUNT=parseFloat((goodsamt+data.IGSTAMT+data.CGSTAMT+data.SGSTAMT).toFixed(2));
    }
    catch(error)
    {

    }
    this.CalculateSummary();
  }
  CalculateSummary()
  {
     let totalamt=0, billamt=0;
     this.items.forEach((el)=>{
      totalamt=totalamt+parseFloat(el.AMOUNT.toFixed(2));
     });   

     try
     {
          if(this.newData.OTHERDISCOUNT!=0&&this.newData.OTHERDISCOUNT!=undefined&&this.newData.OTHERDISCOUNT!='')
          {
            totalamt=totalamt+parseFloat( this.newData.OTHERDISCOUNT);
          }
          if(this.newData.OTHERCHARGES!=0&&this.newData.OTHERCHARGES!=undefined&&this.newData.OTHERCHARGES!='')
          {
            totalamt=totalamt+parseFloat(this.newData.OTHERCHARGES);
          }

          this.newData.TOTALAMOUNT=totalamt;
          if(this.newData.BILLAMOUNT>0)
          {
            billamt= this.newData.BILLAMOUNT;
          }
          this.newData.ROUNDOFF=parseFloat((billamt-totalamt).toFixed(2));
    }
    catch(error)
    {

    }
  }
  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
       try
       {
            if(data.ITEMID==undefined||data.ITEMID==0||data.ITEMID=='' )
            {flag=false; msg=msg+"* Item not seletect<br/>"}
    
            if(data.QUANTITYBILLED==undefined||data.QUANTITYBILLED==0||data.QUANTITYBILLED=='' )
            {flag=false; msg=msg+"* Quantity not entred<br/>"}
            
            if(data.QUANTITYRECEIVED==undefined||data.QUANTITYRECEIVED==0||data.QUANTITYRECEIVED=='' )
            {flag=false; msg=msg+"* Quantity not entred<br/>"}

            if(data.QUANTITYBILLED>data.PENDINGQTY )
            {flag=false; msg=msg+"* You cant use more than pending Qty<br/>"}

            if((data.UOM==undefined||data.UOM==0||data.UOM=='' )&&this.newData.SHORTNAME=='REJ')
            {flag=false; msg=msg+"* Rate per not selected<br/>"}

            if((data.BILLEDWT==undefined||data.BILLEDWT==0||data.BILLEDWT=='' )&&this.newData.SHORTNAME=='REJ')
            {flag=false; msg=msg+"* Rejection Weight not entred<br/>"}


            if(data.GSTID==undefined||data.GSTID=='' )
            {flag=false; msg=msg+"* GST type not selected<br/>"}

            var qty = 
            this.items.find(x=>x.ITEMID==data.ITEMID&&x.ORDERID==data.ORDERID&&x.INDENTID==data.INDENTID&&x.id!=data.id);
            if(qty!=undefined)
            {
              flag=false; msg=msg+"* Duplicate item found<br/>";
            }
            qty =this.items.find(x=>x.IGST!=data.IGST&&x.id!=data.id);
            if(qty!=undefined)
            {
              flag=false; msg=msg+"* Different gst type found<br/>";
            }
            else
            {
              qty =this.items.find(x=>x.CGST!=data.CGST&&x.id!=data.id);
              if(qty!=undefined)
              {
                flag=false; msg=msg+"* Different gst type found<br/>";
              }
              else
              {
                qty =this.items.find(x=>x.SGST!=data.SGST&&x.id!=data.id);
                if(qty!=undefined)
                {
                  flag=false; msg=msg+"* Different gst type found<br/>";
                }
              }
            }
            
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

  additem() {


  if(this.validateDetail(this.newitem))
  {
    this.items.push(this.newitem);
    // this.newitemtype['id']=this.newitem.ITEMID;
    // this.removearray.push(this.newitemtype);
    this.items.forEach((item, index) => {
      var num = 'id';
      var value = index + 1;
      item[num] = value;
      var num1 = 'sr';
      var value1 = index+1;
      item[num1] = value1;
      
    });
    console.log("this.conatcts",this.items);
    this.newitem = {};
    this.CalculateSummary();
  }
}

removeitem(index) {
  this.items.splice(index, 1);
 
}
edititem(val) {
  this.edititemID = val;
}

updateitem(val) {
  if(this.validateDetail(val))
  {
    this.edititemID = {};
  }
}
searchHSN(term, flag, mode)
  {
    if(term !== '' || flag=='A')
    {
     // this.showGSTHsn=true;
     if(mode=='A')
     {this.showGSTHsn=true;}
     else
     {this.showEditGSTHsn=true;}
      if(flag=='A')
      {
        this.filteredgstHSNList=this.gstHSNList;  
        this.showTogleGSTHsn=!this.showTogleGSTHsn;
        //this.showGSTHsn=this.showTogleGSTHsn;
        if(mode=='A')
        {this.showGSTHsn=this.showTogleGSTHsn;}
        else
        {this.showEditGSTHsn=this.showTogleGSTHsn;}
      }
      else
      {
        this.filteredgstHSNList=this.filterPipe.transform(this.gstHSNList,term, 'HSNCODE');  
      }
      
    }
    else
    {
      this.filteredgstHSNList = [];
      this.showGSTHsn = false;
      this.showTogleGSTHsn=false;
      this.showEditGSTHsn=false;
    }
  }
  onChangeOfHSN(row, data)
  {
    data.GSTID=row.GSTID;  
    data.HSNCODE=row.HSNCODE;
    if(this.newData.WITHINSTATE=='Y')
    {
      data.IGST=0;
      data.CGST=row.CGST;
      data.SGST=row.SGST;
    }
    else
    {
      data.IGST=row.IGST;
      data.CGST=0;
      data.SGST=0;
    }
    this.showGSTHsn = false;
    this.showTogleGSTHsn=false;
    this.showEditGSTHsn=false;
    this.CalculateAmount(data);   
    
  }
  getWeighmentSlipWt(slipno)
  {
    
    if(parseFloat(slipno)>0)
    {
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getWeighmentSlipWt?slipno="+slipno+"&token="+this.token).subscribe((res)=>{
        this.allData=res;
        this.allData=this.allData.Table[0];
        this.WeighMaxWeight=this.allData.WEIGHT;
        this.isLoadingResults=false;
        },
        error=>{
          this.isLoadingResults=false;
        }); 
    }
    
  }
  saverecord(mode)
  {
    this.isLoadingResults=true;
    let header:Array<any>=[], detail:Array<any>=[];
        if(!this.validateData())
        {
          this.isLoadingResults=false;
          return;
        }
        
        let tmp:any={};
        tmp.PARTYID=this.newData.PARTYID;
        tmp.GRNo=this.newData.GRNO;
        if(this.newData.GRDATE!=undefined&&this.newData.GRDATE!='')
        {tmp.GRDate=formatDate(this.newData.GRDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); }
        tmp.ChallanNo=this.newData.CHALLANNO;
        if(this.newData.CHALLANDATE!=undefined&&this.newData.CHALLANDATE!='')
        {tmp.ChallanDate=formatDate(this.newData.CHALLANDATE, 'dd-MMM-yyyy', 'en-US', '+0530');}
        tmp.BillNo=this.newData.BILLNO;
        if(this.newData.BILLDATE!=undefined&&this.newData.BILLDATE!='')
        {tmp.BillDate=formatDate(this.newData.BILLDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); }
        tmp.PurchaseAcId=this.newData.PURCHASEACID
        tmp.BillAmount=this.newData.BILLAMOUNT;
        tmp.TotalAmount=this.newData.TOTALAMOUNT;
        tmp.Roundoff=this.newData.ROUNDOFF;
        tmp.BehalfofBillNo=this.newData.BEHALFOFBILLNO;
        if(this.newData.BEHALFOFBILLDATE!=undefined&&this.newData.BEHALFOFBILLDATE!='')
        {tmp.BehalfofBilldate=formatDate(this.newData.BEHALFOFBILLDATE, 'dd-MMM-yyyy', 'en-US', '+0530');}
        if(this.newData.AGAINSTCASH)
        {
          tmp.AgainstCash=='Y';  
        }
        else
        {
          tmp.AgainstCash='N'
        }
        tmp.BillPassAmount=0;
        tmp.ImprestAcId=this.newData.IMPRESTACID;
        tmp.OtherDiscount=this.newData.OTHERDISCOUNT;
        tmp.OtherCharges=this.newData.OTHERCHARGES;
        tmp.RGPREMARKS=this.newData.RGPREMARKS;
        tmp.PONOS=this.newData.PONOS;
        tmp.DiscAmt=this.newData.DiscAmt;
        tmp.WeightSlipNo=this.newData.SLIPNO;

        if(mode=='Insert')
        {
          tmp.MrirCatgId=this.newData.MRIRCATGID;
          tmp.GateInwardNo=this.newData.GATEINWARDNO;
          tmp.Status='E';
          tmp.RGPID=0;
          tmp.RGPNO=0;
          tmp.ISRGP='N';
          tmp.FormNo='';
          tmp.CompanyId=1;
          tmp.FreightAmount=0;
          tmp.BillDiscount=0;
          tmp.EduAmt=0;
          tmp.ExciseAmt=0;
          tmp.STaxAmt=0;
          tmp.ExciseId=0;
          tmp.SHEduAmt=0;
          tmp.AgstAnnex158='N';
          tmp.SurchargeAmount=0;
          tmp.TotalRate=0;
          tmp.LocalFreight=0;
          tmp.MaterialGrade='';
          tmp.IsSpecialPO='N';
          tmp.EduCessAmt_ST=0;
          tmp.SHCessAmt_ST=0;
          tmp.AdditionalDuty=0;
          tmp.InwardDate=formatDate(this.newData.INWARDDATE, 'dd-MMM-yyyy', 'en-US', '+0530') ;
          tmp.InwardId=':D';
          tmp.InwardNo=':E';
          tmp.BranchId=':A';
          tmp.Userid=':B';
          tmp.Edate=':C';

        }
        else
        {
          tmp.Mdate=":A";
        }
        header.push(tmp);
        let i=1;
        this.items.forEach(el=>{
              let tmpDtl:any={};
              
              tmpDtl.INWARDID=":A";
              tmpDtl.BRANCHID=":D";
              tmpDtl.USERID=":C";
              tmpDtl.EDATE=":B";
              tmpDtl.MDATE=":B";
              
              tmpDtl.ITEMID=el.ITEMID;
              tmpDtl.QUANTITYBILLED=el.QUANTITYBILLED;
              tmpDtl.QUANTITYRECEIVED=el.QUANTITYRECEIVED;
              if(el.QUANTITYBREAKAGE>0)
              {tmpDtl.QUANTITYBREAKAGE=el.QUANTITYBREAKAGE;}
              else
              {tmpDtl.QUANTITYBREAKAGE=0;}
              if(el.QUANTITYREJECTED>0)
              {tmpDtl.QUANTITYREJECTED=el.QUANTITYREJECTED;}
              else
              {tmpDtl.QUANTITYREJECTED=0;}
              if(el.QUANTITYFOC>0)
              {tmpDtl.QUANTITYFOC=el.QUANTITYFOC;}
              else
              {tmpDtl.QUANTITYFOC=0;}
              if(el.RATE>0)
              {tmpDtl.RATE=el.RATE;}
              else
              {tmpDtl.RATE=0;}
              if(el.DISCOUNTPERCENT>0)
              {tmpDtl.DISCOUNTPERCENT=el.DISCOUNTPERCENT;}
              else
              {tmpDtl.DISCOUNTPERCENT=0;}
              if(el.DISCOUNTAMOUNT>0)
              {tmpDtl.DISCOUNTAMOUNT=el.DISCOUNTAMOUNT;}
              else
              {tmpDtl.DISCOUNTAMOUNT=0;}
              if(el.AMOUNT>0)
              {tmpDtl.AMOUNT=el.AMOUNT;}
              else
              {tmpDtl.AMOUNT=0;}
              if(el.RATE>0)
              {tmpDtl.RATE=el.RATE;}
              else
              {tmpDtl.RATE=0;}
              if(el.BilledWt>0)
              {tmpDtl.BilledWt=el.BilledWt;tmpDtl.RecdWt=el.BILLEDWT;}
              else
              {tmpDtl.BilledWt=0;tmpDtl.RecdWt=0;}
              if(el.GSTID>0)
              {tmpDtl.GSTID=el.GSTID;}
              else
              {tmpDtl.GSTID=0;}
              if(el.IGST>0)
              {tmpDtl.IGST=el.IGST;}
              else
              {tmpDtl.IGST=0;}
              if(el.SGST>0)
              {tmpDtl.SGST=el.SGST;}
              else
              {tmpDtl.SGST=0;}
              if(el.CGST>0)
              {tmpDtl.CGST=el.CGST;}
              else
              {tmpDtl.CGST=0;}
              if(el.IGSTAMT>0)
              {tmpDtl.IGSTAMT=el.IGSTAMT;}
              else
              {tmpDtl.IGSTAMT=0;}
              if(el.SGSTAMT>0)
              {tmpDtl.SGSTAMT=el.SGSTAMT;}
              else
              {tmpDtl.SGSTAMT=0;}
              if(el.CGSTAMT>0)
              {tmpDtl.CGSTAMT=el.CGSTAMT;}
              else
              {tmpDtl.CGSTAMT=0;}
              tmpDtl.SRNO=i;
              tmpDtl.UOM=el.UOM;
              tmpDtl.SConGST=0;
              tmpDtl.SConGSTAmt=0;
              if(el.ORDERID>0)
              {tmpDtl.ORDERID=el.ORDERID;}
              else
              {tmpDtl.ORDERID=0;}
              tmpDtl.PONo=el.PONO;
              tmpDtl.PODate=formatDate(el.ORDERDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 
              if(el.INDENTID>0)
              {tmpDtl.IndentId=el.INDENTID;}
              else
              {tmpDtl.IndentId=0;}
              tmpDtl.CompanyId=1;
              tmpDtl.StoreId=1;
              tmpDtl.ExcisePercent=0;
              tmpDtl.TaxPercent=0;
              tmpDtl.ExciseAmount=0;
              tmpDtl.TaxAmount=0;
              tmpDtl.PurchaseAccountID=0;
              tmpDtl.EduCessPercent=0;
              tmpDtl.EduCessAmount=0;
              tmpDtl.TaxId=0;
              tmpDtl.ServiceTaxPercent=0;
              tmpDtl.ServiceTaxAmount=0;
              tmpDtl.SHCessPercent=0;
              tmpDtl.SHCessAmount=0;
              tmpDtl.SurchargeRate=0;
              tmpDtl.SurchargeAmount=0;
              tmpDtl.ScheduleRowNo=0;
              tmpDtl.ScheduleId=0;
              tmpDtl.SheetRate=0;
              tmpDtl.SheetGrade='';
              tmpDtl.EduCessAmt_ST=0;
              tmpDtl.SHCessAmt_ST=0;
              tmpDtl.AdditionalDuty=0;
              tmpDtl.EDUCESSPERCENT_ST=0;
              tmpDtl.SHCESSPERCENT_ST=0;
              detail.push(tmpDtl);

              i++;


          
        });
    
            
        let mrirno:any;

        const  params = new  HttpParams()
      
        .set('mririd', this.routeID)
        .set('mrircatgid', this.newData.MRIRCATGID)
        .set('action', mode)
        .set('token', this.token)
        .set('header', JSON.stringify(header))
        .set('detail', JSON.stringify(detail));
        
      this.http.post(this.original_url+"/PurachaseAndStore/Purchase/SaveMRIR", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        mrirno=res;
        if (parseInt(mrirno)>0)
        {
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'sucess',
                    displayMsg:'Data Saved'
                  }
                });
               this.newData={};
               this.items=[];
               this.router.navigate(['/mrir-entery-list']);
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
  validateData()
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
       try
       {
            if(this.newData.MRIRCATGID==undefined||this.newData.MRIRCATGID==0||this.newData.MRIRCATGID=='' )
            {flag=false; msg=msg+"* Inward Category not selected.<br/>"}
    
            if(this.newData.GATEINWARDNO==undefined||this.newData.GATEINWARDNO==0||this.newData.GATEINWARDNO=='' )
            {flag=false; msg=msg+"* Gate entry not entred.<br/>"}
            
            if(this.newData.PARTYID==undefined||this.newData.PARTYID==0||this.newData.PARTYID=='')
            {flag=false; msg=msg+"* Party not selected.<br/>"}

            if(this.newData.AGAINSTCASH==true && (this.newData.IMPRESTACID  ==undefined||this.newData.IMPRESTACID==0||this.newData.IMPRESTACID==''))
            {flag=false; msg=msg+"* Imprest A/c not select.<br/>"}

            if(this.newData.PURCHASEACID==undefined||this.newData.PURCHASEACID==0||this.newData.PURCHASEACID=='')
            {flag=false; msg=msg+"* Purchase a/c not selected.<br/>"}
           
            if(this.newData.BILLNO!=undefined&&this.newData.BILLNO!=0&&this.newData.BILLNO!=''&&(this.newData.BILLDATE==undefined||this.newData.BILLDATE==0||this.newData.BILLDATE==''))
            {flag=false; msg=msg+"* Bill date not entred.<br/>"}
            
            if(this.newData.CHALLANNO!=undefined&&this.newData.CHALLANNO!=0&&this.newData.CHALLANNO!=''&&(this.newData.CHALLANDATE==undefined||this.newData.CHALLANDATE==0||this.newData.CHALLANDATE==''))
            {flag=false; msg=msg+"* Challan date not entred.<br/>"}

            if((this.newData.BILLNO==undefined||this.newData.BILLNO==0||this.newData.BILLNO=='')&&(this.newData.CHALLANNO==undefined||this.newData.CHALLANNO==0||this.newData.CHALLANNO==''))
            {flag=false; msg=msg+"* Document no not mentioned.<br/>"}

            if(this.newData.GRNO!=undefined&&this.newData.GRNO!=0&&this.newData.GRNO!=''&&(this.newData.GRDATE==undefined||this.newData.GRDATE==0||this.newData.GRDATE==''))
            {flag=false; msg=msg+"* GRN date not entred.<br/>"}

            if((this.newData.BEHALFOFBILLNO==undefined||this.newData.BEHALFOFBILLNO==0||this.newData.BEHALFOFBILLNO=='') && this.newData.SHORTNAME=='REJ')
            {flag=false; msg=msg+"* Sale Invoice no. not entred.<br/>"}

            if((this.newData.BEHALFOFBILLDATE==undefined||this.newData.BEHALFOFBILLDATE==0||this.newData.BEHALFOFBILLDATE=='') && this.newData.SHORTNAME=='REJ')
            {flag=false; msg=msg+"* Sale Invoice date not entred.<br/>"}
            let weight=0, wtdiff=0;
            this.newData.PONOS='';
            this.newData.DiscAmt=0;
            let i=1;
            this.items.forEach((el)=>{
              if(el.ORDERDATE> this.newData.BILLDATE)
              {flag=false; msg=msg+"* Order date should be less or equal.<br/>";}
              weight=weight+parseFloat( el.QUANTITYRECEIVED);
              this.newData.PONOS=this.newData.PONOS+el.PONO;
              this.newData.DiscAmt=this.newData.DiscAmt+el.DISCOUNTAMOUNT;
              if(i>1)
              {
                this.newData.PONOS=this.newData.PONOS+',';
              }
              i++;
            });
            
            if(this.WeighMaxWeight==undefined||this.WeighMaxWeight=='' )
            {this.WeighMaxWeight=0;}

            if(this.newData.SHORTNAME=='RMS')
            {
              weight=weight*1000;
            }
            wtdiff=parseFloat( this.WeighMaxWeight)-weight;
            if((this.newData.SHORTNAME=='RMS'||this.newData.SHORTNAME=='RMA' )  && this.newData.NAME.substring(0,7)!='FORTUNE' && this.newData.NAME.substring(0,7)!='SURAKSH' && this.newData.NAME.substring(0,7)!='THE INV')
            {
              if(wtdiff<-20)
              {
                {flag=false; msg=msg+"* Weigh variation more than 20 kgs.<br/>"}
              }
            }
            if(Math.abs( this.newData.ROUNDOFF)>0)
            {flag=false; msg=msg+"* Bill Amount is not tallied.<br/>";}
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
  printMRIR()
  {
    let data:any={};
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/PurachaseAndStore/Purchase/PrintMRIR?inwardid="+this.routeID+"&token="+this.token).subscribe((res)=>{
      this.allData=res;
      console.log("Mrir Load", res);
      this.allData=this.allData.Table;
      data.header=this.allData[0];
      this.allData=res;
      data.detail=this.allData.Table1;
      
      data.title="MRIR";
      data.backto='/add-mrir/'+this.routeID+'/'+this.routeAction;
       sessionStorage.setItem('mrir', JSON.stringify(data));
      this.router.navigate(['/print-mrir']);
      // const dialogRef = this.dialog.open(PrintMRIRComponent, {
      //   data: {
      //     wrongData: 'sucess',
      //     displayMsg:'Data Saved'
      //   }
      // });

      this.isLoadingResults=false;
     },
     error=>{
       this.isLoadingResults=false;
     });  
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



@Component({
  selector: 'mrirprint',
  templateUrl: './mrirprint.html',
  styleUrls: ['./add-new-mrir.component.css']
})
export class PrintMRIRComponent implements OnInit {
  newData:any={};backto:any;
  DetailData:Array<any>=[];
  title:any;telephone:any;GSTIn:any;
  repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;fax:any; email:any;pan:any;
 constructor(private router: Router ) {


  let currentBranch = sessionStorage.getItem("currentBranch");
  var CompanyData = JSON.parse(currentBranch);
  this.companyName=CompanyData['COMPANYNAME'];
  this.Address1=CompanyData['ADDRESS'];
  this.Address2 = CompanyData['ADDRESS1'];
  this.GSTIn = CompanyData['COMPANYGSTNO'];
  this.telephone = CompanyData['TELEPHONE'];
  this.fax = CompanyData['FAX'];
  this.email = CompanyData['EMAIL'];
  this.pan = CompanyData['COMPANYPAN'];
  let indent = sessionStorage.getItem("mrir");
  var data = JSON.parse(indent);
  this.newData=data['header'];
  this.DetailData=data['detail'];
  this.backto=data['backto'];
  sessionStorage.removeItem('mrir');
  }

 ngOnInit() {
  //  setTimeout(() => {
  //    window.print();
  //  });
  // setTimeout(() => {
  //    this.backToView();
  //  });
  
}
public print(): void 
{ 
  let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  virtualWindow.document.write('<html><head><title>Print</title>  '); 
  virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
  virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3; } footer {position: fixed;bottom: 30px;} div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}</style>');
  virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
  virtualWindow.document.close(); 
  virtualWindow.focus(); 
  setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   

 // window.print();
      // let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
      // virtualWindow.document.write('<html><head><title>Print</title>  '); 
      // virtualWindow.document.write('<link rel="stylesheet" href="assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
      // virtualWindow.document.write('<link href="assets/dist/css/style.min.css" rel="stylesheet"> '); 
      // virtualWindow.document.write('<link href="styles.css" rel="stylesheet"> '); 
      // virtualWindow.document.write('<link href="assets/dist/css/style-custom.css" rel="stylesheet">'); 
      // virtualWindow.document.write('<style type="text/css" media="print">@page{size: auto;margin: 0mm;} #printPageButton,#printPageButton1,#printPageButton2,#printPageButton3,#hidefromdatelabel,#hidefromdate,#hidetodatelabel,#hidetodate,#hidesortbutton {  display: none;}</style>'); 
      
      // virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
      // virtualWindow.document.close(); 
      // // necessary for IE >= 10 
      // virtualWindow.focus(); 
      // // necessary for IE >= 10 
      // setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000); 
      // Give the DOM time to render images before printing.
   }
backToView()
{
   this.router.navigate([this.backto]);
}

}