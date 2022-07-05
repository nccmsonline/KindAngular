import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IndentEntryService } from '../indent-entry.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from '@angular/router';
declare var $: any;
declare var jQuery: any;
import {formatDate } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-new-indent-entry',
  templateUrl: './add-new-indent-entry.component.html',
  styleUrls: ['./add-new-indent-entry.component.css']
})
export class AddNewIndentEntryComponent implements OnInit {
  isLoadingResults=false;
  original_url=environment.baseUrl;
  fieldArray: Array<any> = [];
  newChangeData: any={};
  date = new FormControl(new Date());
  closeResult: string;
  newData: any={};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  indententry: FormGroup;
  allDataGet: any;
  departmentget:Array<any> = [];
  indentorget:Array<any> = [];
  costcentreget:Array<any> = [];
  subcostcentreget:Array<any> = [];
  brandlistget:Array<any> = [];
  itemuomget:Array<any> = [];
  itemlistget:Array<any> = [];
  action: string;
  myDate = new Date();
  itemCodeDesc="";
  itemNameDesc="";
  isLoadingItemCode=false;
  isLoadingItemName=false;
  // item
  newdataarray: Array<any> = [];
  items: Array<any> = [];
  newItem: any = {};
  editItemID: any={};
  Itemitemid : any;
  Itembrandid : any;
  Itemquantityrequired : any;
  Itemremarks : any;
  Itemrequiredby : any;
  Itemsuplid : any;

  userinfo: any;
  companyid:any;
  branchid: any;
  coid:any;
  boid:any;
  id: string;
  Itemcode:'';
  FYUSER:any;ServerIP:any;tmpDate=new Date();
  userid:any;token:any;WorkingDate:any;
  itemDisplay:any={};routeID:any;routeAction:any;isConfirmed:any;
  constructor( private router: Router,  private activatedRoute: ActivatedRoute,
            private fb: FormBuilder, public dialog: MatDialog,
            private http: HttpClient,
            private indentEntryService: IndentEntryService) 
  {
    this.createForm();
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.newData.INDENTDATE= new Date(CompanyData['WORKINGDATE']);
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
    this.tmpDate= new Date(CompanyData['WORKINGDATE']);
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    
    this.tmpDate.setDate(this.tmpDate.getDate()+3);
    this.newItem.EXPECTEDDATE=this.tmpDate;
  }
 ngOnInit() {
  this.isLoadingResults=true;
      this.http.get(this.original_url+"/indentandpo/indent/onIndentLoad?token="+this.token+"&indentid="+this.routeID).subscribe((res)=>{
      console.log("res",res);
      this.itemDisplay=res;
      this.departmentget=this.itemDisplay.Table;
      this.costcentreget=this.itemDisplay.Table1;
      this.brandlistget=this.itemDisplay.Table2;
      this.itemDisplay=this.itemDisplay.Table3[0];
      this.newData.INDENTNO=this.itemDisplay.INDENTNO;
      debugger;
      if(this.routeAction == "edit")
      {
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table4[0];
        this.newData.INDENTID=this.routeID;
        this.newData.INDENTNO=this.itemDisplay.INDENTNO;
        this.newData.INDENTDATE=this.itemDisplay.INDENTDATE;
        if(this.itemDisplay.ISJOBWORK=="Y")
        {
          this.newData.ISJOBWORK=1;
          this.newData.JOBWORK='Yes';
        }
        else
        {
          this.newData.ISJOBWORK=0;
          this.newData.JOBWORK='No';
        }
        this.newData.ACTUALSLIPNO=this.itemDisplay.ACTUALSLIPNO;
        this.newData.ISCONFIRM=this.itemDisplay.ISCONFIRM;
        this.newData.DEPTID=this.itemDisplay.DEPTID;
        this.newData.COSTCENTERID=this.itemDisplay.COSTCENTERID;
        this.newData.DEPTNAME=this.itemDisplay.DEPTNAME;
        this.newData.COSTCENTRE=this.itemDisplay.COSTCENTRE;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table4;
        this.items=[];
        let i=0;
        this.itemDisplay.forEach((el)=>{
          let tmp:any={};
          tmp.id=i++;
          tmp.SR=i;
          tmp.INDENTID=el.INDENTID;
          tmp.ITEMID=el.ITEMID;
          tmp.ITEMCODE=el.ITEMCODE;
          tmp.ITEMNAME=el.ITEMNAME;
          tmp.QUANTITY=el.QUANTITY;
          tmp.UOM=el.UOM;
          tmp.ITEMSBRANDID=el.ITEMSBRANDID;
          tmp.ITEMSBRAND=el.ITEMSBRAND;
          tmp.REMARKS=el.REMARKS;
          tmp.ISEMERGENCY=el.ISEMERGENCY;
          tmp.STOCKINHAND=el.STOCKINHAND;
          if(el.ISEMERGENCY=="Y")
          {
            this.newData.ISEMERGENCY=1;
          }
          else
          {
            this.newData.ISEMERGENCY=0;
          }
          tmp.EXPECTEDDATE=el.EXPECTEDDATE;
          tmp.LASTPURCHASEQTY=el.LASTPURCHASEQTY;
          tmp.LASTPURCHASERATE=el.LASTPURCHASERATE;
          tmp.LASTPURCHASEDATE=el.LASTPURCHASEDATE;
          this.items.push(tmp);
        });
        
      }
      this.isLoadingResults=false;
   });
 }
 printIndnet()
 {
   let data:any={};
   data.header=this.newData;
   data.detail=this.items;
  
   data.backto='/add-new-indent-entry/'+this.routeID+'/edit';
  sessionStorage.setItem('indent', JSON.stringify(data));
  this.router.navigate(['/print-indent'], {skipLocationChange:true});
 }
 brandChange(id, data)
 {
  if(id)
  {
    data.ITEMSBRAND=this.brandlistget.find(x=>x.ITEMSBRANDID==id).ITEMSBRAND;
  }
 }

