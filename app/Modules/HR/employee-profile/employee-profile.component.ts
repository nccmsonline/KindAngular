import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import { SalarySlipComponent } from './../salary-slip/salary-slip.component';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  constructor(@Inject('BASE_URL') private original_url : string,private http: HttpClient,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.EmpId=data.empid;

    this.http.get(this.original_url+"/HR/HR/getEmployeeDetail?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+this.boid+"&empid="+this.EmpId).subscribe((res: any[])=> {
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
