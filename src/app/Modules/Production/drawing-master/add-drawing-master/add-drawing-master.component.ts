import { TranslateService } from '@ngx-translate/core';
import { Global } from 'src/app/Global';
import { HttpClient, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ImageUploadPopupComponent } from 'src/app/Modules/General/image-upload-popup/image-upload-popup.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-add-drawing-master',
  templateUrl: './add-drawing-master.component.html',
  styleUrls: ['./add-drawing-master.component.css']
})
export class AddDrawingMasterComponent implements OnInit {


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  original_url = environment.baseUrl;
  sortOrder: any;
  sortSelection: any;
  dob = new Date();
  onDataChanged: Observable<any>;
  drawingmastergroup:FormGroup;
  itemPerPage = '10';
  resultsLength = 0;
  isLoadingResults = true;
  page: any;
  itemCount: any;
  uploadformData = new FormData();
  itemDisplay: any;
  search: any;
  isLoading : boolean=false;
  pagenumber: any;
  isRateLimitReached = false;
  filterarray: Array<any> = [];
  showreset: boolean = false;
  public href: string = "";
  userRightCheck: any = {};
  canCreateCommonClass = '';
  canViewCommonClass = '';
  functionalityid: string;
  moduleid: string;
  action: string;
  rgpid: string;
  allDataGet: any;
  newData: any={};
  itemsArray: any={};
  dmid: string;
  departmentArray:  Array<any> = [];
  machinecatgArray: any;
  itemArray:Array<any>=[];
  imagesArray: Array<any> = [];
  PopData: any;
  actionType: any;
  type: any;
  callNoHeader: any;
  id: any;
  formData = new FormData();
  cgid:any;
  searchitm: any;
  arrayItem='';
  arrayItemEdit='';
  itemlistget:Array<any> = [];


  constructor(
    private http: HttpClient,
    private router: Router,
    private globalVar: Global,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public dialog: MatDialog,
    private fb: FormBuilder

  ) {
    this.newData.DRAWDOB=this.dob;
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    // User Right Data Get

    this.href = this.router.url;
    this.dmid = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.moduleid = this.activatedRoute.snapshot.paramMap.get('moduleid');
    this.functionalityid = this.activatedRoute.snapshot.paramMap.get('functionalityid');
    if (this.userRightCheck.canview == 'True') { this.canViewCommonClass = ''; }
    if (this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }
    if (this.userRightCheck.canview == 'False') { this.canViewCommonClass = 'canViewCommonClass'; }
    if (this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }



      if(this.action=='new'){
        this.newData.imagesArray = [];
        this.isLoadingResults=true;
        this.http.get(this.original_url + "/Masters/CommonMaster/GetCommonapiforDrawingMaster?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&userid=" + this.globalVar.userid)
          .subscribe((response) => {
            let allDataget
            allDataget = response;

            this.newData.SRNO=allDataget.Table[0].SRNO;
            this.departmentArray=allDataget.Table1;
            this.machinecatgArray=allDataget.Table2;
            this.newData.msid=this.dmid;
            this.isLoadingResults=false;
          });
          this.createForm()
        }
        if(this.action=='edit'){
          this.newData.imagesArray = [];
          this.isLoadingResults=true;
          this.http.get(this.original_url + "/Masters/CommonMaster/getdrawingmasterdata?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&userid="+this.globalVar.fyid+"&id="+this.dmid)
            .subscribe((response) => {
              let allDataget
              allDataget = response;
              // this.newData.SRNO=allDataget.Table[0].id;
              this.departmentArray=allDataget.Table1;
              this.machinecatgArray=allDataget.Table2;
              this.newData=allDataget.Table[0];
              this.newData.imagesArray=allDataget.Table3;
              this.newData.msid=this.dmid;
              this.isLoadingResults=false;
              // console.log("images array length",this.newData.imagesArray.length)
            });
            this.createForm()
          }
      }

