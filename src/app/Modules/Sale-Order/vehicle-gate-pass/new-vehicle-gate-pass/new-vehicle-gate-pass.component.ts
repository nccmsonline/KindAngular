import { parseNumber } from '@progress/kendo-angular-intl';
import { share } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from 'src/app/Global';
import { environment } from 'src/environments/environment';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-vehicle-gate-pass',
  templateUrl: './new-vehicle-gate-pass.component.html',
  styleUrls: ['./new-vehicle-gate-pass.component.css']
})
export class NewVehicleGatePassComponent implements OnInit {
  newData:any={};routeID:any;routeAction:any;allData:any={};
  isLoadingResults=false;
  original_url = environment.baseUrl;transpoterList:Array<any>=[];
  constructor( private activatedRoute: ActivatedRoute, private http: HttpClient,public AppUser:Global, public dialog: MatDialog, private router: Router) { 
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    console.log("action ", this.routeAction);
    this.getLoadData();
  }

  ngOnInit() {
   
  }
  getLoadData()
  {
    this.http.get(this.original_url+"/SOP/SaleInvoice/GetVehicleGPLoad?token="+this.AppUser.Token+"&id="+this.routeID).subscribe((res:any)=>{
      this.allData=res;
      var data=this.allData.Table[0];
      this.transpoterList=this.allData.Table1;
      this.newData=data;
     
      console.log("data",data);
      if(this.routeAction!="new")
      {
       
        var pdate =new Date(this.newData.INTIME);
        if(this.newData!=null)
        {
          this.newData.INTIME= pdate; 
        }
        else
        {
          this.newData.INTIME='';
        }
        pdate =new Date(this.newData.OUTTIME);
        if(data.OUTTIME!=null)
        {
          this.newData.OUTTIME= pdate;// data.OUTTIME; 
        }
        else
        {
          this.newData.OUTTIME='';
        }
      }
     
    });
  }
  validateBeforeSave(mode)
  {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    //debugger;

    console.log("dataravi",this.newData);
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
   
    if(this.newData.VEHICLENO==undefined||this.newData.VEHICLENO=='' )
    {flag=false; msg=msg+"<li>Vehicle no. not entred</li>"}
    if(this.newData.DRIVERNAME==undefined||this.newData.DRIVERNAME=='' )
    {flag=false; msg=msg+"<li>Driver Name not entred</li>"}

    if(this.newData.MOBILENO==undefined||this.newData.MOBILENO=='' )
    {flag=false; msg=msg+"<li>Driver Mobile no. not entred</li>"}

    if(this.newData.TRANSPORTERID==undefined||this.newData.TRANSPORTERID=='' )
    {flag=false; msg=msg+"<li>Transporter Name not selected</li>"}
    if(this.newData.CUSTOMERNAME==undefined||this.newData.CUSTOMERNAME==null)
    {flag=false; msg=msg+"<li>Customer Name not seleected</li>"}
 
    if(this.newData.INTIME==undefined||this.newData.INTIME=='' )
    {flag=false; msg=msg+"<li>In time not entred</li>"}

    var endDate = new Date(this.newData.OUTTIME).getTime();
    var startDate = new Date(this.newData.INTIME).getTime();

    if(startDate>endDate)
    {flag=false; msg=msg+"<li>In time should not be less than out time</li>"} 



       msg=msg+"</ul>";
       if(flag==false)
       {
        this.isLoadingResults=false;
        //console.log("msgBox",msg);
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
         data: {
           wrongData: 'validation',
           displayMsg:msg
         }
       });
       
       }
     return flag;
  }
  saveRecord(mode)
  {
    this.isLoadingResults=true;
    if(!this.validateBeforeSave(mode))
    {
      this.isLoadingResults=false;
      return;
    }
    var savedata:any={};
    var saveList:any=[];
    var msg:any,mId:any;
    if(mode=='Insert')
    {
      msg="Saved sucessfully";
      mId="-1";
    }
    else
    {
      msg="updated sucessfully";
      mId=this.newData.ID;
    }
    
   if(mode=='Insert')
   {
      savedata.Id=":a"; 
      savedata.edate=":b"; 
      savedata.DATED=  formatDate(this.newData.DATED, 'dd-MMM-yyyy', 'en-US', '+0530');
      savedata.BRANCHID=this.AppUser.BranchId;
   }
  else
  {
    savedata.Mdate=":b"; 
  }
    savedata.INTIME=  formatDate(this.newData.INTIME, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530'); 
    if(this.newData.OUTTIME==undefined||this.newData.OUTTIME=='' )
    {
      savedata.OUTTIME= "";
    }
    else
    {
      savedata.OUTTIME=  formatDate(this.newData.OUTTIME, 'dd-MMM-yyyy HH:mm', 'en-US', '+0530');     
    }
    savedata.VEHICLENO=this.newData.VEHICLENO;
    savedata.DRIVERNAME=this.newData.DRIVERNAME;

    savedata.TRANSPORTERID=this.newData.TRANSPORTERID;
    savedata.MOBILENO=this.newData.MOBILENO;
    savedata.PURPOSEOFVISIT=this.newData.PURPOSEOFVISIT;
    savedata.CUSTOMERNAME=this.newData.CUSTOMERNAME;

    savedata.MATERIAL=this.newData.MATERIAL;
    savedata.DISTINATION=this.newData.DISTINATION;
    savedata.WEIGHT=this.newData.WEIGHT;
    savedata.LRNO=this.newData.LRNO;
    savedata.REMARKS=this.newData.REMARKS;
    console.log("4", savedata);
    saveList.push(savedata);
  
    const  params = new  HttpParams()
   
    .set('id', mId)
    .set('token', this.AppUser.Token)
    .set('data', JSON.stringify(saveList));
   
  this.http.post(this.original_url+"/SOP/SaleInvoice/saveVehicleGatePass", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    this.allData=res;
    let gatePassForm=this.allData;
    
    debugger;
    if (parseNumber( gatePassForm)>0)
    {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:msg
              }
            });
            this.newData={};
            if(this.routeAction!="new")
            {
              this.router.navigate(['/Vehicle-GP'], {skipLocationChange:true});
            }
    }
    else
    {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'wrongData',
                  displayMsg:'Somthing went wrong'
                }
              });
    }
    this.isLoadingResults=false;
  },
  error=>{
    var erroremsg:any;
    erroremsg=error.message;
   const dialogRef = this.dialog.open(SuccessDialogComponent, {
     data: {
       wrongData: 'wrongData',
       displayMsg:erroremsg
     }
   });
   this.isLoadingResults=false;}
   );
  }
}
