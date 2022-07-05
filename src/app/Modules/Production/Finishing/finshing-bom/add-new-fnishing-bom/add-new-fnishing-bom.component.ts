import { Component, OnInit, Inject, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SuccessDialogComponent } from '../../../../../Dialog/success-dialog/success-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../../environments/environment';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-new-fnishing-bom',
  templateUrl: './add-new-fnishing-bom.component.html',
  styleUrls: ['./add-new-fnishing-bom.component.css']
})
export class AddNewFnishingBOMComponent implements OnInit {
  filterPipe =new GrdFilterPipe;
  isSupplierfiltered='';
  isGradefiltered='';
  original_url=environment.baseUrl;
  filteredSuppliers: Array<any>=[] ;
  filteredGrade: Array<any>=[] ;
  productListget:Array<any>=[];
  cleateItemList:Array<any>=[];
  rivieItemList:Array<any>=[];
  steelWireItemList:Array<any>=[];
  isLoadingProductList=false;
  routeID:any;
  routeAction:any;
  rivetItemDesc="";cleateItemDesc="";steelWireItemDesc="";
  arrayItemProductDesc="";itemlistget:Array<any>=[];allDataGet:any;supplierList:Array<any>=[];
  isAddNew:any;allData:any={};EmpNo:any;myDate = new Date();;metalGradList:Array<any>=[];
  isEditable:any;isLoadingResults:any;gatePassForm:any=[];userid:any;token:any;
  newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  constructor(private http: HttpClient, public dialog: MatDialog,private router: Router,  private activatedRoute: ActivatedRoute) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.myDate= new Date(CompanyData['WORKINGDATE']);
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');

