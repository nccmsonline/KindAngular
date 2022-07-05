import { Component, OnInit, Inject, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-new-gstvoucher',
  templateUrl: './add-new-gstvoucher.component.html',
  styleUrls: ['./add-new-gstvoucher.component.css']
})
export class AddNewGSTVoucherComponent implements OnInit {
  filterPipe =new GrdFilterPipe;
  original_url=environment.baseUrl;
  newData:any={};
  token:any;
  routeID:any;
  routeAction:any;
  isLoadingResults:any;
  isStatefiltered:any;
  isCityfiltered:any;
  detail:any={};
  gstDetail:Array<any>=[];
  gstList:Array<any>=[];
  accountList:Array<any>=[];
  nameList:Array<any>=[];
  statteList:Array<any>=[];
  cityList:Array<any>=[];
  datePipe = new DatePipe("en-US");
  gstFilteredList:Array<any>=[];
  tdsAcFilteredList:Array<any>=[];
  accountFilteredList:Array<any>=[];
  nameFilteredList:Array<any>=[];
  stateFilteredList:Array<any>=[];
  cityFilteredList:Array<any>=[];
 
  isLoadingGST=false;
  allDataGet:any={};
  searchHsn="";
  searchTDSAct="";
  searchAct="";
  searchName="";
  searchCity="";
  searchState="";
  searcheditHsn="";
  searchEditAct="";
  compaanyStateId:0;
  editItemID:any={};
  VOUCHERDATE:any;
  VOUCHERNO:any;
  WorkingDate=new Date();;
  FinancialYearSDate=new Date();;
  constructor(private router: Router,private http: HttpClient,private activatedRoute: ActivatedRoute, public dialog: MatDialog) { 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
  
   
    let currentBranch = sessionStorage.getItem("currentBranch");
    currentBranch = JSON.parse(currentBranch);
    this.compaanyStateId = currentBranch['COMPANYSTATEID'];

     this.FinancialYearSDate= new Date(currentBranch['FINANCIALYEARSTARTDATE']);
     this.WorkingDate= new Date(currentBranch['WORKINGDATE']);
     console.log("WorkingDate",this.WorkingDate);
     console.log("FinancialYearSDate",this.FinancialYearSDate);

    this.routeID = parseInt( this.activatedRoute.snapshot.paramMap.get('id'));
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.isCityfiltered="";
    this.isStatefiltered="";
    debugger;
    if(this.routeAction=='new')
    {
     
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/Accounts/Accounts/directGSTVoucherLoad?token="+this.token)
      .subscribe((response) => {
        this.allDataGet = response;
        this.accountList = this.allDataGet.Table;
        this.allDataGet = response;
        this.gstList = this.allDataGet.Table1;
        this.nameList= this.allDataGet.Table2;
        this.statteList= this.allDataGet.Table4;
        this.cityList= this.allDataGet.Table3;
        let temp:any={};
        temp= this.allDataGet.Table5[0];
        this.newData.VOUCHERDATE= new Date(temp.WORKINGDATE);
        this.newData.VOUCHERNO= temp.VOUCHERNO;
        this.isLoadingResults=false;
      }); 
    }
    else
    {
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/Accounts/Accounts/directGSTVoucherLoad?token="+this.token+"&voucherno="+this.routeID)
      .subscribe((response) => {
        this.allDataGet = response;
        this.accountList = this.allDataGet.Table;
        this.allDataGet = response;
        this.gstList = this.allDataGet.Table1;
        this.nameList= this.allDataGet.Table2;
        this.statteList= this.allDataGet.Table4;
        this.cityList= this.allDataGet.Table3;
        let temp:any={};
        temp= this.allDataGet.Table5[0];
        this.newData=temp;
        this.gstDetail=this.allDataGet.Table6;
        this.isLoadingResults=false;
      }); 
    }
  }
  onReverseChargeCheck(event)
  {
    this.calculateSummary();
  }
  ngOnInit() {
  }
  // filterCityList(id, data)
  // {

  // }
  // filterStateList(id, data)
  // {

