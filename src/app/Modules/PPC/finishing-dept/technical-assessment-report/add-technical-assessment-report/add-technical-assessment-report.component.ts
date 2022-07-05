import { AddDrawingMasterPopupComponent } from './../../add-drawing-master-popup/add-drawing-master-popup.component';
import { AddDrawingMasterComponent } from './../../../../Production/drawing-master/add-drawing-master/add-drawing-master.component';
import { Global } from './../../../../../Global';
import { HttpClient, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { NoofoperationPopupComponent } from 'src/app/Modules/General/noofoperation-popup/noofoperation-popup.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-technical-assessment-report',
  templateUrl: './add-technical-assessment-report.component.html',
  styleUrls: ['./add-technical-assessment-report.component.css']
})
export class AddTechnicalAssessmentReportComponent implements OnInit {

  original_url = environment.baseUrl;
  newData:any={};
  KRAArray:Array<any>=[];
  toolTypeArray:Array<any>=[];
  contacts: Array<any> = [];
  newContact: any = {};
  editContactID:any;
  isLoadingResults:boolean;
  myDate = new Date();
  newitemtype: any = {};
  removearray: Array<any> = [];
  isLoading: boolean;
  photosBuffer: Array<any> = [];
  arrayItemCustomer: string = '';
  allDataGet: any;
  tarid: string;
  action: string;
  drawingnoArray: Array<any> = [];
  framesizeArray:Array<any> = [];
  businesssegementarray: Array<any> = [];
  dropdownSettings = {};
  oprArray: Array<any> = [];
  stackArray: Array<any> = [];
  cavityArray: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private globalVar: Global,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
  ) {

    this.newData.date=this.myDate
    this.tarid = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'DIETYPEID',
      textField: 'DIETYPEDESC',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    if(this.action=='new'){
      this.newData.imagesArray = [];
      this.isLoadingResults=true;
      this.http.get(this.original_url + "/Production/TechAccessReport/getcommonapidata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid=" + this.globalVar.fyid)
        .subscribe((response) => {
          let allDataget
          allDataget = response;
          this.newData.SRNO=allDataget.Table[0].SRNO;
          this.newData.DATED=this.myDate;
          this.drawingnoArray=allDataget.Table1;
          this.framesizeArray=allDataget.Table2;
          this.toolTypeArray=allDataget.Table3;
          this.stackArray=allDataget.Table4;
          this.cavityArray=allDataget.Table5;
          this.isLoadingResults=false;
        });
      }
      if(this.action=='edit'){
        this.newData.imagesArray = [];
        this.isLoadingResults=true;
        this.http.get(this.original_url + "/Production/TechAccessReport/getTARdata?coid="+ this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid="+this.globalVar.fyid+"&id="+this.tarid)
          .subscribe((response) => {
            let allDataget
            allDataget = response;
            this.drawingnoArray=allDataget.Table6;
            this.framesizeArray=allDataget.Table7;
            this.toolTypeArray=allDataget.Table8;
            this.stackArray=allDataget.Table9;
            this.cavityArray=allDataget.Table10;
            this.newData= allDataget.Table[0];
            this.contacts=allDataget.Table1;       
            this.oprArray=allDataget.Table2;
            this.newData.TOOLSREQDST=allDataget.Table3;
            this.newData.TOOLTYPEST=allDataget.Table4;
            this.newData.PLATEDRGNORT= parseInt(this.newData.PLATEDRGNORT);

            // this.toolTypeArray.forEach((element ) => {
            //   this.contacts.forEach((element1 ) => {
            //    if(element.DIETYPEID==element1.TOOLING){
            //     element1.TOOLINGNAME=element.DIETYPEDESC;

            //    }
            //   });
            // });


            this.isLoadingResults=false;
          });
        }
    
    }

    ngOnInit() {
    }
  
    searchTermCustomer(event) {
      let term: any;
      term = event;
      this.arrayItemCustomer = term;
      if (this.arrayItemCustomer !== '') {
        this.isLoading = true;
        this.http.get(this.original_url + "/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + this.arrayItemCustomer + "&type=C")
          .subscribe((respose) => {
            this.isLoading = false;
            this.allDataGet = respose;
            this.allDataGet = this.allDataGet.Table;
            this.photosBuffer = this.allDataGet;
          }, error => {
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

    reset1(data) {
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

  addnewdraw(){
    const dialogRef = this.dialog.open(AddDrawingMasterPopupComponent, {

      data: {
        action: "new",
        id:"0",
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.http.get(this.original_url + "/Masters/CommonMaster/getdrawingmasterlist?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.UserId+"&Pagenumber=1&Pagesize=0&sort=&sortorder=&search=&searchtype=&filtertype=")
      .subscribe((response) => {
        let allDataget
        allDataget = response;
        this.drawingnoArray = allDataget.Table;
        this.isLoadingResults=false;
      });
    });
  }

  openNoofoperationPopup(rowDetail)
  {    
   
      // rowDetail.OPERATIONST = this.toolTypeArray.find(x=>x.DIETYPEID==this.newData.DIETYPEID).DIETYPEDESC;
          const dialogRef = this.dialog.open(NoofoperationPopupComponent, {
            width:"350px",
            height:"352px",
            data: {
              // enquiryid:this.routeID,
              id: this.tarid,
              toolTypeArray:this.toolTypeArray,
              oprArray:this.oprArray,
              rowdata:this.newData,
              // segement: this.segmentArray,
              // routeAction:this.routeAction
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if(result)
            {
              this.oprArray = result.data;
            }
            
          });
  
  }


  validateDetail(data) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Before add please rectify following mistakes:-</h5>";
    if (data.DRAWINGNO == undefined || data.DRAWINGNO == 0 || data.DRAWINGNO == '') { flag = false; msg = msg + "* Drawing No. Not Entered<br/>" }


    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    }
    return flag;
  }
    

  addContact(){
      
    if (this.validateDetail(this.newContact)) {
      // this.vc.first.nativeElement.focus();
      this.contacts.push(this.newContact);
      console.log('contacts1', this.contacts)
      this.newitemtype['ID'] = this.newContact.itemid;
      this.removearray.push(this.newitemtype);
      this.contacts.forEach((contact, index) => {
        var num = 'ID';
        var value = index + 1;
        contact[num] = value;
        var num1 = 'sr';
        var value1 = index + 1;
        contact[num1] = value1;
        var MCID = 'MCID'
        contact[MCID] = '0'
      });
      this.newContact = {};
      // this.newContact.stockinhand = '';
    }
  }

    editContact(val){
      this.editContactID = val;
    }
  
    updateContact(val){
      if (this.validateDetail(val)) {
        // this.vc.first.nativeElement.focus();
        this.editContactID = {};
      }
    }
  
    removeContact(index){
      this.contacts.splice(index, 1);
      this.removearray = [];
    }
   
    drgChange(id,rowDetail){
      var DRAWINGNO = this.drawingnoArray.find(x=>x.ID == id).DRAWINGNO;
      rowDetail.DRAWINGNAME=DRAWINGNO;
    }

    toolChange(id,rowDetail){
      var TOOLNO = this.cavityArray.find(x=>x.ID == id).NAME;
      rowDetail.TOOLINGNAME=TOOLNO;
    }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data:-</h5>";
    if (this.newData.PARTYID == undefined || this.newData.PARTYID == '' || this.newData.PARTYID == null) { flag = false; msg = msg + "* Party not Selected<br/>"}
    if (this.newData.REMARKS == undefined || this.newData.REMARKS == '' || this.newData.REMARKS == null) { flag = false; msg = msg + "* Remarks Not Entered<br/>"}

    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    } else {
      this.savetar(hdata, action)
    }
  }

  // Save Data
  savetar(data, action)
  {

      this.isLoadingResults=true;
      var headerarray: Array<any> = [];

         let PARTYID,SRNO,DATED,DRAWINGNOST,COMPONENTSIZERT,FRAMENOST,DRAWINGNORT,COMPONENTSIZEST,SHEETST,
         WASTAGEST,MATERIALST,LAMINATIONST	,LAMINATIONRT	,OPERATIONST,TOOLTYPEST	,
         TOOLSREQDST,APPROXCOSTST,STACKST	,STACKRT	,HEIGHTST	,HEIGHTRT	,PLATEDRGNOST	
         ,PLATEDRGNORT	,PLATEWASTAGEST	,REMARKS,DRAWINGNO,STACKHT,ALUWT,STACKWT,ENDPLATE,TOOLING,TOOLINGCOST,REMARKS1 ;

         PARTYID=this.globalVar.checknull(data.PARTYID,"number")
         SRNO=this.globalVar.checknull(data.SRNO,"number")
         DATED=this.globalVar.checknull(data.DATED,"Date")
         DRAWINGNOST=this.globalVar.checknull(data.DRAWINGNOST,"number")
         DRAWINGNORT=this.globalVar.checknull(data.DRAWINGNORT,"number")
         FRAMENOST=this.globalVar.checknull(data.FRAMENOST,"number")
         COMPONENTSIZEST=this.globalVar.checknull(data.COMPONENTSIZEST,"string")
         COMPONENTSIZERT=this.globalVar.checknull(data.COMPONENTSIZERT,"string")
         SHEETST=this.globalVar.checknull(data.SHEETST,"string")
         WASTAGEST=this.globalVar.checknull(data.WASTAGEST,"string")
         MATERIALST=this.globalVar.checknull(data.MATERIALST,"string")   
         LAMINATIONST=this.globalVar.checknull(data.LAMINATIONST,"string")
         LAMINATIONRT=this.globalVar.checknull(data.LAMINATIONRT,"string")    
         OPERATIONST=this.globalVar.checknull(data.OPERATIONST,"string")
         TOOLTYPEST=this.globalVar.checknull(data.TOOLTYPEST,"number")   
         TOOLSREQDST=this.globalVar.checknull(data.TOOLSREQDST,"number")
         APPROXCOSTST=this.globalVar.checknull(data.APPROXCOSTST,"string")   
         STACKST=this.globalVar.checknull(data.STACKST,"number")
         STACKRT=this.globalVar.checknull(data.STACKRT,"string")
         HEIGHTST=this.globalVar.checknull(data.HEIGHTST,"string")
         HEIGHTRT=this.globalVar.checknull(data.HEIGHTRT,"string")
         PLATEDRGNOST=this.globalVar.checknull(data.PLATEDRGNOST,"number")
         PLATEDRGNORT=this.globalVar.checknull(data.PLATEDRGNORT,"number")
         PLATEWASTAGEST=this.globalVar.checknull(data.PLATEWASTAGEST,"string")
         REMARKS=this.globalVar.checknull(data.REMARKS,"string")


      // header Deatail
    headerarray.push(
      {
        ID:this.tarid,
        PARTYID:PARTYID,
        SRNO:SRNO,
        DATED:DATED,
        DRAWINGNOST:DRAWINGNOST,
        DRAWINGNORT:DRAWINGNORT,
        FRAMENOST:FRAMENOST,
        FRAMENORT:'',
        COMPONENTSIZEST:COMPONENTSIZEST,
        COMPONENTSIZERT:COMPONENTSIZERT,
        SHEETST:SHEETST,
        SHEETRT:'',
        WASTAGEST:WASTAGEST,
        WASTAGERT:'',
        MATERIALST:MATERIALST,
        MATERIALRT:'',
        LAMINATIONST:LAMINATIONST,
        LAMINATIONRT:LAMINATIONRT,
        OPERATIONST:OPERATIONST,
        OPERATIONRT:'',
        TOOLTYPEST:'',
        TOOLTYPERT:'',
        TOOLSREQDST:'',
        TOOLSREQDRT:'',
        APPROXCOSTST:APPROXCOSTST,
        APPROXCOSTRT:'',
        STACKST:STACKST,
        STACKRT:STACKRT,
        HEIGHTST:HEIGHTST,
        HEIGHTRT:HEIGHTRT,
        PLATEDRGNOST:PLATEDRGNOST,
        PLATEDRGNORT:PLATEDRGNORT,
        PLATEWASTAGEST:PLATEWASTAGEST,
        PLATEWASTAGERT:'',
        REMARKS:REMARKS,
        BRANCHID:this.globalVar.BranchId,
      });

          // fixed asset detail array
    var detailarray: Array<any> = [];
    let i = 0;
    for (let mdata of this.contacts) {

      DRAWINGNO=this.globalVar.checknull(mdata.DRAWINGNO,"number")
      STACKHT=this.globalVar.checknull(mdata.STACKHT,"string")
      ALUWT=this.globalVar.checknull(mdata.ALUWT,"string")
      STACKWT=this.globalVar.checknull(mdata.STACKWT,"string")
      ENDPLATE=this.globalVar.checknull(mdata.ENDPLATE,"string")
      TOOLING=this.globalVar.checknull(mdata.TOOLING,"number")
      TOOLINGCOST=this.globalVar.checknull(mdata.TOOLINGCOST,"string")
      REMARKS1=this.globalVar.checknull(mdata.REMARKS,"string")


      detailarray.push({
        ID: i + 1,
        TARID:this.tarid,
        DRAWINGNO:DRAWINGNO,
        STACKHT:STACKHT,
        ALUWT:ALUWT,
        STACKWT:STACKWT,
        ENDPLATE:ENDPLATE,
        TOOLING:TOOLING,
        TOOLINGCOST:TOOLINGCOST,
        REMARKS:REMARKS1,
      });
      i++;
    }
     
    var dtltools: Array<any> = [];
    if (this.newData.TOOLSREQDST == undefined || this.newData.TOOLSREQDST == null || this.newData.TOOLSREQDST == '' || this.newData.TOOLSREQDST.length ==0 ) {
      dtltools.push({
        TARID: this.tarid
      });
    } else {
    let i = 0;
    for (let mdata of this.newData.TOOLSREQDST) {
      dtltools.push({
     ID :i + 1,
     TARID: this.tarid,
     NAME : mdata.DIETYPEDESC,
     TOOLID : mdata.DIETYPEID
      });
      i++;
    }

    var dtltollingtype: Array<any> = [];
    if (this.newData.TOOLTYPEST == undefined || this.newData.TOOLTYPEST == null || this.newData.TOOLTYPEST == '' || this.newData.TOOLTYPEST.length ==0 ) {
      dtltollingtype.push({
        TARID: this.tarid
      });
    } else {
    let i = 0;
    for (let mdata of this.newData.TOOLTYPEST) {
      dtltollingtype.push({
     ID :i + 1,
     TARID: this.tarid,
     NAME : mdata.DIETYPEDESC,
     TOOLINGTYPEID	 : mdata.DIETYPEID
      });
      i++;
    }
  }
}
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      const  params = new  HttpParams()
      .set('statementtype', action)
      .set('UserId',  this.globalVar.userid)
      .set('hdrarray', JSON.stringify(headerarray))
      .set('dtlarray', JSON.stringify(detailarray))
      .set('dtlwastage', JSON.stringify(this.oprArray))
      .set('dtltools', JSON.stringify(dtltools))
      .set('dtltollingtype', JSON.stringify(dtltollingtype))
      .set('id',this.tarid);

      this.http.post(this.original_url+"/Production/TechAccessReport/saveTAR", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        let temp;
        temp = res;
        this.isLoadingResults=false;
        this.successDialog();
        this.router.navigate(['/technical-assessment-report']);
      });
    
  }
  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
  
  
  }
  