  createForm() {
    this.indententry = this.fb.group({
      // indentnumber : ['', Validators.required ],
    //  INDENTDATE : {disabled: true, value: ''},
      DEPTID : ['',Validators.required],
      COSTCENTERID: ['',Validators.required]
    });
  }

  // Contact Start
  additem(event){
    if(this.validateDetail(this.newItem))
    {
      this.items.push(this.newItem);
      this.items.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newItem = {};
      this.newItem.EXPECTEDDATE=this.tmpDate;
    }
  }
  removeItem(index){
    this.items.splice(index,1);
  }
  editItem(val){
    this.editItemID = val;
  }
  updateItem(val){
    console.log("test");
    this.editItemID = {};
  }
  // Conatct End
  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    console.log("dataravi",this.newItem);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.newItem.ITEMCODE==undefined||this.newItem.ITEMCODE=='')
    {flag=false; msg=msg+"<li>Item code not entred</li>"}
    if(this.newItem.ITEMNAME==undefined||this.newItem.ITEMNAME=='')
    {flag=false; msg=msg+"<li>Item Name not entred</li>"}
    if(this.newItem.QUANTITY==undefined||this.newItem.QUANTITY=='' ||this.newData.QUANTITY==0)
    {flag=false; msg=msg+"<li>Batch size not entred.</li>"}
    if(this.newItem.ITEMSBRAND==undefined||this.newItem.ITEMSBRAND=='')
    {flag=false; msg=msg+"<li>Item Brand not entred</li>"}
    if(data.EXPECTEDDATE==undefined||data.EXPECTEDDATE==''|| data.EXPECTEDDATE<mdate)
    {flag=false; msg=msg+"<li>Delivery date not selected or before current date.</li>";}
    msg=msg+"</ul>";
       if(flag==false)
       {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
         data: {
           wrongData: 'validation',
           displayMsg:msg
         }
       });
       }
     return flag;
  }
  validateAll(data, mode)
  {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    console.log("dataravi",this.newData);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.items.length==undefined||this.items.length<=0)
    {flag=false; msg=msg+"<li>Nothig to save</li>"}
    
    msg=msg+"</ul>";

       if(flag==false)
       {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
         data: {
           wrongData: 'validation',
           displayMsg:msg
         }
       });
       }
       else{
        this.saveindent(data, mode);
       }
    
  }
  searchItemCode(search, data)
  {
      var str:string;
      str=search;
      this.itemCodeDesc = search;
      if(this.itemCodeDesc !== '')
      {
        data.ITEMNAME='';  
        data.ITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingItemCode=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=itemcode&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.itemlistget = this.allDataGet;
            this.isLoadingItemCode=false;
          });
        }
      }
      else
      {
        this.itemlistget = [];
        this.itemCodeDesc = '';
        data.ITEMCODE='';
        data.ITEMNAME='';  
        data.UOM='';  
        data.ITEMID=0;
      }
  }
  onChangeOfItemCode(row, data)
  {
       data.ITEMCODE=row.ITEMCODE;
       data.ITEMNAME=row.ITEMNAME;  
       data.UOM=row.RECTUOM;
       data.ITEMID=row.ITEMID;
       data.STOCKINHAND=row.STOCKINHAND;
       this.itemCodeDesc='';
  }
  searchItemName(search, data)
  {
      var str:string;
      str=search;
      this.itemNameDesc = search;
      if(this.itemNameDesc !== '')
      {
        data.ITEMCODE='';  
        data.ITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingItemName=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=ItemName&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.itemlistget = this.allDataGet;
            this.isLoadingItemName=false;
          });
        }
      }
      else
      {
        this.itemlistget = [];
        this.itemNameDesc = '';
        data.ITEMCODE='';
        data.ITEMNAME='';  
        data.UOM='';  
        data.ITEMID=0;
      }
  }
  onChangeOfItemName(row, data)
  {
       data.ITEMCODE=row.ITEMCODE;
       data.ITEMNAME=row.ITEMNAME;  
       data.ITEMID=row.ITEMID;
       data.UOM=row.RECTUOM;
       data.STOCKINHAND=row.STOCKINHAND;
       this.itemNameDesc='';
  }
  saveindent(data, mode)
  {
    let tmpData:any={};
    let mindentid=0;
    let indentarray: Array<any> = [];
    let header: Array<any> = [];
    let detail: Array<any> = [];
  debugger;
    if(mode=='Insert')
    {
      tmpData.INDENTNO = ':A';
      tmpData.INDENTDATE = ':B';
      tmpData.INDENTID  = ':C';
      tmpData.EDATE = ':D';
      tmpData.INDENTORID=this.userid;
    }
    else
    {
       tmpData.MDATE = ':A';
       mindentid=data.INDENTID;
    }
  
    tmpData.BRANCHID = this.boid;
    tmpData.USERID = this.userid;
    tmpData.DEPTID  = data.DEPTID;
    tmpData.COSTCENTERID = data.COSTCENTERID;
    tmpData.ACTUALSLIPNO = data.ACTUALSLIPNO;
    if(data.ISJOBWORK ==1)
    {
      tmpData.ISJOBWORK="Y";
    }
    else
    {
      tmpData.ISJOBWORK="N";
    }
    
    
    tmpData.SUBCOSTCENTREID = 0;
    tmpData.REFERENCENO=0;
    tmpData.COMPANYID=1;
    tmpData.STATUS="P";
    header.push(tmpData);

    this.items.forEach((el)=>{
      let tmp:any={};
      tmp.INDENTID=":A";

      if(mode=='Insert')
      {
      tmp.EDATE=formatDate(this.WorkingDate, 'dd-MMM-yyyy', 'en-US', '+0530'); 
      }
      else
      {
        tmp.MDATE=formatDate(this.WorkingDate, 'dd-MMM-yyyy', 'en-US', '+0530'); 
      }
      
      tmp.ITEMID=el.ITEMID;
      tmp.EXPECTEDDATE=formatDate(el.EXPECTEDDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 

      tmp.COMPANYID=1;
      tmp.USERID=this.userid;
      tmp.BRANCHID=this.boid;
    
      tmp.STOCKINHANDQTY=el.STOCKINHAND;
      tmp.QUANTITY=el.QUANTITY;
      tmp.PACKSIZE=1;
      tmp.BRANDID=el.ITEMSBRANDID;
      tmp.REMARKS=el.REMARKS;
      tmp.TOOLDEVELOPORDERID=0;
 
      detail.push(tmp);
    })
    
   let indentno:any;

    const  params = new  HttpParams()
  
    .set('indentid', mindentid.toString())
    .set('token', this.token)
    .set('header', JSON.stringify(header))
    .set('detail', JSON.stringify(detail));
    this.isLoadingResults=true;
  this.http.post(this.original_url+"/indentandpo/Indent/saveIndent", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    indentno=res;
    if (parseInt(indentno)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:'Data Saved'
              }
            });
           this.newData={};
           this.items=[];
           this.router.navigate(['/indent-entry'], {skipLocationChange:true});
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

//   public doSelect = (value: any) =>{ this.countryID=value;  console.log('hello', this.countryID);
//   this.countryChange();};
//    public doSelect1 = (value: any) => { this.StateId=value;  console.log('hello', this.StateId);
//   this.stateChange();};
//   public doSelect2 = (value: any) =>    {
//  };
//  public doSelect3 = (value: any) => {console.log('value', value);   this.zoneID=value;
//  this.zoneChange();
// };
// public doSelect4 = (value: any) => {console.log('value', value);   this.regionID=value;
// this.regionChange();
// };
// public doSelect5 = (value: any) => {console.log('value', value);   
// }

//  public doRemove = (value: any) => console.log('SingleDemoComponent.doRemove', value);

//  public doSelectOptions = (options: INgxSelectOption[]) => {console.log('SingleDemoComponent.doSelectOptions', options); 
//  };

onChange(id) {
    console.log("id", id);
  this.http.get(this.original_url+"/MaterialManagement/Indents/getitemlist?coid="+this.coid+"&boid="+this.boid)
      .subscribe((res) => {
        
        this.newChangeData = res;
        console.log("test",res);
        this.newChangeData = this.newChangeData.Table;
        
        this.newChangeData = this.newChangeData[0];
        if(this.newChangeData !== undefined)
        {
        this.Itemcode = this.newChangeData.itemcode;
        }
        
        console.log("changedata",this.newChangeData);
        
      });
}

}


