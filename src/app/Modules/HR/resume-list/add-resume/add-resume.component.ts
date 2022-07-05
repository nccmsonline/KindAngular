import { Global } from 'src/app/Global';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-resume',
  templateUrl: './add-resume.component.html',
  styleUrls: ['./add-resume.component.css']
})
export class AddResumeComponent implements OnInit {

  original_url=environment.baseUrl;
  resumeHeaderForm: FormGroup;
  postAppliedArray:Array<any>=[];
  sourceArray:Array<any>=[];
  skillSetArray:Array<any>=[];
  getData:any;
  minDate = "1947-08-15";
  newData:any={};
  newQualification:any={};
  qualificationArray:Array<any>=[];
  editItemID: any={};
  isLoadingResults:boolean=false;
  isloading:boolean=false;
  msgshow:boolean=true;
  newExperience:any={};
  experienceArray:Array<any>=[];
  experienceEditItemID: any={};
  notifier: NotifierService;
  ageArray:Array<any>=[];
  ageValue:any;
  yearArray:Array<any>=[];
  monthArray:Array<any>=[];
  action:any; 
  resumeID:any;
  myDate = new Date();
  disabledStyle='none';
  degreeArray:Array<any>=[];
  editSkillArray:Array<any>=[];
  editCategoryArray:Array<any>=[];
  minFromDate:any;
  industryArray:Array<any>=[];
  previousUrl: string;
  DOBdate:any;
  sorucearray:any;
  departmentArray:Array<any>=[];
  customerForm: FormGroup;
  arrayResumeName='';
  namelistget:Array<any> = [];
  isLoading:boolean=false;
  releventYearArray:Array<any> = [];
  releventMonthArray:Array<any> = [];
  yopArray:Array<any> = [];
  emailMsg: boolean= false;
  moduleid:any;
  functionalityid:any;
  userRightCheck:any={};
  newHealthData:any={};
  canEditCommonClass = '';
  canCreateCommonClass ='';
  canDeleteCommonClass ='';
  // relation
  RelationArray:Array<any> = [];
  newRelation:any={};
  relationEditItemID: any={};

  bankArray:Array<any> = [];
  relationArray:Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    notifier: NotifierService, private globalVar: Global,
    // private resumeListService: ResumeListService,
    public dialog: MatDialog,private translate: TranslateService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.resumeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.moduleid= this.activatedRoute.snapshot.paramMap.get('moduleid');
    this.functionalityid= this.activatedRoute.snapshot.paramMap.get('functionalityid');

    // User Right Data Get
    let Sidebar = sessionStorage.getItem("sidebar");
    let sidebarDataGet = JSON.parse(Sidebar);
    // let childSidebarDataGet = sidebarDataGet.find(x=>x.moduleid == this.moduleid);
    // this.userRightCheck = childSidebarDataGet.items.find(x=>x.functionalityid == this.functionalityid);
    if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    if(this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; } 
    if(this.userRightCheck.candelete == 'True') { this.canDeleteCommonClass = ''; }
    if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
    if(this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; } 
    if(this.userRightCheck.candelete == 'False') { this.canDeleteCommonClass = 'canDeleteCommonClass'; }

    this.notifier = notifier;
    this.createForm();

    // Age Array
    for(let i=16;i<=70;i++){
      this.ageArray.push(i);
    }

    // Year Array
    for(let j=0;j<=60;j++){
      this.yearArray.push(j);
      this.releventYearArray.push(j);
    }

    // Month Array
    for(let k=0;k<=11;k++){
      this.monthArray.push(k);
      this.releventMonthArray.push(k);
    }

    let todayDateChange; let commondate;
    todayDateChange = formatDate(this.myDate, 'yyyy', 'en-US');
    commondate = todayDateChange - 16;
    
    this.DOBdate = commondate+"-01-01";

    // Year of passing
    for(let k=1950;k<=todayDateChange;k++){
      this.yopArray.push(k);
    }

    this.newData.TOTEXPYY = 0;
    this.newData.TOTEXPMM = 0;
    this.newExperience.TOTEXPYY = 0;
    this.newExperience.TOTEXPMM = 0;
    this.newExperience.relevantexpyy = 0;
    this.newExperience.relevantexpmm = 0;


      if(this.action == 'new')
      {
        this.isLoadingResults=true;
        this.http.get(this.original_url+"/HR/Resume/getcommonapi?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId)
          .subscribe((res)=>{
            this.getData = res;
            this.postAppliedArray = this.getData.Table;
            this.sourceArray = this.getData.Table1;
            this.skillSetArray = this.getData.Table2;
            this.degreeArray = this.getData.Table3;
            this.industryArray = this.getData.Table4;
            this.sorucearray=this.getData.Table5;
            this.newData.STATUSID=this.sorucearray[0].id;
            this.departmentArray=this.getData.Table6;
            this.bankArray=this.getData.Table7;
            this.relationArray=this.getData.Table8;
            this.isLoadingResults=false;
          });
      } 
      else if(this.action == 'edit')
      {
        this.editFunction(this.resumeID);
      }
    
  }

