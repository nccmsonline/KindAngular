import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-day-book-and-report',
  templateUrl: './day-book-and-report.component.html',
  styleUrls: ['./day-book-and-report.component.css']
})
export class DayBookAndReportComponent implements OnInit {
  userid:any;itemDisplay:any;dateToControl = new FormControl(new Date());dateFormControl = new FormControl(new Date());
  FYUSER:any;ServerIP:any;boid : any;curDate:any;fstartDate:any;DayBooKReport: FormGroup;newData:any={};datePipe = new DatePipe("en-US");token:any; 
  constructor(private fb: FormBuilder,private router: Router, private http: HttpClient, @Inject('BASE_URL') private original_url : string,  private activatedRoute: ActivatedRoute) { 
    this.createForm( );
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];;
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];;
   
    this.fstartDate=  CompanyData['FINANCIALYEARSTARTDATE'] ;
    this.curDate= CompanyData['WORKINGDATE'] ;

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.token = currentUser['TOKEN'];
    this.userid = currentUser['USERID'];


    var currentDate: Date = new Date( this.fstartDate);
    this.dateFormControl.setValue(currentDate);
    currentDate = new Date( this.curDate);
    this.dateToControl.setValue(currentDate);
  }

  ngOnInit() {
  }
  postDatedChequeLedger()
  {
    var orderfilter:any={};
    orderfilter={
    flag:'C',
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy')};
  
    sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/post-datedcheque-ledger-component'], {skipLocationChange:true});
  }
  postDatedChequeLedgerAndNEFT()
  {
    var orderfilter:any={};
    orderfilter={
    flag:'N',  
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy')
    };
    sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/post-datedcheque-ledger-component'], {skipLocationChange:true});
  }
  postDatedChequeBudgetWise()
  {
    var orderfilter:any={};
    orderfilter={
    fromDate:this.datePipe.transform(this.dateFormControl.value, 'dd-MMM-yyyy'),
    toDate:this.datePipe.transform(this.dateToControl.value, 'dd-MMM-yyyy')};
  
    sessionStorage.setItem('orderfilter', JSON.stringify(orderfilter));
    this.router.navigate(['/post-dated-cheque-budget-wise'], {skipLocationChange:true});
  }
 
  createForm() {
    this.DayBooKReport = this.fb.group({
    
      fromdate :  ['', Validators.required ],
      todate :  ['', Validators.required ],
      
    });
  }
}
