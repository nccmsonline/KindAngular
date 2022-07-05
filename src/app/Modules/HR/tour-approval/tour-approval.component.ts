import { Component, OnInit , ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { SuccessDialogComponent } from '.././../../Dialog/success-dialog/success-dialog.component';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { FileDownloadUploadService } from 'src/app/file-download-upload.service';

@Component({
  selector: 'app-tour-approval',
  templateUrl: './tour-approval.component.html',
  styleUrls: ['./tour-approval.component.css']
})
export class TourApprovalComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  userinfo : any; newData:any={};
  coid : any;
  boid : any;
  userid:any;TourListToSave : Array<any>=[]; 
  original_url=environment.baseUrl;flag:any;token:any;
  fieldArray = new MatTableDataSource<any>();datePipe = new DatePipe("en-US");
  displayedColumns: string[] = ['PASS','DELETE','DATED', 'EMPNO','NAME','DEPTNAME','TOURSTARTDATE','TOURENDDATE','ADVANCEAMT','ADDRESS','REASON','print'];
  data:any;FYUSER:any;ServerIP:any;fendDate:any;fstartDate:any;
  itemDisplay: any;dateFormControl = new FormControl(new Date());isLoadingResults:boolean;
  constructor( private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, public dialog: MatDialog, private upload:FileDownloadUploadService) { 
    //this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fendDate= this.datePipe.transform( CompanyData['FINANCIALYEARENDDATE'], 'dd/MMM/yyyy') ;
    this.fstartDate=this.datePipe.transform( CompanyData['FINANCIALYEARSTARTDATE'] , 'dd/MMM/yyyy');
    
    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
   
    console.log("current   User",currentUser);
    console.log("userid",this.userid);
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.flag = this.activatedRoute.snapshot.paramMap.get('flag');
        
        this.getSavedTourList();
      }
    });
    
   // this.isLoadingResults=false;
  }

  ngOnInit() {
    
  }
  // onChange(event, tour)
  // {
  //   if(event.checked == true)
  //   {
  //   this.TourListToSave.push(tour);
  //   }
  //   else
  //   {
  //     this.TourListToSave.splice (this.TourListToSave.indexOf(tour),1);
  //   }
  // }
  onChange(event, data)
  {
    if(event.checked == true)
    {
    //this.ListToSave.push(data);
     data.delete=false;
    }
    // else
    // {
    //   this.ListToSave.splice (this.ListToSave.indexOf(data),1);
    // }
  }
  onDelete(event, data)
  {
    if(event.checked == true)
    {
      data.checked=false;
    }
   
  }
  

  saveData()
  {
    var erroremsg:any;
    var msgType:any;
    var savelist : Array<any>=[];
    let ids="0";
    // TourListToSave

    this.fieldArray.data.forEach((el)=>{
         var data1:any={};
         if(el.checked==true)
         {
              data1.ConfirmedByMD='Y';
              data1.TOURSTARTDATE=formatDate(el.TOURSTARTDATE, 'dd-MMM-yyyy', 'en-US', '+0530') ;
              data1.TOURENDDATE=formatDate(el.TOURENDDATE, 'dd-MMM-yyyy', 'en-US', '+0530')  ;
              data1.ADVANCEAMT=el.ADVANCEAMT==null?0:el.ADVANCEAMT;
              data1.TOURID=el.TOURID;
            // savelist.push({'ConfirmedByMD':'Y','ID':el.TOURID});
              savelist.push(data1);
              ids=ids+", "+el.TOURID;
         }
         else if(el.delete==true)
         {
              data1.ConfirmedByMD='R';
              data1.TOURSTARTDATE=formatDate(el.TOURSTARTDATE, 'dd-MMM-yyyy', 'en-US', '+0530') ;
              data1.TOURENDDATE=formatDate(el.TOURENDDATE, 'dd-MMM-yyyy', 'en-US', '+0530')  ;
              data1.ADVANCEAMT=el.ADVANCEAMT==null?0:el.ADVANCEAMT;
              data1.TOURID=el.TOURID;
            // savelist.push({'ConfirmedByMD':'Y','ID':el.TOURID});
              savelist.push(data1);
         }

    }); 

   if( savelist.length<=0)
   {
     this.WrongDetailDialog('Sorry, Nothing to save.');
   }
   else
   {
    this.isLoadingResults=true;
     const params = new  HttpParams()
 
    .set('token', this.token)
    .set('list',JSON.stringify(savelist))
    .set('ids', ids);
    this.http.post(this.original_url+"/hr/hr/TourConfirmation", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
     this.isLoadingResults=false;
     if(res=="Ravinder")
     {
      erroremsg="Some Error Found Please Login Again Or Connect To System Admin";
      msgType="wrongData";
     }
     else
     {
      msgType="sucess";
     }
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData:msgType,
         displayMsg:erroremsg
       }
     });
      this.data=res;
      this.itemDisplay=res;
      this.itemDisplay=this.itemDisplay.Table;
      this.fieldArray.data = this.itemDisplay;
       console.log("res",res);
       this.TourListToSave=[];
       this.isLoadingResults=false;
    },
    error=>{
     
      erroremsg=error.message;
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'wrongData',
         displayMsg:erroremsg
       }
     });
     this.isLoadingResults=false;
    });
   }
  }

  applyFilter(filterValue: string) {
    this.fieldArray.filter = filterValue.trim().toLowerCase();
  }
  showmytour(row)
  {
    if(row.CONFIRMEDBYMD!='Y')
    {
      this.router.navigate(['/add-tour-intimation/'+row.TOURID+'/view/tour-form-approval'], {skipLocationChange:true});
    }
    else{
      this.WrongDetailDialog("This infomastion not for edit.");
    }
  }
  WrongDetailDialog(pmsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pmsg
      }
    });
  }
  printTourForm(tourId)
  {
       this.isLoadingResults=true;
    this.upload.downloadPDF(this.original_url+ '/admin/CreatePDF/PrintTourForm?token='+this.token+"&tourId="+tourId).subscribe(res => {
      console.log(res);
       var newBlob = new Blob([res], { type: "application/pdf" });
       console.log("ravi",res);
       var newurl = window.URL.createObjectURL(newBlob);
       window.open(newurl);
       this.isLoadingResults=false;
    }, error => {
      this.isLoadingResults=false
      console.log(error);
   });
  }
  getSavedTourList()
  {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/hr/hr/getTourIntimationListForApproval?token="+this.token).subscribe((res)=>{
    this.data=res;
    this.itemDisplay=res;
    this.itemDisplay=this.itemDisplay.Table;
    this.fieldArray.data = this.itemDisplay;

     console.log("res",res);
     this.isLoadingResults=false;
    });
  }

}