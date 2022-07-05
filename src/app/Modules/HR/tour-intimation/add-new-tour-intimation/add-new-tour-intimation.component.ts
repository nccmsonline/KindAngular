import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-new-tour-intimation',
  templateUrl: './add-new-tour-intimation.component.html',
  styleUrls: ['./add-new-tour-intimation.component.css']
})
export class AddNewTourIntimationComponent implements OnInit {
  original_url=environment.baseUrl;trainTicketList:Array<any>=[];newTrainItem:any={};busTicketList:Array<any>=[];
  airticketlist:Array<any>=[];newAirItem:any={};newHotelItem:any={};newBusItem:any={};hotelList:Array<any>=[];
editBusId:any;editTrainId:any;editAirId:any;editHotel:any;backto:any;
isAddNew:any;allData:any={};EmpNo:any;myDate = new Date();routeAction:any;routeID:any;
isEditable:any;isLoadingResults:any;leaveform:any=[];userid:any;token:any;
newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
constructor(private http: HttpClient,private activatedRoute: ActivatedRoute, public dialog: MatDialog) {
  let currentBranch = sessionStorage.getItem("currentBranch");
  var CompanyData = JSON.parse(currentBranch);
  this.ServerIP=CompanyData['SERVERIP'];
  this.FYUSER=CompanyData['FYUSER'];
  this.boid = CompanyData['BRANCHID'];
  
  let currentUser = sessionStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);
  this.userid = currentUser['USERID'];
  this.token = currentUser['TOKEN'];

  console.log("CompanyData", CompanyData);

  console.log("currentUser", currentUser);

  this.myDate= new Date(CompanyData['WORKINGDATE']);
  this.routeID = parseInt( this.activatedRoute.snapshot.paramMap.get('id'));
  this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
  this.backto ="/" + this.activatedRoute.snapshot.paramMap.get('backto');
  this.isAddNew=true;


 }
  ngOnInit() {
    if(this.routeAction!="new")
    {
      this.http.get(this.original_url+"/HR/HR/getTourInfo?token="+this.token+"&tourid="+this.routeID).subscribe((res: any[])=> {
        this.allData=res;
       this.newData=this.allData.Table[0];
       this.EmpNo=this.newData.EMPNO;
       this.myDate=this.newData.DATED;
       this.busTicketList=this.allData.Table1;
       this.trainTicketList=this.allData.Table2;
       this.airticketlist=this.allData.Table3;
       this.hotelList=this.allData.Table4;
        this.isLoadingResults=false;
      },errr=>{
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'wrongData',
            displayMsg:'Please check you internet coneectivity'
          }
          
        });
        this.isLoadingResults=false;
      }
      );
    }
  }
  refresh()
  {
    this.newData.EMPNO='';
    this.newData.NAME='';
    this.newData.DESIGNATION;
    this.newData.LEAVEFROM='';
    this.newData.DEPARTMENT='';
    this.newData.LEAVETO='';
    this.newData.REASONFORLEAVE='';
    this.newData.ADDRESS='';
    this.isAddNew=true;
  }
  validateDetail()
  {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.EmpNo==undefined||this.EmpNo=='')
    {flag=false; msg=msg+"<li>Employee code not entred</li>"}
    if(this.newData.NAME==undefined||this.newData.NAME=='' )
    {flag=false; msg=msg+"<li>Employee not exsits</li>"}
    if(this.newData.TOURSTARTDATE==undefined||this.newData.TOURSTARTDATE=='' )
    {flag=false; msg=msg+"<li>Tour start from date not entred</li>"}
    if(this.newData.TOURENDDATE==undefined||this.newData.TOURENDDATE=='' )
    {flag=false; msg=msg+"<li>Tour upto date not entred</li>"}
    if(this.newData.REASONFORTOUR==undefined||this.newData.REASONFORTOUR=='' )
    {flag=false; msg=msg+"<li>Reason of tour not entred</li>"}
    if(this.newData.PARTYNAMEANDADDRESS==undefined||this.newData.PARTYNAMEANDADDRESS=='' )
    {flag=false; msg=msg+"<li>Party Name and Address not entred</li>"}

     msg=msg+"</ul>";
     if(flag==false)
     {
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
       data: {
         wrongData: 'validation',
         displayMsg:msg
       }
     });
     }
    else
    {
      this.saveLeaveRecord(this.routeAction)
    }
 
}

