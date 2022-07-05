import { HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SuccessDialogComponent } from './../../../../Dialog/success-dialog/success-dialog.component';
import { Global } from './../../../../Global';
import { environment } from './../../../../../environments/environment';
import { ValidationComponent } from './../../../../validation/validation.component';

import { Component, OnInit} from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploadPopupComponent } from 'src/app/Modules/General/image-upload-popup/image-upload-popup.component';

@Component({
  selector: 'app-add-management-planner',
  templateUrl: './add-management-planner.component.html',
  styleUrls: ['./add-management-planner.component.css']
})
export class AddManagementPlannerComponent implements OnInit {

  original_url = environment.baseUrl;
  yearopeningnew:Array<any>=[];
  openingstock:any={};
  editContactID: any={};
  groupid:any;
  alldata:any;
  personarray:Array<any>=[];
  data:Array<any>=[];
  routeID:any;
  routeAction:any;
  date = new Date();
  employeearray:Array<any>=[];
  userarray:Array<any>=[];
  statusArray:Array<any>=[];
  imagesArray: Array<any> = [];
  notifier: NotifierService;
  
  uploadformData = new FormData();
  yearopeningnew1: Array<any> = [];
  groupname:any;
  isLoadingResults:boolean;
  
  constructor(
     private http: HttpClient,
     public dialog: MatDialog,
     private globalVar: Global,
     private datePipe: DatePipe,
     private translate: TranslateService,
     notifier: NotifierService,
     private activatedRoute: ActivatedRoute) {
      
      this.notifier = notifier;
      this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
      // this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
      this.groupid=this.routeID;
      this.openingstock.DUEDATE = this.date;
      this.openingstock.readonlyDisableClass = 'readonly-disable';
      this.openingstock.readonlyCheck = true;

      this.openingstock.AFTERDAYS = 0;
      this.openingstock.AFTERDAYS = 0;
      // this.marketing();
      this.openingGetData();
   }

  ngOnInit() {
  }