  editFunction(id)
  {
    this.isLoadingResults=true
    this.disabledStyle='auto';
    this.msgshow=false;
    this.http.get(this.original_url+"/HR/Resume/GetResumedetails?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&resumeid="+id)
      .subscribe((res)=>{
        this.getData = res;
        this.experienceArray = this.getData.Table1;
        this.qualificationArray = this.getData.Table2;
        this.newData= this.getData.Table[0];
        this.editSkillArray = this.getData.Table3;
        this.editCategoryArray = this.getData.Table4;
        this.postAppliedArray = this.getData.Table5;
        this.sourceArray = this.getData.Table6;
        this.skillSetArray = this.getData.Table7;
        this.degreeArray = this.getData.Table8;
        this.industryArray = this.getData.Table9;
        this.sorucearray=this.getData.Table10;
        this.departmentArray=this.getData.Table11;
        this.bankArray=this.getData.Table12;
        this.relationArray=this.getData.Table13;
        this.RelationArray=this.getData.Table14;
        this.newHealthData.BLOODGROUP=this.newData.BLOODGROUP;
        this.newHealthData.HEIGHT=this.newData.HEIGHT;
        this.newHealthData.WEIGHT=this.newData.WEIGHT;
        this.newHealthData.POWERLENSLEFT=this.newData.POWERLENSLEFT;
        this.newHealthData.POWERLENSRIGHT=this.newData.POWERLENSRIGHT;
        this.newHealthData.PHYSICALIMPAIRMENTS=this.newData.PHYSICALIMPAIRMENTS;
        this.newHealthData.SMOKER=this.newData.SMOKER;
        this.newHealthData.MAJORILLNESS=this.newData.MAJORILLNESS;
        this.newHealthData.IDENTIFICATIONMARKS=this.newData.IDENTIFICATIONMARKS;
 
        // Skill Set
        let editSkillDetail:Array<any>=[];
        for(let i=0;i<this.editSkillArray.length;i++){
          editSkillDetail.push(this.editSkillArray[i].SKILLID);
        }
        this.newData.SKILLID = editSkillDetail;

        // Post Applied For
        let editCategoryDetail:Array<any>=[];
        for(let i=0;i<this.editCategoryArray.length;i++){
          editCategoryDetail.push(this.editCategoryArray[i].CATEGORYID);
        }
        this.newData.CATEGORYID = editCategoryDetail;
        this.isLoadingResults=false;
      });
  }

  ngOnInit() {
  }

  createForm() {
    this.resumeHeaderForm = this.fb.group({
      RESUMENO:'',
      SOURCEID: '',
      SKILLID: '',
      CATEGORYID: '',
      NAME: '',
      COMMADDRESS:'',
      GENDER: '',
      DOB: '',
      AGE: '',
      PHONE: '',
      OTHERCONTACTNO:"",
      CURRENTSALARY: '',
      EXPECTEDSALARY: '',
      LASTINDUSTRYSEGMENT: '',
      EMAIL: '',
      TOTEXPYY: '',
      TOTEXPMM: '',
      FATHERNAME: '',
      HOMETOWN: '',
      CURRENTLOCATION: '',
      REFERENCES: '',
      REMARKS: ''
    });
  }

  emailcheck(EMAIL)
  {
    if(EMAIL.errors != null)
    {
      this.emailMsg = true;
    }
    else
    {
      this.emailMsg = false;
    }
  }

  isFieldValid(field: string) {
    return !this.customerForm.get(field).valid && this.customerForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }
  // Qualification Grid Data Add
  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
      if(data.QUALIFICATIONID==undefined||data.QUALIFICATIONID==0||data.QUALIFICATIONID=='' )
      {flag=false; msg=msg+"* Degree / Certificate not seletect<br/>"}
      // if(data.INSTITUE==undefined||data.INSTITUE=='' )
      // {flag=false; msg=msg+"University / Institution not entred"+'\n'}
      // if(data.PASSINGYEAR==undefined||data.PASSINGYEAR=='' )
      // {flag=false; msg=msg+"Year of passing not entred"+'\n'}
      // if(data.GRADES==undefined||data.GRADES=='' )
      // {flag=false; msg=msg+"Grade / Division not entred"+'\n'}
      if(flag==false) {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
    return flag;
  }

  addQualification(newQualification)
  {
    if(this.validateDetail(newQualification))
    {
      this.qualificationArray.push(this.newQualification);
      this.qualificationArray.forEach((item,index) => {
        var num = 'id';
        var value = 0;
        item[num] = value;
      });
      this.newQualification = {};
    }
  }

