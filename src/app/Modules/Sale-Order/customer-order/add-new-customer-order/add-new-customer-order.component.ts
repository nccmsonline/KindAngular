import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-new-customer-order',
  templateUrl: './add-new-customer-order.component.html',
  styleUrls: ['./add-new-customer-order.component.css']
})
export class AddNewCustomerOrderComponent implements OnInit, AfterContentInit {
  original_url = environment.baseUrl;
  datetype: Array<any>=[];newData:any={};itemDisplay:any;billseriesList:any=[];transportModeList:any=[];rowDetail:any={};userid:any;isLoadingResults:boolean;
  FYUSER:any;ServerIP:any;boid : any;customerList1 = new MatTableDataSource<any>();customerList:any=[];curDate:any;isEditable:boolean;isAddNew:boolean;
  productCodeList:any=[];productNameList:any=[];pairProductList:any=[];routeID:any;routeAction:any;orderDetail:any=[];disableDropDown:boolean;token:any;
  constructor( private router: Router, private http: HttpClient,  private activatedRoute: ActivatedRoute, public dialog: MatDialog) { 
    let currentBranch = sessionStorage.getItem("currentBranch");
    this.isLoadingResults=true;
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.curDate= CompanyData['WORKINGDATE'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.isEditable=false;
    this.isAddNew=false;
 }

  ngOnInit() {
    this.datetype.push({id:'PCS',description:'On Qty '}) ;
    this.datetype.push({id:'KGS',description:'On Wight '}) ;
  }
  ngAfterContentInit() {
     this.gatLoadData();
     if(this.routeAction == "edit")
     {
     this.showOrderDetail();
     }
     else if(this.routeAction == "new")
     {
      this.isAddNew=true;
      let todayDate  = new Date( this.curDate);
      this.newData.ORDERDATE= formatDate(todayDate, 'dd-MM-yyyy', 'en-US', '+0530');
      this.getLastOrderNo();
     }
  }
  previousOrder()
  {
    this.routeID=parseInt(this.routeID)-1;
    this.showOrderDetail();
  }
  NextOrder()
  {
    this.routeID=parseInt(this.routeID)+1;
    this.showOrderDetail();
   
  }
  onCustomerChange(data, id)
  {
       data.CUSTOMERID=id;
       data.BILLCUSTOMERID=id;
      var cust=this.customerList.find(x=>x.CUSTOMERID==id);
      data.TCSRATE=cust.TCSRATE;
      data.TCSID=cust.TCSID;
      console.log("ravi",id);
      if(id>0&&  this.newData.BILLSERIESID>0)
      {
          this.getProductList()
      }
  }
  onBillSeriesChange(id)
  {
    this.newData.BILLSERIESID=id;
        console.log("ravinder",id);
        if(id>0&&  this.newData.CUSTOMERID>0)
        {
          this.getProductList()
        }
  }
  onProductIdChange(data)
  {
    console.log("PRODUCTID",data.PRODUCTID);
      var item=this.productNameList.find(x=>x.ITEMID==data.PRODUCTID);
      if(item!=undefined)
      {
        console.log("data", data);
        this.rowDetail.ITEMID=parseInt(data.PRODUCTID) ;
        console.log("data11", data.ITEMID);
        data.PRODUCTTYPE=item.PRODUCTTYPE;
        data.STAMPINGRATE=item.STAMPINGRATE;
        data.PROCESSCHRG=''; //item.PROCESSCHRG;
        data.ALLUMINIUMRATE=item.ALLUMINUMRATE;
        data.STAMPINGWT=item.STAMPINGWT;
        data.ALLUMINUMWT=item.ALLUMINUMWT;
        data.UFO=item.UFO;
        data.ITEMCODE=item.ITEMCODE;
        data.HSN=item.HSN;
        data.IGST=item.IGST;
        data.CGST=item.CGST;
        data.SGST=item.SGST;
        data.PAIRCODE='';
        data.UOM='PCS';
        data.RATE=item.RATE;
        data.COILTHICKNESS=item.COILTHICKNESS;
        data.SHEETWIDTH=item.SHEETWIDTH;
        data.PRODUCTHEIGHT=item.PRODUCTHEIGHT;
        data.GRPCODE=item.GRPCODE;
        data.GSTID=item.GSTID;
        this.getPairProductList();
      }
  }
  onProductChange(data, id)
  {
    console.log("itemid",id);
    data.ITEMID=id;
    data.PRODUCTID=id;
    var item=this.productNameList.find(x=>x.ITEMID==id);
    data.PRODUCTTYPE=item.PRODUCTTYPE;
    data.STAMPINGRATE=item.STAMPINGRATE;
    data.PROCESSCHRG=''; //item.PROCESSCHRG;
    data.ALLUMINIUMRATE=item.ALLUMINUMRATE;
    data.STAMPINGWT=item.STAMPINGWT;
    data.ALLUMINUMWT=item.ALLUMINUMWT;
    data.UFO=item.UFO;
    data.ITEMCODE=item.ITEMCODE;
    data.HSN=item.HSN;
    data.IGST=item.IGST;
    data.CGST=item.CGST;
    data.SGST=item.SGST;
    data.PAIRCODE='';
    data.UOM='PCS';
    data.RATE=item.RATE;
    data.COILTHICKNESS=item.COILTHICKNESS;
    data.SHEETWIDTH=item.SHEETWIDTH;
    data.PRODUCTHEIGHT=item.PRODUCTHEIGHT;
    data.GRPCODE=item.GRPCODE;
    data.GSTID=item.GSTID;
    this.getPairProductList();
  }
  ShowRowDetail(item)
  {
     this.rowDetail.ITEMID=item.ITEMID;
      this.rowDetail.PRODUCTTYPE=item.PRODUCTTYPE;
       this.getPairProductList();
       this.http.get(this.original_url+"/SOP/SaleOrder/getProductPairList?partyid="+this.newData.CUSTOMERID+"&itemid="+this.rowDetail.ITEMID+"&producttype="+this.rowDetail.PRODUCTTYPE+"&userid="+this.userid+"&token="+this.token).subscribe((res)=>{
                this.itemDisplay=res;
                this.itemDisplay=this.itemDisplay.Table;
                this.pairProductList= this.itemDisplay;
                this.rowDetail.STAMPINGRATE=item.STAMPINGRATE;
                this.rowDetail.PROCESSCHRG=item.PROCESSCHRG;
                this.rowDetail.ALLUMINIUMRATE=item.ALLUMINIUMRATE;
                this.rowDetail.STAMPINGWT=item.STAMPINGWT;
                this.rowDetail.ALLUMINUMWT=item.ALLUMINUMWT;
                this.rowDetail.UFO=item.UFO;
                this.rowDetail.ITEMCODE=item.ITEMCODE;
                this.rowDetail.PAIRCODE=item.PAIRCODE;
                this.rowDetail.HSN=item.HSN;
                this.rowDetail.IGST=item.IGST;
                this.rowDetail.GSTID=item.GSTID;
                this.rowDetail.CGST=item.CGST;
                this.rowDetail.SGST=item.SGST;
                this.rowDetail.RSID=item.RSID;
                this.rowDetail.PAIRCODE='';
               // this.rowDetail.UOM='PCS';
                this.rowDetail.RATE=item.RATE;
                this.rowDetail.ORDERQTYPCS=item.ORDERQTYPCS;
                this.rowDetail.ORDERQTYKGS=item.ORDERQTYKGS;
                this.rowDetail.UOM=item.UOM;
                this.rowDetail.ROWNO=item.ROWNO;
                this.rowDetail.DELIVERYDATEREQUESTED=item.DELIVERYDATEREQUESTED;
                this.rowDetail.RATE=item.RATE;
                this.rowDetail.COILTHICKNESS=item.COILTHICKNESS;
                this.rowDetail.SHEETWIDTH=item.SHEETWIDTH;
                this.rowDetail.PRODUCTHEIGHT=item.PRODUCTHEIGHT;
                this.rowDetail.GRPCODE=item.GRPCODE;
           });

  }
  wtCalculate(row)
  {
    var item=this.productNameList.find(x=>x.ITEMID==row.ITEMID);
    if(row.ORDERQTYPCS!=undefined && row.ORDERQTYPCS!=null && row.ORDERQTYPCS!=''&&item.PRODUCTWEIGHT!=undefined && item.PRODUCTWEIGHT!=null && item.PRODUCTWEIGHT!='')
    {
      var wt=parseInt(row.ORDERQTYPCS) *parseFloat(item.PRODUCTWEIGHT);
      row.ORDERQTYKGS=wt.toFixed(3);
    }
  }
  gatLoadData()
  {
    this.http.get(this.original_url+"/SOP/SaleOrder/getOrderLoadEvent?token="+this.token).subscribe((res)=>{
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.customerList= this.itemDisplay;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table2;
    this.transportModeList= this.itemDisplay; 
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table1;
    this.billseriesList= this.itemDisplay; 
    this.isLoadingResults=false;
   console.log("res",res);
    });
  }
  onPairChange(data, id)
  {
    console.log("ngModelChange",id);
    var item=this.pairProductList.find(x=>x.RSID==parseInt(id));
    if(item!=undefined)
    {
      data.RSID=parseInt( item.RSID);
      data.PAIRCODE=item.PAIRINGCODE;
    }
  }
  getProductList()
  {
    this.http.get(this.original_url+"/SOP/SaleOrder/getPartyProductList?partyid="+this.newData.CUSTOMERID+"&billseriesid="+this.newData.BILLSERIESID+"&userid="+this.userid+"&token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.productCodeList= this.itemDisplay;
      this.productNameList=this.itemDisplay;
      this.productNameList = this.productNameList.sort(function(a,b){return a.ITEMNAME - b.ITEMNAME});
      console.log("ravi",this.productNameList);
      });
  }
  getPairProductList()
  {
    //console.log(this.original_url+"/SOP/SaleOrder/getProductPairList?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+
    //"&boid="+this.boid+"&partyid="+this.newData.CUSTOMERID+"&itemid="+this.rowDetail.ITEMID+"&producttype="+this.rowDetail.PRODUCTTYPE);
    this.http.get(this.original_url+"/SOP/SaleOrder/getProductPairList?partyid="+this.newData.CUSTOMERID+"&itemid="+this.rowDetail.ITEMID+"&producttype="+this.rowDetail.PRODUCTTYPE+"&userid="+this.userid+"&token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.pairProductList= this.itemDisplay;
      });
  }
  showOrderDetail()
  {
    this.http.get(this.original_url+"/SOP/SaleOrder/showOrderDetail?orderid="+this.routeID+"&userid="+this.userid+"&token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table[0];
      this.newData= this.itemDisplay;
      this.newData.ORDERDATE= formatDate(this.newData.ORDERDATE, 'dd-MM-yyyy', 'en-US', '+0530');
      this.isEditable=true;
      if(this.newData.CONFIRMEDBYMKT=="Y")
      this.isEditable=false;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table1;
      this.orderDetail= this.itemDisplay;
      this.getProductList();
      this.listLength();
      });
  }
  getLastOrderNo()
  {
    this.http.get(this.original_url+"/SOP/SaleOrder/getLastSaleOrder?token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table[0];
      this.newData.ORDERREFNO= this.itemDisplay.ORDERREFNO;
      });
  }
  listLength()
  {
    if(this.orderDetail.length>0)
    {
      this.disableDropDown=true;
    }
    else
    {
      this.disableDropDown=false;
    }
  }
  addItemDetail(data)
  {
    if(this.validateDetail(data))
    {
      if(data.ROWNO>0)
      {
        this.orderDetail.splice(data.ROWNO-1,1);
      }
      this.orderDetail.push(data);
      this.orderDetail.forEach((item,index) => {
        var serialno = 'ROWNO';
        var value = index+1;
        item[serialno] = value;
      });
      this.rowDetail = {};
      this.listLength();
     
    }
  }
  validateDetail(data)
  {
  var flag:boolean;
  flag=true;
  var mdate = new Date();
  var msg:any;
  this.onPairChange(data, data.RSID)
  console.log("dataravi",data);
  msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';


  if(this.newData.CUSTOMERID==undefined||this.newData.CUSTOMERID==0||this.newData.CUSTOMERID=='' ||this.newData.CUSTOMERID==null)
  {flag=false; msg=msg+"<li>Customer not seletect.</li>"}
  if(this.newData.BILLCUSTOMERID==undefined||this.newData.BILLCUSTOMERID==0||this.newData.BILLCUSTOMERID=='' ||this.newData.BILLCUSTOMERID==null)
  {flag=false; msg=msg+"<li>Bill to Customer not seletect.</li>"}

  if(this.newData.BILLSERIESID==undefined||this.newData.BILLSERIESID==0||this.newData.BILLSERIESID=='' ||this.newData.BILLSERIESID==null)
  {flag=false; msg=msg+"<li>Bill type not seletect.</li>"}

  if(this.newData.TRANSPORTMODEID==undefined||this.newData.TRANSPORTMODEID==0||this.newData.TRANSPORTMODEID=='' ||this.newData.TRANSPORTMODEID==null)
  {flag=false; msg=msg+"<li>Transport mode not seletect.</li>"}

     if(data.ITEMID==undefined||data.ITEMID==0||data.ITEMID=='' ||data.ITEMID==null)
     {flag=false; msg=msg+"<li>Item not seletect.</li>"}
     if(data.RSID==undefined||data.RSID==null)
     {flag=false; msg=msg+"<li>Product pair seletect.</li>"}
     if(data.ORDERQTYPCS==undefined||data.orderedquantity=='' )
     {data.ORDERQTYPCS=0;}
     if(data.ORDERQTYKGS==undefined||data.ORDERQTYKGS=='' )
     {data.ORDERQTYKGS=0}
     if(data.RATE==undefined||data.RATE=='' )
     {data.RATE=0}
     if(data.DELIVERYDATEREQUESTED==undefined||data.DELIVERYDATEREQUESTED==''|| data.DELIVERYDATEREQUESTED<mdate)
     {flag=false; msg=msg+"<li>Delivery date not selected or before current date.</li>";}

   
     if(data.STAMPINGRATE==undefined||data.STAMPINGRATE==''||data.STAMPINGRATE==null )
     data.STAMPINGRATE==0;
     if(data.PROCESSCHRG==undefined||data.PROCESSCHRG==''||data.PROCESSCHRG==null )
     data.PROCESSCHRG==0;

     if(data.ALLUMINIUMRATE==undefined||data.ALLUMINIUMRATE==''||data.ALLUMINIUMRATE==null )
     data.ALLUMINIUMRATE==0;
     if(data.STAMPINGWT==undefined||data.STAMPINGWT=='' ||data.STAMPINGWT==null)
     data.STAMPINGWT==0;

     if(data.ALLUMINUMWT==undefined||data.ALLUMINUMWT==''||data.ALLUMINUMWT==null )
     data.ALLUMINUMWT==0;
     if(data.UFO==undefined||data.UFO=='' ||data.UFO==null)
     data.UFO==0;

     var qty=    this.orderDetail.find(x=>x.ITEMID==data.ITEMID&&x.RSID==data.RSID&&x.ROWNO!=data.ROWNO);
     if(qty!=undefined)
     {
      {flag=false; msg=msg+"<li>Duplicate item found"+'</li>'}  
     }

     msg=msg+"</ul>";
     if(flag==false)
     {
      this.isLoadingResults=false;
      console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     } //alert(msg);
   return flag;
}
  removeItem(row){
    this.orderDetail.splice(row.ROWNO-1,1);
    this.listLength();
  }
  editItem(val){
  //  this.editItemID = val;
  }
  updateItem(val){
    // if(this.validateDetail(val))
    // {
    //   this.editItemID = {};
    //   this.calSummary();
    // }
  }
  saveSaleOrder()
  {
    this.isLoadingResults=true;
    if(this.validatData())
    {
      var header:any=[], hdr:any={};
      var detail:any=[];
      hdr.ORDERREFNO=':ORDERREFNO';
      hdr.ORDERDATE=':ORDERDATE';
      hdr.ORDERREFID=':ORDERREFID';
      hdr.CUSTOMERID=this.newData.CUSTOMERID;
      hdr.BILLCUSTOMERID=this.newData.BILLCUSTOMERID;
      hdr.BILLSERIESID=this.newData.BILLSERIESID;
      hdr.TRANSPORTMODEID=this.newData.TRANSPORTMODEID;
      hdr.AMENDMENTNO=0;
      hdr.USERID=this.userid;
      hdr.EDATE=':EDATE';
      hdr.CUSTOMERPO=this.newData.CUSTOMERPO;
      hdr.TAXID=0;
      hdr.CANCELLED='N';
      hdr.CONFIRMEDBYMKT='N';
      hdr.CONFIRMEDBYPRODN='N';
      hdr.CONFIRMEDBYCEO='Y';
      hdr.CONFIRMEDBYTOOLROOM='Y';
      hdr.BUYER=0;
      hdr.FREIGHTRATE=0;
      hdr.IPOGENRATED='N';
      hdr.EXCISEID=0;
      hdr.AMENDMENTTYPE='Q';
      hdr.BRANCHID=this.boid;
      header.push(hdr);
      var rowno:number; 
        rowno=1;
      for(var el of this.orderDetail)
      {  
        var dtl:any={}
        dtl.ORDERREFID=':ORDERREFID';
        dtl.ITEMID=el.ITEMID;
        dtl.RATE=el.RATE;
        dtl.TAXID=0;
        dtl.ROWNO=rowno; // el.ROWNO;
        dtl.RSID=el.RSID;
        dtl.ORDERQTYPCS=el.ORDERQTYPCS;
        dtl.ORDERQTYKGS=el.ORDERQTYKGS;
        dtl.BALANCEQTYKGS=el.ORDERQTYKGS;
        dtl.BALANCEQTYPCS=el.ORDERQTYPCS;
        dtl.UOM=el.UOM;
        dtl.DISPATCHQTYKGS=0;
        dtl.DISPATCHQTYPCS=0;
        dtl.GRPCODE=el.GRPCODE;
        dtl.DELIVERYDATEREQUESTED= formatDate(el.DELIVERYDATEREQUESTED, 'dd-MMM-yyyy', 'en-US', '+0530'); 
        dtl.FRMREQD='N';
        dtl.EXCISEID=0;
        dtl.GSTID=el.GSTID;
        dtl.ROWSR=0;
        dtl.BRANCHID=this.boid;
        dtl.AMENDMENTNO=0;
        dtl.PCSDESPBYCURRUNIT=0;
        dtl.KGSDESPBYOTHERUNIT=0;
        dtl.KNOCKEDOFFKGS=0;
        dtl.KNOCKEDOFFPCS=0;
        dtl.STAMPINGRATE=el.STAMPINGRATE;
        dtl.RCWRATE=0;
        if(el.PROCESSCHRG==undefined||el.PROCESSCHRG=='' || el.PROCESSCHRG==null  )
        el.PROCESSCHRG=0;
        else
        dtl.PROCESSCHRG=el.PROCESSCHRG;
        dtl.ALLUMINIUMRATE=el.ALLUMINIUMRATE;
        rowno++;
        //console.log("detail",el);
        detail.push(dtl);
      }


      var retunrOrderNo:any;

      const  params = new  HttpParams()
    
      .set('orderid', "0")
      .set('token', this.token)
      .set('header', JSON.stringify(header))
      .set('detail', JSON.stringify(detail));
      
    this.http.post(this.original_url+"/SOP/SaleOrder/saveSaleOrder", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      retunrOrderNo=res;
      if (parseInt(retunrOrderNo)>0)
      {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'sucess',
                  displayMsg:'Order Updated'
                }
              });
              this.addNewOrder();
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
    });

     
    }
    

  }
  updateSaleOrder()
  {
    if(this.validatData())
    {
          var header:any=[], hdr:any={};
          var detail:any=[];
          hdr.CUSTOMERID=this.newData.CUSTOMERID;
          hdr.BILLCUSTOMERID=this.newData.BILLCUSTOMERID;
          hdr.BILLSERIESID=this.newData.BILLSERIESID;
          hdr.TRANSPORTMODEID=this.newData.TRANSPORTMODEID;
          hdr.AMENDMENTNO=this.newData.AMENDMENTNO;
          hdr.USERID=this.userid;
          hdr.MDATE=':EDATE';
          hdr.CUSTOMERPO=this.newData.CUSTOMERPO;
          hdr.TAXID=0;
          hdr.CANCELLED='N';
          hdr.CONFIRMEDBYMKT='N';
          hdr.CONFIRMEDBYPRODN='N';
          hdr.CONFIRMEDBYCEO='Y';
          hdr.CONFIRMEDBYTOOLROOM='Y';
          hdr.BUYER=0;
          hdr.FREIGHTRATE=0;
          hdr.IPOGENRATED='N';
          hdr.EXCISEID=0;
          hdr.AMENDMENTTYPE='Q';
          header.push(hdr);

      
          var rowno:number; 
          rowno=1;
          for(var el of this.orderDetail)
          {  
            var dtl:any={};
            dtl.ORDERREFID=':ORDERREFID';
            dtl.ITEMID=el.ITEMID;
            dtl.RATE=el.RATE;
            dtl.TAXID=0;
            dtl.ROWNO=rowno;//  el.ROWNO;
            dtl.RSID=el.RSID;
            dtl.ORDERQTYPCS=el.ORDERQTYPCS;
            dtl.ORDERQTYKGS=el.ORDERQTYKGS;
            dtl.BALANCEQTYKGS=el.ORDERQTYKGS;
            dtl.BALANCEQTYPCS=el.ORDERQTYPCS;
            dtl.UOM=el.UOM;
            dtl.DISPATCHQTYKGS=0;
            dtl.DISPATCHQTYPCS=0;
            dtl.GRPCODE=el.GRPCODE;
            dtl.DELIVERYDATEREQUESTED= formatDate(el.DELIVERYDATEREQUESTED, 'dd-MMM-yyyy', 'en-US', '+0530'); 
            dtl.FRMREQD='N';
            dtl.EXCISEID=0;
            dtl.GSTID=el.GSTID;
            dtl.ROWSR=0;
            dtl.BRANCHID=this.boid;
            dtl.AMENDMENTNO=0;
            dtl.PCSDESPBYCURRUNIT=0;
            dtl.KGSDESPBYOTHERUNIT=0;
            dtl.KNOCKEDOFFKGS=0;
            dtl.KNOCKEDOFFPCS=0;
            dtl.STAMPINGRATE=el.STAMPINGRATE;
           // dtl.PROCESSCHRG=el.PROCESSCHRG;
            dtl.ALLUMINIUMRATE=el.ALLUMINIUMRATE;
            dtl.RCWRATE=0;
            if(el.PROCESSCHRG==undefined||el.PROCESSCHRG=='' || el.PROCESSCHRG==null  )
            el.PROCESSCHRG=0;
            else
            dtl.PROCESSCHRG=el.PROCESSCHRG;
            
            rowno++;
            console.log("detail",el);
            detail.push(dtl);
          // detail.push(dtl);
          }
          var retunrOrderNo:any;
          console.log("detail",detail);

          const  params = new  HttpParams()
    
          .set('token', this.token)
          .set('orderid', this.newData.ORDERREFID)
          .set('header', JSON.stringify(header))
          .set('detail', JSON.stringify(detail));
          this.isLoadingResults=true;
        this.http.post(this.original_url+"/SOP/SaleOrder/saveSaleOrder", params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .subscribe((res) => {
          retunrOrderNo=res;
          if (parseInt(retunrOrderNo)>0)
          {
                  const dialogRef = this.dialog.open(SuccessDialogComponent, {
                    data: {
                      wrongData: 'sucess',
                      displayMsg:'Order Updated'
                    }
                  });
                  this.addNewOrder();
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
        });

    }
  }
  addNewOrder()
  {
    this.router.navigate(['/add-new-customer-order/0/new'], {skipLocationChange:true});
    this.newData={};
    this.orderDetail=[];
    this.routeID=0;
    this.routeAction='new';
    this.isEditable=false;
    this.isAddNew=true;
    this.productNameList=[];
    this.listLength();
    let todayDate  = new Date( this.curDate);
    this.newData.ORDERDATE= formatDate(todayDate, 'dd-MM-yyyy', 'en-US', '+0530');
    this.getLastOrderNo();
    //this.isAddNew=false;
    //this.ngAfterContentInit();
  }
  validatData()
  {
  var flag:boolean;
  flag=true;
  var mdate = new Date();
  var msg:any;
 
  msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';


  if(this.newData.CUSTOMERID==undefined||this.newData.CUSTOMERID==0||this.newData.CUSTOMERID=='' ||this.newData.CUSTOMERID==null)
  {flag=false; msg=msg+"<li>Customer not seletect.</li>";}
  if(this.newData.BILLCUSTOMERID==undefined||this.newData.BILLCUSTOMERID==0||this.newData.BILLCUSTOMERID=='' ||this.newData.BILLCUSTOMERID==null)
  {flag=false; msg=msg+"<li>Bill to Customer not seletect.</li>";}

  if(this.newData.BILLSERIESID==undefined||this.newData.BILLSERIESID==0||this.newData.BILLSERIESID=='' ||this.newData.BILLSERIESID==null)
  {flag=false; msg=msg+"<li>Bill type not seletect.</li>";}

  if(this.newData.TRANSPORTMODEID==undefined||this.newData.TRANSPORTMODEID==0||this.newData.TRANSPORTMODEID=='' ||this.newData.TRANSPORTMODEID==null)
  {flag=false; msg=msg+"<li>Transport mode not seletect.</li>";}

  if(this.newData.CUSTOMERPO==undefined||this.newData.CUSTOMERPO=='' ||this.newData.CUSTOMERPO==null)
  {flag=false; msg=msg+"<li>Customer PO not entred</li>";}
 
  if(this.orderDetail==undefined||this.orderDetail.length==0 )
  {flag=false; msg=msg+"<li>Nothing for save</li>";}
    
  for(var el of this.orderDetail)
  {
    console.log("valid row",el);
      if(el.RSID>0)
      {
        var dt=this.orderDetail.filter(x=>x.ITEMID==parseInt(el.RSID));
        console.log("valid row1",dt);
        if(dt.length==0)
        {
          flag=false; msg=msg+"<li>Pair not found for "+ el.ITEMCODE +" at Row No "+ el.ROWNO+ "</li>";
        }
      }  
  }
     msg=msg+"</ul>";
     if(flag==false)
     {
      console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     } //alert(msg);
   return flag;
}
printOrder()
{
    let data:any={};
    this.isLoadingResults=true;
     this.http.get(this.original_url+"/SOP/SaleOrder/printOrderDetail?orderno="+this.newData.ORDERREFNO+"&token="+this.token).subscribe((res)=>{
      this.itemDisplay=res;
      console.log("Mrir Load", res);
      this.itemDisplay=this.itemDisplay.Table;
      data.header=this.itemDisplay[0];
      this.itemDisplay=res;
      data.detail=this.itemDisplay.Table1;
      
      data.title="Customer Order";
      data.backto='/add-new-customer-order/'+this.routeID+'/'+this.routeAction;
       sessionStorage.setItem('order', JSON.stringify(data));
      this.router.navigate(['/print-customer-order'], {skipLocationChange:true});
      this.isLoadingResults=false;
     },
     error=>{
       this.isLoadingResults=false;
     });  
  }
}





@Component({
  selector: 'printSaleOrder',
  templateUrl: './printSaleOrder.html',
  styleUrls: ['./add-new-customer-order.component.css']
})
export class PrintSaleOrderComponent implements OnInit {
  orderHeader:any={};backto:any;
  OrderDetail:Array<any>=[];
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
  let indent = sessionStorage.getItem("order");
  var data = JSON.parse(indent);
  this.orderHeader=data['header'];
  this.OrderDetail=data['detail'];
  this.backto=data['backto'];
  //sessionStorage.removeItem('order');
  }

 ngOnInit() {

}
public print(): void 
{ 
  
  let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  virtualWindow.document.write('<html><head><title>Print</title>  '); 
  virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
  virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3; } div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}</style>');
  //font: 12pt Georgia, "Times New Roman", Times, serif;
  virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
  
  virtualWindow.document.close(); 
  virtualWindow.focus(); 
      // necessary for IE >= 10 
  setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
}
backToView()
{
   this.router.navigate([this.backto], {skipLocationChange:true});
}

}