saveLeaveRecord(mode)
{
  var savedata:any={};
  var saveList:any=[];
  var msg:any,mId:any;
  debugger;
  if(mode=='new')
  {
    msg="Saved sucessfully";
    mId="-1";
  }
  else
  {
    msg="updated sucessfully";
    mId=this.newData.ID;
    //console.log("2", this.newData);
  }
  
//  savedata.EMPNO=this.newData.EMPNO;
  
  if(mode=='new')
  {
    savedata.TOURID=":a"; 
    savedata.DATED=":b"; 
    savedata.BRANCHID=this.boid;
    savedata.USERID=this.userid;
    
    //console.log("3", this.newData);
  }
  else
  {
    savedata.MDATE=":b"; 
  }
  savedata.EMPID=this.newData.EMPID;
  savedata.TOURSTARTDATE=  formatDate(this.newData.TOURSTARTDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 
  savedata.TOURENDDATE=  formatDate(this.newData.TOURENDDATE, 'dd-MMM-yyyy', 'en-US', '+0530'); 
  savedata.REASONFORTOUR=this.newData.REASONFORTOUR;
  savedata.PARTYNAMEANDADDRESS=this.newData.PARTYNAMEANDADDRESS;
  savedata.ADVANCEAMT=this.newData.ADVANCEAMT;
  saveList.push(savedata);
  let busTicketSave:Array<any>=[];
  this.busTicketList.forEach((el)=>{
    let newd:any={};
    newd.TOURID=':A';
    newd.BRANCHID=this.boid;
    newd.FROMCITY=el.FROMCITY;
    newd.TOCITY=el.TOCITY;
    newd.DATEOFJOURNEY=formatDate(el.DATEOFJOURNEY, 'dd-MMM-yyyy', 'en-US', '+0530'); 
    busTicketSave.push(newd);
  });

  let trainTicketSave:Array<any>=[];
  this.trainTicketList.forEach((el)=>{
    let newd:any={};
    newd.TOURID=':A';
    newd.BRANCHID=this.boid;
    newd.FROMSTATION=el.FROMSTATION;
    newd.TOSTATION=el.TOSTATION;
    newd.TYPEOFBOOKING=el.TYPEOFBOOKING;
    newd.DATEOFJOURNEY=formatDate(el.DATEOFJOURNEY, 'dd-MMM-yyyy', 'en-US', '+0530');
    trainTicketSave.push(newd);
  });


  let airticketSave:Array<any>=[];
  this.airticketlist.forEach((el)=>{
    let newd:any={};
    newd.TOURID=':A';
    newd.BRANCHID=this.boid;
    newd.FROMAIRPORT=el.FROMAIRPORT;
    newd.TOAIRPORT=el.TOAIRPORT;
    newd.DATEOFJOURNEY=formatDate(el.DATEOFJOURNEY, 'dd-MMM-yyyy', 'en-US', '+0530');
    airticketSave.push(newd);
  });

  let hotelListSave:Array<any>=[];
  this.hotelList.forEach((el)=>{
    let newd:any={};
    newd.TOURID=':A';
    newd.BRANCHID=this.boid;
    newd.CITYNAME=el.CITYNAME;
    newd.PREFERREDAREA=el.PREFERREDAREA;
    newd.BOOKINGFROM=formatDate(el.BOOKINGFROM, 'dd-MMM-yyyy', 'en-US', '+0530');
    newd.BOOKINGTO=formatDate(el.BOOKINGTO, 'dd-MMM-yyyy', 'en-US', '+0530');
    hotelListSave.push(newd);
  });

  const  params = new  HttpParams()
  .set('fyuser', this.FYUSER)
  .set('serverip', this.ServerIP)
  .set('boid', this.boid)
  .set('id', this.routeID)
  .set('userid', this.userid)
  .set('token', this.token)
  .set('haeder', JSON.stringify(saveList))
  .set('busdetail', JSON.stringify(busTicketSave))
  .set('traindetail', JSON.stringify(trainTicketSave))
  .set('airdetail', JSON.stringify(airticketSave))
  .set('hoteldetail', JSON.stringify(hotelListSave));

  this.isLoadingResults=true;
this.http.post(this.original_url+"/hr/hr/saveTourForm", params.toString(), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
.subscribe((res) => {
  // this.allData=res;
  // this.leaveform=this.allData.Table;
  
  debugger;
  if (res=="Ravinder")
  {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'Somthing went wrong'
      }
    });
 
  }
  else
  {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess',
        displayMsg:msg
      }
    });
    this.newData={};   
    this.busTicketList=[];
    this.airticketlist=[];
    this.trainTicketList=[];
    this.hotelList=[];
  }
  this.isLoadingResults=false;
},
error=>{
  var erroremsg:any;
  erroremsg=error.message;
  ////console.log("1212",erroremsg);
 const dialogRef = this.dialog.open(SuccessDialogComponent, {
   data: {
     wrongData: 'wrongData',
     displayMsg:erroremsg
   }
 });
 this.isLoadingResults=false;}
 );

}