@Component({
  selector: 'printindent',
  templateUrl: './printindent.html',
  styleUrls: ['./add-new-indent-entry.component.css']
})
export class PrintIndentComponent implements OnInit {
  newData:any={};backto:any;
  DetailData:Array<any>=[];repeatHeaders=true;
  companyName:any;Address1:any;Address2:any;
 constructor(private router: Router ) {
  let indent = sessionStorage.getItem("indent");
  var data = JSON.parse(indent);

  let currentBranch = sessionStorage.getItem("currentBranch");
  var CompanyData = JSON.parse(currentBranch);
  this.companyName=CompanyData['COMPANYNAME'];
  this.Address1=CompanyData['ADDRESS'];
  this.Address2 = CompanyData['ADDRESS1'];

  this.newData=data['header'];
  this.DetailData=data['detail'];
  this.backto=data['backto'];
  sessionStorage.removeItem('indent');
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
  // let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  // virtualWindow.document.write('<html><head><title>Print</title>  '); 
  // virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
  // virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
  // virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
  // virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
  // virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3; } footer {position: fixed;bottom: 30px;} div.header { display: block; text-align: center; position: running(header); width: 100%; } div.footer { display: block; text-align: center; position: running(footer); width: 100%; } @page { /* switch to landscape */  size: landscape;  /* set page margins */ margin: 0.5cm; @top-center { content: element(header); } @bottom-center { content: element(footer); } @bottom-right { content: counter(page) " of " counter(pages); } } .custom-page-start { margin-top: 50px; } thead {display: table-header-group;}</style>');
  // virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
  // virtualWindow.document.close(); 
  // virtualWindow.focus(); 
  // setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  virtualWindow.document.write('<html><head><title>Print</title>  '); 
  virtualWindow.document.write('<link rel="stylesheet" href="http://kind.org.in/assets/libs/bootstrap/dist/css/bootstrap.min.css">  '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style.min.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/styles.css" rel="stylesheet"> '); 
  virtualWindow.document.write('<link href="http://kind.org.in/assets/dist/css/style-custom.css" rel="stylesheet">'); 
  virtualWindow.document.write('<style type="text/css"> body {  line-height: 1.3;-webkit-print-color-adjust: exact !important; }  footer {position: fixed;bottom: 30px;}   @page {margin: 0.5cm;  size: landscape;} ');
  virtualWindow.document.write('</style>');
  virtualWindow.document.write('</head><body>' + document.getElementById('ravinderpal').innerHTML + '</body></html>'); 
  virtualWindow.document.close(); 
  virtualWindow.focus(); 
  setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   

  
  

   }
backToView()
{
   this.router.navigate([this.backto], {skipLocationChange:true});
}

}