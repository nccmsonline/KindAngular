import { item } from './../../../Accounts/dashboard/dashboard.component';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { ConfirmationDialogService } from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service';
import { ValidationComponent } from './../../../../validation/validation.component';
import { formatDate } from '@angular/common';
import { Item } from 'src/app/Modules/General/item-master/item.modal';
//import { parse } from 'path';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';


@Component({
  selector: 'app-add-new-purchase-order',
  templateUrl: './add-new-purchase-order.component.html',
  styleUrls: ['./add-new-purchase-order.component.css']
})
export class AddNewPurchaseOrderComponent implements OnInit {

  filterPipe =new GrdFilterPipe;
  newData:any={};isLoadingResults:any;WorkingDate:any;
  userid:any;token:any; routeID:any;routeAction:any;ponoplaceholder="Last Order No.";
  items:Array<any>=[];original_url = environment.baseUrl;newitem:any={};edititemID:any={};
  DeliveryTermsList:Array<any>=[];filteredDeliveryTermsList:Array<any>=[];
  CostCenterList:Array<any>=[];filteredCostCenterList:Array<any>=[];
  showDropDown='';partyNameList:Array<any>=[];allData:any={};
  itemList:Array<any>=[];gstList:Array<any>=[];brandlist:Array<any>=[];isJobWork:any;
  constructor(public dialog: MatDialog,   private router: Router,  private activatedRoute: ActivatedRoute, private http: HttpClient,private upload:FileDownloadUploadService) 
  { 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.newData.INDENTDATE= new Date(CompanyData['WORKINGDATE']);
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.isJobWork = this.activatedRoute.snapshot.paramMap.get('flag');

    this.newData.AGAINSTCASH=false;
    // this.router.events
    // .subscribe((event) => {
    //   if (event instanceof onanimationend) {
    //     this.isJobWork = this.activatedRoute.snapshot.paramMap.get('flag');
        
    //   }
    // });
  }



