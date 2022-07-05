import { Global } from 'src/app/Global';
import { environment } from './../../../../../environments/environment';
import { HttpClient, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from '../../../../validation/validation.component';
declare var CKEDITOR: any;
import { TranslateService } from '@ngx-translate/core';
import { AddDoubleColumnMasterComponent } from 'src/app/Modules/Master/double-column-master/add-double-column-master/add-double-column-master.component';
import { ImageUploadPopupComponent } from 'src/app/Modules/General/image-upload-popup/image-upload-popup.component';

@Component({
  selector: 'app-add-letter-bank',
  templateUrl: './add-letter-bank.component.html',
  styleUrls: ['./add-letter-bank.component.css']
})
export class AddLetterBankComponent implements OnInit {
  @ViewChild('ckeditor') public ckeditor: any;
  original_url = environment.baseUrl;
  letterBank: FormGroup;
  newData: any = {};
  displayedColumns: string[] = ['category', 'deptname'];
  text: any;
  fieldArray: any;
  action: string;
  departmentDataget: Array<any> = [];
  subjectSingle: Array<any> = [];
  subjectDataget: Array<any> = [];
  imagesArray: Array<any> = [];
  titleSingle: Array<any> = [];
  titleDataget: Array<any> = [];
  documentDDCategory: Array<any> = [];
  filterArray1: Array<any> = [];
  formData = new FormData();
  filterArray2: Array<any> = [];
  uploadformData = new FormData();
  filterArray3: Array<any> = [];
  letterid: any;
  actiontype: any;
  allData: any;
  isLoadingResults: boolean = false;
  ckeConfig: any;
  //  datasourcetablearray:Array<any>=[];
  datasourcetablearray = new MatTableDataSource();
  moduleid: any;
  functionalityid: any;
  userRightCheck: any = {};
  canEditCommonClass = '';
  canCreateCommonClass = '';
  departmentSingle: Array<any> = [];
  employeeDatasourceArray: Array<any> = [];
  resumeDatasourceArray: Array<any> = [];
  resumeDocsDocsArray: Array<any> = [];
  allDocsArray: Array<any> = [];
  myCkeditorConfig: any;
  documentCategory: any
  ckeObject: any;

  constructor(

    private fb: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private globalVar: Global,
    private translate: TranslateService,
    // private letterBankService: LetterBankService,
    private router: Router,
    public dialog: MatDialog,

    // public data: any,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.newData.imagesArray=[];   
    this.createForm();
    this.letterid = this.activatedRoute.snapshot.paramMap.get('id');
    this.actiontype = this.activatedRoute.snapshot.paramMap.get('action');
   
   console.log("length",this.newData.imagesArray.length)
    // User Right Data Get
    // let Sidebar = sessionStorage.getItem("sidebar");
    // let sidebarDataGet = JSON.parse(Sidebar);
    // let childSidebarDataGet = sidebarDataGet.find(x => x.moduleid == this.moduleid);
    // this.userRightCheck = childSidebarDataGet.items.find(x => x.functionalityid == this.functionalityid);
    // if (this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; }
    // if (this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; }
    // if (this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; }
    // if (this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; }
  }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: true,
      // forcePasteAsPlainText: true,
      pasteFromWordRemoveStyles:false,
      pasteFromWordRemoveFontStyles : false,
    };

    this.myCkeditorConfig = {
      allowedContent: true,
      // forcePasteAsPlainText: true,
      pasteFromWordRemoveStyles:false,
      pasteFromWordRemoveFontStyles : false,
      extraPlugins: 'pastefromword',
      height: 500,
      removePlugins: 'blockquote,elementspath,save,image,flash,iframe,link,smiley,tabletools,find,templates,about,maximize,showblocks,newpage,language',
      removeButtons: 'Blockquote,Save,Underline,Smiley,Subscript,Superscript,Copy,Cut,Paste,Undo,Redo,Form,TextField,Textarea,Button,SelectAll,CreateDiv,PasteText,Select,HiddenField,,Radio,Checkbox,ImageButton,Anchor,BidiLtr,BidiRtl,Preview,Indent,Outdent'

    };

    // if (this.userRightCheck.canview == 'True') {
    if (this.actiontype == 'new') {
      this.isLoadingResults = true;
      this.http.get(this.original_url + "/Masters/CommonMaster/getcommonapiletterbank?COID=" + this.globalVar.CommpanyId + "&BOID=" + this.globalVar.BranchId + "&FYID=" + this.globalVar.fyid)
        .subscribe((res) => {
          this.fieldArray = res;
          this.newData.imagesArray=[];   
          console.log("length",this.newData.imagesArray.length)
          this.allDocsArray = this.fieldArray.Table;
          this.departmentSingle = this.fieldArray.Table1;
          this.subjectSingle = this.fieldArray.Table2;
          this.titleSingle = this.fieldArray.Table3;
          this.filterArray1 = this.fieldArray.Table5;
          this.filterArray2 = this.fieldArray.Table6;
          this.filterArray3 = this.fieldArray.Table7;
          // this.datasourcetablearray.data = this.fieldArray.Table4;
          this.resumeDocsDocsArray = this.fieldArray.Table6;
          this.employeeDatasourceArray = this.fieldArray.Table4;
          this.resumeDatasourceArray = this.fieldArray.Table5;
          this.newData.LETTERTYPE = '1';
          this.letterChange();
          this.isLoadingResults = false;
        },error => {
          this.isLoadingResults = false;
        });
    } else if (this.actiontype == 'edit') {
      this.newData.imagesArray=[];
      this.isLoadingResults = true;
      let params = new HttpParams();
      params = params.append('coid', this.globalVar.CommpanyId);
      params = params.append('boid', this.globalVar.BranchId);
      params = params.append('id', this.letterid);
      this.http.get(this.original_url + "/Masters/CommonMaster/getcommonapiletterbank", { params: params })
      .subscribe((res) => {
        this.newData.imagesArray=[];
        this.fieldArray = res;
        this.allDocsArray = this.fieldArray.Table;
        this.departmentSingle = this.fieldArray.Table1;
        this.subjectSingle = this.fieldArray.Table2;
        this.titleSingle = this.fieldArray.Table3;
        this.employeeDatasourceArray = this.fieldArray.Table4;
        this.resumeDatasourceArray = this.fieldArray.Table5;
        this.filterArray1 = this.fieldArray.Table5;
        this.filterArray2 = this.fieldArray.Table6;
        this.filterArray3 = this.fieldArray.Table7;
        this.resumeDocsDocsArray = this.fieldArray.Table6;
        
      });

      this.http.get(this.original_url + "/Masters/CommonMaster/getletterdata", { params: params })
        .subscribe((res) => {
          this.isLoadingResults = false;
          let temp, temp1;
          this.allData = res;   
          console.log("data", this.allData)
          temp = res;
          temp = temp.ds;
          temp1 = res;
          temp1 = temp1.documenttext
          
          // this.subjectDataget = this.allData.Table1;
          // this.titleDataget = this.allData.Table2;
          temp = temp.Table[0];
          this.newData = temp;
          this.newData.LETTERTYPE = this.newData.LETTERTYPE
          this.newData.doctype = this.newData.DOCUMENTTYPE
          this.departmentDataget = this.departmentSingle.filter(x => x.DOCID == this.newData.DOCUMENTTYPE);
          this.subjectDataget = this.subjectSingle.filter(x => x.DEPTID == this.newData.DEPTID);
          this.titleDataget = this.titleSingle.filter(x => x.SUBJECTID == this.newData.SUBJECTID);
          this.letterChange();
          this.newData.imagesArray=this.allData.ds.Table3;
          console.log(this.newData.imagesArray,"imagesarray")
          let html
          html = temp1
          // html= temp1.replace(/(abc)/g,'&nbsp;').trim();
          this.newData.DOCUMENTTEXT = html
         
        },error => {
          this.isLoadingResults = false;
        });
    }
    // }
  }

  handleEvent(event) {
  }

  setCkeObject($event) {
    this.ckeObject = $event;
    console.log("this.ckeObject", this.ckeObject)
  }

  inserttoeditoronclick(data) {
    // tinymce.activeEditor.execCommand('mceInsertContent', false, "<strong>" + data.name + "</strong>");
    // CKEDITOR.instances['editor1'].insertElement(data.NAME);
    this.ckeObject.editor.insertText(data.NAME);
    // this.ckeObject.editor.insertText('<b>'+data.NAME+'</b>');

    // var oEditor = CKEDITOR.instances.yourEditorID;
    // var html = "<a href="#">my anchor</a>";

    // var newElement = CKEDITOR.dom.element.createFromHtml( html, oEditor.document );
    // oEditor.insertElement( newElement );
  }

  // search
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasourcetablearray.filter = filterValue;
  }

  createForm() {
    this.letterBank = this.fb.group({
      DEPTID: [null, Validators.required],
      SUBJECTID: [null, Validators.required],
      TITLEID: [null, Validators.required],
      documenttext: '',
      DOCUMENTTYPE: ''
    });
  }

  // Department Change
  departmentChange(event) {
    this.newData.TITLEID = '';
    this.subjectDataget = this.subjectSingle.filter(x => x.DEPTID == event);
  }

  // Department Category Change
  documentCategoryChange(event) {
    // this.newData.DEPTID = '';
    this.newData.SUBJECTID = '';
    this.newData.TITLEID = '';
    this.departmentDataget = this.departmentSingle.filter(x => x.DOCID == event);
  }

  // Department Master Popup
  departmentPopup(data) {
    const dialogRef = this.dialog.open(AddDoubleColumnMasterComponent, {
      data: {
        data: data,
        menutype: "dept-master-letter",
        action: this.actiontype,
        filterArray1: this.filterArray1,
        userRightCheck: this.userRightCheck
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      this.isLoadingResults = true;
      console.log("res", result)
      this.http.get(this.original_url + '/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=20&sort=&coid=' + this.globalVar.CommpanyId + '&boid=' + this.globalVar.BranchId + '&sortorder=&search=&id=&type=dept-master-letter')
        .subscribe((res) => {
          this.isLoadingResults = false;
          let fieldArray: any;
          fieldArray = res;
          this.departmentSingle = fieldArray.Table

          this.subjectSingle = [];
          this.subjectDataget = [];
          // this.newData.SUBJECTID = this.subjectDataget.find(x => x.subject == result.defaultValue).id;
          // this.newData.DEPTID = result.DEPTID;
          this.titleDataget = [];
          this.newData.SUBJECTID = '';
          this.newData.TITLEID = '';
          if (this.newData.doctype != null && this.newData.doctype != undefined && this.newData.doctype != '') {

            this.departmentDataget = this.departmentSingle.filter(x => x.FILTERID1 == this.newData.doctype);
          }
          // }
        },error => {
          this.isLoadingResults = false;
        });

    });
  }

  // Check Title, Subject, Dept Duplicate Data Exist
  checkDuplicateDataExist() {
    this.isLoadingResults=true;
    this.http.get(this.original_url + "/Masters/CommonMaster/checkletterexistdata?doccatgid=" + this.newData.doctype + "&DEPTID=" + this.newData.DEPTID + "&subid=" + this.newData.SUBJECTID + "&TITLEID=" + this.newData.TITLEID + "&LETTERTYPE=" + this.newData.LETTERTYPE+"&boid=" + this.globalVar.BranchId)
      .subscribe((res) => {
        let allDataget: any;
        let newSinglDataget: any;
        allDataget = res;
        newSinglDataget = allDataget.ds;
        newSinglDataget = newSinglDataget.Table[0];
        this.isLoadingResults=false;
        if (newSinglDataget.ISEXISTS == 1) {
          this.newData.DOCUMENTTEXT = allDataget.DOCUMENTTEXT;
        }
        else {
          this.newData.DOCUMENTTEXT = '';
        }
      },error => {
        this.isLoadingResults = false;
      });
  }

  //Subject Change
  subjectChange(event) {
    this.titleDataget = this.titleSingle.filter(x => x.SUBJECTID == event);
  }

  //Subject Master Popup
  subjectPopup(data) {
    const dialogRef = this.dialog.open(AddDoubleColumnMasterComponent, {

      data: {
        data: data,
        menutype: "subject-master-letter",
        action: this.actiontype,
        filterArray1: this.filterArray1,
        filterArray2: this.filterArray2,
        userRightCheck: this.userRightCheck
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      // this.subjectSingle = [];
      // this.subjectDataget = [];
      // this.subjectSingle = result.subjectArray;
      // this.subjectDataget = this.subjectSingle.filter(x => x.DEPTID == result.DEPTID);
      // this.newData.SUBJECTID = this.subjectDataget.find(x => x.subject == result.defaultValue).id;
      // this.newData.DEPTID = result.DEPTID;
      // this.titleDataget = [];
      // }
      this.isLoadingResults=false;
      this.http.get(this.original_url + '/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=20&sort=&coid=' + this.globalVar.CommpanyId + '&boid=' + this.globalVar.BranchId + '&sortorder=&search=&id=&type=subject-master-letter')
        .subscribe((res) => {
          this.isLoadingResults = false;
          let fieldArray: any;
          fieldArray = res;
          this.subjectSingle = fieldArray.Table

          // this.subjectSingle = [];
          // this.subjectDataget = [];
          // this.newData.SUBJECTID = this.subjectDataget.find(x => x.subject == result.defaultValue).id;
          // this.newData.DEPTID = result.DEPTID;
          this.titleDataget = [];
          this.newData.SUBJECTID = '';
          this.newData.TITLEID = '';
          if (this.newData.DEPTID != null && this.newData.DEPTID != undefined && this.newData.DEPTID != '') {

            // this.newData.TITLEID = '';
            this.subjectDataget = this.subjectSingle.filter(x => x.FILTERID2 == this.newData.DEPTID);
          }
        },error => {
          this.isLoadingResults = false;
        });
    });
  }

  //Title Master Popup
  titlePopup(data) {
    
    const dialogRef = this.dialog.open(AddDoubleColumnMasterComponent, {
      data: {
        data: data,
        menutype: "title-master-letter",
        action: this.actiontype,
        filterArray1: this.filterArray1,
        filterArray2: this.filterArray2,
        filterArray3: this.filterArray3,
        userRightCheck: this.userRightCheck
      },
      width: '600px'
    });
    this.isLoadingResults=true;
    dialogRef.afterClosed().subscribe(result => {
      this.http.get(this.original_url + '/Masters/CommonMaster/GetdoublecolumndataList?PageNumber=1&PageSize=20&sort=&coid=' + this.globalVar.CommpanyId + '&boid=' + this.globalVar.BranchId + '&sortorder=&search=&id=&type=title-master-letter')
        .subscribe((res) => {
          this.isLoadingResults = false;
          let fieldArray: any;
          fieldArray = res;
          this.titleSingle = fieldArray.Table

          // this.subjectSingle = [];
          // this.subjectDataget = [];
          // this.newData.SUBJECTID = this.subjectDataget.find(x => x.subject == result.defaultValue).id;
          // this.newData.DEPTID = result.DEPTID;
          // this.titleDataget = [];
          // this.newData.SUBJECTID = '';
          this.newData.TITLEID = '';
          if (this.newData.SUBJECTID != null && this.newData.SUBJECTID != undefined && this.newData.SUBJECTID != '') {

            // this.newData.TITLEID = '';
            this.titleDataget = this.titleSingle.filter(x => x.FILTERID3 == this.newData.SUBJECTID);
          }
        },error => {
          this.isLoadingResults = false;
        });
      // if (result) {
      //   this.titleSingle = [];
      //   this.titleDataget = [];
      //   this.subjectSingle = [];
      //   this.subjectDataget = [];
      //   this.titleSingle = result.titleArray;
      //   this.titleDataget = this.titleSingle.filter(x => x.SUBJECTID == result.SUBJECTID);
      //   this.newData.TITLEID = this.titleDataget.find(x => x.title == result.defaultValue).id;
      //   this.newData.DEPTID = result.DEPTID;
      //   this.subjectSingle = result.subjectArray;
      //   this.subjectDataget = this.subjectSingle.filter(x => x.DEPTID == result.DEPTID);
      //   this.newData.SUBJECTID = result.SUBJECTID;
      // }
    });
  }

  letterChange() {
    if (this.actiontype == 'new') {
      this.newData.DOCUMENTTEXT = '';
    }
    if (this.newData.LETTERTYPE == '1') {
      this.documentDDCategory = this.allDocsArray;
      this.datasourcetablearray.data = this.employeeDatasourceArray;
    }
    if (this.newData.LETTERTYPE == '2') {
      this.documentDDCategory = this.allDocsArray;
    }
    if (this.newData.LETTERTYPE == '3') {
      this.documentDDCategory = this.allDocsArray;
      this.datasourcetablearray.data = this.resumeDatasourceArray;
    }
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
  imagePopup(rowDetail) {

    const dialogRef = this.dialog.open(ImageUploadPopupComponent, {
      data: {
        itemid: 1,
        routeID: this.letterid,
        action: "new",
        type: "cncmst",
        actionDetail: rowDetail,
        form: "LetterBank",
        module: "HR",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.close == 'ok') {
          // Formdata
          debugger
          let formDataArray = [];
          formDataArray = result.formdata;
          for (let file of formDataArray) {
            this.formData.append(file.FILENAME, file.file);
          }

          // Image Array
          let temp: any;
          temp = result.imageArray;
          if (temp.length > 0) {
            rowDetail.imagesArray = temp;
            console.log("imagesArray",this.newData.imagesArray)
            console.log("temp",temp)
          }
        }
      }
    });
  }

  // Validation
  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    if (this.newData.doctype == undefined || this.newData.doctype == '' || this.newData.doctype == null) { flag = false; msg = msg + "* Document Category not selected<br/>" }
    if (this.newData.DEPTID == undefined || this.newData.DEPTID == '' || this.newData.DEPTID == null) { flag = false; msg = msg + "* Department not selected<br/>" }
    if (this.newData.SUBJECTID == undefined || this.newData.SUBJECTID == '' || this.newData.SUBJECTID == null) { flag = false; msg = msg + "* Subject not selected<br/>" }
    if (this.newData.TITLEID == undefined || this.newData.TITLEID == '' || this.newData.TITLEID == null) { flag = false; msg = msg + "* Title not selected<br/>" }

    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    }
    else {
      this.saveLetterbank(hdata, action);
    }
  }

  // Save
  saveLetterbank(data, mode) {
    var documenttext;
    this.isLoadingResults = true;
    // if (data.DOCUMENTTEXT == undefined) { documenttext = '' }
    // else{ 
    debugger
    documenttext = data.DOCUMENTTEXT
    // documenttext= this.globalVar.removeNBSP(data.DOCUMENTTEXT);
    // }
    if (data.DOCUMENTTYPE == undefined) { data.DOCUMENTTYPE = 0 };

    if (mode == "Insert") {
      data.id = 0;
    }
    var imageArray: Array<any> = [];
    var m = 0;
    for (let mdata of this.newData.imagesArray) {
      imageArray.push({
        id: m + 1,
        irdid: this.letterid,
        itemid: 1,
        srno: m + 1,
        imageinfo: mdata.FILENAME,
        isactive: 1,
        remarks:mdata.REMARKS
      });
      m++
    }
    console.log("length",this.newData.imagesArray.length)


    const params = new HttpParams()
      .set('statementtype', mode)
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('userid', this.globalVar.UserId)
      .set('id', this.letterid)
      .set('documenttype', data.doctype)
      .set('deptid', data.DEPTID)
      .set('subjectid', data.SUBJECTID)
      .set('titleid', data.TITLEID)
      .set('documenttext', documenttext)
      .set('lettertype', data.LETTERTYPE)
      .set('accesstoken', this.globalVar.Token);

    this.http.post(this.original_url + "/Masters/CommonMaster/SaveLetter", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe(res => {
        if (this.newData.imagesArray.length! > 0) {
          let progress: number;
          let message: any;
          let resid = res;
          const uploadReq = new HttpRequest('POST', this.original_url + '/Master/Upload/UploadingallFiles?statementtype='+mode+'&userid=' + this.globalVar.UserId + '&module=HR&form=LetterBank&refid=' + resid + '&osservertype=Windows&remarks=&tablename=letter_images&imagesArray=' + JSON.stringify(imageArray) + '&refparentid=1', this.formData, {
            reportProgress: true
          });
          this.http.request(uploadReq).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress){
              progress = Math.round(100 * event.loaded / event.total); 
            }
            if (event.type === HttpEventType.Response){
              this.isLoadingResults=false;
              this.successDialog();
              this.router.navigate(['/letter-bank']);
              message = event.body.toString();
            }
          });          
        }
        else {
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/letter-bank']);
        }
      }, error => {
        this.isLoadingResults = false;
      });
  }
}