  // }
  searchHsnCode(search, data, mode)
  {
      var str:string;
      if(this.newData.NAME==undefined ||this.newData.NAME=='' )
      {
        this.showWorning('Plaese select Party before entring detail');
        data.TARIFFHEAD='';
        return;
      }
      str=search;
      if(mode=="A")
      {this.searchHsn = search;}
      else
      {this.searcheditHsn = search;}
      if(search !== '')
      {
        data.GSTID=0;
        console.log("this.str",this.gstList);
        this.gstFilteredList=this.filterPipe.transform(this.gstList,search, 'TARIFFHEAD');  
        //this.gstFilteredList=this.gstList.filter(x=>x.TARIFFHEAD.includes(search));
      }
      else
      {
        this.gstFilteredList = [];
        this.searchHsn = '';
        this.searcheditHsn = '';
        data.TARIFFHEAD='';
        data.GSTID=0;
      }
  }
  onChangeOfGST(row, data)
  {
       data.TARIFFHEAD=row.TARIFFHEAD;
       data.GSTID=row.GSTID;  
       if(this.newData.STATEID==this.compaanyStateId)
       {
        data.SGSTRATE=row.SGST;
        data.CGSTRATE=row.CGST;
        data.IGSTRATE=0;
       }
       else
       {
        data.IGSTRATE=row.IGST;
        data.SGSTRATE=0;
        data.CGSTRATE=0;
       }
       this.searchHsn='';
       this.searcheditHsn = '';
       if(data.AMOUNT>0)
       {
         this.calculateAmt(data);
       }
  }
  searchTDSAccount(search, data)
  {
      this.searchTDSAct = search;
      if(this.searchTDSAct !== '')
      {
        data.TDSACCOUNTID=0;
        this.tdsAcFilteredList=this.filterPipe.transform(this.accountList,search, 'ACCOUNTHEAD');  
        
      }
      else
      {
        this.tdsAcFilteredList = [];
        this.searchTDSAct = '';
        data.TDSACCOUNT='';
        data.TDSACCOUNTID=0;
      }
  }
  onChangeOfTDSAccount(row, data)
  {
       data.TDSACCOUNT=row.ACCOUNTHEAD;
       data.TDSACCOUNTID=row.ACCOUNTID;  
       this.searchTDSAct='';
  }
  searchAccount(search, data, mode)
  {
     
      if(mode=="A")
      {this.searchAct = search;}
      else
      {this.searchEditAct = search;}
      if(search !== '')
      {
        data.ACCOUNTID=0;
        this.accountFilteredList=this.filterPipe.transform(this.accountList,search, 'ACCOUNTHEAD');  
      }
      else
      {
        this.accountFilteredList = [];
        this.searchAct = '';
        this.searchEditAct ='';
        data.ACCOUNTHEAD='';
        data.ACCOUNTID=0;
      }
  }
  onChangeOfAccount(row, data)
  {
       data.ACCOUNTHEAD=row.ACCOUNTHEAD;
       data.PURACID=row.ACCOUNTID;  
       this.searchAct='';
       this.searchEditAct ='';
  }

  searchOnName(search, data)
  {
      var str:string;
      str=search;
      this.searchName = search;
      if(this.searchName !== '')
      {
        data.ACCOUNTID=0;
        console.log("this.str",this.gstList);
        this.nameFilteredList=this.filterPipe.transform(this.nameList,search, 'NAME');  
        //this.gstFilteredList=this.gstList.filter(x=>x.TARIFFHEAD.includes(search));
      }
      else
      {
        this.nameFilteredList = [];
        this.searchName = '';
        data.NAME='';
        data.ACCOUNTID=0;
      }
  }
  onChangeOfName(row, data)
  {
       data.NAME=row.NAME;
       data.ADDRESS=row.ADDRESS;
       data.CITYDESC=row.CITYDESC;  
       data.STATEDESC=row.STATEDESC;
       data.GSTIN=row.GSTIN;
       data.CGSTRATE=row.CGST;
       data.EMAIL=row.EMAIL;
       data.PANNO=row.PANNO;
       data.PHONE=row.PHONE;
       data.STATEID=row.STATEID;
       data.CITYID=row.CITYID;
       data.ACCOUNTID=row.ACCOUNTID;
       this.searchName='';
  }
  
