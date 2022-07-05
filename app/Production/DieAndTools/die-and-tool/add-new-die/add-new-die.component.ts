import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-add-new-die',
  templateUrl: './add-new-die.component.html',
  styleUrls: ['./add-new-die.component.css']
})
export class AddNewDieComponent implements OnInit {
  isLoadingResults:boolean;ServerIP:any;FYUSER:any;boid:any;itemDisplay:any;routeID:any;routeAction:any;
  frameList:any=[];poleList:any=[];venderList:any=[];statusList:any=[];electStandarList:any=[];disableDropDown:boolean;
  newData:any={};partyList:any=[];colorCodeList:any=[];toolSectionList:any=[];dieTypeList:any=[];datetype: Array<any>=[];
  constructor(private router: Router, @Inject('BASE_URL') private original_url : string, private http: HttpClient,  private activatedRoute: ActivatedRoute, public dialog: MatDialog) {
    this.isLoadingResults=true;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP= CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    http.get(this.original_url+"/Production/DieAndTools/loadDieFormData?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid).subscribe((res: any[])=> {
    
     console.log("ts",res);
   
   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table;
   this.frameList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table1;
   this.poleList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table2;
   this.partyList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table3;
   this.dieTypeList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table4;
   this.toolSectionList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table5;
   this.colorCodeList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table6;
   this.venderList = this.itemDisplay;
   
   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table7;
   this.statusList = this.itemDisplay;

   this.itemDisplay=res;
   this.itemDisplay=this.itemDisplay.Table8;
   this.electStandarList = this.itemDisplay;

   if(this.routeAction=="edit")
   {
     //this.original_url
      http.get(this.original_url+"/Production/DieAndTools/getDieData?serverip="+this.ServerIP+"&fyuser="+this.FYUSER+"&boid="+ this.boid+"&dieid="+ this.routeID).subscribe((res: any[])=> {
      console.log("test",res); 
      this.itemDisplay=res;
        this.itemDisplay=this.itemDisplay.Table;
        this.newData = this.itemDisplay[0];
       if( this.newData.DOUBLEPUNCH=="Y")
       this.newData.ISDOUBLEPUNCH=true;

       this.newData.INHOUSEVENDORED="I";
      });
      this.isLoadingResults=false;
    }
    else
    {
      this.isLoadingResults=false;
    }
    });
  }
  ngOnInit() {
    this.datetype.push({id:'I',description:'In-House'}) ;
    this.datetype.push({id:'V',description:'Vendored'}) ;
  }
  calculateBalanceStrokes(data)
  {
    var stPlanned=0,stMade=0;
    if(data.PLANNEDSTROKES==undefined||data.PLANNEDSTROKES==0||data.PLANNEDSTROKES=='' ||data.PLANNEDSTROKES==null)
    stPlanned=0;
    else
    stPlanned=data.PLANNEDSTROKES;

    if(data.STROKESMADE==undefined||data.STROKESMADE==0||data.STROKESMADE=='' ||data.STROKESMADE==null)
    stMade=0;
    else
    stMade=data.STROKESMADE;

    data.AVAILABLESTROKES=stPlanned-stMade;
  }
  validatData(data)
  {
  var flag:boolean;
  flag=true;
  var mdate = new Date();
  var msg:any;
 

  console.log("ravi",data);
  msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';


  if(data.PARTYID==undefined||data.PARTYID==0||data.PARTYID=='' ||data.PARTYID==null)
  {flag=false; msg=msg+"<li>Customer not seletect.</li>";}
  // if(data.BILLCUSTOMERID==undefined||data.BILLCUSTOMERID==0||data.BILLCUSTOMERID=='' ||data.BILLCUSTOMERID==null)
  // {flag=false; msg=msg+"<li>Bill to Customer not seletect.</li>";}

  // if(data.FRAMEID==undefined||data.FRAMEID==0||data.FRAMEID=='' ||data.FRAMEID==null)
  // {flag=false; msg=msg+"<li>Fame not seletect.</li>";}

  // if(data.POLEID==undefined||data.POLEID==0||data.POLEID=='' ||data.POLEID==null)
  // {flag=false; msg=msg+"<li>Pole not seletect.</li>";}

  // if(data.DRAWINGNO==undefined||data.DRAWINGNO=='' ||data.DRAWINGNO==null)
  // {flag=false; msg=msg+"<li>Drawing no not entred</li>";}
 
  if(data.DIENAME==undefined||data.DIENAME=='' ||data.DIENAME==null)
  {flag=false; msg=msg+"<li>Die Name not entred</li>";}

  if(data.DIETYPEID==undefined||data.DIETYPEID==0||data.DIETYPEID=='' ||data.DIETYPEID==null)
  {flag=false; msg=msg+"<li>Die type not seletect.</li>";}

  if(data.TOOLSECTIONID==undefined||data.TOOLSECTIONID==0||data.TOOLSECTIONID=='' ||data.TOOLSECTIONID==null)
  {flag=false; msg=msg+"<li>Tool section not seletect.</li>";}
    
  console.log("lsit",data.ELESTANDARDID);
  if(data.ELESTANDARDID==undefined ||data.ELESTANDARDID==null)
  {flag=false; msg=msg+"<li>Electrical Standard not seletect.</li>";}
    
  
     msg=msg+"</ul>";
     if(flag==false)
     {
      console.log("msgBox",msg);
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     } //alert(msg);
   return flag;
}
  savedata(data)
  {
    var mData:any={};
    var header:any=[];
    if(this.validatData(data))
    {
      mData.FRAMEID=data.FRAMEID;
      mData.POLEID=data.POLEID;
      mData.PARTYID=data.PARTYID;
      mData.DRAWINGNO=data.DRAWINGNO;
      mData.DIENAME=data.DIENAME;
      mData.DIETYPEID=data.DIETYPEID;
      mData.TOOLSECTIONID=data.TOOLSECTIONID;
      mData.PIECENO=1;
      if(data.MFGDATE!=undefined&&data.MFGDATE!='' &&data.MFGDATE!=null)
      mData.MFGDATE= formatDate(data.MFGDATE, 'dd-MMM-yyyy', 'en-US', '+0530');

      mData.TOTALPIECES=1;
      if(data.ISDOUBLEPUNCH)
      mData.DOUBLEPUNCH="Y";
      else
      mData.DOUBLEPUNCH="N";
      mData.COLORID=data.COLORID;
      mData.MATERIALUSED=data.MATERIALUSED;
      mData.PROCESSUSED=data.PROCESSUSED;
      mData.SUPPLIERID=data.SUPPLIERID;
      mData.INHOUSEVENDORED=data.INHOUSEVENDORED;
      mData.TOOLSECTIONID=data.TOOLSECTIONID;
      mData.ELESTANDARDID=data.ELESTANDARDID;

      mData.RTRDRAWINGNO=data.RTRDRAWINGNO;
      mData.STRNOOFSLOTS=data.STRNOOFSLOTS;
      mData.RTRNOOFSLOTS=data.RTRNOOFSLOTS;
      mData.PARTYREFRENCENO=data.PARTYREFRENCENO;
      mData.REMARKS=data.REMARKS;
      // var frameDesc=this.frameList.find(x=>x.FRAMEID==data.FRAMEID).FRAMEDESC;
      // var poleDesc=this.poleList.find(x=>x.POLEID==data.POLEID).POLEDESC;
      var dieTypeCode=this.dieTypeList.find(x=>x.DIETYPEID==data.DIETYPEID).DIETYPECODE;
      var electStandard:any;
      if(data.ELESTANDARDID>0)
        electStandard=this.electStandarList.find(x=>x.STANDARDID==data.ELESTANDARDID).ELESTANDARD;
      else
        electStandard='';

      mData.DIECODE='';//frameDesc+'/'+poleDesc+'/'+dieTypeCode+'/'+electStandard+'-'+data.DRAWINGNO;

      if(data.DRAWINGNO!=undefined)
      {mData.DIECODE=mData.DIECODE+data.DRAWINGNO}
      if(data.DRAWINGNO!=undefined&&data.RTRDRAWINGNO!=undefined)
      {mData.DIECODE=mData.DIECODE+'/'}
      if(data.RTRDRAWINGNO!=undefined)
      {mData.DIECODE=mData.DIECODE+data.RTRDRAWINGNO}

      mData.DIECODE=mData.DIECODE+'-'+dieTypeCode;

      if(data.ELESTANDARDID>0)
      {mData.DIECODE=mData.DIECODE+'-'+data.electStandard}

      if(data.STRNOOFSLOTS!=undefined)
      {mData.DIECODE=mData.DIECODE+'-#'+data.STRNOOFSLOTS}

      if(data.RTRNOOFSLOTS!=undefined)
      {mData.DIECODE=mData.DIECODE+'-#'+data.RTRNOOFSLOTS}


      if(data.PLANNEDSTROKES==undefined||data.PLANNEDSTROKES==0||data.PLANNEDSTROKES=='' ||data.PLANNEDSTROKES==null)
        mData.PLANNEDSTROKES=0;
      else
        mData.PLANNEDSTROKES=data.PLANNEDSTROKES;

      if(data.STROKESMADE==undefined||data.STROKESMADE==0||data.STROKESMADE=='' ||data.STROKESMADE==null)
         mData.STROKESMADE=0;
      else
        mData.STROKESMADE=data.STROKESMADE;

      // if(data.AVAILABLESTROKES==undefined||data.AVAILABLESTROKES==0||data.AVAILABLESTROKES=='' ||data.AVAILABLESTROKES==null)
      //   mData.AVAILABLESTROKES=0;
      // else
        mData.AVAILABLESTROKES=mData.PLANNEDSTROKES-mData.STROKESMADE;

      mData.DIECODE=mData.DIECODE.toUpperCase();
      mData.STATUSID=data.STATUSID;
      mData.BranchId=this.boid;
      if(this.routeAction=="new")
      {
        mData.DIEID=":P";
        mData.EDATE=":d";
      }
      else
      {
        mData.MDATE=":d";
      }
      header.push(mData);
      var returnmsg:any;
      const  params = new  HttpParams()
      .set('fyuser', this.FYUSER)
      .set('serverip', this.ServerIP)
      .set('boid', this.boid)
      .set('dieid', this.routeID)
      .set('header', JSON.stringify(header));
      this.isLoadingResults=true;
    this.http.post(this.original_url+"/Production/DieAndTools/saveDieDetail", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      returnmsg=res;
      if (parseInt(returnmsg)>0)
      {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: {
                  wrongData: 'sucess',
                  displayMsg:'Sucessfull'
                }
              });
              if(this.routeAction=="new")
                this.addNewDie();
              else
              this.router.navigate(['/dies-list']);
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
    });
    }
  }
  addNewDie()
  {
    this.newData={};
  }
}