    this.isAddNew=true;
   }
   
    ngOnInit() {
      this.isLoadingResults=true;
      this.http.get(this.original_url+"/Production/DieAndTools/FinshingLoadApi?token="+this.token)
      .subscribe((response: any[]) => {
        this.allDataGet = response;
        this.allDataGet = this.allDataGet.Table;
        this.supplierList = this.allDataGet;
        this.allDataGet = response;
        this.allDataGet = this.allDataGet.Table1;
        this.metalGradList = this.allDataGet;
        if(this.routeAction=='edit') 
        {
          this.showData();
        }
        this.isLoadingResults=false;
      }); 
    }
    onChangeOfProductDesc(row, data)
    {
         data.ITEMCODE=row.ITEMCODE;
         data.ITEMNAME=row.ITEMNAME;  
         data.ITEMID=row.ITEMID;
         this.arrayItemProductDesc='';
    }
    filterMetalList(search, data)
    {
      var str:string;
     str=search;
     this.isGradefiltered = search;
     console.log(search);
      if(str !== '')
      {
        data.METALGRADEID=0;
         this.filteredGrade=this.filterPipe.transform(this.metalGradList,str, 'METALGRADEDESC');  
         console.log("metal g", this.filteredGrade);
      }
      else
      {
        this.filteredGrade = [];
        this.isGradefiltered = '';
        data.METALGRADEDESC='';  
        data.METALGRADEID=0;
      }
    }
    onChangeMetal(row, data)
    {
      data.METALGRADEDESC=row.METALGRADEDESC;  
      data.METALGRADEID=row.METALGRADEID;
      this.isGradefiltered='';
    }
    filterSupplierList(search, data)
    {
      var str:string;
     str=search;
     this.isSupplierfiltered = search;
     console.log(search);
      if(str !== '')
      {
        data.SUPPLIERID=0;
         this.filteredSuppliers=this.filterPipe.transform(this.supplierList,str, 'NAME'); 
      }
      else
      {
        this.filteredSuppliers = [];
        this.isSupplierfiltered = '';
        data.CUSTOMERNAME='';  
        data.SUPPLIERID=0;
      }
    }
    onChangeSupplier(row, data)
    {
      console.log('row',row);
      console.log('data',data);
      data.CUSTOMERNAME=row.NAME;  
      data.SUPPLIERID=row.CUSTOMERID;
      this.isSupplierfiltered='';
    }
    searchTermProductCode(search, data)
    {
      var str:string;
      str=search;
      this.arrayItemProductDesc = search;
      if(this.arrayItemProductDesc !== '')
      {
        data.ITEMNAME='';  
        data.ITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingProductList=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=ItemCode")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.itemlistget = this.allDataGet;
            this.isLoadingProductList=false;
          });
        }
      }
      else
      {
        this.itemlistget = [];
        this.arrayItemProductDesc = '';
        data.ITEMCODE='';
        data.ITEMNAME='';  
        data.ITEMID=0;
      }
    }

    searchCleateCode(search, data)
    {
      var str:string;
      str=search;
      this.cleateItemDesc = search;
      if(this.cleateItemDesc !== '')
      {
        data.CLEATEITEMCODE='';  
        data.CLEATEITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingProductList=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=ItemName&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.cleateItemList = this.allDataGet;
            this.isLoadingProductList=false;
          });
        }
      }
      else
      {
        this.cleateItemList = [];
        this.cleateItemDesc = '';
        data.CLEATEITEMCODE='';
        data.CLEATEITEMNAME='';  
        data.CLEATEITEMID=0;
      }
    }
    onChangeOfCleateDesc(row, data)
    {
         data.CLEATEITEMCODE=row.ITEMCODE;
         data.CLEATEITEMNAME=row.ITEMNAME;  
         data.CLEATEITEMID=row.ITEMID;
         this.cleateItemDesc='';
    }
    searchRivitCode(search, data)
    {
      var str:string;
      str=search;
      this.rivetItemDesc = search;
      if(this.rivetItemDesc !== '')
      {
        data.RIVETITEMCODE='';  
        data.RIVETITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingProductList=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=ItemName&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.rivieItemList = this.allDataGet;
            this.isLoadingProductList=false;
          });
        }
      }
      else
      {
        this.rivieItemList = [];
        this.rivetItemDesc = '';
        data.RIVETITEMCODE='';
        data.RIVETITEMNAME='';  
        data.RIVETITEMID=0;
      }
    }
    onChangeOfRivitDesc(row, data)
    {
         data.RIVETITEMCODE=row.ITEMCODE;
         data.RIVETITEMNAME=row.ITEMNAME;  
         data.RIVETITEMID=row.ITEMID;
         this.rivetItemDesc='';
    }
    searchSteelWireCode(search, data)
    {
      var str:string;
      str=search;
      this.steelWireItemDesc = search;
      if(this.steelWireItemDesc !== '')
      {
        data.STEELWIREITEMCODE='';  
        data.STEELWIREITEMID=0;
        if(str.length>2 )
        {
          this.isLoadingProductList=true;
          this.http.get(this.original_url+"/Master/getItemList?token="+this.token+"&search="+str.toUpperCase()+"&searchon=ItemName&pori=I")
          .subscribe((response: any[]) => {
            this.allDataGet = response;
            this.allDataGet = this.allDataGet.Table;
            this.steelWireItemList = this.allDataGet;
            this.isLoadingProductList=false;
          });
        }
      }
      else
      {
        this.steelWireItemList = [];
        this.steelWireItemDesc = '';
        data.STEELWIREITEMCODE='';
        data.STEELWIREITEMNAME='';  
        data.STEELWIREITEMID=0;
      }
    }
    onChangeOfSteelWireDesc(row, data)
    {
         data.STEELWIREITEMCODE=row.ITEMCODE;
         data.STEELWIREITEMNAME=row.ITEMNAME;  
         data.STEELWIREITEMID=row.ITEMID;
         this.steelWireItemDesc='';
    }
    refresh()
    {
      this.newData.CLEATEITEMCODE='';
      this.newData.CLEATEITEMNAME='';  
      this.newData.CLEATEITEMID=0;
      this.newData.RIVETITEMCODE='';
      this.newData.RIVETITEMNAME='';  
      this.newData.RIVETITEMID=0;
      this.newData.STEELWIREITEMCODE='';
      this.newData.STEELWIREITEMNAME='';  
      this.newData.STEELWIREITEMID=0;

      this.newData.ITEMCODE='';
      this.newData.BATCHSIZE='';
      this.newData.STAMPINGWEIGHT='';
      this.newData.STAMPINGSIZE='';
      this.newData.WASTESTAMPING='';
      this.newData.WASTESTAMPINGWT='';
      this.newData.METALGRADEDESC='';
      this.newData.CUSTOMERNAME='';
      this.newData.CLEATSIZE='';
      this.newData.CLEATWEIGHT='';
      this.newData.CLEATWASTAGE='';
      this.newData.CLEATWASTAGEWT='';
      this.newData.RIVETSIZE='';
      this.newData.RIVETWEIGHT='';
      this.newData.RIVETWASTAGE='';
      this.newData.RIVETWASTAGE='';
      this.newData.RIVETWASTAGEWT='';
      this.newData.TIGELECTERICITYCONSUMP='';
      this.newData.TIGGASSCONSUMP='';
      this.newData.MIGELECTERICITYCONSUMP='';
      this.newData.MIGCO2CONSUMP='';
      this.newData.STEELWIRE='';
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.myDate= new Date(CompanyData['WORKINGDATE']);
      this.isAddNew=true;
    }
    validateDetail(mode)
    {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    console.log("dataravi",this.newData);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.newData.ITEMCODE==undefined||this.newData.ITEMCODE=='')
    {flag=false; msg=msg+"<li>Product code not entred</li>"}
    if(this.newData.BATCHSIZE==undefined||this.newData.BATCHSIZE=='' ||this.newData.BATCHSIZE==0)
    {flag=false; msg=msg+"<li>Batch size not entred.</li>"}
    if(this.newData.STAMPINGWEIGHT==undefined||this.newData.STAMPINGWEIGHT=='' ||this.newData.STAMPINGWEIGHT==0)
    {flag=false; msg=msg+"<li>Stamping weight not entred</li>"}
    if(this.newData.METALGRADEID==undefined||this.newData.METALGRADEID=='' )
    {flag=false; msg=msg+"<li>Material grad not entred</li>"}
    if(this.newData.STAMPINGSIZE==undefined||this.newData.STAMPINGSIZE==null||this.newData.STAMPINGSIZE==0)
    {flag=false; msg=msg+"<li>Actual Stampings used not entred.</li>"}
  
    if(this.newData.CLEATWEIGHT>0 && (this.newData.CLEATEITEMID==undefined||this.newData.CLEATEITEMID==''||this.newData.CLEATEITEMID==0))
    {flag=false; msg=msg+"<li>Cleate code note selected.</li>"}

    if(this.newData.RIVETWEIGHT>0 && (this.newData.RIVETITEMID==undefined||this.newData.RIVETITEMID==''||this.newData.RIVETITEMID==0))
    {flag=false; msg=msg+"<li>Rivet code note selected.</li>"}


    if(this.newData.STEELWIRE>0 && (this.newData.STEELWIREITEMID==undefined||this.newData.STEELWIREITEMID==''||this.newData.STEELWIREITEMID==0))
    {flag=false; msg=msg+"<li>Steel wire code note selected.</li>"}

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
      else
      {
        this.saveRecord(mode)
      }
  }
  
  saveRecord(mode)
  {
    var savedata:any={};
    var saveList:any=[];
    var msg:any,mId:any;
    if(mode=='add')
    {
      msg="Saved sucessfully";
      mId="-1";
      savedata.ID=":A";
      savedata.DATED=":B";
    }
    else
    {
      savedata.MDATE=":A";
      msg="updated sucessfully";
      mId=this.newData.ID;
    }
    savedata.BATCHSIZE=this.newData.BATCHSIZE;
    savedata.STAMPINGWEIGHT=this.newData.STAMPINGWEIGHT;
    savedata.STAMPINGSIZE=this.newData.STAMPINGSIZE;
    savedata.WASTESTAMPING=this.newData.WASTESTAMPING;
    savedata.WASTESTAMPINGWT=this.newData.WASTESTAMPINGWT;
    savedata.CLEATSIZE=this.newData.CLEATSIZE;
    savedata.CLEATWEIGHT=this.newData.CLEATWEIGHT;
    savedata.CLEATWASTAGE=this.newData.CLEATWASTAGE;
    savedata.CLEATWASTAGEWT=this.newData.CLEATWASTAGEWT;
    savedata.RIVETSIZE=this.newData.RIVETSIZE;
    savedata.RIVETWEIGHT=this.newData.RIVETWEIGHT;
    savedata.RIVETWASTAGE=this.newData.RIVETWASTAGE;
    savedata.RIVETWASTAGEWT=this.newData.RIVETWASTAGEWT;
    savedata.TIGELECTERICITYCONSUMP=this.newData.TIGELECTERICITYCONSUMP;
    savedata.TIGGASSCONSUMP=this.newData.TIGGASSCONSUMP;
    savedata.MIGELECTERICITYCONSUMP=this.newData.MIGELECTERICITYCONSUMP;
    savedata.MIGCO2CONSUMP=this.newData.MIGCO2CONSUMP;
    savedata.STEELWIRE=this.newData.STEELWIRE;
    savedata.ITEMID=this.newData.ITEMID;
    savedata.SUPPLIERID=this.newData.SUPPLIERID;
    savedata.METALGRADEID=this.newData.METALGRADEID;
    savedata.BRANCHID=this.boid;
    savedata.USERID=this.userid;
    
    savedata.CLEATEITEMID=this.newData.CLEATEITEMID;
    savedata.RIVETITEMID=this.newData.RIVETITEMID;
    savedata.STEELWIREITEMID=this.newData.STEELWIREITEMID;


    
    saveList.push(savedata);
    const  params = new  HttpParams()
  
    .set('bomid', mId)
    .set('token', this.token)
    .set('header', JSON.stringify(saveList));
    this.isLoadingResults=true;
  this.http.post(this.original_url+"/Production/DieAndTools/saveFinishingBOM", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    this.allData=res;
    this.gatePassForm=this.allData.Table;
    
    debugger;
    if (parseInt(this.allData)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:msg
              }
            });
            this.newData={};
            if(mode!='add')
            {
              this.router.navigate(['/finishing-bom']);
            }
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
    ////console.log("1212",erroremsg);
   const dialogRef = this.dialog.open(SuccessDialogComponent, {
     data: {
       wrongData: 'wrongData',
       displayMsg:erroremsg
     }
   });
   this.isLoadingResults=false;}
   );
  
  }
  
   showData()
   {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/Production/DieAndTools/FinshingBOM?bomid="+this.routeID+"&token="+this.token).subscribe((res)=> {
      this.allData=res;
     //his.newData=
     console.log("Gp data",res);
     this.allData=this.allData.Table[0];
     
     Object.assign(this.newData, {

      ITEMCODE:this.allData.ITEMCODE,
      BATCHSIZE:this.allData.BATCHSIZE,
      STAMPINGWEIGHT:this.allData.STAMPINGWEIGHT,
      STAMPINGSIZE:this.allData.STAMPINGSIZE,
      WASTESTAMPING:this.allData.WASTESTAMPING,
      WASTESTAMPINGWT:this.allData.WASTESTAMPINGWT,
      METALGRADEDESC:this.allData.METALGRADEDESC,
      METALGRADEID:this.allData.METALGRADEID,
      CUSTOMERNAME:this.allData.CUSTOMERNAME,
      CLEATSIZE:this.allData.CLEATSIZE,
      CLEATWEIGHT:this.allData.CLEATWEIGHT,
      CLEATWASTAGE:this.allData.CLEATWASTAGE,
      CLEATWASTAGEWT:this.allData.CLEATWASTAGEWT,
      RIVETSIZE:this.allData.RIVETSIZE,
      RIVETWEIGHT:this.allData.RIVETWEIGHT,
      RIVETWASTAGE:this.allData.RIVETWASTAGE,
      RIVETWASTAGEWT:this.allData.RIVETWASTAGEWT,
      TIGELECTERICITYCONSUMP:this.allData.TIGELECTERICITYCONSUMP,
      TIGGASSCONSUMP:this.allData.TIGGASSCONSUMP,
      MIGELECTERICITYCONSUMP:this.allData.MIGELECTERICITYCONSUMP,
      MIGCO2CONSUMP:this.allData.MIGCO2CONSUMP,
      STEELWIRE:this.allData.STEELWIRE,
      ITEMID:this.allData.ITEMID,
      SUPPLIERID:this.allData.SUPPLIERID,
      ID:this.allData.ID,
      CLEATEITEMCODE:this.allData.CLEATEITEMCODE,
      CLEATEITEMNAME:this.allData.CLEATEITEMNAME,
      CLEATEITEMID:this.allData.CLEATEITEMID,
      RIVETITEMCODE:this.allData.RIVETITEMCODE,
      RIVETITEMNAME:this.allData.RIVETITEMNAME, 
      RIVETITEMID:this.allData.RIVETITEMID,
      STEELWIREITEMCODE:this.allData.STEELWIREITEMCODE,
      STEELWIREITEMNAME:this.allData.STEELWIREITEMNAME,
      STEELWIREITEMID:this.allData.STEELWIREITEMID
     });
     this.allData=res;
      this.gatePassForm=this.allData.Table; 
  
      this.isLoadingResults=false;
    },errr=>{
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'Please check you internet coneectivity'
        }
        
      });
      this.isLoadingResults=false;
    }
    );
   }
  }
  

//   @Pipe({
//   name: 'grdFilter'
// })
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
