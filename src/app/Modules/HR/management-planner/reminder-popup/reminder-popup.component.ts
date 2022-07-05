import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Global } from './../../../../Global';
import { Component, Inject, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reminder-popup',
  templateUrl: './reminder-popup.component.html',
  styleUrls: ['./reminder-popup.component.css']
})
export class ReminderPopupComponent implements OnInit {
  newData:any={};
  showdatefilter=false;
  myDate = new Date();
  search: any;
  contacts:Array<any>=[]
  originalcontacts:Array<any>=[]
  groupArray:Array<any>=[]
  isLoadingResults=false
  original_url=environment.baseUrl;
  fromDate:any;
  toDate:any;
  todaydate = new Date();
  id:any;

  constructor(
    private globalVar:Global,
    private translate: TranslateService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ReminderPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.newData.fromdate = this.globalVar.FinancialYearStartDate;
    this.newData.todate = formatDate(this.todaydate, 'yyyy-MM-dd', 'en-US');
    this.id=data.id
    // this.contacts=[{ACTIVITY:"Car Registrtation",REFERENCENO:"12",ACTIONTAKENO:"null",DUEDATE:"2021-05-21T06:33:21",REMINDERDATE:"2021-05-24T06:33:27",KINDATTN:"Manpreet Singh",GROUPID:"2.0",GROUPNAME:"Licenses",REMARKS:"Test Remarks....."}]
   }

  ngOnInit(): void {
    this.commonDataGet();
  }

  onChangefilter(event) {
    console.log("event",event)
    // let todaydate = new Date();
    if (event == 5) {
      this.showdatefilter = true;
      this.newData.fromdate = formatDate(this.todaydate, 'yyyy-MM-dd', 'en-US');
      this.newData.todate = formatDate(this.todaydate, 'yyyy-MM-dd', 'en-US');
    }
    else {
      this.showdatefilter = false;
      if (event == 1) {
        this.newData.fromdate = this.globalVar.FinancialYearStartDate;
        this.newData.todate = formatDate(this.todaydate, 'yyyy-MM-dd', 'en-US');
      }
      else if (event == 2) {
        var weekstart = this.myDate.getDate() - this.myDate.getDay() + 1;
        let monday = new Date(this.myDate.setDate(weekstart));
        this.newData.fromdate = formatDate(monday, 'yyyy-MM-dd', 'en-US');
        this.newData.todate = formatDate(this.todaydate, 'yyyy-MM-dd', 'en-US');
      }
      else if (event == 3) {
        let firstDay = new Date(this.myDate.getFullYear(), this.myDate.getMonth(), 1);
        let lastDay = new Date(this.myDate.getFullYear(), this.myDate.getMonth() + 1, 0);
        this.newData.fromdate = formatDate(firstDay, 'yyyy-MM-dd', 'en-US');
        this.newData.todate = formatDate(lastDay, 'yyyy-MM-dd', 'en-US');
      }
      else if (event == 4) {
        this.newData.fromdate = formatDate(this.globalVar.FinancialYearStartDate, 'yyyy-MM-dd', 'en-US');
        this.newData.todate = formatDate(this.todaydate, 'yyyy-MM-dd', 'en-US');
      }
    }
  }

  commonDataGet() {

    this.isLoadingResults = true;
    this.fromDate=this.globalVar.checknull(this.newData.fromdate,'Date');
    this.toDate=this.globalVar.checknull(this.newData.todate,'Date');
    this.http.get(this.original_url + "/Notification/UserNotification/GetManagementReminder?userid=1&PageNumber=1&PageSize=100&search=&coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fromdate="+this.fromDate+"&todate="+this.toDate )
      .subscribe((response) => {
        var allDataGet: any;
        allDataGet = response;
       
        this.originalcontacts=allDataGet.Table;
        this.contacts = this.originalcontacts
        this.groupArray=allDataGet.Table1;
        this.isLoadingResults = false;
        if(this.id >0){
          this.newData.group=this.id
        }
        if( this.newData.group != null && this.newData.group != undefined && this.newData.group != ''){
          this.catgChange(this.newData.group);
        }
      });
  }
   // Filter Date
   filterDate() {
    if (this.search == undefined || this.search == null) {
      this.search = '';
    }
    this.commonDataGet();
  }

  // Clear date Filter
  ClearDateFilter() {
    this.search = '';
    this.newData.fromdate = this.globalVar.FinancialYearStartDate;
    this.newData.todate = this.todaydate;
    this.commonDataGet();
  }

  catgChange(id){
    console.log("id",id)
    if(id==null || id==undefined || id== ''){
      this.contacts = this.originalcontacts
    }else{
      this.contacts = this.originalcontacts.filter(x => x.GROUPID == id);
    }

  }
  catgRemove(){
    this.contacts = this.originalcontacts;
  }

  openGroup(id,name){
    // stockArray: stockArray, issuedquantity: issueqty
    this.dialogRef.close({id: id, name: name});
  }


}
