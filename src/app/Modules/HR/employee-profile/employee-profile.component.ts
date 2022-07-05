import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SalarySlipComponent } from './../salary-slip/salary-slip.component';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  original_url=environment.baseUrl;isCEO:any;
  newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;userid:any;token:any;
  constructor(private http: HttpClient,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.EmpId=data.empid;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];
    this.isCEO= currentUser['ISCEO'];
    this.http.get(this.original_url+"/HR/HR/getEmployeeDetail?empid="+this.EmpId+"&userid="+this.userid+"&token="+this.token).subscribe((res: any[])=> {
      console.log("ts",res);
      this.newData=res;
      this.newData=this.newData.Table[0];

      this.newData.DOB=this.datePipe.transform(this.newData.DOB, 'dd-MMM-yyyy');
      this.newData.DOJ=this.datePipe.transform(this.newData.DOJ, 'dd-MMM-yyyy');
    });
   }

  ngOnInit() {
  }
  showSalarySlip()
  {
    if(this.newData.SALARYDATE==undefined||this.newData.SALARYDATE==null||this.newData.SALARYDATE=='')
    {
       const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:'Please select date.'
       }
     });
    }
    else
    {
      const dialogRef = this.dialog.open(SalarySlipComponent, {
        // width: '600px',
         data: {empid: this.EmpId,
           year:this.datePipe.transform(this.newData.SALARYDATE, 'yyyy'),
           month:this.datePipe.transform(this.newData.SALARYDATE, 'MM'),
           monthname:this.datePipe.transform(this.newData.SALARYDATE, 'MMM') }
       });
    }

  }
}
