import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.css']
})
export class ChartDetailComponent implements OnInit {
  FYUSER:any;ServerIP:any; boid : any;itemDisplay:any;mDate:any;PartyName:any;
  chartDetail : Array<any>=[];accountid:any;chart: Array<any>=[];
  YearOpeningBalance:number; ClosingBalance:number;
  constructor(    public dialogRef: MatDialogRef<ChartDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private http:HttpClient,
    @Inject('BASE_URL') private original_url : string)  {
      var datePipe = new DatePipe("en-US");
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      this.mDate=data.pDate; // datePipe.transform(CompanyData['FINANCIALYEARSTARTDATE'], 'dd/MMM/yyyy') ;
// this.http.get(this.original_url+"/Accounts/Payments/getDayDetail?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid +"&calDate="+this.mDate)

      this.http.get(this.original_url+"/Accounts/Payments/getDayDetail?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid +"&calDate="+this.mDate)
      .subscribe((res) => {
        console.log("res",res);

        this.data=res;
        this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        //this.chart=this.itemDisplay;
        console.log("this.chart",this.itemDisplay);
        var i:Number;var totalAmt:number;
        i=1;
        for(let data of this.itemDisplay)
        {
          this.chart.push({BRACHNAME:data.BRANCHNAME, PARTYNAME:data.NAME,PAYMENTMODE:data.PAYMENTMODE,TRANAMT:data.TRANAMT});
        }
        if(this.boid=="2")
        { 
          
           var list= this.chart.filter(x=>x.BRACHNAME=='UNIT 2');
           var r:number;
           r=0;
           list.forEach((data)=>{
            if(r==0)
            {
              this.chartDetail.push({PARTYNAME:'Unit - 2',PAYMENTMODE:'',TRANAMT:null,BGCOLOR:'BLUE'});
            }
            
            this.chartDetail.push({ PARTYNAME:data.PARTYNAME,PAYMENTMODE:data.PAYMENTMODE,TRANAMT:data.TRANAMT,BGCOLOR:'BLACK'});
            r++;
           });
           
        
          r=0;
           var list1= this.chart.filter(x=>x.BRACHNAME=='PDC');
           totalAmt=0;
           list1.forEach((data)=>{
            if(r==0)
            {
              this.chartDetail.push({PARTYNAME:'PDC',PAYMENTMODE:'',TRANAMT:null,BGCOLOR:'BLUE'});
            }
            r++;
            this.chartDetail.push({ PARTYNAME:data.PARTYNAME,PAYMENTMODE:data.PAYMENTMODE,TRANAMT:data.TRANAMT,BGCOLOR:'BLACK'});
           });
           
        }
        else
        {
          this.chart.forEach((data)=>{
           this.chartDetail.push({ PARTYNAME:data.PARTYNAME,PAYMENTMODE:data.PAYMENTMODE,TRANAMT:data.TRANAMT});
          });
        }
        console.log("this.chartDetail",this.chartDetail);
      });
     }

  ngOnInit() {
  }

}
