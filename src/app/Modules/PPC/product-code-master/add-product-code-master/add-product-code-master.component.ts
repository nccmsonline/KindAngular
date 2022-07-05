import { environment } from './../../../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Global } from 'src/app/Global';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';

@Component({
  selector: 'app-add-product-code-master',
  templateUrl: './add-product-code-master.component.html',
  styleUrls: ['./add-product-code-master.component.css']
})
export class AddProductCodeMasterComponent implements OnInit {
  @ViewChildren('oldcodefocus') vc;
  original_url = environment.baseUrl;
  newData: any = {};
  requisitionform: FormGroup;
  myDate = new Date();
  contacts: Array<any> = [];
  contact: any = {};
  isLoadingResults :boolean;
  id: any;
  toolTypeArray: Array<any> = [];
  toolNoArray: Array<any> = [];
  userArray: Array<any> = [];
  maintOfficerArray: Array<any> = [];
  ToolSectionArray: Array<any> = [];
  yesornoArray: Array<any> = [];
  reasonArray: Array<any> = [];
  delayReason: Array<any> = [];
  action: any;
  arrayItemCustomer: any = '';
  isLoading = false;
  allDataGet: any;
  photosBuffer: Array<any> = [];
  PoleArray: Array<any> = [];
  ProductArray: Array<any> = [];
  StatusArray: Array<any> = [];
  FrameArray: Array<any> = [];
  DieTypeArray: Array<any> = [];
  EfficiencyArray: Array<any> = [];
  LastOperationArray: Array<any> = [];
  framenoArray: Array<any> = [];
  ColourArray: Array<any> = [];
  ProcessArray: Array<any> = [];
  userRightCheck: any = {};
  dimentionDataGet: Array<any> = [];


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