  imagePopup(rowDetail) {
    const dialogRef = this.dialog.open(ImageUploadPopupComponent, {
      data: {
        itemid: rowDetail.id,
        routeID: rowDetail.swoid,
        action: "new",
        type: 'spares',
        actionDetail: rowDetail
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.close == 'ok') {

          // Formdata
          let formDataArray = [];
          formDataArray = result.formdata;
          for (let file of formDataArray) {
            this.uploadformData.append(file.filename, file.file, file.itemid);
          }

          // Image Array
          let temp: any;
          temp = result.imageArray;
          if (temp.length > 0) {
            rowDetail.imagesArray = temp;
          }
        }
      }
    });
  }

  openingGetData(){
    this.isLoadingResults=true;
    this.http.get("http://kindwebapi.suvidhacloud.com/api/Masters/CommonMaster/getgroupactivities?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&groupid="+this.groupid)
    .subscribe((data: any[]) => {
        let currentDate; let alldata:any; currentDate= new Date();
        alldata = data;
        this.isLoadingResults=false;
        this.yearopeningnew = alldata.Table;
        this.statusArray = alldata.Table1;
        this.userarray = alldata.Table2;
        // this.contacts = this.originalcontacts.filter(x => x.GROUPID == id);
        this.groupname = alldata.Table3.find(x => x.ID == this.routeID).GROUPNAME;
        let convertToDAte = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
        currentDate=convertToDAte
        this.yearopeningnew.forEach((item,index) => {
          if(item.TASKSTATUS == 1)
          {
            if(item.ASSIGNEDTO == this.globalVar.UserId)
            {
              let tDate = this.datePipe.transform(this.date, "dd-MM-yyyy");
              let reminderDate = this.datePipe.transform(item.REMINDERDATE, "dd-MM-yyyy"); 
              if((tDate) >= (reminderDate)) {
                this.notifier.notify( 'error', 'Remind It' );
              }
            }
            
            if(item.ESCLATEUSER == undefined || item.ESCLATEUSER == null || item.ESCLATEUSER == '')
            {
              item.readonlyDisableClass = 'readonly-disable';
              item.readonlyCheck = true;
            }
            else
            {
              item.readonlyDisableClass = '';
              item.readonlyCheck = false;
            }
            
          }
          
          // if(item.taskstatus == 2)
          // {
          //   item.backgroundColour = 'green';
          // }
          // else if(item.taskstatus == 1 && item.reminderdate == this.date)
          // {
          //   item.backgroundColour = 'yellow';
          // }
          // else if(item.taskstatus == 1 && item.reminderdate < this.date)
          // {
          //   item.backgroundColour = 'red';
          // }
          
          if(item.TASKSTATUS == 1 && currentDate>formatDate(item.DUEDATE, 'yyyy-MM-dd', 'en-US'))
          {
            item.backgroundColour = '#ff9999';
          }
          else if(item.TASKSTATUS == 1 && currentDate==formatDate(item.DUEDATE, 'yyyy-MM-dd', 'en-US'))
          {
            item.backgroundColour = '#ffffad';
          }
          else if(item.TASKSTATUS == 2)
          {
            item.backgroundColour = '#b4ffb4';
          }
        });
      });
  }

  // marketing(){
  //   this.mangementPlannerService.getMarketExcutive()
  //   .subscribe((response) => {
  //     this.alldata=response
  //     this.alldata=this.alldata.Table;
  //     this.personarray=this.alldata;
  //   });
  // }

  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    msg="<h5>Before add please rectify following mistakes:-</h5>";
    if(data.ACTIVITY==undefined||data.ACTIVITY==null||data.ACTIVITY=='' )
    {flag=false; msg=msg+"* Activity/Task not Entered<br/>"}

    if(data.DUEDATE==undefined||data.DUEDATE==null||data.DUEDATE=='' )
    {flag=false; msg=msg+"* Action due on not selected<br/>"}

    if(data.REMINDERDATE==undefined||data.REMINDERDATE==null||data.REMINDERDATE=='' )
    {flag=false; msg=msg+"* To Remind on not selected<br/>"}

    if(data.ASSIGNEDTO==undefined||data.ASSIGNEDTO==null||data.ASSIGNEDTO=='' )
    {flag=false; msg=msg+"* Kind Attention not selected<br/>"}

    if(flag==false) 
    {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    }
    return flag;
  }

  addActivity(event){ 
    if(this.validateDetail(event))
    {
      this.yearopeningnew1=[]
      event.ACTIONTAKENON=this.globalVar.checknull(event.ACTIONTAKENON,'Date')
      this.yearopeningnew1.push(event)
      this.yearopeningnew1.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
        item['groupid']=this.groupid;
        // item.imagesArray=[]
      });
      this.saveplanner("",'Insert');
    
      this.openingstock.DUEDATE = this.date;

    }
  }
 
  editopening(val){
    this.editContactID=val;
  }

  updateopening(){
    // this.editContactID={};
  }
  
  updateActivity(event){
    if(this.validateDetail(event))
    {
    this.yearopeningnew1=[]
      event.ACTIONTAKENON=this.globalVar.checknull(event.ACTIONTAKENON,'Date')
      this.yearopeningnew1.push(event)
      // this.yearopeningnew1.forEach((item,index) => {
      //   var num = 'id';
      //   var value = index+1;
      //   item[num] = value;
      //   item['groupid']=this.groupid;
      //   // item.imagesArray=[]
      // });
      this.saveplanner("",'Update');
      // this.openingstock={};
     
    }
  }

  kindAttnChange(event, data) {
    data.ASSIGNEDUSER = this.userarray.find(x => x.USERID == event).USERNAME;
  }

  statusTaskChange(event, data) {
    data.TASKSTATUSNAME = this.statusArray.find(x => x.ID == event).TASKSTATUSNAME;
  }

  escalateChange(event, data) {
    data.ESCLATEUSER1 = this.userarray.find(x => x.USERID == event).USERNAME;
    if(data.ESCLATEUSER == undefined || data.ESCLATEUSER == null || data.ESCLATEUSER == '')
    {
      data.readonlyDisableClass = 'readonly-disable';
      data.readonlyCheck = true;
    }
    else
    {
      data.readonlyDisableClass = '';
      data.readonlyCheck = false;
    }
  }

  removeescalateChange(event, data) {
    if(data.ESCLATEUSER == undefined || data.ESCLATEUSER == null || data.ESCLATEUSER == '')
    {
      data.readonlyDisableClass = 'readonly-disable';
      data.readonlyCheck = true;
    }
    else
    {
      data.readonlyDisableClass = '';
      data.readonlyCheck = false;
    }
  }

  removeyearopening(index){
    this.yearopeningnew.splice(index,1);
  }

  // Hours Check
  hoursCheck(key, rowDetail)
  {
    if(key >= 24)
    {
      rowDetail.AFTERHRS = 24;
    }
    if(rowDetail.AFTERHRS == undefined || rowDetail.AFTERHRS == null || rowDetail.AFTERHRS == '')
    {
      rowDetail.AFTERHRS = 0;
    }
  }

  // Hours Check
  yearCheck(key, rowDetail)
  {
    if(rowDetail.AFTERDAYS == undefined || rowDetail.AFTERDAYS == null || rowDetail.AFTERDAYS == '')
    {
      rowDetail.AFTERDAYS = 0;
    }
  }

  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  saveplanner(event,statementType){
    let id;
   
    this.data=this.yearopeningnew1;
    // for(let i = 0; i < this.data.length; i++){
    //   this.data[i].id =  'A';
    //   this.data[i].reminderdate =  formatDate(this.data[i].reminderdate, 'yyyy-MM-dd', 'en-US');
    //   this.data[i].duedate =  formatDate(this.data[i].duedate, 'yyyy-MM-dd', 'en-US');
    //   // this.data[i].actiontakenon =  formatDate(this.data[i].actiontakenon, 'yyyy-MM-dd', 'en-US');
    //   console.log("date",this.data[i].actiontakenon)
    //   this.data[i].actiontakenon = this.globalVar.checknull(this.data[i].actiontakenon,"Date") ;
    //   console.log("date1",this.data[i].actiontakenon)
    // }

    var imageArray: Array<any> = [],Detail: Array<any> = [];

    let actiontakenon, ACTIONTAKENBY, REMARKS,duedate,reminderdate;

    for (let mdata of this.data) {
      // var row = mdata.imagesArray;
      // if (row != undefined) {
      //   for (var data1 of row) {
      //     imageArray.push(data1);
      //   }
      // }
      mdata.ESCLATEUSER = this.globalVar.checknull(mdata.ESCLATEUSER, "number");
      actiontakenon = this.globalVar.checknull(mdata.ACTIONTAKENON, "Date");
      mdata.TASKSTATUSNAME = this.globalVar.checknull(mdata.TASKSTATUSNAME, "string");
      mdata.TASKSTATUS = this.globalVar.checknull(mdata.TASKSTATUS, "number");
      mdata.AFTERHRS = this.globalVar.checknull(mdata.AFTERHRS, "string");
      mdata.AFTERDAYS = this.globalVar.checknull(mdata.AFTERDAYS, "string");
      mdata.REFERENCENO = this.globalVar.checknull(mdata.REFERENCENO, "string");
       ACTIONTAKENBY = this.globalVar.checknull(mdata.ACTIONTAKENBY, "string");
      REMARKS = this.globalVar.checknull(mdata.REMARKS, "string");
      
      // reminderdate=this.globalVar.formatDateNew(mdata.REMINDERDATE)
      // duedate=this.globalVar.formatDateNew(mdata.DUEDATE)
      reminderdate=this.globalVar.checknull(mdata.REMINDERDATE, "Date");
      duedate=this.globalVar.checknull(mdata.DUEDATE, "Date");

      if(statementType == 'Insert'){
        id='0'
      }else{
        id=mdata.ID
      }

      Detail.push({
        id:id,
        groupid: this.groupid,
        esclateuser: mdata.ESCLATEUSER,
        assignedto: mdata.ASSIGNEDTO,
        actiontakenon: actiontakenon,
        ACTIONTAKENBY:ACTIONTAKENBY,
        // TASKSTATUSNAME: mdata.TASKSTATUSNAME,
        TASKSTATUS: mdata.TASKSTATUS,
        reminderdate:reminderdate,
        activity: mdata.ACTIVITY,
        afterhrs: mdata.AFTERHRS,
        afterdays: mdata.AFTERDAYS, 
        referenceno:mdata.REFERENCENO,
        REMARKS:REMARKS,
        // readonlyCheck: true,
        // readonlyDisableClass: "readonly-disable",
        duedate: duedate
      });
    
    }

    var imageDataarray: Array<any> = []; let k = 0;
    for (let img of imageArray) {
      imageDataarray.push({
        id: k + 1,
        woid: this.routeID,
        itemid: img.itemid,
        srno: k + 1,
        imageinfo: img.filename,
        isactive: 1
      });
      k++;
    }


    if(Detail.length > 0)
    {
      this.isLoadingResults=true;
      let params = new HttpParams()
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('id', '0')

      .set('statementtype', 'Insert')
      .set('fyid',this.globalVar.fyid)
      .set('userid',this.globalVar.UserId)
      .set('groupactivities',JSON.stringify(Detail))
      this.http.post(this.original_url+"/Masters/CommonMaster/Savegroupactivity", params.toString(),{
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .subscribe((res: any[]) => {
          this.isLoadingResults=false;
          this.openingstock={};
          this.editContactID={};
          if (imageDataarray.length! > 0) {
            let progress: number;
            let message: any;
            let woid = res;
            woid = woid[0].swoid;
            const uploadReq = new HttpRequest('POST', this.original_url + '/Common/UploadFile?module=SOP&form=SOP-form&refid=' + woid + '&userid=' + this.globalVar.UserId + '&osservertype=' + this.globalVar.osservertype + '&imageArray=' + JSON.stringify(imageDataarray) + '&tablename=db_sop.salewo_images&remarks=&refparentid=1', this.uploadformData, {
              reportProgress: true
            });
            this.http.request(uploadReq).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                progress = Math.round(100 * event.loaded / event.total);
              }
              if (event.type === HttpEventType.Response) {
                // this.isLoadingResults = false;
                this.openingGetData();
                this.successDialog();
                this.dialog.closeAll();
                // message = event.body.toString();
              }
            });
          }
          else {
            // this.isLoadingResults = false;
            this.openingGetData();
            this.successDialog();
          }
          
        });
    }
    else
    {
      let msg="<h5>Please enter Activity Data</h5>";
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    }
    

  }
}