  ngOnInit() {


  }
  imagePopup(rowDetail) {
    // rowDetail.imagesArray = [];
    const dialogRef = this.dialog.open(ImageUploadPopupComponent, {
      data: {
        itemid: 1,
        routeID: this.dmid,
        action: "new",
        type: "drawmst",
        actionDetail: rowDetail,
        form: "DrawingMaster",
        module: "Production",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.close == 'ok') {
          // Formdata
          let formDataArray = [];
          formDataArray = result.formdata;
          for (let file of formDataArray) {
            this.formData.append(file.FILENAME, file.file);
          }

          // Image Array
          console.log(result,"result")
          let temp: any;
          temp = result.imageArray;
          if (temp.length > 0) {
            rowDetail.imagesArray = temp;
          }
          // console.log('imagesarray',this.imagesArray)
        }
      }
    });
  }


  back(){
    
  }

  createForm() {
    this.drawingmastergroup = this.fb.group({
      lod: '',
      assay: '',
      nextqcdate: '',
      expirydate: '',
    });
  }
  
  catgchange(data){
    this.newData.ID='';
    this.newData.NAME='';
  }

  searchTermItemNew(term, rowDetail)
  {
    this.itemlistget = [];
    this.arrayItem = term;
    if(this.arrayItem != '')
    {
      this.isLoading=true;
      this.http.get(this.original_url + "/Masters/CommonMaster/Getitemlistcategorywise?PageNumber=1&PageSize=100&sort=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&sortorder=&search="+this.arrayItem+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&categoryid="+this.newData.CATGID)
        .subscribe((response) => {
          this.allDataGet = response;
          this.allDataGet = this.allDataGet.Table;
          this.itemlistget = this.allDataGet;
          this.isLoading=false;
        });
    }
    else
    {
      this.itemlistget = [];
      this.arrayItem = '';
    }
  }


  onChangeOfItem(id, rowDetail) {
    this.arrayItem = '';
    this.arrayItemEdit='';
    var ITEMNAME = this.itemlistget.find(x=>x.ID == id).NAME;
    var ITEMID = this.itemlistget.find(x=>x.ID == id).ID;
    rowDetail.NAME=ITEMNAME;
    rowDetail.ITEMID=ITEMID;
  }

  dropdownHide(){
    this.arrayItem = '';
  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data:-</h5>";
    if (this.newData.DRAWINGNO == undefined || this.newData.DRAWINGNO == '' || this.newData.DRAWINGNO == null) { flag = false; msg = msg + "* Please Enter Drawing No<br/>"}
    if (this.newData.DEPTID == undefined || this.newData.DEPTID == '' || this.newData.DEPTID == null) { flag = false; msg = msg + "* Please Select Department <br/>"}
    if (this.newData.CATGID == undefined || this.newData.CATGID == '' || this.newData.CATGID == null) { flag = false; msg = msg + "* Please Select Category<br/>"}
    if (this.newData.ITEMID == undefined || this.newData.ITEMID == '' || this.newData.ITEMID == null) { flag = false; msg = msg + "* Please Select Item<br/>"}

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

         let DRAWINGNO,DEPTID,CATGID,ITEMID,REVNO,REVDATE,NOOFPAGES,DRAWDOB,DRGDESCRIPTION;

    DRAWINGNO=this.globalVar.checknull(data.DRAWINGNO,"string")
    DEPTID=this.globalVar.checknull(data.DEPTID,"number")
    CATGID=this.globalVar.checknull(data.CATGID,"number")
    ITEMID=this.globalVar.checknull(data.ITEMID,"number")
    NOOFPAGES=this.globalVar.checknull(data.NOOFPAGES,"number")
    REVDATE=this.globalVar.checknull(data.REVDATE,"Date")
    DRAWDOB=this.globalVar.checknull(data.DRAWDOB,"Date")
    REVNO=this.globalVar.checknull(data.REVNO,"string")
    DRGDESCRIPTION=this.globalVar.checknull(data.DRGDESCRIPTION,"string")


      // header Deatail
    headerarray.push(
      {
        ID:this.dmid,
        COID:this.globalVar.CommpanyId,
        BOID:this.globalVar.BranchId,
        USERID:this.globalVar.UserId,
        SRNO: this.newData.SRNO,
        DRAWINGNO: DRAWINGNO,
        DEPTID: DEPTID,
        CATGID:CATGID,
        ITEMID:ITEMID,
        DRAWDOB:DRAWDOB,
        REVNO:REVNO,
        REVDATE:REVDATE,
        NOOFPAGES:NOOFPAGES,
        CREATEDBY:this.globalVar.userid,
        MODIFIEDBY:"",
        MODIFIEDON:"",
        DRGDESCRIPTION:DRGDESCRIPTION,
        
      });
      var imageArray: Array<any> = [];
      var m = 0;
      for (let mdata of this.newData.imagesArray) {
        console.log("mdata",mdata)
        // console.log(mdata,"mdata")
        imageArray.push({
          id: m+1,
          irdid:this.dmid,
          itemid:0,
          SRNO: m + 1,
          IMAGEINFO: mdata.FILENAME,
          REMARKS: mdata.REMARKS,
          isactive: 1
        });
        m++
      }


      
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      const  params = new  HttpParams()
      .set('statementtype', action)
      .set('userid',  this.globalVar.userid)
      .set('machinemasterarray', JSON.stringify(headerarray))
      .set('id',  this.dmid)


      this.http.post(this.original_url+"/Masters/CommonMaster/saveDrawingMaster", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        let temp;
        temp = res;
        if (this.newData.imagesArray.length > 0) {
          let progress: number;
          let message: any;
          let resid
          if(action=='Insert'){
             resid = res;
          }else{
            resid = this.dmid;
          }
          
          const uploadReq = new HttpRequest('POST', this.original_url + '/Master/Upload/UploadingallFiles?statementtype='+action+'&userid=' + this.globalVar.UserId + '&module=Production&form=DrawingMaster&refid=' + resid + '&osservertype=Windows&remarks=&tablename=DRAWING_MST_IMAGES&imagesArray=' + JSON.stringify(imageArray) + '&refparentid=1', this.formData, {
            reportProgress: true
          });
          this.http.request(uploadReq).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress){
              progress = Math.round(100 * event.loaded / event.total); 
            }
            if (event.type === HttpEventType.Response){
              this.isLoadingResults=false;
              this.successDialog();
              // this.dialogRef.close();
              message = event.body.toString();
              this.router.navigate(['/drawing-master']);
            }
          });          
        }
        else{


        this.isLoadingResults=false;
        this.successDialog();
        this.router.navigate(['/drawing-master']);
        }
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