    this.createForm();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');

   }


   ngOnInit() {
   
    if (this.action == 'new') {
      this.isLoadingResults=true;
      this.http.get(this.original_url + "/Masters/ProductMaster/getcommonapiproductmst?coid=" + this.globalVar.CommpanyId + "&boid=2&fyid=" + this.globalVar.fyid)
        .subscribe((res) => {
          let allDataGet: any;
          let idGet: any;
          allDataGet = res;
          this.FrameArray = allDataGet.Table;
          this.PoleArray = allDataGet.Table1;
          this.ProcessArray = allDataGet.Table2;
          this.ProductArray = allDataGet.Table3;
          this.EfficiencyArray = allDataGet.Table4;
         this.isLoadingResults = false;
        },error => {
          this.isLoadingResults = false;
        }
  );
    }
    else if (this.action == 'edit') {
      this.isLoadingResults=true;
      this.http.get(this.original_url + "/Masters/ProductMaster/getProductmastermasterdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&id="+this.id)
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet = res;
          this.FrameArray = allDataGet.Table1;
          this.PoleArray = allDataGet.Table2;
          this.ProcessArray = allDataGet.Table3;
          this.ProductArray = allDataGet.Table4;
          this.EfficiencyArray = allDataGet.Table5;
          this.newData = allDataGet.Table[0];
          this.newData.FRAMENAME=this.newData.FRAMEDESC;
          this.newData.POLARITYNAME=this.newData.POLEDESC;
          this.newData.PRODTYPENAME=this.newData.PRODUCTTYPE1;
          this.newData.FRAMENAME=this.newData.FRAMEDESC;
          this.newData.EFFNAME = this.EfficiencyArray.find(x => x.ID ==  this.newData.EFFICIENCYGRADE).EFFICIENCYID;
          this.newData.PROCESSNAME = this.ProcessArray.find(x => x.ID ==  this.newData.PROCESSID).PROCESSDESC;
          this.newData.THICKNESS=this.newData.THICKNESS.toString();
          this.newData.LENGTH=this.newData.LENGTH.toString();
          this.isLoadingResults = false;
        },error => {
          this.isLoadingResults = false;
        }
  );
    }
  }

  createForm() {
    this.requisitionform = this.fb.group({
      PARTYNAME: ['', Validators.required],
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

  searchTermCustomer(event) {
    let term: any;
    term = event.target.value;
    this.arrayItemCustomer = term;
    if (this.arrayItemCustomer !== '') {
      this.isLoading = true;
      this.http.get(this.original_url+"/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=" + this.arrayItemCustomer+"&type=C")
        .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.photosBuffer = this.allDataGet;
        },error => {
          this.isLoading = false;
        }
  );
    }
    else {
      this.isLoading = false;
      this.photosBuffer = [];
      this.arrayItemCustomer = '';
    }
  }




  reset(data) {
    this.arrayItemCustomer = '';
    data.PARTYNAME = '';
    data.PARTYID = '';
    this.onChangeOfItemCodeCustomer(null, null);
  }

  
  onChangeOfItemCodeCustomer(data, rowDetail) {
    if (data == null) {

      this.newData.PARTYID = '';
      this.newData.PARTYNAME = '';

    }
    else {

      this.newData.PARTYID = data.CUSTOMERID;
      this.newData.PARTYNAME = data.NAME;
      this.arrayItemCustomer = '';

    }
  }
  dropdownHide(){
    
  }

  generateName(data) {
    let A, B, C, D, E, F, G, H, I, J, K, L
    if (data.CUSTOMERINITIAL != null && data.CUSTOMERINITIAL != undefined && data.CUSTOMERINITIAL != '') {
      A = data.CUSTOMERINITIAL.substring(0, 3)
    }
    if (data.SERIES != null && data.SERIES != undefined && data.SERIES != '') {
      B = data.SERIES.substring(0, 4)
    }
    if (data.FRAMENAME != null && data.FRAMENAME != undefined && data.FRAMENAME != '') {
      C = data.FRAMENAME.substring(0, 4)
    }
    if (data.POLARITYNAME != null && data.POLARITYNAME != undefined && data.POLARITYNAME != '') {
      D = data.POLARITYNAME.substring(0, 2)
    }
    if (data.EFFNAME != null && data.EFFNAME != undefined && data.EFFNAME != '') {
      E = data.EFFNAME.substring(0, 3)
    }
    if (data.PRODTYPENAME != null && data.PRODTYPENAME != undefined && data.PRODTYPENAME != '') {
      F = data.PRODTYPENAME.substring(0, 3)
    }
    if (data.PROCESSNAME != null && data.PROCESSNAME != undefined && data.PROCESSNAME != '') {
      G = data.PROCESSNAME.substring(0, 3)
    }
    if (data.LENGTH != null && data.LENGTH != undefined && data.LENGTH != '') {
      H = data.LENGTH.substring(0, 3)
    }
    if (data.THICKNESS != null && data.THICKNESS != undefined && data.THICKNESS != '') {
      I = data.THICKNESS.substring(0, 2)
    }
    if (data.GRADE != null && data.GRADE != undefined && data.GRADE != '') {
      J = data.GRADE.substring(0, 4)
    }
    if (data.COATINGTYPE != null && data.COATINGTYPE != undefined && data.COATINGTYPE != '') {
      K = data.COATINGTYPE.substring(0, 2)
    }
    if (data.DRAWINGNO != null && data.DRAWINGNO != undefined && data.DRAWINGNO != '') {
      L = data.DRAWINGNO.substring(0, 10)
    }
    A =this.globalVar.checknull(A,"string")
    B=this.globalVar.checknull(B,"string")
    C=this.globalVar.checknull(C,"string")
    D=this.globalVar.checknull(D,"string")
    E=this.globalVar.checknull(E,"string")
    F=this.globalVar.checknull(F,"string")
    G=this.globalVar.checknull(G,"string")
    H=this.globalVar.checknull(H,"string")
    I=this.globalVar.checknull(I,"string")
    J=this.globalVar.checknull(J,"string")
    K=this.globalVar.checknull(K,"string")
    L=this.globalVar.checknull(L,"string")

    this.newData.PRODUCTCODE=A+'/'+B+'/'+C+'/'+D+'/'+E+'/'+F+'/'+G+'/'+H+'/'+I+'/'+J+'/'+K+'/'+L
  }

  changePole(id,data) {
    var NAME = this.PoleArray.find(x => x.POLEID == id).POLEDESC;
    data.POLARITYNAME= NAME;
    this.generateName(data);
  }
  changeFrame(id,data){
    var NAME = this.FrameArray.find(x => x.FRAMEID == id).FRAMEDESC;
    data.FRAMENAME= NAME;
    this.generateName(data);
  }
  changeEff(id,data){
    var NAME = this.EfficiencyArray.find(x => x.ID == id).EFFICIENCYID;
    data.EFFNAME= NAME;
    this.generateName(data);
  }
  changeProdtype(id,data){
    var NAME = this.ProductArray.find(x => x.PRODUCTTYPEID == id).PRODUCTTYPE;
    data.PRODTYPENAME= NAME;
    this.generateName(data);
  }
  changeFinishing(id,data){
    var NAME = this.ProcessArray.find(x => x.PROCESSID == id).PROCESSDESC;
    data.PROCESSNAME= NAME;
    this.generateName(data);
  }

  
  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data:-</h5>";
    if (this.newData.PARTYID == undefined || this.newData.PARTYID == '' || this.newData.PARTYID == null) { flag = false; msg = msg + "* Please Select Party <br/>"}
    if (this.newData.CUSTOMERINITIAL == undefined || this.newData.CUSTOMERINITIAL == '' || this.newData.CUSTOMERINITIAL == null) { flag = false; msg = msg + "* Please Enter Customer Initial<br/>"}
    if (this.newData.DRAWINGNO == undefined || this.newData.DRAWINGNO == '' || this.newData.DRAWINGNO == null) { flag = false; msg = msg + "* Please Enter Drawing No.<br/>"}
    if (this.newData.SERIES == undefined || this.newData.SERIES == '' || this.newData.SERIES == null) { flag = false; msg = msg + "* Please Enter Series<br/>"}
    if (this.newData.FRAME == undefined || this.newData.FRAME == '' || this.newData.FRAME == null) { flag = false; msg = msg + "* Please Select Frame<br/>"}
    if (this.newData.POLARITY == undefined || this.newData.POLARITY == '' || this.newData.POLARITY == null) { flag = false; msg = msg + "* Please Select Polarity<br/>"}
    if (this.newData.EFFICIENCYGRADE == undefined || this.newData.EFFICIENCYGRADE == '' || this.newData.EFFICIENCYGRADE == null) { flag = false; msg = msg + "* Please Select Efficiency Grade<br/>"}
    if (this.newData.PRODUCTTYPE == undefined || this.newData.PRODUCTTYPE == '' || this.newData.PRODUCTTYPE == null) { flag = false; msg = msg + "* Please Select Product Type<br/>"}
    if (this.newData.PROCESS == undefined || this.newData.PROCESS == '' || this.newData.PROCESS == null) { flag = false; msg = msg + "* Please Select Finishing Process<br/>"}
    if (this.newData.LENGTH == undefined || this.newData.LENGTH == '' || this.newData.LENGTH == null) { flag = false; msg = msg + "* Please Enter Core Length<br/>"}
    if (this.newData.THICKNESS == undefined || this.newData.THICKNESS == '' || this.newData.THICKNESS == null) { flag = false; msg = msg + "* Please Enter Sheet Thickness<br/>"}
    if (this.newData.GRADE == undefined || this.newData.GRADE == '' || this.newData.GRADE == null) { flag = false; msg = msg + "* Please Enter Grade<br/>"}
    if (this.newData.COATINGTYPE == undefined || this.newData.COATINGTYPE == '' || this.newData.COATINGTYPE == null) { flag = false; msg = msg + "* Please Enter Coating Type<br/>"}


    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    } else {
      this.saveCncProgramMaster(hdata, action)
    }
  }

  // Save Data
  saveCncProgramMaster(data, action)
  {
      this.isLoadingResults=true;
      var headerarray: Array<any> = [];

         let PRODUCTCODE,PARTYID,CUSTOMERINITIAL,DRAWINGNO,SERIES,FRAME,POLARITY,EFFICIENCYGRADE,PRODUCTTYPE,PROCESS,
         LENGTH,THICKNESS,GRADE,COATINGTYPE;

    PRODUCTCODE=this.globalVar.checknull(data.PRODUCTCODE,"string")
    PARTYID=this.globalVar.checknull(data.PARTYID,"number")
    CUSTOMERINITIAL=this.globalVar.checknull(data.CUSTOMERINITIAL,"string")
    DRAWINGNO=this.globalVar.checknull(data.DRAWINGNO,"string")
    POLARITY=this.globalVar.checknull(data.POLARITY,"number")
    FRAME=this.globalVar.checknull(data.FRAME,"number")
    EFFICIENCYGRADE=this.globalVar.checknull(data.EFFICIENCYGRADE,"number")
    SERIES=this.globalVar.checknull(data.SERIES,"string")
    PRODUCTTYPE=this.globalVar.checknull(data.PRODUCTTYPE,"number")
    PROCESS=this.globalVar.checknull(data.PROCESS,"number")
    LENGTH=this.globalVar.checknull(data.LENGTH,"number")
    THICKNESS=this.globalVar.checknull(data.THICKNESS,"number")
    GRADE=this.globalVar.checknull(data.GRADE,"string")
    COATINGTYPE=this.globalVar.checknull(data.COATINGTYPE,"string")


      // header Deatail
    headerarray.push(
      {
        ID:this.id,
        COID:this.globalVar.CommpanyId,
        BOID:this.globalVar.BranchId,
        USERID:this.globalVar.UserId,
        PRODUCTCODE: PRODUCTCODE,
        PARTYID: PARTYID,
        CUSTOMERINITIAL:CUSTOMERINITIAL,
        DRAWINGNO:DRAWINGNO,
        EFFICIENCYGRADE:EFFICIENCYGRADE,
        SERIES:SERIES,
        FRAME:FRAME,
        POLARITY:POLARITY,
        PRODUCTTYPE:PRODUCTTYPE,
        PROCESS:PROCESS,
        LENGTH:LENGTH,
        THICKNESS:THICKNESS,
        GRADE:GRADE,
        COATINGTYPE:COATINGTYPE,
        CREATEDBY:this.globalVar.userid,
        CREATEDON:this.myDate,
        MODIFIEDBY:"",
        MODIFIEDON:"", 
      });
 
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      const  params = new  HttpParams()
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('statementtype', action)
      .set('userid',  this.globalVar.userid)
      .set('hdrarray', JSON.stringify(headerarray))
      .set('id',  this.id)


      this.http.post(this.original_url+"/Masters/ProductMaster/SaveProductmaster", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        this.isLoadingResults=false;
        this.successDialog();
        this.router.navigate(['/product-code-master']);  
      });
    
  }
  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }




}
