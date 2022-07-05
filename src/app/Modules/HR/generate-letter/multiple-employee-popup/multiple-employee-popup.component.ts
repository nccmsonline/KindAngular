import { Global } from './../../../../Global';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-multiple-employee-popup',
  templateUrl: './multiple-employee-popup.component.html',
  styleUrls: ['./multiple-employee-popup.component.css']
})
export class MultipleEmployeePopupComponent implements OnInit {
  
  dataSourceSummary = new MatTableDataSource<any>();
  displayedColumnsSummary: string[] = [ 'empno', 'empname', 'download'];
  isLoadingResults:boolean;
  multiPreviewLetterArray: Array<any> = [];
  contacts:Array<any>=[];
  allDataGet:any;
  original_url=environment.baseUrl;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MultipleEmployeePopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private messageService: MessageService,
    private router: Router, notifier: NotifierService,
    private http: HttpClient, 
    private globalVar: Global, 
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    console.log("data",this.data)
    this.refresh();
  }
  SinglePDFDownload(rowDetail)
  {
    console.log("rowDetail",rowDetail)
    let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
  
    virtualWindow.document.write( rowDetail.DOCUMENTTEXT ); 
    
    virtualWindow.document.close(); 
    virtualWindow.focus(); 
        // necessary for IE >= 10 
    setTimeout(t => { virtualWindow.print(); virtualWindow.close(); }, 1000);    
  }

  refresh()
  {
    this.isLoadingResults=true;
      this.http.get(this.original_url+"/Masters/CommonMaster/getletterempdetails?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&userid="+this.globalVar.UserId+"&letterid="+this.data.data.ID)
        .subscribe((response) => {
          this.allDataGet = response;
          this.contacts = this.allDataGet;
          this.isLoadingResults=false;
        });
  }
}