removeItem(datalist, index){
  datalist.splice(index,1);
}
editItem(val, flag){
  if(flag=='B')
  {
    this.editBusId = val;
  }
  else if(flag=='T')
  {
    this.editTrainId = val;
  }
  else if(flag=='A')
  {
    this.editAirId = val;
  }
  else if(flag=='H')
  {
    this.editHotel = val;
  }
}
updateItem(flag){
  //this.editBusId = {};
  if(flag=='B')
  {
    this.editBusId = {};
  }
  else if(flag=='T')
  {
    this.editTrainId = {};
  }
  else if(flag=='A')
  {
    this.editAirId = {};
  }
  else if(flag=='H')
  {
    this.editHotel = {};
  }
 }
 addiBustem(){
  var flag:boolean, msgBox:string;
  flag=true;
  msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
console.log("ravinder bus",this.newBusItem);
 if(this.newBusItem.FROMCITY==''||this.newBusItem.FROMCITY==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>From City not entred."+'</li>';
  }
  if(this.newBusItem.TOCITY==''||this.newBusItem.TOCITY==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>To City not entred."+'</li>';
  }
  if(this.newBusItem.DATEOFJOURNEY==''||this.newBusItem.DATEOFJOURNEY==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>Date of Journey not entred."+'</li>';
  }
  msgBox=msgBox+"</ul>";
  if(flag==true)
  {
      this.busTicketList.push(this.newBusItem);    
      this.busTicketList.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newBusItem = {};
  }
  else
  {
    this.showMsg(msgBox);
  }
}
addTrainItem(){
  var flag:boolean, msgBox:string;
  flag=true;
  msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';

 if(this.newTrainItem.FROMSTATION==''||this.newTrainItem.FROMSTATION==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>From Station not entred."+'</li>';
  }
  if(this.newTrainItem.TOSTATION==''||this.newTrainItem.TOSTATION==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>To Station not entred."+'</li>';
  }
  if(this.newTrainItem.DATEOFJOURNEY==''||this.newTrainItem.DATEOFJOURNEY==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>Date of Journey not entred."+'</li>';
  }
  msgBox=msgBox+"</ul>";
  if(flag==true)
  {
      this.trainTicketList.push(this.newTrainItem);    
      this.trainTicketList.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newTrainItem = {};
  }
  else
  {
    this.showMsg(msgBox);
  }
}
addAirticket(){
  var flag:boolean, msgBox:string;
  flag=true;
  msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';

 if(this.newAirItem.FROMAIRPORT==''||this.newAirItem.FROMAIRPORT==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>From Airport not entred."+'</li>';
  }
  if(this.newAirItem.TOAIRPORT==''||this.newAirItem.TOAIRPORT==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>To Airport not entred."+'</li>';
  }
  if(this.newAirItem.DATEOFJOURNEY==''||this.newAirItem.DATEOFJOURNEY==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>Date of Journey not entred."+'</li>';
  }
  msgBox=msgBox+"</ul>";
  if(flag==true)
  {
      this.airticketlist.push(this.newAirItem);    
      this.airticketlist.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newAirItem = {};
  }
  else
  {
    this.showMsg(msgBox);
  }
}
addHotelItem(){
  var flag:boolean, msgBox:string;
  flag=true;
  msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';

 if(this.newHotelItem.CITYNAME==''||this.newHotelItem.CITYNAME==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>City Name not entred."+'</li>';
  }
 
  if(this.newHotelItem.BOOKINGFROM==''||this.newHotelItem.BOOKINGFROM==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>From booking not entred."+'</li>';
  }
  if(this.newHotelItem.BOOKINGTO==''||this.newHotelItem.BOOKINGTO==undefined)
  {
      flag=false;
      msgBox=msgBox+"<li>To booking not entred."+'</li>';
  }
  msgBox=msgBox+"</ul>";
  if(flag==true)
  {
      this.hotelList.push(this.newHotelItem);    
      this.hotelList.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newHotelItem = {};
  }
  else
  {
    this.showMsg(msgBox);
  }
}

showMsg(msgBox)
{
  const dialogRef = this.dialog.open(SuccessDialogComponent, {
    data: {
      wrongData: 'validation',
      displayMsg:msgBox
    }
  });
}
 showData()
 {
  this.isLoadingResults=true;
  this.http.get(this.original_url+"/HR/HR/getEmployeeDetailByEmpNo?empno="+this.EmpNo+"&token="+this.token).subscribe((res: any[])=> {
    this.allData=res;
   this.newData=this.allData.Table[0];
   
    this.isLoadingResults=false;
  },errr=>{
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'Please check you internet coneectivity'
      }
      
    });
    this.isLoadingResults=false;
  }
  );
 }
}
