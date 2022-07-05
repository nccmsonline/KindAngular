import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
//import {ExcelService} from '../../../../../services/excel/excel.service';
import {ExcelService} from '../../../../services/excel/excel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ot-sumary',
  templateUrl: './ot-sumary.component.html',
  styleUrls: ['./ot-sumary.component.css']
})
export class OTSumaryComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;fromDate:any;toDate:any;customerId:any;billSeriesId:any;mydata:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");empid:any;flag:any;
  repeatHeaders = true;isLoadingResults:boolean;backto:any; userid:any;token:any; 
  Address:any;reportname:any;newData:any={};itemDisplay:any;orderData:any=[];otData:any=[];
   days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  DAY1:any;
      DAY2:any;
      DAY3:any;
      DAY4:any;
      DAY5:any;
      DAY6:any;
      DAY7:any;
      DAY8:any;
      DAY9:any;
      DAY10:any;
      DAY11:any;
      DAY12:any;
      DAY13:any;
      DAY14:any;
      DAY15:any;
      DAY16:any;
      DAY17:any;
      DAY18:any;
      DAY19:any;
      DAY20:any;
      DAY21:any;
      DAY22:any;
      DAY23:any;
      DAY24:any;
      DAY25:any;
      DAY26:any;
      DAY27:any;
      DAY28:any;
      DAY29:any;
      DAY30:any;
      DAY31:any;
  constructor( private router: Router, private excelService: ExcelService, private http: HttpClient) {
      this.isLoadingResults=true;
      this.companyData= sessionStorage.getItem("currentBranch");
      this.companyData= JSON.parse(this.companyData);
      this.CompanyName=this.companyData['COMPANYNAME'];
      this.Address=this.companyData['ADDRESS'];
      this.Address=this.Address+' '+this.companyData['ADDRESS1'];
      this.ServerIP=this.companyData['SERVERIP'];
      this.FYUSER=this.companyData['FYUSER'];
      this.boid = this.companyData['BRANCHID'];
      var filterData= sessionStorage.getItem("otfilter");
      filterData=JSON.parse(filterData);
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);

      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
      this.fromDate=filterData["fromDate"];
      this.toDate=filterData["toDate"];
      this.flag=filterData["flag"];
      if (filterData["empid"]!=undefined)
      {
        this.empid=filterData["empid"];
      }
      else
      {
        this.empid='';
      }
      if (this.flag=='W')
      {
        this.empid='';
      }
     
      this.backto=filterData["source"];
      if(this.flag=="W")
      {
        this.mydata='Department wise Working Hours Summary from ' +  this.fromDate +" to " + this.toDate;
      }
      else
      {
        this.mydata='Department wise O.T. Summary from ' +  this.fromDate +" to " + this.toDate;
      }
      
      this.newData.OTDATE= new Date(this.fromDate);
      this.gatLoadData();
      var pdate =new Date(this.fromDate);
      var y=pdate.getFullYear(),m=pdate.getMonth();
      var firstDate=new Date(y,m,1);
      var secondDate=new Date(y,m+1,0);
      var lastDay= parseInt(this.datePipe.transform(secondDate, 'dd')) ;
      this.DAY1=this.days[this.newData.OTDATE.getDay()];
      this.DAY2=this.days[this.NextDate().getDay()];
      this.DAY3=this.days[this.NextDate().getDay()];
      this.DAY4=this.days[this.NextDate().getDay()];
      this.DAY5=this.days[this.NextDate().getDay()];
      this.DAY6=this.days[this.NextDate().getDay()];
      this.DAY7=this.days[this.NextDate().getDay()];
      this.DAY8=this.days[this.NextDate().getDay()];
      this.DAY9=this.days[this.NextDate().getDay()];
      this.DAY10=this.days[this.NextDate().getDay()];
      this.DAY11=this.days[this.NextDate().getDay()];
      this.DAY12=this.days[this.NextDate().getDay()];
      this.DAY13=this.days[this.NextDate().getDay()];
      this.DAY14=this.days[this.NextDate().getDay()];
      this.DAY15=this.days[this.NextDate().getDay()];
      this.DAY16=this.days[this.NextDate().getDay()];
      this.DAY17=this.days[this.NextDate().getDay()];
      this.DAY18=this.days[this.NextDate().getDay()];
      this.DAY19=this.days[this.NextDate().getDay()];
      this.DAY20=this.days[this.NextDate().getDay()];
      this.DAY21=this.days[this.NextDate().getDay()];
      this.DAY22=this.days[this.NextDate().getDay()];
      this.DAY23=this.days[this.NextDate().getDay()];
      this.DAY24=this.days[this.NextDate().getDay()];
      this.DAY25=this.days[this.NextDate().getDay()];
      this.DAY26=this.days[this.NextDate().getDay()];
      this.DAY27=this.days[this.NextDate().getDay()];
      this.DAY28=this.days[this.NextDate().getDay()];
      if(lastDay>28)
      {
        this.DAY29=this.days[this.NextDate().getDay()];
      }
      if(lastDay>29)
      {
        this.DAY30=this.days[this.NextDate().getDay()];
      }
      if(lastDay>30)
      {
        this.DAY31=this.days[this.NextDate().getDay()];
      }
    
  }
  ngOnInit() {
    
  }
  NextDate()
  {
    var data = new Date(this.newData.OTDATE);
    data.setHours( this.newData.OTDATE.getHours() + 24);
    this.newData.OTDATE = '';
    this.newData.OTDATE = data;
    return data;
  }
  exportToExcel() {

    // this.accountGroupMasterService.getalldata()
    // .subscribe((response) => {
    //  this.allGetZone = response;
    //  this.allGetZone = this.allGetZone.Table;
    //  this.exportarray= this.allGetZone;
     this.excelService.exportAsExcelFile(this.otData, 'Account-master');
    // });
    }
    exportToExcelDetail() {

 var data:Array<any>=[];
   // data.push(this.Header);
    this.otData.forEach(hrd => {
      hrd.detail.forEach(el => {
      data.push({
        'Dept Name': hrd.DEPTNAME,
        'Emp No': el.EMPNO,
        'Name':el.NAME,
        'DAY1':el.DAY1,
        'DAY2':el.DAY2,
        'DAY3':el.DAY3,
        'DAY4':el.DAY4,
        'DAY5':el.DAY5,
        'DAY6':el.DAY6,
        'DAY7':el.DAY7,
        'DAY8':el.DAY8,
        'DAY9':el.DAY9,
        'DAY10':el.DAY10,
        'DAY11':el.DAY11,
        'DAY12':el.DAY12,
        'DAY13':el.DAY13,
        'DAY14':el.DAY14,
        'DAY15':el.DAY15,
        'DAY16':el.DAY16,
        'DAY17':el.DAY17,
        'DAY18':el.DAY18,
        'DAY19':el.DAY19,
        'DAY20':el.DAY20,
        'DAY21':el.DAY21,
        'DAY22':el.DAY22,
        'DAY23':el.DAY23,
        'DAY24':el.DAY24,
        'DAY25':el.DAY25,
        'DAY26':el.DAY26,
        'DAY27':el.DAY27,
        'DAY28':el.DAY28,
        'DAY29':el.DAY29,
        'DAY30':el.DAY30,
        'DAY31':el.DAY31,
        'Total OT': el.TOTAL
      });
    });
    data.push({
      'Dept Name': hrd.DEPTNAME,
      'Emp No': null,
      'DAY1':null,
      'DAY2':null,
      'DAY3':null,
      'DAY4':null,
      'DAY5':null,
      'DAY6':null,
      'DAY7':null,
      'DAY8':null,
      'DAY9':null,
      'DAY10':null,
      'DAY11':null,
      'DAY12':null,
      'DAY13':null,
      'DAY14':null,
      'DAY15':null,
      'DAY16':null,
      'DAY17':null,
      'DAY18':null,
      'DAY19':null,
      'DAY20':null,
      'DAY21':null,
      'DAY22':null,
      'DAY23':null,
      'DAY24':null,
      'DAY25':null,
      'DAY26':null,
      'DAY27':null,
      'DAY28':null,
      'DAY29':null,
      'DAY30':null,
      'DAY31':null,

      'Name':'Total',
      'Total OT': hrd.TOTAL
    });
  });
       this.excelService.exportAsExcelFile(data, 'OTDetail');
      // });
      }
  gatLoadData()
  {
    if(this.flag=='W')
    {
          this.http.get(this.original_url+"/hr/hr/getWorkingHrsSummary?fromdate="+this.fromDate+"&toDate="+this.toDate+
          "&empid="+this.empid+"&token="+this.token).subscribe((res:any[])=>{
              this.itemDisplay=res;

              this.otData= this.itemDisplay;

              console.log("header",res);
              this.isLoadingResults=false;
          });
    }
    else
    {
          this.http.get(this.original_url+"/hr/hr/getOTSummary?fromdate="+this.fromDate+"&toDate="+this.toDate+
          "&empid="+this.empid+"&token="+this.token).subscribe((res:any[])=>{
              this.itemDisplay=res;

              this.otData= this.itemDisplay;

              console.log("header",res);
              this.isLoadingResults=false;
        });
    }
   
  }
  backtoSource()
  {
    alert(this.backto);
    this.router.navigate(['/hr-reports'], {skipLocationChange:true});
  }
}