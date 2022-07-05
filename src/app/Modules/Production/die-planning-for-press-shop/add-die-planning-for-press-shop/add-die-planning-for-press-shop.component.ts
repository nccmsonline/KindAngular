import { environment } from './../../../../../environments/environment';
import { Global } from '../../../../Global';
import { ValidationComponent } from './../../../../validation/validation.component';
import { SuccessDialogComponent } from './../../../../Dialog/success-dialog/success-dialog.component';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-die-planning-for-press-shop',
  templateUrl: './add-die-planning-for-press-shop.component.html',
  styleUrls: ['./add-die-planning-for-press-shop.component.css']
})
export class AddDiePlanningForPressShopComponent implements OnInit {
  @ViewChildren('NEXTDIEID') vc;
  original_url = environment.baseUrl;
  newData: any = {};
  requisitionform: FormGroup;
  myDate = new Date();
  contact: Array<any> = [];
  contacts: Array<any> = [];
  isLoadingResults=false;
  id:any;
  toolTypeArray:Array<any> = [];
  toolNoArray:Array<any> = [];
  userArray:Array<any> = [];
  maintOfficerArray:Array<any> = [];
  storeInchargeArray:Array<any> = [];
  reasonArray:Array<any> = [];
  delayReason:Array<any> = [];
  action: any;
  arrayItemCustomer:any='';
  isLoading=false;
  allDataGet: any;
  photosBuffer:Array<any> = [];
  ipoarray:Array<any> = [];
  toolnoarray:Array<any> = [];
  pressnoarray:Array<any> = [];
  DataGet: Array<any> = [];
  framenoarray: Array<any> = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.newData.DIEPLANNINGDATE=this.myDate
    //this.vc.nativeElement.focus();
    this.createForm();
  //   this.contacts=[
  //   {id:1,name:"Main Pillar / Bush",Remarks:"" ,togglereqd:true,status:true},
  //   {id:2,name:"Semi Pillar / Bush",Remarks:"",togglereqd:true,status:true},
  //   {id:3,name:"Centre Locatio / Pin",Remarks:"",togglereqd:true,status:true},
  //   {id:4,name:"Grinding Sleeves",Remarks:"",togglereqd:true,status:true},
  //   {id:5,name:"Alignment Bolts",Remarks:"",togglereqd:true,status:false},
  //   {id:6,name:"Top / Bottom Plate",Remarks:"",togglereqd:true,status:true},
  //   {id:7,name:"Dwelling",Remarks:"",togglereqd:true,status:true},
  //   {id:7,name:"Approx. Tool Life",Remarks:"",togglereqd:true,status:true},
  //   {id:8,name:"RT Size",Remarks:"",togglereqd:false,status:true},
  //   {id:9,name:"RT ID Bore Size",Remarks:"",togglereqd:false,status:true},
  // ]

  // this.toolTypeArray=[
  //   {id:1,name:"Blanking"},
  //   {id:2,name:"Stator"},
  //   {id:3,name:"Rotor"}
  // ]
  // this.toolNoArray=[
  //   {id:1,name:"061105"},
  //   {id:2,name:"061106"},
  //   {id:3,name:"061107"},
  //   {id:4,name:"061108"},
  //   {id:5,name:"061109"}
  // ]

  // this.userArray=[
  //   {id:1,name:"Manpreet Singh"},
  //   {id:2,name:"Navneet Kumar"},
  //   {id:3,name:"User 1"},
  //   {id:4,name:"User 2"},
  //   {id:5,name:"User 3"}
  // ]

  // this.maintOfficerArray=[
  //   {id:1,name:"Progressive"},
  //   {id:2,name:"Gang or Compoubd"}
  // ]

  // this.storeInchargeArray=[
  //   {id:1,name:"Working"},
  //   {id:2,name:"Under Maint."}
  // ]
  

  // this.reasonArray=[
  //   {id:2,name:"2"},
  //   {id:3,name:"4"},
  //   {id:4,name:"6"},
  //   {id:5,name:"8"}
  // ]