  ngOnInit() {

    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getPOLoad?orderid="+this.routeID+"&token="+this.token).subscribe((res)=>{
     this.allData=res;
     console.log("Mrir Load", res);
     this.DeliveryTermsList=this.allData.Table1;
     this.CostCenterList=this.allData.Table;
     this.gstList=this.allData.Table2;
     this.brandlist=this.allData.Table3;
     if(this.routeAction!='new')
     {
      this.items=this.allData.Table5;
      this.itemList=this.allData.Table6;
      let i=1;
      this.items.forEach(el=>{
        el.id=i++;
      });
      this.allData=this.allData.Table4;
      this.newData=this.allData[0];
      this.ponoplaceholder="Order No.";
      
     }
     else
     {
      this.allData=this.allData.Table4;
      this.newData=this.allData[0];
     }
     this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    });   
  }
  searchParty(term, flag)
  {
    
    if(flag=='A'&&this.showDropDown=='PARTY')
    {
      this.showDropDown='';
    }
    if(term !== '' )
    {
        this.showDropDown='PARTY';
        this.http.get(this.original_url+"/Master/getAccountList?flag=S&search="+term+"&token="+this.token).subscribe((res)=>{
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
      this.showDropDown='';
    }
  }
  onChangeOfParty(row, data)
  {
    data.NAME=row.NAME;  
    data.PARTYID=row.CUSTOMERID;
    data.STATEID=row.STATEID;
    data.WITHINSTATE=row.WITHINSTATE;
    data.ADDRESS=row.ADDRESS;
    data.STATEDESC=row.STATEDESC;
    data.GSTNO=row.GSTNO;
    this.newitem={};
    this.showDropDown='';
    this.getItemList(data.PARTYID);
  }
  
  searchCostCenter(term, flag)
  {
    if(flag=='A'&&this.showDropDown=='COSTCENTER')
    {
      this.showDropDown='';
    }
    else if(term !== ''||flag=='A' )
    {
      this.showDropDown='COSTCENTER';
      if(flag=='A')
      {
        this.filteredCostCenterList=this.CostCenterList;  
      }
      else
      {
        this.filteredCostCenterList=this.filterPipe.transform(this.CostCenterList,term, 'COSTCENTRE');  
      }
      
    }
    else
    {
      this.filteredCostCenterList = [];
      this.showDropDown='';
    }
  }
  onChangeOfCostCenter(row, data)
  {
    data.COSTCENTERID=row.COSTCENTERID;  
    data.COSTCENTRE=row.COSTCENTRE;
    this.showDropDown='';
  }
  getItemList(partyid)
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/PurachaseAndStore/Purchase/getPartyWisePassedIndent?partyid="+partyid+"&token="+this.token+"&flag="+this.isJobWork).subscribe((res)=>{
     this.allData=res;
     console.log("Mrir Load", res);
     this.itemList=this.allData.Table;
     this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    }); 
  }
  searchDeliveryTerms(term, flag)
  {
    if(flag=='A'&&this.showDropDown=='DELIVERYTERMS')
    {
      this.showDropDown='';
    }
    else if(term !== ''||flag=='A' )
    {
      this.showDropDown='DELIVERYTERMS';
      if(flag=='A')
      {
        this.filteredDeliveryTermsList=this.DeliveryTermsList;  
      }
      else
      {
        this.filteredDeliveryTermsList=this.filterPipe.transform(this.DeliveryTermsList,term, 'DELIVERYTERM');  
      }
      
    }
    else
    {
      this.filteredDeliveryTermsList = [];
      this.showDropDown='';
    }
  }
  onChangeOfDeliveryTerms(row, data)
  {
    data.DELIVERYTERMID=row.DELIVERYTERMID;  
    data.DELIVERYTERM=row.DELIVERYTERM;
    this.showDropDown='';
  }
  onItemChange(item, row)
  {
      console.log("Item Change", item);
      row.disc
      row.UNIT=item.UOM;
      row.ARDNO=item.ARDNO;
      row.BRANDID=item.BRANDID;
      row.DESCRIPTION=item.DESCRIPTION;
      row.DISCRATE=item.DISCRATE;
      row.EXPECTEDDATE=item.EXPECTEDDATE;
      row.GSTID=item.GSTID;
      row.INDENTID=item.INDENTID;
      row.ITEMID=item.ITEMID;
      row.ORDERQUANTITY=parseFloat( item.QUANTITY);
      row.QUANTITY=item.QUANTITY;
      row.ORDERRATE=item.RATE;
      row.HSNCODE=item.TARIFFHEAD;
      row.SGST=0;
      row.CGST=0;
      row.IGST=0;
      row.ITEMNAME=item.ITEMNAME;
      row.ITEMCODE=item.ITEMCODE;
      row.DLYDATE=item.EXPECTEDDATE;
      row.ARREFID=item.ARID;
      row.ARREF=item.ARDNO;

      if(this.newData.WITHINSTATE=='Y')
      {
        row.SGST=item.SGST;
        row.CGST=item.CGST;
      }
      else
      {
        row.IGST=item.IGST;
      }
      this.onChangeOfBrand(row.BRANDID, row);

      this.CalculateAmount(row)
  }
  onChangeOfBrand(id, data)
  {
    console.log("brand id",id);
    var brand=this.brandlist.find(x=>x.ITEMSBRANDID==id).ITEMSBRAND;
    data.BRAND=brand;
  }
  onGSTChange(item, row)
  {
      row.GSTID=item.GSTID;
      row.HSNCODE=item.HSNCODE;
      row.SGST=0;
      row.CGST=0;
      row.IGST=0;
      if(this.newData.WITHINSTATE=='Y')
      {
        row.SGST=item.SGST;
        row.CGST=item.CGST;
      }
      else
      {
        row.IGST=item.IGST;
      }
      this.CalculateAmount(row)
  }
  CalculateAmount(data)
  {
    let amount:number;
    let goodsamt:number;
    try
    {
      goodsamt=parseFloat((data.ORDERRATE).toFixed(2));
      if(data.DISCRATE>0)
      {
        data.DISCOUNTAMOUNT=parseFloat((goodsamt*data.DISCRATE/100).toFixed(2));
        goodsamt=parseFloat((goodsamt-data.DISCOUNTAMOUNT).toFixed(2));
      }
      data.IGSTAMT=parseFloat((goodsamt*data.IGST/100).toFixed(2));
      data.CGSTAMT=parseFloat((goodsamt*data.CGST/100).toFixed(2));
      data.SGSTAMT=parseFloat((goodsamt*data.SGST/100).toFixed(2));
      data.NETRATE=parseFloat((goodsamt+data.IGSTAMT+data.CGSTAMT+data.SGSTAMT).toFixed(2));

      data.IGSTAMT=parseFloat((data.ORDERQUANTITY*data.IGSTAMT).toFixed(2));
      data.CGSTAMT=parseFloat((data.ORDERQUANTITY*data.CGSTAMT).toFixed(2));
      data.SGSTAMT=parseFloat((data.ORDERQUANTITY*data.SGSTAMT).toFixed(2));

      goodsamt=parseFloat((data.ORDERQUANTITY*data.NETRATE).toFixed(2));
      data.TOTALAMOUNT=parseFloat((goodsamt).toFixed(2));
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
      totalamt=totalamt+parseFloat(el.TOTALAMOUNT.toFixed(2));
     });   

     try
     {
         

          this.newData.TOTALAMOUNT=totalamt;
         
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
    var currDate=new Date();
 
console.log("Validate",data);
    msg="<h5>Before add please rectify following mistakes:-</h5>";
       try
       {
            if(data.ITEMID==undefined||data.ITEMID==0||data.ITEMID=='' )
            {flag=false; msg=msg+"<li> Item not seletect</li>"}
    
            if(data.ORDERQUANTITY==undefined||data.ORDERQUANTITY==0||data.ORDERQUANTITY=='' )
            {flag=false; msg=msg+"<li> Quantity not entred</li>"}
            
            if(data.GSTID==undefined||data.GSTID=='' )
            {flag=false; msg=msg+"<li> GST type not selected</li>"}

            debugger
            if(data.BRANDID==undefined||data.BRANDID==null)
            {flag=false; msg=msg+"<li> Brand not selected</li>"}
            
            if(parseFloat (data.ORDERQUANTITY)>parseFloat( data.QUANTITY))
            {flag=false; msg=msg+"<li> Order Qty should not be more than indent qty.</li>"}
            

            var qty = 
            this.items.find(x=>x.ITEMID==data.ITEMID&&x.INDENTID==data.INDENTID&&x.id!=data.id);
            if(qty!=undefined)
            {
              flag=false; msg=msg+"<li> Duplicate item found</li>";
            }
            var selectedDate=new Date(data.DLYDATE);
            selectedDate.setHours(selectedDate.getHours() + 23);

            if( selectedDate<currDate)
            {
              flag=false;
              msg=msg+"<li> Expected date should not before current date."+'</li>';
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
  saverecord(mode)
  {
    let header:Array<any>=[], detail:Array<any>=[];
        if(!this.validateData())
        {
          return;
        }
        this.isLoadingResults=true;
        let tmp:any={};
        tmp.PARTYID=this.newData.PARTYID;
        tmp.CostCentreId=this.newData.COSTCENTERID;
        tmp.Destination=this.newData.DESTINATION;
        tmp.DeliveryTermId=this.newData.DELIVERYTERMID;
       
        tmp.PoTypeId=1;
        tmp.PaymentTermsId=1;
        tmp.TotalAmount=this.newData.TOTALAMOUNT;
        tmp.SubTotal=0;
        tmp.Remarks=this.newData.REMARKS;
        
        tmp.ModeOfDespatchId=1;
        tmp.Referance=this.newData.REFERANCE;
        if(this.newData.REFDATE!=undefined&&this.newData.REFDATE!='')
        {tmp.RefDate=formatDate(this.newData.REFDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); }
        tmp.Companyid=1;
        tmp.CompNo="";
        tmp.SubCostCentreid=1;
        tmp.ProductionUnitId=1;
        
        tmp.AMMENDMENTNO=0;
        tmp.PKGFWDBEFORETAX=0;
        tmp.DocThrough="-";
        tmp.ISAPPROVED="Y";
        tmp.IsJobWork=this.isJobWork;
        tmp.DeliveryTerms=this.newData.DELIVERYTERMS;

        tmp.SentTo=this.newData.SENTTO;
        tmp.SentCC=this.newData.SENTCC;
        tmp.SentFrom=this.newData.SENTFROM;
        tmp.PurchaseCategId=0;
        tmp.PurchaseCatgCode='';
        tmp.TERMCONDITION1=this.newData.TERMCONDITION1;
        tmp.TERMCONDITION2=this.newData.TERMCONDITION2;
        tmp.TERMCONDITION3=this.newData.TERMCONDITION3;
        tmp.TERMCONDITION4=this.newData.TERMCONDITION4;
        tmp.TERMCONDITION5=this.newData.TERMCONDITION5;
        tmp.TERMCONDITION6=this.newData.TERMCONDITION6;
        tmp.TERMCONDITION7=this.newData.TERMCONDITION7;
        tmp.TERMCONDITION8=this.newData.TERMCONDITION8;
        tmp.TERMCONDITION9=this.newData.TERMCONDITION9;
        tmp.TERMCONDITION10=this.newData.TERMCONDITION10;
        tmp.TERMCONDITION11=this.newData.TERMCONDITION11;
        tmp.TERMCONDITION12=this.newData.TERMCONDITION12;
        tmp.TERMCONDITION13=this.newData.TERMCONDITION13;
        tmp.TERMCONDITION14=this.newData.TERMCONDITION14;
        tmp.TERMCONDITION15=this.newData.TERMCONDITION15;
        if(mode=='Insert')
        {
          tmp.OrderId=':A';
          tmp.OrderNo=':B';
          tmp.OrderDate=':C';
          tmp.Edate=":D";
          tmp.Etime=":E";
          tmp.DeliveryDate=":F";
          tmp.UserId=":G";
          tmp.BranchId=":H";
          tmp.TypeOfOrder="I";
          tmp.Status="P";
          tmp.Confirmation="N";
        }
       

        header.push(tmp);
        let i=1;
        this.items.forEach(el=>{
              let tmpDtl:any={}, gstamt=0;
              tmpDtl.ORDERID=":A";
              tmpDtl.BRANCHID=":D";
              tmpDtl.USERID=":C";
              tmpDtl.EDATE=":B";
              tmpDtl.Etime=":E";
              tmpDtl.ITEMID=el.ITEMID;
              tmpDtl.OrderQuantity=el.ORDERQUANTITY;
              tmpDtl.OrderRate=el.ORDERRATE;
              tmpDtl.Companyid=1;
              tmpDtl.IndentId=el.INDENTID;
              tmpDtl.COSTCENTERID=1;
              tmpDtl.SUBCOSTCENTERID=1;
              tmpDtl.ARRef=el.ARREF;
              tmpDtl.DlyDate=formatDate(el.DLYDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 
              tmpDtl.Remarks=el.REMARKS;
              tmpDtl.BrandId=el.BRANDID;
              tmpDtl.ARRefId=el.ARREFID;
              tmpDtl.Description=el.DESCRIPTION;
              if(el.DISCRATE>0)
              {tmpDtl.DiscRate=el.DISCRATE;}
              else
              {tmpDtl.DiscRate=0;}
              if(el.GSTID>0)
              {tmpDtl.GSTId=el.GSTID;}
              else
              {tmpDtl.GSTId=0;}
              if(el.GST>0)
              {tmpDtl.IGST=el.IGST;}
              else
              {tmpDtl.IGST=0;}
              if(el.CGST>0)
              {tmpDtl.CGST=el.CGST;}
              else
              {tmpDtl.CGST=0;}
              if(el.SGST>0)
              {tmpDtl.SGST=el.SGST;}
              else
              {tmpDtl.SGST=0;}
              if(el.IGSTAMT>0)
              {gstamt=gstamt+parseFloat(el.IGSTAMT);}
              if(el.SGSTAMT>0)
              {gstamt=gstamt+parseFloat(el.SGSTAMT);}
              if(el.CGSTAMT>0)
              {gstamt=gstamt+parseFloat(el.CGSTAMT);}
              tmpDtl.GSTAmount=gstamt;
              if(el.NETRATE>0)
              {tmpDtl.NetRate=el.NETRATE;}
              else
              {tmpDtl.NetRate=0;}
              if(el.TOTALAMOUNT>0)
              {tmpDtl.TotalAmount=el.TOTALAMOUNT;}
              else
              {tmpDtl.TotalAmount=0;}
              tmpDtl.SHCessRate=0;

              

              detail.push(tmpDtl);
              i++;
        });
    
            
        let torderno:any;
        const  params = new  HttpParams()
        .set('orderid', this.routeID)
        .set('action', mode)
        .set('token', this.token)
        .set('header', JSON.stringify(header))
        .set('detail', JSON.stringify(detail));
        
      this.http.post(this.original_url+"/PurachaseAndStore/Purchase/SavePurchaseOrder", params.toString(), {
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
               this.newData={};
               this.items=[];
               this.router.navigate(['/purchase-order']);
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
            if(this.newData.PARTYID==undefined||this.newData.PARTYID==0||this.newData.PARTYID=='' )
            {flag=false; msg=msg+"<li> Party name not selected.</li>"}
    
            if(this.newData.REFERANCE==undefined||this.newData.REFERANCE=='' )
            {flag=false; msg=msg+"<li> Your referance not entred.</li>"}

            if(this.newData.REFDATE==undefined||this.newData.REFDATE=='' )
            {flag=false; msg=msg+"<li> Your referance date not entred.</li>"}

           
    
            if(this.newData.DESTINATION==undefined||this.newData.DESTINATION=='' )
            {flag=false; msg=msg+"<li> Destination not entred.</li>"}

            if(this.newData.COSTCENTRE==undefined||this.newData.COSTCENTRE==0||this.newData.COSTCENTRE=='' )
            {flag=false; msg=msg+"<li> Constcenter not selected.</li>"}

            if(this.newData.DELIVERYTERM==undefined||this.newData.DELIVERYTERM==0||this.newData.DELIVERYTERM=='' )
            {flag=false; msg=msg+"<li> Delivery term not selected.</li>"}


            if(this.items.length==0)
            {flag=false; msg=msg+"<li> Please select atleat one record for save.</li>";}
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
  printPO()
  {
    let data:any={};
    this.isLoadingResults=true;
    
     this.upload.downloadPDF(this.original_url+ '/admin/InventoryPDF/PrintPurchaseOrder?token='+this.token+"&orderid="+this.routeID).subscribe(res => {
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

    //  this.http.get(this.original_url+"/PurachaseAndStore/Purchase/printPurchaseOrder?orderid="+this.routeID+"&token="+this.token).subscribe((res)=>{
    //   this.allData=res;
     
    //   this.allData=this.allData.Table;
    //   data.header=this.allData[0];
    //   this.allData=res;
    //   data.detail=this.allData.Table1;
    //   if(this.isJobWork=='N')
    //   {data.title="P u r c h a s e  O r d e r";}
    //   else
    //   {data.title="P u r c h a s e  O r d e r : J o b W o r k";}
    //   data.backto='/addNew-purchaseOrder/'+this.routeID+'/'+this.routeAction+'/'+this.isJobWork;
    //   sessionStorage.setItem('order', JSON.stringify(data));
    //   this.router.navigate(['/purchase-print']);
      

     

    //   this.isLoadingResults=false;
    //  },
    //  error=>{
    //    this.isLoadingResults=false;
    //  });  
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
  selector: 'poprint',
  templateUrl: './poprint.html',
  styleUrls: ['./add-new-purchase-order.component.css']
})
export class PrintPOComponent implements OnInit {
  newData:any={};backto:any;
  DetailData:Array<any>=[];
  title:any;telephone:any;GSTIn:any;fax:any; email:any;pan:any;
  repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;
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
  let indent = sessionStorage.getItem("order");
  var data = JSON.parse(indent);
  this.newData=data['header'];
  this.DetailData=data['detail'];
  this.title=data['title'];
  //this.title="P u r c h a s e    O r d e r";
  this.backto=data['backto'];
  sessionStorage.removeItem('order');
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
 // window.print();
 let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
 virtualWindow.document.write('<html><head><title>Print</title>  '); 
 virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
 virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
 virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
 virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
 virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3; -webkit-print-color-adjust: exact !important;} footer {position: fixed;bottom: 30px; } div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}</style>');
 virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
 virtualWindow.document.close(); 
 virtualWindow.focus(); 
 setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
}
backToView()
{
  debugger
   this.router.navigate([this.backto]);
}

}