  filterCityList(search, data)
  {
      this.searchCity = search;
      if(this.searchCity !== '')
      {
        data.CITYID=0;
        this.cityFilteredList=this.filterPipe.transform(this.cityList,search, 'CITYDESC');  
        
      }
      else
      {
        this.cityFilteredList = [];
        this.searchCity = '';
        data.CITYDESC='';
        data.CITYID=0;
      }
  }
  onChangeOfCity(row, data)
  {
       data.CITYDESC=row.CITYDESC;
       data.CITYID=row.CITYID;  
       this.searchCity='';
  }
  filterStateList(search, data)
  {
      this.searchState = search;
      if(this.searchState !== '')
      {
        data.STATEID=0;
        this.stateFilteredList=this.filterPipe.transform(this.statteList,search, 'STATEDESC');  
        
      }
      else
      {
        this.stateFilteredList = [];
        this.searchState = '';
        data.STATEDESC='';
        data.STATEID=0;
      }
  }
  onChangeOfState(row, data)
  {
       data.STATEDESC=row.STATEDESC;
       data.STATEID=row.STATEID;  
       this.searchState='';
  }
  additem(event){
    if(this.validateDetail(this.detail))
    {
      this.gstDetail.push(this.detail);
      this.gstDetail.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.detail = {};
      this.calculateSummary();
    }
  }
  removeItem(index){
    this.gstDetail.splice(index,1);
    this.calculateSummary();
  }
  editItem(val){
    this.editItemID = val;
  }
  updateItem(val){
    console.log("test");
    this.editItemID = {};
    this.calculateSummary();
   
  }
  calPercentage()
  {
    let billAmt=0,tdsPercent=0;
    if(this.newData.BILLAMT!=undefined&&this.newData.BILLAMT!='')
    {
      billAmt=this.newData.BILLAMT;
    }
    if(this.newData.BILLAMT!=undefined&&this.newData.BILLAMT!='')
    {
      tdsPercent=this.newData.TDSPERCENT;
    }
    let tdsAmt=billAmt*tdsPercent/100;
    this.newData.TDSAMT=tdsAmt.toFixed(0);
  }
  // Conatct End
  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    console.log("dataravi",this.detail);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.detail.GSTID==undefined||this.detail.GSTID=='')
    {flag=false; msg=msg+"<li>HSN code not entred</li>"}
    if(this.detail.AMOUNT==undefined||this.detail.AMOUNT==''||this.detail.AMOUNT==0)
    {flag=false; msg=msg+"<li>Amount not entred</li>"}
    if(this.detail.TAXABLEVALUE==undefined||this.detail.TAXABLEVALUE=='' ||this.detail.TAXABLEVALUE==0)
    {flag=false; msg=msg+"<li>Taxable amount not entred.</li>"}
    if(this.detail.DESCRIPTION==undefined||this.detail.DESCRIPTION=='')
    {flag=false; msg=msg+"<li>Description not entred</li>"}
    if(this.detail.ACCOUNTHEAD==undefined||this.detail.ACCOUNTHEAD=='')
    {flag=false; msg=msg+"<li>Booking Account head not selected</li>"}
    msg=msg+"</ul>";
       if(flag==false)
       {
        this.showWorning(msg)
       }
     return flag;
  }
  amountChnage(data)
  {
    console.log("detail data",data);
    var mDISCAMT=0, mAmount=0;
    if(data.DISCAMT!=undefined&&data.DISCAMT!='')
    {
      mDISCAMT=data.DISCAMT;
    }
    if(data.AMOUNT!=undefined&&data.AMOUNT!='')
    {
      mAmount=data.AMOUNT;
    }
    if(mDISCAMT>=mAmount && mAmount>0)
    {
      this.showWorning("Discount amount should not be equal or more then amount.");
      return;
    }
    let taxableAmt=mAmount-mDISCAMT;
    data.TAXABLEVALUE=taxableAmt.toFixed(2);
    this.calculateAmt(data);
  }
  calculateAmt(data)
  {
    data.IGSTAMT=(data.TAXABLEVALUE* data.IGSTRATE/100).toFixed(2);
    data.CGSTAMT=(data.TAXABLEVALUE* data.CGSTRATE/100).toFixed(2);
    data.SGSTAMT=(data.TAXABLEVALUE* data.SGSTRATE/100).toFixed(2);
    let netAmt=parseFloat( data.TAXABLEVALUE)+parseFloat( data.IGSTAMT)+parseFloat( data.CGSTAMT)+parseFloat( data.SGSTAMT);
    data.NETAMT=netAmt;
  }
  calculateSummary()
  {
    this.newData.IGSTAMT=0;
    this.newData.SGSTAMT=0;
    this.newData.CGSTAMT=0;
    this.newData.AMOUNT=0;
    this.newData.TAXABLEVALUE=0;
    this.newData.DISCAMT=0;
    this.gstDetail.forEach((el)=>{
      this.newData.IGSTAMT=this.newData.IGSTAMT+parseFloat( el.IGSTAMT).toFixed(2);
      this.newData.SGSTAMT=this.newData.SGSTAMT +parseFloat( el.SGSTAMT).toFixed(2);
      this.newData.CGSTAMT=this.newData.CGSTAMT +parseFloat( el.CGSTAMT).toFixed(2);
      if(el.DISCAMT!=undefined&&el.DISCAMT!='')
      {  this.newData.DISCAMT=this.newData.DISCAMT+parseFloat( el.DISCAMT).toFixed(2);}
      else
      {
        this.newData.DISCAMT=0;
      }
      this.newData.TAXABLEVALUE=this.newData.TAXABLEVALUE+parseFloat( el.TAXABLEVALUE).toFixed(2);
      this.newData.AMOUNT=parseFloat( this.newData.AMOUNT)+parseFloat( el.TAXABLEVALUE)+parseFloat( this.newData.IGSTAMT)+parseFloat( this.newData.SGSTAMT)+parseFloat( this.newData.CGSTAMT);
    });
    if(this.newData.ISREVERSECHARGE1==1)
    {
      let revamt= parseFloat(this.newData.IGSTAMT)+ parseFloat(this.newData.SGSTAMT)+ parseFloat(this.newData.CGSTAMT);
      this.newData.REVERSEAMT=revamt.toFixed(2);
    }
    else
    {
      this.newData.REVERSEAMT=0;
    }
    let netAmt= parseFloat(this.newData.BILLAMT)+parseFloat(this.newData.REVERSEAMT)- parseFloat(this.newData.AMOUNT);
     this.newData.ROUNDOFF=netAmt.toFixed(2);
  }
  showWorning(msg)
  {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'validation',
        displayMsg:msg
      }
    });
  }


  validateData()
  {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    console.log("dataravi",this.detail);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.newData.ACCOUNTID==undefined||this.newData.ACCOUNTID=='')
    {flag=false; msg=msg+"<li>Party not selected</li>"}
    if(this.newData.STATEID==undefined||this.newData.STATEID=='')
    {flag=false; msg=msg+"<li>Party State not selected</li>"}
    if(this.newData.CITYID==undefined||this.newData.CITYID=='')
    {flag=false; msg=msg+"<li>Party City not selected</li>"}
    if(this.newData.BILLNO==undefined||this.newData.BILLNO=='')
    {flag=false; msg=msg+"<li>Bill no not entred</li>"}
    if(this.newData.BILLDATE==undefined||this.newData.BILLDATE=='')
    {flag=false; msg=msg+"<li>Bill Date not entred</li>"}
    if(this.newData.BILLAMT==undefined||this.newData.BILLAMT==''||this.newData.BILLAMT==0)
    {flag=false; msg=msg+"<li>Bill Amount not entred</li>"}
    if(this.newData.TDSPERCENT>0 && (this.newData.TDSACCOUNTID==undefined ||this.newData.TDSACCOUNTID=='' ||this.newData.TDSACCOUNTID==0))
    {flag=false; msg=msg+"<li>TDS posting Account not selected.</li>"}
    if(this.newData.RMK==undefined||this.newData.RMK=='')
    {flag=false; msg=msg+"<li>Voucher Description not entred</li>"}
    if( Math.abs( this.newData.ROUNDOFF)>1  )
    {flag=false; msg=msg+"<li>Round of amount can't be more than 1 Rupees</li>"}
    if( this.gstDetail.length<=0  )
    {flag=false; msg=msg+"<li>No Detail found to Save</li>"}

    msg=msg+"</ul>";
       if(flag==false)
       {
        this.showWorning(msg)
       }
       
     return flag;
  }
  savedata(mode)
  {
    if(!this.validateData())
    {
      return;
    }
    let voucherno=0;
    var header:Array<any>=[];
    var detail:Array<any>=[];
    var tmp:any={};
    if(mode=='Insert')
    {
      tmp.VOUCHERNO=":A";
     
      tmp.BRANCHID=":B";
    }
    else
    {
      voucherno=this.routeID;
    }
    tmp.VOUCHERDATE=this.datePipe.transform(this.newData.VOUCHERDATE, 'dd/MMM/yyyy');
    tmp.ACCOUNTID=this.newData.ACCOUNTID;
    tmp.BILLNO=this.newData.BILLNO;
    tmp.BILLDATE=this.datePipe.transform(this.newData.BILLDATE, 'dd/MMM/yyyy');
    tmp.AMOUNT=this.newData.AMOUNT;
    tmp.BILLAMT=this.newData.BILLAMT;
    tmp.RMK=this.newData.RMK;
    tmp.TDSPERCENT=this.newData.TDSPERCENT;
    tmp.TDSAMT=this.newData.TDSAMT;
    tmp.TDSACCOUNTID=this.newData.TDSACCOUNTID;
    tmp.REVERSEAMT=this.newData.REVERSEAMT;
    tmp.DISCAMT=this.newData.DISCAMT;
    tmp.TAXABLEVALUE=this.newData.TAXABLEVALUE;
    tmp.IGSTAMT=this.newData.IGSTAMT;
    tmp.CGSTAMT=this.newData.CGSTAMT;
    tmp.SGSTAMT=this.newData.SGSTAMT;
    if(this.newData.ISREVERSECHARGE1==1)
    {tmp.isreversecharge='Y';}
    else
    {tmp.isreversecharge='N';}
    tmp.ROUNDOFF=this.newData.ROUNDOFF;
    header.push(tmp);
    this.gstDetail.forEach((el)=>{
      let tmpd:any={};
      tmpd.VOUCHERNO=':A';
      tmpd.BRANCHID=':B';
      tmpd.GSTID=el.GSTID;
      tmpd.HSN=el.HSN;
      tmpd.DESCRIPTION=el.DESCRIPTION;
      tmpd.AMOUNT=el.AMOUNT;
      tmpd.DISCAMT=el.DISCAMT;
      tmpd.TAXABLEVALUE=el.TAXABLEVALUE;
      tmpd.IGSTRATE=el.IGSTRATE;
      tmpd.IGSTAMT=el.IGSTAMT;
      tmpd.CGSTRATE=el.CGSTRATE;
      tmpd.CGSTAMT=el.CGSTAMT;
      tmpd.SGSTRATE=el.SGSTRATE;
      tmpd.SGSTAMT=el.SGSTAMT;
      tmpd.NETAMT=el.NETAMT;
      tmpd.PURACID=el.PURACID;
      detail.push(tmpd);
    }); 
    

    const  params = new  HttpParams()
    .set('voucherno', voucherno.toString())
    .set('token', this.token)
    .set('header', JSON.stringify(header))
    .set('detail', JSON.stringify(detail))
    .set('pDate', this.datePipe.transform(this.newData.VOUCHERDATE, 'dd/MMM/yyyy'));
    this.isLoadingResults=true;
  this.http.post(this.original_url+"/Accounts/Accounts/SaveServiceVoucher", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    let voucherno1:any;
    voucherno1=res;
    if (parseInt(voucherno1)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:'Data Saved'
              }
            });
           this.newData={};
           this.gstDetail=[];
           this.router.navigate(['/gst-voucher'], {skipLocationChange:true});
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
  printVoucher()
  {
    this.router.navigate(['/print-voucher/'+this.newData.VOUCHERNO1+'/JE'], {skipLocationChange:true});
  }
}

export class GrdFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchOn: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    // console.log("items", items);
    // console.log("searchText", searchText);
    // console.log("searchOn", searchOn);
    searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it[searchOn].toLowerCase().includes(searchText);
        });
   } 
}