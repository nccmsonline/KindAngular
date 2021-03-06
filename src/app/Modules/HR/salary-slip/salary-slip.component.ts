import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-salary-slip',
  templateUrl: './salary-slip.component.html',
  styleUrls: ['./salary-slip.component.css']
})
export class SalarySlipComponent implements OnInit {
  original_url=environment.baseUrl;
  CompanyName:any; companyData:any;
  boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any; userid:any;token:any; empno:any;
  Address:any;reportname:any;newData:any={};isLoadingResults:boolean;
  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.isLoadingResults=true;
    this.companyData= sessionStorage.getItem("currentBranch");
    this.companyData= JSON.parse(this.companyData);
    this.CompanyName=this.companyData['COMPANYNAME'];
    this.Address=this.companyData['ADDRESS'];
    this.Address=this.CompanyName+' '+this.companyData['ADDRESS1'];
    console.log("ravinder", data);
    this.EmpId=data.empid;
    var month=data.month;
    var year=data.year;
    var monthname=data.monthname;
    if(data.empno==undefined)
    { this.empno=0}
    else
    {this.empno=data.empno}
    this.ServerIP=this.companyData['SERVERIP'];
    this.FYUSER=this.companyData['FYUSER'];
    this.boid = this.companyData['BRANCHID'];
   


      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);

      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
    this.reportname="Salary Slip for the Month of " +monthname+", "+year;
   // this.http.get("https://localhost:44398/api"+"/HR/HR/getEmployeeDetail?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&empid="+this.EmpId).subscribe((res: any[])=> {
    this.http.get(this.original_url+"/hr/hr/getSalarySlip?empid="+this.EmpId+
                   "&month="+month+"&year="+year+"&token="+this.token+"&empno="+this.empno).subscribe((res: any[])=> {
      console.log("ts",res);
      this.newData=res;
      this.newData=this.newData.Table[0];
      this.isLoadingResults=false;
    });
  }

  ngOnInit() {
  }

}