  // this.delayReason=[
  //   {id:1,name:"160"},
  //   {id:2,name:"100"},
  //   {id:3,name:"90"},
  // ]
  this.contacts.forEach(element => {
  this.statusChange(element.status,element);
  });
  this.newData.srno="8";
   }

  ngOnInit() {
    if(this.action=='new'){
    this.isLoadingResults=true;
    this.http.get(this.original_url + "/Production/DieAndTools/dieplanningCommonApi?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid)
      .subscribe((res) => {
        let allDataGet: any;
        let idGet: any;
        allDataGet = res;
        this.toolnoarray=allDataGet.Table1;
        this.pressnoarray=allDataGet.Table2;
        this.DataGet=allDataGet.Table;
        idGet = allDataGet.Table;
        idGet = idGet[0];
        this.isLoadingResults=false;
      },error => {
        this.isLoadingResults = false;
      });
    }
else if(this.action=='edit'){
  this.isLoadingResults=true;
  this.http.get(this.original_url + "/Production/DieAndTools/getdieplanningdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&id="+this.id)
    .subscribe((res) => {
      let allDataGet: any;
      let idGet: any;
      allDataGet = res;
      this.toolnoarray=allDataGet.Table2;
      this.pressnoarray=allDataGet.Table3;
      this.DataGet=allDataGet.Table1;
      this.newData=allDataGet.Table[0];
      if (this.newData.CONTINUEYN == 'Y'){this.newData.CONTINUEYN=true}else{this.newData.CONTINUEYN=false}
      if (this.newData.TRANSFERTOFINISHING == 'Y'){this.newData.TRANSFERTOFINISHING=true}else{this.newData.TRANSFERTOFINISHING=false}
      this.isLoadingResults=false;
    },error => {
      this.isLoadingResults = false;
    });
}
  }


  // ngAfterViewInit(args: any): void {
  //   document.getElementById('grid').addEventListener('keydown', () => {
  //     debugger
  //     this.newData.editModule.saveCell();
  //     var index = this.newData.selectedRowIndex;
  //     var field;
  //     if ((window as any).field === 'DIEPLANNINGDATE') {
  //       field = 'IPOID';
  //     }
  //     if ((window as any).field === 'IPOID') {
  //       field = 'DIEID';
  //     }
  //     if ((window as any).field === 'DIEID') {
  //       if (index == this.newData.getRows().length - 1) { //check if its last row
  //         this.newData.editModule.addRecord();
  //       }
  //       index++;
  //       field = 'DIEPLANNINGDATE';
  //     }
  //     if ((window as any).field === 'DIEPLANNINGDATE' || (window as any).field === 'IPOID' || (window as any).field === 'DIEID') {
  //       this.newData.editModule.editCell(index, field);
  //     }
    
  //   })
  // }

  createForm() {
    this.requisitionform = this.fb.group({
      deptid: ['', Validators.required],
      costcentreid: ['', Validators.required],
      reqndate: '',
      batchmfgdate: '',
      batchexpirydate: '',
      storeid: ['', Validators.required],
      manualslipno: '',
      batchno: '',
      uom: '',
      productid: '',
      bomid: '',
      lotsize: '',
    });
  }

  statusChange(status, row) {
    console.log("event,value", status)
    if (status == true) {
      row.statusName = 'Ok';
    } if (status == false) {
      row.statusName = 'Not Ok';
    }

  }

  toolChange(id){
    if(id == null || id== undefined || id== ''){
      this.newData.LASTUSEDDATE='';
      this.newData.ITEMID=''
      this.newData.ITEMFRAMENO='';
      this.newData.STROKESREQ=0;
    }else{
      debugger
      // this.vc.nativeElement.focus();
      // this.vc.next.nativeElement.focus();
      
      // const element = this.renderer.selectRootElement('#elementId');
      // element.focus();
    // this.newData.STROKESREQ=0;

    // var $canfocus = $(':focusable');
    //     var index = $canfocus.index(document.activeElement) + 1;
    //     if (index >= $canfocus.length) index = 0;
    //     $canfocus.eq(index).focus();
        
    let LASTUSEDDATE,FRAMEDESC;
    LASTUSEDDATE = this.toolnoarray.find(x => x.DIEID == id).LASTUSEDDATE;
    // FRAMEDESC = this.toolnoarray.find(x => x.DIEID == id).ITEMID;
    this.newData.LASTUSEDDATE=LASTUSEDDATE;
    
    this.newData.STROKESREQ=0;

    

    this.http.get(this.original_url + "/Production/DieAndTools/checktoolstrokes?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&dieid="+id)
    .subscribe((res) => {
      let allDataGet: any;
      let idGet: any;
      allDataGet = res;
      allDataGet=allDataGet.Table[0]
      this.newData.STROKESREQ=allDataGet.STROKESBAL
      ;});
    }
    document.getElementById("frameno").focus();
  }

  calculateBalance(data){
    let STROKESREQ:number=0
    let STROKESTAKEN:number=0
    let NEXTIPOID:number=0
    let balance:number=0

    STROKESREQ = this.globalVar.checknull(data.STROKESREQ,'number')
    STROKESTAKEN = this.globalVar.checknull(data.STROKESTAKEN,'number')
    NEXTIPOID = this.globalVar.checknull(data.NEXTIPOID,'number')

    balance =(STROKESREQ-STROKESTAKEN-NEXTIPOID)

    if (balance > 0) {
      data.STROKESBAL = balance
    } else {
      data.STROKESBAL = 0
    }
  }

  changetype(event)
  {
    if(this.newData.CONTINUEYN == false){
      this.newData.NEXTDIEID = ''
    }
    // this.vc.first.nativeElement.focus();
  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    // if (this.newData.MachineName == undefined || this.newData.MachineName == '' || this.newData.MachineName == null) { flag = false; msg = msg + "* Please Enter Machine Name<br/>" }
    // if ((this.newData.MaintBy == "true" || this.newData.MaintBy == "1") && (this.newData.MainSupplierId == '' || this.newData.MainSupplierId == "0" || this.newData.MainSupplierId == undefined)) { flag = false; msg = msg + "* Please Select Maintenance Party <br/>" }
    // if ((this.newData.UnderWty == '1' || this.newData.UnderWty == "1") && (this.newData.Wtyupto == '' || this.newData.Wtyupto == undefined)) { flag = false; msg = msg + "* Please Select Warranty Upto Date Or Uncheck Warranty Option <br/>" }
    // if ((this.newData.UnderAMC == '1' || this.newData.UnderAMC == "1") && (this.newData.AMCFrom == '' || this.newData.AMCFrom == undefined || this.newData.AMCUpto == '' || this.newData.AMCUpto == undefined)) { flag = false; msg = msg + "* Please Select AMC Dates Or Uncheck AMC Option <br/>" }
    if (this.newData.IPOID == undefined || this.newData.IPOID == '' || this.newData.IPOID == null) { flag = false; msg = msg + "* IPO No. not selected<br/>" }
    if (this.newData.DIEID == undefined || this.newData.DIEID == '' || this.newData.DIEID == null) { flag = false; msg = msg + "* Tool not selected<br/>" }
    if (this.newData.MACHINEID == undefined || this.newData.MACHINEID == '' || this.newData.MACHINEID == null) { flag = false; msg = msg + "* Press No. not selected<br/>" }


    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
    else {
      this.savemachine(hdata, action);
    }
  }


  savemachine(data, actions) {
    this.isLoadingResults = true;
    // machinedetail array
    let newArray: Array<any> = [];
    let assetdetail: Array<any> = [];
    let DIEPLANNINGDATE,IPOID,ITEMID,ITEMFRAMENO,METALGRADE,AVAILABLERM,TRANSFERTOFINISHING,STAMPINGWIEGHT,REJECTION,CONTINUEYN,DIEID,NEXTDIEID,REMARKS, 
    DIEPLANNINGNO,STROKESREQ,STROKESBAL,EDATE,PRESSNO,STROKESDAY,STROKESNIGHT,SECONDTOOLNO ,MACHINEID ,STROKESTAKEN,NEXTIPOID;

    DIEPLANNINGDATE=this.globalVar.checknull(data.DIEPLANNINGDATE , "Date")
    IPOID=this.globalVar.checknull(data.IPOID , "number")
    ITEMFRAMENO=this.globalVar.checknull(data.ITEMFRAMENO , "string")
    METALGRADE=this.globalVar.checknull(data.METALGRADE , "string")
    AVAILABLERM=this.globalVar.checknull(data.AVAILABLERM , "number")
    TRANSFERTOFINISHING=this.globalVar.checknull(data.TRANSFERTOFINISHING , "string")
    STAMPINGWIEGHT=this.globalVar.checknull(data.STAMPINGWIEGHT , "number")
    REJECTION=this.globalVar.checknull(data.REJECTION , "number")
    CONTINUEYN=this.globalVar.checknull(data.CONTINUEYN , "string")
    DIEID=this.globalVar.checknull(data.DIEID , "number")
    NEXTDIEID=this.globalVar.checknull(data.NEXTDIEID , "number")
    REMARKS=this.globalVar.checknull(data.REMARKS , "string")
    DIEPLANNINGNO=this.globalVar.checknull(data.DIEPLANNINGNO , "number")
    STROKESREQ=this.globalVar.checknull(data.STROKESREQ , "number")
    STROKESBAL=this.globalVar.checknull(data.STROKESBAL , "number")
    EDATE=this.globalVar.checknull(data.EDATE , "Date")
    MACHINEID=this.globalVar.checknull(data.MACHINEID , "number")
    STROKESTAKEN=this.globalVar.checknull(data.STROKESTAKEN , "number")
    NEXTIPOID=this.globalVar.checknull(data.NEXTIPOID , "number")
    SECONDTOOLNO=this.globalVar.checknull(data.SECONDTOOLNO , "number")
    ITEMID=this.globalVar.checknull(data.ITEMID , "number")

    if (data.CONTINUEYN == undefined || data.CONTINUEYN == null || data.CONTINUEYN == '' || data.CONTINUEYN == "false" || data.CONTINUEYN == '0') { CONTINUEYN = "N"; } else { CONTINUEYN = "Y" }
    if (data.TRANSFERTOFINISHING == undefined || data.TRANSFERTOFINISHING == null || data.TRANSFERTOFINISHING == '' || data.TRANSFERTOFINISHING == "false" || data.TRANSFERTOFINISHING == '0') { TRANSFERTOFINISHING = "N"; } else { TRANSFERTOFINISHING = "Y" }

    // if (data.MaintBy == 'false') { MaintBy = "0"; } else { MaintBy = "1" }
    // if (data.MainSupplierId == undefined || data.MainSupplierId == null || data.MainSupplierId == '' || data.MaintBy == "false") { MainSupplierId = "0"; } else { MainSupplierId = data.MainSupplierId }
    // if (data.UnderWty == '1') { UnderWty = "1"; } else { UnderWty = "0" }
    // if (data.Wtyupto == undefined || data.Wtyupto == null || data.Wtyupto == '') { Wtyupto = ""; } else { Wtyupto = formatDate(data.Wtyupto, 'yyyy-MM-dd', 'en-US') }
    // if (data.UnderAMC == '1') { UnderAMC = "1"; } else { UnderAMC = "0" }
   
    newArray.push(
      {
        USERID:":D",
        COMPANYID:this.globalVar.CommpanyId,
        BRANCHID:"C",
        DIEPLANNINGNO:":B",
        DIEPLANNINGDATE:DIEPLANNINGDATE,
        IPOID:IPOID,
        DIEID:DIEID,
        ITEMFRAMENO:ITEMFRAMENO,
        METALGRADE:METALGRADE,
        AVAILABLERM:AVAILABLERM,
        TRANSFERTOFINISHING:TRANSFERTOFINISHING,
        STAMPINGWIEGHT:STAMPINGWIEGHT,
        REJECTION:REJECTION,
        CONTINUEYN:CONTINUEYN,
        NEXTDIEID:NEXTDIEID,
        REMARKS:REMARKS,
        STROKESREQ:STROKESREQ,
        STROKESBAL:STROKESBAL,
        // PRESSNO: '',
        // STROKESDAY: 0,
        // STROKESNIGHT: 0,
        SECONDTOOLNO: SECONDTOOLNO,
        EDATE:":E",
        DIEPLANNINGID:":A",
        STROKESTAKEN: STROKESTAKEN,
        NEXTPRODUCTID: '',
        MACHINEID: MACHINEID,
        NEXTIPOID: NEXTIPOID,
        NEXTFRAMENO: '',
        MDATE: '',
        ITEMID: ITEMID,
        REMARKS1: '',
        ROTORID: 0,
      });
    // fixed asset detail array
        
    const params = new HttpParams()
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('fyid', this.globalVar.fyid)
      .set('userid', this.globalVar.UserId)
      .set('id', this.id)
      .set('statementtype', actions)
      .set('headerarray', JSON.stringify(newArray))
    this.http.post(this.original_url + "/Production/DieAndTools/savedieplan", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/die-planning']);
      },error => {
        this.isLoadingResults = false;
      });
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
  reset1(data){

  }
  searchTermCustomer(event) {
    let term: any;
    term = event.target.value;
    this.arrayItemCustomer = term;
    if (this.arrayItemCustomer !== '') {
      this.isLoading = true;
      this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CustomerMaster/CustomerList?PageNumber=1&PageSize=100&sort=1&customerid=0coid=1&boid=1&search=" + this.arrayItemCustomer)
      .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.photosBuffer = this.allDataGet;
        });
    }
    else {
      this.isLoading = false;
      this.photosBuffer = [];
      this.arrayItemCustomer = '';
    }
  }


  reset(data) {
    this.arrayItemCustomer = '';
    data.customername = '';
    data.customerid = '';
    this.onChangeOfItemCodeCustomer(null, null);
  }


  onChangeOfItemCodeCustomer(data, rowDetail) {
    if (data == null) {

      this.newData.customerid = '';
      this.newData.customername = '';

    }
    else {

      this.newData.customerid = data.id;
      this.newData.customername = data.name;
      this.arrayItemCustomer = '';
     
    }
  }
  ipochange(id) {
    // debugger
    this.framenoarray = []
    this.newData.ITEMID=''
    this.newData.ITEMFRAMENO=''
    this.toolnoarray = []
    this.newData.DIEID=''
    this.newData.METALGRADE=''
    // document.getElementById("tooln").autofocus;
    // document.getElementById("tooln").click;
    // this.vc.first.nativeElement.focus();
    let ID;
    ID = this.DataGet.find(x => x.IPOID == id).PARTYID;
    this.http.get(this.original_url+"/Production/DieAndTools/dieplan_ordertools?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&partyid="+ID)
    .subscribe((respose) => {
        this.isLoading = false;
        this.allDataGet = respose;
        this.toolnoarray = this.allDataGet.Table;
  });

  this.http.get(this.original_url + "/Production/DieAndTools/getframeno?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&ipoid="+id)
    .subscribe((res) => {
      let allDataGet: any;
      let idGet: any;
      allDataGet = res;
      this.framenoarray=allDataGet.Table
      ;});
  }

  pressChange(id) {
    if(id == null || id== undefined || id== ''){}
    else{
  document.getElementById("metalgrade").focus();
    }
  }
  dateChange(){
    document.getElementById("ipo").focus();
  }

  framenoChange(id){
    if(id==null||id==undefined||id==''){
      this.newData.ITEMFRAMENO=''
      this.newData.METALGRADE=''
    }else{
    document.getElementById("pressno").focus();
    let ITEMFRAMENO;
    ITEMFRAMENO = this.framenoarray.find(x => x.ITEMID == id).PAIRPRODUCTCODE;
    // FRAMEDESC = this.toolnoarray.find(x => x.DIEID == id).ITEMID;
    this.newData.ITEMFRAMENO=ITEMFRAMENO;
    this.http.get(this.original_url + "/Production/DieAndTools/checkmetalgrade?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&itemid="+id)
    .subscribe((res) => {
      let allDataGet: any;
      let idGet: any;
      allDataGet = res;
      allDataGet=allDataGet.Table[0]
      this.newData.METALGRADE=allDataGet.METALGRADEDESC
      ;});
  }
}
}


