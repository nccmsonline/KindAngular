import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from './../../../../validation/validation.component';
import { Global } from 'src/app/Global';
import { environment } from './../../../../../environments/environment';

import { Component, ViewChild,ElementRef,OnInit, ViewEncapsulation, ViewChildren, SecurityContext } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
// import FileSaver from 'file-saver';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-add-generate-letter',
  templateUrl: './add-generate-letter.component.html',
  styleUrls: ['./add-generate-letter.component.css'],
  providers: [MessageService],
  
  encapsulation: ViewEncapsulation.None
})
export class AddGenerateLetterComponent implements OnInit {
 
  @ViewChildren('employeeFocus') vc;
  @ViewChild('pdf', { static: false }) pdf: ElementRef;
  original_url = environment.baseUrl;
  generateLetterform: FormGroup;
  items: MenuItem[];
  activeIndex: number = 0;
  newData:any={};
  disabledbutton:boolean=true;
  previewDisable:boolean=true;
  nextDisable:boolean=false;
  imgURL:any;
  emptyEmpDisplay = 'block';
  selectedEmpDisplay = 'none';
  multidisplayedColumns: string[] = ['select', '#', 'empno', 'empname'];
  multipledataSource = new MatTableDataSource<any>();
  documentCategory:Array<any>=[];
  departmentDataget:Array<any>=[];
  subjectSingle:Array<any>=[];
  titleSingle:Array<any>=[];
  subjectDataget: Array<any>=[];
  titleDataget: Array<any>=[];
  summary:boolean=false;
  empBgDD = '#5bb75b';
  arrayResumeName='';
  namelistget:Array<any> = [];
  isLoading:boolean=false;
  empListToshow: Array<any> = [];
  checked:boolean=false;
  summarychecked:boolean=false;
  previewLetterArray: any={};
  previewHTML:any={}
  multiPreviewLetterArray: Array<any> = [];
  // Summary
  displayedColumnsSummary: string[] = [ 'empno', 'empname', 'download'];
  dataSourceSummary = new MatTableDataSource<any>();
  summaryListToshow: Array<any> = [];
  employeeListtoSummaryArray: Array<any> = [];
  moduleid:any;
  functionalityid:any;
  userRightCheck:any={};
  canEditCommonClass = '';
  canCreateCommonClass ='';
  canDeleteCommonClass ='';
  routeID: any;
  routeAction: any;
  checkexists:boolean;
  isLoadingResults: boolean;
  // empltype: any;
  notifier: NotifierService;
  newEditCheck = 'click';
  departmentSingle: Array<any> = [];
  resumeDocsDocsArray: Array<any> = [];
  allDocsArray: Array<any> = [];

  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router, notifier: NotifierService,
    public dialog: MatDialog, private activatedRoute: ActivatedRoute,
    private http: HttpClient, private globalVar: Global, private translate: TranslateService
  ) {
    this.notifier = notifier;
    this.isLoadingResults = true;
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.createForm();
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.moduleid= this.activatedRoute.snapshot.paramMap.get('moduleid');
    this.functionalityid= this.activatedRoute.snapshot.paramMap.get('functionalityid');

    // User Right Data Get
    // let Sidebar = sessionStorage.getItem("sidebar");
    // let sidebarDataGet = JSON.parse(Sidebar);
    // let childSidebarDataGet = sidebarDataGet.find(x=>x.moduleid == this.moduleid);
    // this.userRightCheck = childSidebarDataGet.items.find(x=>x.functionalityid == this.functionalityid);
    
    // if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    // if(this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; } 
    // if(this.userRightCheck.candelete == 'True') { this.canDeleteCommonClass = ''; }
    // if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
    // if(this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; } 
    // if(this.userRightCheck.candelete == 'False') { this.canDeleteCommonClass = 'canDeleteCommonClass'; }

    // Tab
    this.items = [{
      label: 'GENERAL',
      command: (event: any) => {
          this.activeIndex = 0;
          this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label});
      }
    },
    {
        label: 'Select Employees',
        command: (event: any) => {
            this.activeIndex = 1;
            this.messageService.add({severity:'info', summary:'Second Step', detail: event.item.label});
        }
    },
    {
        label: 'PREVIEW',
        command: (event: any) => {
            this.activeIndex = 2;
            this.messageService.add({severity:'info', summary:'Third Step', detail: event.item.label});
        }
    }];
  }

  ngOnInit() {
    // Step 1
    
      if(this.routeAction == 'new')
      {
        // this.newData.lettertype = '1';
        // this.newData.emptype = 's';
        // this.empltype = this.newData.lettertype;
        let params1 = new HttpParams();
        params1 = params1.append('fyid', "1");
        params1 = params1.append('coid', this.globalVar.CommpanyId);
        params1 = params1.append('boid', this.globalVar.BranchId);
        this.isLoadingResults = true;
        this.http.get(this.original_url+"/Masters/CommonMaster/getcommonapiletterbank?COID="+this.globalVar.CommpanyId+"&BOID="+this.globalVar.BranchId+"&FYID="+this.globalVar.fyid)
          .subscribe((res) => {
            let fieldArray:any;
            fieldArray = res;
            // this.documentCategory = fieldArray.Table;
            this.allDocsArray = fieldArray.Table;
            this.departmentSingle = fieldArray.Table1;
            this.subjectSingle = fieldArray.Table2;
            this.titleSingle = fieldArray.Table3;
            this.resumeDocsDocsArray=fieldArray.Table8;
            this.newData.lettertype = '1';
            this.newData.emptype = 's';
            this.letterChange();
            this.isLoadingResults=false;
          },error => {
            this.isLoadingResults = false;
          });
      } else if(this.routeAction == 'edit') {
        this.newEditCheck = '';
        // Step 3
        let editparams = new HttpParams();
        editparams = editparams.append('coid', this.globalVar.CommpanyId);
        editparams = editparams.append('boid', this.globalVar.BranchId);
        editparams = editparams.append('id', this.routeID);
        this.isLoadingResults=true;
        this.http.get(this.original_url+"/Masters/CommonMaster/getgeneratedletterdata", {params: editparams})
          .subscribe((res) => {
            this.isLoadingResults = false;
            let fieldArray:any;
            fieldArray = res;
            // this.documentCategory = fieldArray.Table2;
            this.allDocsArray = fieldArray.Table2;
            // this.departmentDataget = fieldArray.Table3;
            this.departmentSingle = fieldArray.Table3;
            this.subjectSingle = fieldArray.Table4;
            this.titleSingle = fieldArray.Table5;
            this.resumeDocsDocsArray=fieldArray.Table6;
            if(fieldArray.Table.length > 0)
            {
              this.newData = fieldArray.Table[0];
            }
            this.newData.lettertype = this.newData.lettertype.toString();
            this.letterChange();
            this.documentCategoryChange(this.newData.documenttype, '')
            this.departmentChange(this.newData.DEPTID, '');
            this.subjectChange(this.newData.SUBJECTID, '');

            // this.empltype = this.documentCategory.find(x => x.id == this.newData.documenttype).empltype;
            // this.empltype = this.newData.lettertype;
            
            this.multiPreviewLetterArray = fieldArray.Table1;
            if(this.newData.lettertype == '1')
            {
              this.employeeListtoSummaryArray = fieldArray.Table1;
            // }

            if(this.newData.emptype == 's')
            {
              this.newData.EMPID = this.newData.empids;
              this.newData.NAME = this.newData.NAME;
              this.empListToshow.push(this.newData.EMPID);
            }
            else if(this.newData.emptype == 'm')
            {
              // let allempArr = fieldArray.Table6;
              // this.multiPreviewLetterArray.forEach((res) => {
              //   allempArr.forEach(element => {
              //     if(res.EMPID == element.id)
              //     {
              //       res.checked = true;
              //     }
              //   });
                
                // this.empListToshow.push(res.id);
                // res.checked = false;
              // });
            }
            this.isLoadingResults=false;
          }
          }, error => {
            this.isLoadingResults = false;
          });
      }
   
  }

  createForm() {
    this.generateLetterform = this.fb.group({

    });
  }

  // start Step 0
  // Letter Type Change
  letterChange() {
    if (this.newData.lettertype == '1') {
      this.documentCategory = this.allDocsArray;
    }
    if (this.newData.lettertype == "2") {
      this.documentCategory = this.allDocsArray;
    }
    if (this.newData.lettertype == '3') {
      this.documentCategory = this.allDocsArray;
    }
  }

  // Step 1
  // Document Category Change
  documentCategoryChange(event, neweditcheck)
  {
    this.newEditCheck = neweditcheck;
    this.departmentDataget = this.departmentSingle.filter(x => x.DOCID == event);
    // this.empltype = this.newData.lettertype;
  }

  // Document Category Close
  documentCategoryClose(neweditcheck)
  {
    this.newEditCheck = neweditcheck;
    this.newData.documenttype = '';
    // this.empltype = this.newData.lettertype;
  }

  // Department Change
  departmentChange(event, neweditcheck)
  {
    this.newEditCheck = neweditcheck;
    this.subjectDataget = this.subjectSingle.filter(x => x.DEPTID == event);
  }

  // Department Close
  departmentClose(neweditcheck)
  {
    this.newEditCheck = neweditcheck;
    this.subjectDataget = [];
    this.titleDataget = [];
  }

  //Subject Change
  subjectChange(event, neweditcheck)
  {
    this.newEditCheck = neweditcheck;
    this.titleDataget = this.titleSingle.filter(x => x.SUBJECTID == event);
  }

  // Subject Close
  subjectClose(neweditcheck)
  {
    this.newEditCheck = neweditcheck;
    this.titleDataget = [];
  }

  // Title Change
  titleChange(event, neweditcheck)
  {
    this.newEditCheck = neweditcheck;
  }

  // Title Close
  titleClose(neweditcheck)
  {
    this.newEditCheck = neweditcheck;
  }
  // End Step 1

  // Start Step 2
  singleMultiChange()
  {
    this.empListToshow = [];
    this.imgURL = [];
    this.newData.NAME = '';
    this.newData.EMPID = '';
    this.employeeListtoSummaryArray = [];
    this.multipledataSource.data.forEach((res) => {
      res.checked = false;
    });
  }

  // Single Employee
  // Filter
  applyFilter(filterValue: string) {
    this.multipledataSource.filter = filterValue.trim().toLowerCase();
  }
  
  // Blank Textbox Click
  clickEmptyRow()
  {
    this.emptyEmpDisplay = 'none';
    this.selectedEmpDisplay = 'block';
    this.newData.EMPID = '';
    this.newData.NAME = '';
    setTimeout(()=>{
      this.vc.first.nativeElement.focus();
    },0);
  }

  // Clear Emp. Data
  clearEmpdata(){
    this.newData.EMPID = '';
    this.newData.NAME = '';
    this.empListToshow = [];
    this.employeeListtoSummaryArray = [];
  }

  // Blank Textbox Close
  closeEmptyRow()
  {
    this.emptyEmpDisplay = 'block';
    this.selectedEmpDisplay = 'none';
    this.newData.EMPID = '';
    this.newData.NAME = '';
    this.arrayResumeName = '';
    this.empListToshow = [];
  }

  // Dropdown Employees Category
  // dropdownEmp()
  // {
  //   this.emptyEmpDisplay = 'none';
  //   this.selectedEmpDisplay = 'block';
  //   setTimeout(()=>{
  //     this.vc.first.nativeElement.focus();
  //   },0);
  // }

  // Dropdown Employees Category Changes
  changeEmployeeMstr(event)
  {
    if(this.newData.empSelect == 'C'){
      this.empBgDD = '#5bb75b';
    } else if(this.newData.empSelect == 'R'){
      this.empBgDD = '#faa732';
    } if(this.newData.empSelect == 'A'){
      this.empBgDD = '#f5f5f5';
    }
    this.newData.EMPID = '';
    this.newData.NAME = '';
    this.arrayResumeName = '';
  }

  // Employee search
  searchEmpName(term, rowDetail)
  {
    this.arrayResumeName = term;
    if(this.arrayResumeName !== '')
    { 
      this.isLoading=true;
      if(this.newData.lettertype == '1')
      {
      this.http.get(this.original_url+"/Masters/CommonMaster/Getemployeelist?PageNumber=1&PageSize=20&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search="+term)
        .subscribe((res) => {
          let allDataGet:any;
          allDataGet = res;
          this.namelistget = allDataGet.Table;
          this.multipledataSource= allDataGet.Table;
          this.isLoading=false;
          if(this.namelistget.length <= 0)
          {
            this.isLoading=false;
            this.arrayResumeName = '';
          }
        });
      }
else
      {
        this.isLoading=true;
        this.http.get(this.original_url+"/HR/Resume/Getresumelist?PageNumber=1&PageSize=50&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search="+this.arrayResumeName+"&useraccesstoken="+this.globalVar.Token)
          .subscribe((res) => {
            let allDataGet:any;
            allDataGet = res;
            this.namelistget = allDataGet.Table;
            this.isLoading=false;
            if(this.namelistget.length <= 0)
            {
              this.isLoading=false;
              this.arrayResumeName = '';
            }
          });
        }
    }
    else
    { 
      this.isLoading=false;
      this.namelistget = [];
      this.arrayResumeName = '';
      rowDetail.name = '';
    }
  }

  // Employee Select
  onChangeOfEmpName(data,rowDetail) {
    if(data)
    {
      console.log("data",data)
      this.empListToshow = [];
      this.employeeListtoSummaryArray = [];
      if(this.newData.lettertype == '1')
      {
      rowDetail.EMPID = data.EMPID;
      rowDetail.NAME = data.NAME;
      }
      else {
        rowDetail.EMPID = data.ID;
        data.EMPID = data.ID;
        rowDetail.NAME = data.NAME;
        console.log("data1",data)
        }
      this.emptyEmpDisplay = 'block';
      this.selectedEmpDisplay = 'none';
      this.arrayResumeName = '';
      this.empListToshow.push(rowDetail.EMPID);
      this.employeeListtoSummaryArray.push(data);
    }
  }

  // Multiple Employee

  // Single Select
  onChangeCheckbox(event, data) {
    console.log("event",event,data)
    if (event.checked == true) {
      if(this.newData.lettertype == '3'){
        data.EMPID = data.id
      }
      this.employeeListtoSummaryArray.push(data);
      this.empListToshow.push(data.EMPID);
      if(this.multipledataSource.data.length == this.empListToshow.length)
      {
        this.checked=true;
      }
      data.colorcode = '#dbead5';
    }
    else {
      this.employeeListtoSummaryArray.splice(this.employeeListtoSummaryArray.indexOf(data.EMPID), 1);
      this.empListToshow.splice(this.empListToshow.indexOf(data.EMPID), 1);
      this.checked=false;
      data.colorcode = '';
    }
    console.log("this.empListToshow",this.empListToshow)
  }

  // Select All
  SelectAllCheckbox(event) {
    if (event.checked == true) {
      this.multipledataSource.data.forEach(element => {
        element.checked = true;
        if(element.checked == true)
        {
          element.colorcode = '#dbead5';
        }
        if(this.newData.lettertype == '3'){
          element.EMPID = element.id
        }
        this.empListToshow.push(element.EMPID);
        this.employeeListtoSummaryArray.push(element);

      });
    }
    else {
      this.multipledataSource.data.forEach(element => {
        element.checked = false;
        if(element.checked == false)
        {
          element.colorcode = '';
        }
        this.empListToshow = [];
        this.employeeListtoSummaryArray = [];;
      });
    }
  }
  // End Step 2

  // Start Step 3

  // End Step 3


  // Summary
   // Summary Single Select
   SummaryonChangeCheckbox(event, data) {
    if (event.checked == true) {
      this.summaryListToshow.push(data.EMPID);
      if(this.dataSourceSummary.data.length == this.summaryListToshow.length)
      {
        this.summarychecked=true;
      }
      data.colorcode = '#dbead5';
    }
    else {
      this.summaryListToshow.splice(this.summaryListToshow.indexOf(data.EMPID), 1);
      this.summarychecked=false;
      data.colorcode = '';
    }
  }

  // Summary Select All
  SummarySelectAllCheckbox(event) {
    if (event.checked == true) {
      this.dataSourceSummary.data.forEach(element => {
        element.summarychecked = true;
        if(element.summarychecked == true)
        {
          element.colorcode = '#dbead5';
        }
        this.summaryListToshow.push(element.EMPID);
      });
    }
    else {
      this.dataSourceSummary.data.forEach(element => {
        element.summarychecked = false;
        if(element.summarychecked == false)
        {
          element.colorcode = '';
        }
        this.summaryListToshow = [];
      });
    }
  }

  // PDF Download
  SinglePDFDownload(rowDetail)
  {
    console.log("empid",rowDetail)
    // let filterArray = this.dataSourceSummary.data;
    // let newdadadat = filterArray.find(x => x.id == rowDetail.id).documenttext;
    // var blob = new Blob([newdadadat], {type: "text/html"});
    // FileSaver.saveAs(blob, "filename");


  //   this.http.get(this.original_url+"/Masters/CommonMaster/downloadhtmlintopdf?docid="+rowDetail.id +"&empid="+rowDetail.EMPID, { responseType: 'blob' })
  //   .subscribe(blob => {
  //     saveAs(blob, 'Letter.pdf', {
  //        type: 'text/plain;charset=windows-1252' // --> or whatever you need here
  //     });
  //  });
  // this.multiPreviewLetterArray.forEach(element => {
    let emparr = this.multiPreviewLetterArray.find(x => x.EMPID == rowDetail.EMPID).DOCUMENTTEXT;
            // });

  rowDetail.EMPID
  let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  
  console.log();

  virtualWindow.document.write( emparr ); 
  
  virtualWindow.document.close(); 
  virtualWindow.focus(); 
      // necessary for IE >= 10 
  setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);   
  }
  
  dropdownHide()
  {
    this.arrayResumeName = '';
  }

  validatenext(activeIndex)
  {
    // if(this.routeAction == 'new')
    // {
      if(this.newData.lettertype != "2")
      {
        // console.log("1", this.empltype);
        this.withEmployeeLetters(activeIndex);
      }
      else if(this.newData.lettertype == "2")
      {
        // console.log("2", this.empltype);
        this.withGeneralDocuments(activeIndex);
      }

      // else if(this.newData.lettertype == '3')
      // {
      //   // console.log("3", this.empltype);
      //   this.withResumeDocuments(activeIndex);
      // }
    // }
    // else if(this.routeAction == 'edit') {
    //   if(this.empltype == '1')
    //   {
    //     this.nextClick(activeIndex);
    //   }
    //   else if(this.empltype == "2")
    //   {
    //     this.nextClick(1);
    //   }
    // }
    
  }

  // General Letters Check Documents
  withGeneralDocuments(activeIndex)
  {
    if(this.activeIndex == 0)
    {
      var flag: boolean;
      flag = true;
      var msg: any;
      msg = "<h5>Please rectify the following before Next Step :-</h5>";
      if (this.newData.documenttype == undefined || this.newData.documenttype == '' || this.newData.documenttype == null) { flag = false; msg = msg + "* Document Category not selected<br/>" }
      if (this.newData.deptid == undefined || this.newData.deptid == '' || this.newData.deptid == null) { flag = false; msg = msg + "* Department not selected<br/>" }
      if (this.newData.subjectid == undefined || this.newData.subjectid == '' || this.newData.subjectid == null) { flag = false; msg = msg + "* Subject not selected<br/>"}
      if (this.newData.titleid == undefined || this.newData.titleid == '' || this.newData.titleid == null) { flag = false; msg = msg + "* Title not selected<br/>"}

      if (flag == false) {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
      else {
        this.isLoadingResults = true;
        if(this.newEditCheck == 'click')
        {
          this.http.get(this.original_url+"/Masters/CommonMaster/checkletterexistdata?doccatgid="+this.newData.documenttype+"&deptid="+this.newData.deptid+"&subid="+this.newData.subjectid+"&titleid="+this.newData.titleid+"&empids=0&lettertype="+this.newData.lettertype+"&boid=" + this.globalVar.BranchId)
          .subscribe((res) => {
            let allDataGet:any;
            allDataGet = res;
            allDataGet=allDataGet.ds
            this.checkexists=allDataGet.Table[0].ISEXISTS;
            this.isLoadingResults = false;
            if(this.checkexists == true)
            {
              this.isLoadingResults = false;
              this.notifier.notify('warning', 'You have already Document Letter');
            }
            else
            {
              this.isLoadingResults = true;
              let params = new HttpParams();
              params = params.append('doccatid', this.newData.documenttype);
              params = params.append('dept', this.newData.deptid);
              params = params.append('subject', this.newData.subjectid);
              params = params.append('title', this.newData.titleid);
              params = params.append('lettertype', this.newData.lettertype);
              params = params.append('empid', '0');
              params = params.append('coid', this.globalVar.CommpanyId);
              params = params.append('boid', this.globalVar.BranchId);
              params = params.append('userid', this.globalVar.userid);
            
              this.http.get(this.original_url+"/Masters/CommonMaster/Getlettertemplate", {params: params})
                .subscribe((res) => {
                  let temp; temp=res;
                  let htmlGet;
                  htmlGet=temp.documenttext
                  temp=temp.ds
                  temp = temp.Table;
                  this.isLoadingResults = false;
                  if(temp.length > 0)
                  {
                    temp = temp[0];
                    let html
                    html=  htmlGet
                      // html=  temp.DOCUMENTTEXT.replace(/(abc)/g,'&nbsp;').trim();
                      // this.newData.DOCUMENTTEXT=html
                    this.multiPreviewLetterArray.push({
                      id: 0,
                      letterid: this.routeID,
                      empid: 0,
                      
                      DOCUMENTTEXT: html
                    });
                    this.nextClick(1);
                  }
                  else
                  {
                    this.isLoadingResults = false;
                    this.notifier.notify('warning', 'You have no document');
                  }
                }, error =>{
                  this.isLoadingResults = false;
                });
            }
          }, error => {
            this.isLoadingResults = false;
          });
        }
        else
        {
          this.nextClick(1);
        }
      }
    }
  }

  // Employee Related Check, HR, Letters
  withEmployeeLetters(activeIndex)
  {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Next Step :-</h5>";
    if(this.activeIndex == 0)
    {
      if (this.newData.documenttype == undefined || this.newData.documenttype == '' || this.newData.documenttype == null) { flag = false; msg = msg + "* Document Category not selected<br/>" }
      if (this.newData.deptid == undefined || this.newData.deptid == '' || this.newData.deptid == null) { flag = false; msg = msg + "* Department not selected<br/>" }
      if (this.newData.subjectid == undefined || this.newData.subjectid == '' || this.newData.subjectid == null) { flag = false; msg = msg + "* Subject not selected<br/>"}
      if (this.newData.titleid == undefined || this.newData.titleid == '' || this.newData.titleid == null) { flag = false; msg = msg + "* Title not selected<br/>"}

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
        this.isLoadingResults = true;
        if(this.newData.lettertype == '1')
        {
        this.http.get(this.original_url+"/Masters/CommonMaster/Getemployeelist?PageNumber=1&PageSize=20&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=")
        .subscribe((res) => {
          this.isLoadingResults = false;
          let allDataGet:any;
          allDataGet = res;
          

          if(this.routeAction == 'edit')
          {
            let allempArr = allDataGet.Table;

            this.multiPreviewLetterArray.forEach(element => {
              this.empListToshow.push(element.EMPID);
            });

            allempArr.forEach((res) => {
              this.multiPreviewLetterArray.forEach(element => {
                  if(element.EMPID == res.EMPID)
                  {
                    res.checked = true;
                  }
                });
              });
              this.multipledataSource.data = allempArr;
          }
          else
          {
            this.multipledataSource.data = allDataGet.Table;
          }
          this.nextClick(activeIndex);
        }, error => {
          this.isLoadingResults = false;
        });
      }
      else{
        this.http.get(this.original_url+"/HR/Resume/Getresumelist?PageNumber=1&PageSize=20&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=&useraccesstoken="+this.globalVar.Token)
        .subscribe((res) => {
          this.isLoadingResults = false;
          let allDataGet:any;
          allDataGet = res;
          

          if(this.routeAction == 'edit')
          {
            let allempArr = allDataGet.Table;

            this.multiPreviewLetterArray.forEach(element => {
              this.empListToshow.push(element.EMPID);
            });

            allempArr.forEach((res) => {
              this.multiPreviewLetterArray.forEach(element => {
                  if(element.EMPID == res.EMPID)
                  {
                    res.checked = true;
                  }
                });
              });
              this.multipledataSource.data = allempArr;
          }
          else
          {
            this.multipledataSource.data = allDataGet.Table;
          }
          this.nextClick(activeIndex);
        }, error => {
          this.isLoadingResults = false;
        });
      }
      }
    }
    if(this.activeIndex == 1)
    {
      if(this.empListToshow.length > 0)
      {
        this.isLoadingResults = true;
        let empids = this.empListToshow.toString();
        if(empids == undefined || empids == null || empids == '')
        {
          this.isLoadingResults = false;
          msg = msg + "* Please select an Employee to generate letter.<br/>";
          const dialogRef = this.dialog.open(ValidationComponent, {
            data: {
              msg: msg,
              action: ''
            }
          });
        }
        else
        {
          this.isLoadingResults=true;
          this.http.get(this.original_url+"/Masters/CommonMaster/checkletterexistdata?doccatgid="+this.newData.documenttype+"&deptid="+this.newData.deptid+"&subid="+this.newData.subjectid+"&titleid="+this.newData.titleid+"&empids="+empids+"&lettertype="+this.newData.lettertype+"&boid=" + this.globalVar.BranchId)
          .subscribe((res) => {
            let allDataGet:any;
            allDataGet = res;
            allDataGet=allDataGet.ds;
            let checkDataExistEmp = allDataGet.Table[0].EMPNAME;
            this.isLoadingResults=false;
              // if(this.newData.emptype == 's')
              // {
                if(this.newEditCheck == 'click')
                {
                  this.checkexists = allDataGet.Table[0].ISEXISTS;
                  if(this.checkexists == true)
                  {
                    this.isLoadingResults = false;
                    this.notifier.notify('warning', 'You have already Document Letter For Employee '+checkDataExistEmp);
                  } 
                  else
                  {
                    this.getLetterTemplate(empids, activeIndex);
                  }
                }
                else
                {
                  this.getLetterTemplate(empids, activeIndex);
                }
              // }
              // else if(this.newData.emptype == 'm')
              // {
              //   if(this.newEditCheck == 'click')
              //   {
              //   // this.multiPreviewLetterArray = checkDataExistEmp.filter(x => x.isexits == false);
              //     if(checkDataExistEmp.length > 0)
              //     {
              //       let emparr = checkDataExistEmp.filter(x => x.ISEXISTS == false);
              //       if(emparr.length > 0)
              //       {
              //         emparr.forEach(element => {
              //           this.empListToshow.push(element.EMPID);
              //         });
              //         let empids = this.empListToshow.toString();
              //         this.getLetterTemplate(empids, activeIndex);
              //       }
              //       else
              //       {
              //         this.isLoadingResults = false;
              //         this.notifier.notify('warning', 'You have already Document Letter');
              //       }
              //     }
              //   }
              //   else
              //   {
              //     this.getLetterTemplate(empids, activeIndex);
              //   }
              // }
          }, error => {
            this.isLoadingResults = false;
          });
        }
      }
      else
      {
        this.isLoadingResults = false;
        msg = msg + "* Please select an Employee to generate letter.<br/>";
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
    }
    else if(this.activeIndex == 2)
    {
      this.nextClick(activeIndex);
    }
  }

// Resume Related Letter of intent
withResumeDocuments(activeIndex)
{
  var flag: boolean;
  flag = true;
  var msg: any;
  msg = "<h5>Please rectify the following before Next Step :-</h5>";
  if(this.activeIndex == 0)
  {
    if (this.newData.documenttype == undefined || this.newData.documenttype == '' || this.newData.documenttype == null) { flag = false; msg = msg + "* Document Category not selected<br/>" }
    if (this.newData.deptid == undefined || this.newData.deptid == '' || this.newData.deptid == null) { flag = false; msg = msg + "* Department not selected<br/>" }
    if (this.newData.subjectid == undefined || this.newData.subjectid == '' || this.newData.subjectid == null) { flag = false; msg = msg + "* Subject not selected<br/>"}
    if (this.newData.titleid == undefined || this.newData.titleid == '' || this.newData.titleid == null) { flag = false; msg = msg + "* Title not selected<br/>"}

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
      this.isLoadingResults = true;
      this.http.get(this.original_url+"/HR/Resume/Getresumelist?PageNumber=1&PageSize=20&sort=&sortorder=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=&useraccesstoken="+this.globalVar.Token)
      .subscribe((res) => {
        this.isLoadingResults = false;
        let allDataGet:any;
        allDataGet = res;
        

        if(this.routeAction == 'edit')
        {
          let allempArr = allDataGet.Table;

          this.multiPreviewLetterArray.forEach(element => {
            this.empListToshow.push(element.EMPID);
          });

          allempArr.forEach((res) => {
            this.multiPreviewLetterArray.forEach(element => {
                if(element.EMPID == res.EMPID)
                {
                  res.checked = true;
                }
              });
            });
            this.multipledataSource.data = allempArr;
        }
        else
        {
          this.multipledataSource.data = allDataGet.Table;
        }
        this.nextClick(activeIndex);
      }, error => {
        this.isLoadingResults = false;
      });
    }
  }
  if(this.activeIndex == 1)
  {
    if(this.empListToshow.length > 0)
    {
      this.isLoadingResults = true;
      let empids = this.empListToshow.toString();
      if(empids == undefined || empids == null || empids == '')
      {
        this.isLoadingResults = false;
        msg = msg + "* Please select an Employee to generate letter.<br/>";
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
      else
      {
        this.isLoadingResults=true;
        this.http.get(this.original_url+"/Masters/CommonMaster/checkletterexistdata?doccatgid="+this.newData.documenttype+"&deptid="+this.newData.deptid+"&subid="+this.newData.subjectid+"&titleid="+this.newData.titleid+"&empids=0&lettertype="+this.newData.lettertype+"&boid=" + this.globalVar.BranchId)
        .subscribe((res) => {
          let allDataGet:any;
          allDataGet = res;
          allDataGet=allDataGet.ds
          let checkDataExistEmp = allDataGet.Table;
          this.isLoadingResults=false;
            if(this.newData.emptype == 's')
            {
              if(this.newEditCheck == 'click')
              {
                this.checkexists = allDataGet.Table[0].ISEXISTS;
                if(this.checkexists == true)
                {
                  this.isLoadingResults = false;
                  this.notifier.notify('warning', 'You have already Document Letter');
                } 
                else
                {
                  this.getLetterTemplate(empids, activeIndex);
                }
              }
              else
              {
                this.getLetterTemplate(empids, activeIndex);
              }
            }
            else if(this.newData.emptype == 'm')
            {
              if(this.newEditCheck == 'click')
              {
              // this.multiPreviewLetterArray = checkDataExistEmp.filter(x => x.isexits == false);
                if(checkDataExistEmp.length > 0)
                {
                  let emparr = checkDataExistEmp.filter(x => x.ISEXISTS == false);
                  if(emparr.length > 0)
                  {
                    emparr.forEach(element => {
                      this.empListToshow.push(element.EMPID);
                    });
                    let empids = this.empListToshow.toString();
                    this.getLetterTemplate(empids, activeIndex);
                  }
                  else
                  {
                    this.isLoadingResults = false;
                    this.notifier.notify('warning', 'You have already Document Letter');
                  }
                }
              }
              else
              {
                this.getLetterTemplate(empids, activeIndex);
              }
            }
        }, error => {
          this.isLoadingResults = false;
        });
      }
    }
    else
    {
      this.isLoadingResults = false;
      msg = msg + "* Please select an Employee to generate letter.<br/>";
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    }
  }
  else if(this.activeIndex == 2)
  {
    this.nextClick(activeIndex);
  }
}

  getLetterTemplate(empids, activeIndex)
  {

    if(this.newData.lettertype == "2") {empids=0}
    this.isLoadingResults = true;
    this.http.get(this.original_url+"/Masters/CommonMaster/Getlettertemplate?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.UserId+"&doccatid="+this.newData.documenttype+"&dept="+this.newData.deptid+"&subject="+this.newData.subjectid+"&title="+this.newData.titleid+"&lettertype="+this.newData.lettertype+"&empid="+empids)
      .subscribe((res) => {
        let allDataGet:any;
        this.previewHTML=res;
        allDataGet = res;
        allDataGet=allDataGet.ds
        this.isLoadingResults = false;
        if(allDataGet.Table.length > 0)
        {
          let singleArray = [];
          singleArray = allDataGet.Table1;
          this.previewLetterArray = allDataGet.Table[0];
         
          singleArray.forEach((element)=> {
            console.log("111",this.previewHTML.documenttext)
            element.DOCUMENTTEXT = this.previewHTML.documenttext;
            for (let key in element) {
              element.DOCUMENTTEXT = element.DOCUMENTTEXT.replaceAll("{{data."+key+"}}", element[key]);
              let html,html1,html2
              html=element.DOCUMENTTEXT
              // html=element.DOCUMENTTEXT.replace(/(abc)/g,'&nbsp;').trim();
              // html1=html.replace(/("\")/g,' ').trim();
              // html2=html1.replace(/(\">)/g,'">').trim();
              console.log("html2",html)
              element.DOCUMENTTEXT=html
            }
          });
         
         
          this.multiPreviewLetterArray = singleArray;
          console.log("this.multiPreviewLetterArray",this.multiPreviewLetterArray)
          this.nextClick(activeIndex);
        }
      }, error => {
        this.isLoadingResults = false;
      });
  }

  // checkemployeeletterexists(empids){
  //   this.isLoadingResults = true;
  //   console.log(empids,"empids");
    
  // }

  // Preview Click
  previewClick(activeIndex)
  {
    console.log("activeIndex",activeIndex)
    this.isLoadingResults = true;
    this.summary = false;
    if(this.newData.lettertype == '1')
    {
      this.activeIndex = activeIndex - 1;
      if(this.activeIndex == 0)
      {
        this.isLoadingResults = false;
        this.previewDisable = true;
        this.nextDisable = false;
      }
      else if(this.activeIndex == 1)
      {
        this.isLoadingResults = false;
        this.previewDisable = false;
        this.nextDisable = false;
        this.empListToshow=[];
      }
      else if(this.activeIndex == 2)
      {
        this.isLoadingResults = false;
        this.previewDisable = false;
        this.nextDisable = true;
      }
    }
    else if(this.newData.lettertype == "2")
    {
      this.isLoadingResults = false;
      this.activeIndex = 0;
      this.previewDisable = true;
      this.nextDisable = false;
    }
    
  }

  // Next Click
  nextClick(activeIndex)
  {
    this.isLoadingResults = true;
    this.summary = false;
    this.activeIndex = activeIndex + 1;
    if(this.activeIndex == 0)
    {
      this.isLoadingResults = false;
      this.nextDisable = true;
      this.previewDisable = false;
    }
    else if(this.activeIndex == 1)
    {
      this.isLoadingResults = false;
      this.previewDisable = false;
      this.nextDisable = false;
    }
    else if(this.activeIndex == 2)
    {
      if(this.newEditCheck == '')
      {
        // let empids = this.empListToshow.toString();
        // this.http.get(this.original_url+"/Masters/CommonMasters/Getlettertemplate?coid="+this.globalVar.coid+"&boid="+this.globalVar.boid+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.userid+"&doccatid="+this.newData.documenttype+"&dept="+this.newData.deptid+"&subject="+this.newData.subjectid+"&title="+this.newData.titleid+"&empid="+empids)
        //   .subscribe((res) => {
        //     this.isLoadingResults = false;
        //     let allDataGet:any;
        //     allDataGet = res;
        //     if(allDataGet.Table.length > 0)
        //     {
        //       let singleArray = [];
        //       singleArray = allDataGet.Table1;
              // this.previewLetterArray = allDataGet.Table[0];

              // singleArray.forEach((element)=> {
              //   element.documenttext = this.previewLetterArray.documenttext;
              //   for (let key in element) {
              //     element.documenttext = element.documenttext.replaceAll("{{data."+key+"}}", element[key]);
              //   }
              // });

          //     this.multiPreviewLetterArray = singleArray;
          //   }
          // }, error => {
          //   this.isLoadingResults = false;
          // });
      }
      this.isLoadingResults = false;
      this.nextDisable = true;
      this.previewDisable = false;
    }
  }

  finishValidate()
  {
    this.isLoadingResults = true;
    let action: any;
    let newEmpArr = [];
    let headerDetail: Array<any>=[];
    let detailArray: Array<any> = [];
    if(this.routeAction == 'new') { action = 'Insert' } else { action = 'Update' }
    
    this.employeeListtoSummaryArray.forEach((res) => {
      newEmpArr.push(res.EMPID);
    });

    let empidnew

    if(this.newData.lettertype == "2") {empidnew=0}
    else{empidnew= newEmpArr.toString() }

    // Header Array
    headerDetail.push({
      id : this.routeID,
      documenttype : this.newData.documenttype,
      deptid : this.newData.deptid,
      subjectid : this.newData.subjectid,
      titleid : this.newData.titleid,     
      empids: empidnew, 
      emptype: this.newData.emptype,
      lettertype: this.newData.lettertype,
      coid : this.globalVar.CommpanyId,
      boid : this.globalVar.BranchId,
      createdby : this.globalVar.UserId,
      createdon : '',
      modifiedby : this.globalVar.UserId,
      modifiedon : ''
    });

    let l = 0;
  
    for(let mdata of this.multiPreviewLetterArray)
    {
      let html,html1,empidnew1
      if(this.newData.lettertype == "2") {empidnew1=0}
      else{empidnew1= mdata.EMPID }


      
      html=  mdata.DOCUMENTTEXT
      // html=  this.globalVar.removeNBSP(mdata.DOCUMENTTEXT);
      console.log("html",html)
      // html1=html.replace(/("\")/g,' ').trim();
      detailArray.push({
        id: 'A',
        letterid: this.routeID,
        empid:empidnew1,
        documenttext: html
      });
      l++;
    }
    console.log("detailArray",detailArray)

    const params = new HttpParams()
      .set('statementtype', action)
      .set('userid', this.globalVar.UserId)
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('hdrarray', JSON.stringify(headerDetail))
      .set('dtlarray', JSON.stringify(detailArray))
      .set('accesstoken', this.globalVar.Token);

    this.http.post(this.original_url + "/Masters/CommonMaster/SavegeneratedLetter", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        this.isLoadingResults = false;
        let allDataGet :any;
        allDataGet=res;
        if(this.newData.lettertype != "2")
        {
          console.log("npid",this.dataSourceSummary.data)
          this.summary = true;
          this.dataSourceSummary.data = this.multiPreviewLetterArray;
          this.dataSourceSummary.data.forEach(element => {
            element.EMPID=element.EMPID;
            element.id=allDataGet;
          });
        }
        else if(this.newData.lettertype == "2")
        {
          this.successDialog();
          this.router.navigate(['/generate-letter']);
        }
        
      },
      error => {
        this.isLoadingResults = false;
      });
  }

  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
  
  publishDataFunction(){
  }

}