  removeQualification(index){
    this.qualificationArray.splice(index,1);
  }
  
  editQualification(val){
    this.editItemID = val;
  }

  updateQualification(val){
    if(this.validateDetail(val))
    {
      this.editItemID = {};
    }
  }

  // Experience Grid Data Add

  validateExperienceDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
      if(data.ORGANIZATION==undefined||data.ORGANIZATION=='' )
      {flag=false; msg=msg+"* Company / Organization not entered<br/>"}
      if(flag==false) {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
    return flag;
  }

  addExperience(newExperience)
  {
    if(this.validateExperienceDetail(newExperience))
    {
      this.experienceArray.push(this.newExperience);
      this.experienceArray.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newExperience = {};
    }
  }

  removeExperience(index){
    this.experienceArray.splice(index,1);
  }
  
  editExperience(val){
    this.experienceEditItemID = val;
  }

  updateExperience(val){
    if(this.validateExperienceDetail(val))
    {
      this.experienceEditItemID = {};
    }
  }

  // relation
  addRelation(newRelation)
  {
    if(this.validateRelationDetail(newRelation))
    {
      this.RelationArray.push(this.newRelation);
      this.RelationArray.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newRelation = {};
    }
  }
  validateRelationDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
      if(data.NAME==undefined||data.NAME=='')
      {flag=false; msg=msg+"* Name not entered<br/>"}
      if( data.RELATIONID==undefined||data.RELATIONID=='')
      {flag=false; msg=msg+"* Relation not Selected<br/>"}
      if(flag==false) {
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: msg,
            action: ''
          }
        });
      }
    return flag;
  }
  removeRelation(index){
    this.RelationArray.splice(index,1);
  }
  
  editRelation(val){
    this.relationEditItemID = val;
  }

  updateRelation(val){
    if(this.validateExperienceDetail(val))
    {
      this.experienceEditItemID = {};
    }
  }

  // name focusout
  focusoutResumeName()
  {
    this.arrayResumeName = '';
  }

  // name search
  searchResumeName(term, rowDetail)
  {
    this.arrayResumeName = term;
    if(this.arrayResumeName !== '')
    { 
      this.isLoading=true;
      this.http.get(this.original_url+"/HR/Resume/checkresumedata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&search="+term)
      .subscribe((response: any[]) => {
        this.isLoading=false;
        let allDataGet:any;
        allDataGet = response;
        this.namelistget = allDataGet.Table;
        if(this.namelistget.length <= 0)
        {
          this.isLoading=false;
          this.arrayResumeName = '';
        }
      });
    }
    else
    { 
      this.isLoading=false;
      this.namelistget = [];
      this.arrayResumeName = '';
      rowDetail.NAME = '';
    }
  }

  onChangeOfResumeName(data,rowDetail) {
    if(data)
    {
      console.log("onChangeOfResumeName function clicked",data.ID)
      this.editFunction(data.ID);
      // rowDetail.Name = data.Name;
      this.arrayResumeName = '';
    }
  }

  // Last Industry Segment Change
  lastSegmentChanged(event, rowDetail)
  {
    console.log(event,"event")
    rowDetail.LASTINDUSTRYSEGMENTNAME = this.industryArray.find(x=>x.ID == event).LASTINDUSTRYSEGMENT;
  }

  // Department Dropdown Change
  deptChanged(event, rowDetail)
  {
    rowDetail.DEPTNAME = this.departmentArray.find(x=>x.ID==event.ID).DEPTNAME;
  }

  relationChanged(event, rowDetail){
    rowDetail.NAME1 = this.relationArray.find(x=>x.ID==event).NAME;
  }

  dropdownHide(){
    this.arrayResumeName = '';
  }

  // DOB Change Validation
  dateChange(data) {
    var d2 = this.myDate;
    var  d1 = data.value;
    var months; var month; var year;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    month=months%12+1;
    year=(months-(month-1))/12;
    this.newData.AGE = year;
  }

  // From Date Change
  fromDateFocusout(event, rowDetail)
  {
    let yourDate: Date = new Date(event + ' UTC');
    rowDetail.EXPFROM = yourDate;

    if(rowDetail.EXPTO != undefined)
    {
      var d2 = rowDetail.EXPTO;
      var  d1 = rowDetail.EXPFROM;
      var months; var month; var year;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth() + 1;
      months += d2.getMonth();
      month=months%12+1;
      year=(months-(month-1))/12;
      rowDetail.TOTEXPMM = month;
      rowDetail.TOTEXPYY = year;

      // Relevent Year Array
      this.releventYearArray = [];
      this.releventMonthArray = [];
      for(let j=0;j<=rowDetail.TOTEXPYY;j++){
        this.releventYearArray.push(j);
      }

      // Relevent Month Array
      for(let k=0;k<=rowDetail.TOTEXPMM;k++){
        this.releventMonthArray.push(k);
      }
    }
  }

  FromDateChange(event, rowDetail)
  {
    this.minFromDate = event.value;
    if(rowDetail.EXPTO != undefined)
    {
      var d2 = rowDetail.EXPTO;
      var d1 = event.value;
      var months; var month; var year;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth() + 1;
      months += d2.getMonth();
      month=months%12+1;
      year=(months-(month-1))/12;
      if(month == 12)
      {
        rowDetail.TOTEXPMM = 0;
        rowDetail.TOTEXPYY = year+1;
      }
      else
      {
        rowDetail.TOTEXPMM = month;
        rowDetail.TOTEXPYY = year;
      }

      // Relevent Year Array
      this.releventYearArray = [];
      this.releventMonthArray = [];
      for(let j=0;j<=rowDetail.TOTEXPYY;j++){
        this.releventYearArray.push(j);
      }

      // Relevent Month Array
      for(let k=0;k<=rowDetail.TOTEXPMM;k++){
        this.releventMonthArray.push(k);
      }
    }
  }

  // Total Exp. Year
  totelExpYyChange(event, rowDetail)
  {
    // Relevent Year Array
    this.releventYearArray = [];
    for(let j=0;j<=rowDetail.TOTEXPYY;j++){
      this.releventYearArray.push(j);
    }
  }

  // Total Exp. Month
  totelExpMmChange(event, rowDetail)
  {
    // Relevent Year Array
    this.releventMonthArray = [];
    for(let k=0;k<=rowDetail.TOTEXPMM;k++){
      this.releventMonthArray.push(k);
    }
  }

  // To Change
  toDateFocusout(event, rowDetail)
  {
    let yourDate: Date = new Date(event + ' UTC');
    rowDetail.EXPTO = yourDate;
    if(rowDetail.EXPFROM != undefined)
    {
      var d2 = rowDetail.EXPTO;
      var d1 = rowDetail.EXPFROM;
      var months; var month; var year;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth() + 1;
      months += d2.getMonth();
      month=months%12+1;
      year=(months-(month-1))/12;
      if(month == 12)
      {
        rowDetail.TOTEXPMM = 0;
        rowDetail.TOTEXPYY = year+1;
      }
      else
      {
        rowDetail.TOTEXPMM = month;
        rowDetail.TOTEXPYY = year;
      }
      
      // Relevent Year Array
      this.releventYearArray = [];
      this.releventMonthArray = [];
      for(let j=0;j<=rowDetail.TOTEXPYY;j++){
        this.releventYearArray.push(j);
      }

      // Relevent Month Array
      for(let k=0;k<=rowDetail.TOTEXPMM;k++){
        this.releventMonthArray.push(k);
      }
    }
  }

  ToDateChange(event, rowDetail)
  {
    if(rowDetail.EXPFROM != undefined)
    {
      var d2 = event.value;
      var d1 = this.minFromDate;
      var months; var month; var year;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth() + 1;
      months += d2.getMonth();
      month=months%12+1;
      year=(months-(month-1))/12;
      
      if(month == 12)
      {
        rowDetail.TOTEXPMM = 0;
        rowDetail.TOTEXPYY = year+1;
      }
      else
      {
        rowDetail.TOTEXPMM = month;
        rowDetail.TOTEXPYY = year;
      }

      // Relevent Year Array
      this.releventYearArray = [];
      this.releventMonthArray = [];
      for(let j=0;j<=rowDetail.TOTEXPYY;j++){
        this.releventYearArray.push(j);
      }

      // Relevent Month Array
      for(let k=0;k<=rowDetail.TOTEXPMM;k++){
        this.releventMonthArray.push(k);
      }
    }
  }

  // Success Message
  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  // Age Change
  ageChangeFunction(event)
  {
    let todayDateChange; let commondate;
    todayDateChange = formatDate(this.myDate, 'yyyy', 'en-US');
    commondate = todayDateChange - event;
    this.newData.DOB = commondate+"-01-01";
  }

  deptChangeFunction(event)
  {
    if(event != undefined)
    {
      this.isloading=true;
      this.http.get(this.original_url+"/HR/Resume/getresumeno?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&deptid="+event.DEPTID)
      .subscribe((res: any[]) => {
        this.getData = res;
        this.newData.RESUMENO = this.getData.Table[0].RESUMENO;
        this.isloading=false;
      });
    }
  }
  
  // Qualification Change
  qualificationChange(event, rowDetail)
  {
    rowDetail.QUALIFICATION = this.degreeArray.find(x => x.ID == event.ID).QUALIFICATION;
  }

  // Validation
  validateBeforeSave(hdata,action){
    var flag: boolean;
      flag = true;
      var msg: any;
      msg = "<h5>Please rectify the following before Saving Data :-</h5>";
      if (this.newData.CATEGORYID == undefined || this.newData.CATEGORYID == '' || this.newData.CATEGORYID == 0) { flag = false; msg = msg + "* Post Applied For not selected<br/>"}
      if (this.newData.SOURCEID == undefined || this.newData.SOURCEID == '' || this.newData.SOURCEID == 0) { flag = false; msg = msg + "* Source Not Selected<br/>"}
      if (this.newData.NAME == undefined || this.newData.NAME == '' || this.newData.NAME == 0) { flag = false; msg = msg + "* Name not Entered<br/>"}
      if (this.newData.PHONE == undefined || this.newData.PHONE == '' || this.newData.PHONE == 0) { flag = false; msg = msg + "* Contact No. not Entered<br/>"}
      if (this.newData.CURRENTLOCATION == undefined || this.newData.CURRENTLOCATION == '' || this.newData.CURRENTLOCATION == 0) { flag = false; msg = msg + "* Current Location not Entered<br/>"}
      if (this.newData.AGE == undefined || this.newData.AGE == '' || this.newData.AGE == 0) { flag = false; msg = msg + "* Age Selected<br/>"}
      if (this.newData.GENDER == undefined || this.newData.GENDER == '' || this.newData.GENDER == 0) { flag = false; msg = msg + "* Gender not selected<br/>"}
      if (this.newData.CO_DEPTID == undefined || this.newData.CO_DEPTID == '' || this.newData.CO_DEPTID == 0) { flag = false; msg = msg + "* Department not selected<br/>"}
      if (this.emailMsg == true ){flag = false; msg = msg + "* Email is wrong<br/>"}
      if (this.newData.AADHARNO == undefined || this.newData.AADHARNO == '' || this.newData.AADHARNO == 0) { flag = false; msg = msg + "* Aadhar No. not Entered<br/>"}

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
        this.saveHeader(hdata, action);
      }
  }

  // editresume(id){
  //   this.router.navigate(['/resumecv/add-resume/'+this.userRightCheck.moduleid+'/'+this.userRightCheck.functionalityid+'/'+id+'/edit']);
  // }

  // viewresume(id){
  //   this.router.navigate(['/resumecv/add-resume/'+this.userRightCheck.moduleid+'/'+this.userRightCheck.functionalityid+'/'+id+'/view']);
  // }

  //Save Header Data
  saveHeader(hdata, action)
  {
    this.isLoadingResults=true;
    let DOB:any; let CO_DEPTID;
    let resumeHeader: Array<any> = [];
    if(hdata.SKILLID == undefined) {hdata.SKILLID = []}
    if(hdata.FATHERNAME == undefined) {hdata.FATHERNAME = ''}
    if(hdata.TOTEXPYY == undefined) {hdata.TOTEXPYY = 0}
    if(hdata.DOB==undefined || hdata.DOB==null || hdata.DOB==''){DOB=''} else{DOB=formatDate(hdata.DOB, 'yyyy-MM-dd ', 'en-US');}
    if(hdata.TOTEXPMM == undefined) {hdata.TOTEXPMM = 0}
    if(hdata.HOMETOWN == undefined) {hdata.HOMETOWN = ''}
    if(hdata.EMAIL == undefined) {hdata.EMAIL = ''}
    if(hdata.REFERENCES == undefined) {hdata.REFERENCES = ''}
    if(hdata.REMARKS == undefined) {hdata.REMARKS = ''}
    if(hdata.EXPECTEDSALARY == undefined || hdata.EXPECTEDSALARY =='') {hdata.EXPECTEDSALARY = 0}
    if(hdata.OTHERCONTACTNO == undefined) {hdata.OTHERCONTACTNO = ''}
    if(hdata.CURRENTSALARY == undefined || hdata.CURRENTSALARY =='') {hdata.CURRENTSALARY = 0}
    if(hdata.LASTINDUSTRYSEGMENT == undefined) {hdata.LASTINDUSTRYSEGMENT = 0}
    if(hdata.COMMADDRESS==undefined){hdata.COMMADDRESS=''}
    if(hdata.CO_DEPTID==undefined){CO_DEPTID=0} else {CO_DEPTID = hdata.CO_DEPTID}
    this.globalVar.checknull(hdata.AADHARNO,'string')
    this.globalVar.checknull(hdata.PANNO,'string')
    this.globalVar.checknull(hdata.BANKBRANCH,'string')
    this.globalVar.checknull(hdata.ACCOUNTNO,'number')
    this.globalVar.checknull(hdata.IFSC,'string')
    this.globalVar.checknull(hdata.REASONLEAVING,'string')
    this.globalVar.checknull(hdata.JOININGPERIOD,'string')
    this.globalVar.checknull(hdata.STRENGTH,'string')
    this.globalVar.checknull(hdata.WEEKNESS,'string')
    this.globalVar.checknull(hdata.INTERESTAREA,'string')
    this.globalVar.checknull(hdata.BANKID,'number')
    this.globalVar.checknull(hdata.REFERENCESCONTACT,'number')


    resumeHeader.push(
    {
      ID: this.resumeID,
      SOURCEID: hdata.SOURCEID,
      NAME: hdata.NAME,
      GENDER: hdata.GENDER,
      DOB: DOB,
      AGE: hdata.AGE,
      STATUSID: hdata.STATUSID,
      PHONE: hdata.PHONE,
      OTHERCONTACTNO: hdata.OTHERCONTACTNO,
      EMAIL: hdata.EMAIL,
      TOTEXPYY: hdata.TOTEXPYY,
      TOTEXPMM: hdata.TOTEXPMM,
      CURRENTSALARY: hdata.CURRENTSALARY,
      CO_DEPTID: CO_DEPTID,   
      COMMADDRESS:hdata.COMMADDRESS,
      FATHERNAME: hdata.FATHERNAME,
      HOMETOWN: hdata.HOMETOWN,
      EXPECTEDSALARY: hdata.EXPECTEDSALARY,
      CURRENTLOCATION: hdata.CURRENTLOCATION,
      REFERENCES: hdata.REFERENCES,
      REMARKS: hdata.REMARKS,
      COID: this.globalVar.CommpanyId,
      BOID: this.globalVar.BranchId,
      CREATEDBY: this.globalVar.userid,
      RESUMENO:hdata.RESUMENO	,
      CTC: "0",
      ISACTIVE: "1",
      DOCUMENTS: "",
      CREATEDON: "",
      COLORCODE: "",
      CURRENTDESIGNATION: "",
      LASTINDUSTRYSEGMENT	:"",
      DUEON	:"",
      POSTAPPLIEDFOR:'',
      SKILLSETID : '',
      CURRENTORG:"",
      CURRENTDEPT:CO_DEPTID ,
      MOTHERNAME: "",
      HUSBANDNAME: "",
      REFERENCESCONTACT:hdata.REFERENCESCONTACT,
      AADHARNO: hdata.AADHARNO ,
      PANNO:hdata.PANNO,
      BANKID:hdata.BANKID,
      BANKBRANCH:hdata.BANKBRANCH,
      ACCOUNTNO:hdata.ACCOUNTNO,
      IFSC:hdata.IFSC,
      REASONLEAVING:hdata.REASONLEAVING,
      JOININGPERIOD:hdata.JOININGPERIOD,
      STRENGTH:hdata.STRENGTH,
      WEEKNESS:hdata.WEEKNESS,
      INTERESTAREA:hdata.INTERESTAREA,
    });

    // Resume Array
    let resumeSkill: Array<any> = [];
    if(hdata.SKILLID.length > 0 )
    {
      for(let mdata of hdata.SKILLID)
      {
        resumeSkill.push(
        {
          ID: 0,
          RESUMEID: this.resumeID,
          SKILLID: mdata,
        });
      }
    }
    
    // Category Array
    let categorySkill: Array<any> = [];
    if(hdata.CATEGORYID.length > 0 )
    {
      for(let mdata of hdata.CATEGORYID)
      {
        categorySkill.push(
        {
          ID: 0,
          RESUMEID: this.resumeID,
          CATEGORYID: mdata,
        });
      }
    }
    
    setTimeout(() => {
      this.isLoadingResults=false;
    }, 3000);

    const  params = new  HttpParams()
    .set('coid', this.globalVar.CommpanyId)
    .set('boid', this.globalVar.BranchId)
    .set('userid', this.globalVar.userid)
    .set('statementtype', action)
    .set('hdrresume', JSON.stringify(resumeHeader))
    .set('resumeskills', JSON.stringify(resumeSkill))
    .set('resumecategory', JSON.stringify(categorySkill))
    .set('id', this.resumeID);
    
    this.http.post(this.original_url+"/HR/Resume/Savehdrresume", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      this.isLoadingResults=false; 
      this.successDialog();
      this.disabledStyle='auto';
      this.msgshow=false;
      let temp:any;
      temp = res;
      temp = res;
      this.resumeID = temp;
      if(action=="Update")
      {
       this.router.navigate(['/resume-list']);
      }
    });
  }

  saveDetail(){
    this.isLoadingResults=true;
    this.qualificationSave(this.newQualification);
    this.experienceSave(this.newExperience);
    this.healthcardSave(this.newHealthData);
    this.dependentSave(this.newRelation);
    this.isLoadingResults=false;
  }

  // Qualification Save
  qualificationSave(newQualification)
  {
    if(this.qualificationArray.length > 0)
    {
      this.isLoadingResults=true;
      var qualificationDetail: Array<any> = [];
      let dateFormat = ''; var REMARKS = ''; var INSTITUE=''; var GRADES=''; var REMARKS='';
      for(let mdata of this.qualificationArray)
      {
        if(mdata.REMARKS==undefined) {REMARKS=''} else {REMARKS=mdata.REMARKS}
        if(mdata.INSTITUE==undefined||mdata.INSTITUE=='' ){INSTITUE=''} else {INSTITUE=mdata.INSTITUE}
        if(mdata.GRADES==undefined||mdata.GRADES=='' ){mdata.GRADES=''} else {GRADES=mdata.GRADES}
        if(mdata.PASSINGYEAR==undefined || mdata.PASSINGYEAR== null || mdata.PASSINGYEAR=='') {dateFormat=''} else {dateFormat = mdata.PASSINGYEAR}

        qualificationDetail.push({
          ID:0,
          RESUMEID:this.resumeID,
          QUALIFICATIONID:mdata.QUALIFICATIONID,
          INSTITUE:INSTITUE,
          PASSINGYEAR:dateFormat,
          GRADES:GRADES,
          REMARKS:REMARKS
        });
      }

    } else
    {
    qualificationDetail=[];
    }
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      // if(qualificationDetail.length > 0)
      // {
        const  params = new  HttpParams()
        .set('coid', this.globalVar.userid)
        .set('boid', this.globalVar.userid)
        .set('userid', this.globalVar.userid)
        .set('resumequal', JSON.stringify(qualificationDetail))
        .set('id',this.resumeID);


      
      this.http.post(this.original_url+"/HR/Resume/SaveResumeQualification", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        this.isLoadingResults=false;
        // this.successDialog();
        this.disabledStyle='auto';
      });
    // }
    // }
    // else
    // {
    //   if(this.experienceArray.length == 0)
    //   {
    //   let msg = "* Nothing to Save.";
    //   const dialogRef = this.dialog.open(ValidationComponent, {
    //     data: {
    //       msg: msg,
    //       action: ''
    //     }
    //   });
    // }
    // }
  }

  // Experience Save
  experienceSave(newExperience)
  {
    if(this.experienceArray.length > 0)
    {
      this.isLoadingResults=true;
      var experienceDetail: Array<any> = []; let LASTINDUSTRYSEGMENT;
      var EXPFROM = ''; var EXPTO = ''; var REMARKS = ''; var REPORTINGTO = ''; var POSITIONHELD = ''; var DEPTID= 0;
      for(let mdata of this.experienceArray)
      {
        if(mdata.REMARKS==undefined) {REMARKS=''}else {REMARKS=mdata.REMARKS}
        // if(!mdata.REMARKS) {REMARKS=''}

        if(mdata.REPORTINGTO==undefined) {REPORTINGTO=''} else {REPORTINGTO=mdata.REPORTINGTO}
        if(mdata.POSITIONHELD==undefined) {POSITIONHELD=''}else {POSITIONHELD=mdata.POSITIONHELD}
        
        // if(!mdata.REPORTINGTO) {REPORTINGTO=''}
        if(mdata.LASTINDUSTRYSEGMENT==undefined) {LASTINDUSTRYSEGMENT=''}else {LASTINDUSTRYSEGMENT=mdata.LASTINDUSTRYSEGMENT}
        if(mdata.DEPTID==undefined || mdata.DEPTID== null || mdata.DEPTID=='') {DEPTID=0} else {DEPTID = mdata.DEPTID}
        if(mdata.EXPFROM==undefined || mdata.EXPFROM== null || mdata.EXPFROM=='') {EXPFROM=''} else {EXPFROM = formatDate(mdata.EXPFROM, 'yyyy-MM-dd ', 'en-US')}
        if(mdata.EXPTO==undefined || mdata.EXPTO== null || mdata.EXPTO=='') {EXPTO=''} else {EXPTO = formatDate(mdata.EXPTO, 'yyyy-MM-dd', 'en-US')}

        experienceDetail.push({
          ID:0,
          RESUMEID:this.resumeID,
          ORGANIZATION:mdata.ORGANIZATION,
          LASTINDUSTRYSEGMENT: LASTINDUSTRYSEGMENT,
          DEPTID: DEPTID,
          TOTEXPYY:mdata.TOTEXPYY,
          TOTEXPMM:mdata.TOTEXPMM,
          RELEVANTEXPYY:mdata.RELEVANTEXPYY,
          RELEVANTEXPMM:mdata.RELEVANTEXPMM,
          POSITIONHELD:POSITIONHELD,
          REPORTINGTO:REPORTINGTO,
          REMARKS:REMARKS,
          EXPFROM: EXPFROM,
          EXPTO: EXPTO
        });
      }

     } else
      {
        experienceDetail=[];
      }
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      const  params = new  HttpParams()
      .set('coid', this.globalVar.userid)
      .set('boid', this.globalVar.userid)
      .set('userid', this.globalVar.userid)
      .set('resumeexp', JSON.stringify(experienceDetail))
      .set('id',this.resumeID);
      
      this.http.post(this.original_url+"/HR/Resume/SaveResumeExperience", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        this.isLoadingResults=false;
        this.successDialog();
        this.disabledStyle='auto';
        this.router.navigate(['/resume-list']);
      });
    
    // else
    // {
    //   if(this.qualificationArray.length == 0)
    //   {
    //   let msg = "* Nothing to Save.";
    //   const dialogRef = this.dialog.open(ValidationComponent, {
    //     data: {
    //       msg: msg,
    //       action: ''
    //     }
    //   });
    // }
    // }
  }
  healthcardSave(mdata){
    let healthHeader: Array<any> = [];
    this.globalVar.checknull(mdata.BLOODGROUP,'string')
    this.globalVar.checknull(mdata.HEIGHT,'string')
    this.globalVar.checknull(mdata.WEIGHT,'string')
    this.globalVar.checknull(mdata.POWERLENSLEFT,'string')
    this.globalVar.checknull(mdata.POWERLENSRIGHT,'string')
    this.globalVar.checknull(mdata.SMOKER,'string')
    this.globalVar.checknull(mdata.PHYSICALIMPAIRMENTS,'string')
    this.globalVar.checknull(mdata.MAJORILLNESS,'string')
    this.globalVar.checknull(mdata.IDENTIFICATIONMARKS,'string')

    healthHeader.push(
      {
        BLOODGROUP:mdata.BLOODGROUP,
        HEIGHT:mdata.HEIGHT,
        WEIGHT:mdata.WEIGHT,
        POWERLENSLEFT:mdata.POWERLENSLEFT,
        POWERLENSRIGHT:mdata.POWERLENSRIGHT,
        SMOKER:mdata.SMOKER,
        PHYSICALIMPAIRMENTS:mdata.PHYSICALIMPAIRMENTS,
        MAJORILLNESS:mdata.MAJORILLNESS,
        IDENTIFICATIONMARKS:mdata.IDENTIFICATIONMARKS
       });
       setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      const  params = new  HttpParams()
      // .set('coid', this.globalVar.userid)
      // .set('boid', this.globalVar.userid)
      .set('userid', this.globalVar.userid)
      .set('healtharray', JSON.stringify(healthHeader))
      .set('id',this.resumeID);
      
      this.http.post(this.original_url+"/HR/Resume/SaveResumehealthdetails", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        this.isLoadingResults=false;
        this.successDialog();
        this.disabledStyle='auto';
        this.router.navigate(['/resume-list']);
      });
    

  }
  dependentSave(mdata){
    if(this.RelationArray.length > 0)
    {
      this.isLoadingResults=true;
      var relationDetail: Array<any> = [];
      let ADDRESS = ''; var NAME = ''; var RELATIONID=''; var PHONE=''; var REMARKS='';
      for(let mdata of this.RelationArray)
      {
        if(mdata.NAME==undefined) {NAME=''} else {NAME=mdata.NAME}
        if(mdata.RELATIONID==undefined||mdata.RELATIONID=='' ){RELATIONID=''} else {RELATIONID=mdata.RELATIONID}
        if(mdata.PHONE==undefined||mdata.PHONE=='' ){mdata.PHONE=''} else {PHONE=mdata.PHONE}
        if(mdata.ADDRESS==undefined || mdata.ADDRESS== null || mdata.ADDRESS=='') {ADDRESS=''} else {ADDRESS = mdata.ADDRESS}

        relationDetail.push({
          ID:0,
          RESUMEID:this.resumeID,
          NAME:NAME,
          RELATIONID:RELATIONID,
          ADDRESS:ADDRESS,
          PHONE:PHONE,
        });
      }

    } else
    {
      relationDetail=[];
    }
      setTimeout(() => {
        this.isLoadingResults=false;
      }, 3000);
      
      // if(qualificationDetail.length > 0)
      // {
        const  params = new  HttpParams()
        // .set('coid', this.globalVar.userid)
        // .set('boid', this.globalVar.userid)
        .set('userid', this.globalVar.userid)
        .set('dependentarray', JSON.stringify(relationDetail))
        .set('id',this.resumeID);

      this.http.post(this.original_url+"/HR/Resume/SaveResumeDependents", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .subscribe((res) => {
        this.isLoadingResults=false;
        // this.successDialog();
        this.disabledStyle='auto';
      });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  yearPssingChange(value) {

  //   let todayDateChange; let commondate;
  //   todayDateChange = formatDate(this.myDate, 'yyyy', 'en-US');
  // if(value >= 1950)
  // {
  //   this.notifier.notify( 'info', 'Improper Year' );
  // } else if(value <= 70) {
  //   this.notifier.notify( 'info', '16' );
  // }
    
    
	}

}
