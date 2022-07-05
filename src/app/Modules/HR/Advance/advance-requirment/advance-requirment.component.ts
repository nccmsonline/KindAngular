import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpParams } from '@angular/common/http'
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileDownloadUploadService } from "../../../../../app/file-download-upload.service";
//import {Observable} from 'rxjs/Observable';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
// import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-advance-requirment',
  templateUrl: './advance-requirment.component.html',
  styleUrls: ['./advance-requirment.component.css']
})
export class AdvanceRequirmentComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  
  selectedfile=null;fileName=''; fileUploaded=false;
  fieldArray = new MatTableDataSource<any>();WorkingDate=new Date();
  original_url=environment.baseUrl;progress:any;message:any;
  isAddNew:any;allData:any={};EmpNo:any;myDate:Date;advancetypeList:Array<any>=[];
  isEditable:any;isLoadingResults:any;leaveform:any=[];userid:any;token:any;
  newData:any={};boid : any;FYUSER:any;ServerIP:any;datePipe = new DatePipe("en-US");EmpId:any;
  displayedColumns =  ['dated', 'amount','INSTALLMENTAMT', 'type','billno', 'raeson', 'approved','ravi'];

  // public webcamImage: WebcamImage = null;

  // handleImage(webcamImage: WebcamImage) {
  //   this.webcamImage = webcamImage;
  // }
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    };
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  // private trigger: Subject<void> = new Subject<void>();
  // private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(private http: HttpClient, public dialog: MatDialog,private upload:FileDownloadUploadService) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.WorkingDate= new Date(CompanyData['SEVERDATE']);
    this.WorkingDate.setDate(this.WorkingDate.getDate() -4);

    
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.isAddNew=true;
    this.myDate= new Date(CompanyData['WORKINGDATE']);
   this.getAdvancetype();

   }
    ngOnInit() {
      this.fieldArray.sort = this.sort;
   this.fieldArray.paginator=this.paginator;
   this.showWebcam=false;
   WebcamUtil.getAvailableVideoInputs()
   .then((mediaDevices: MediaDeviceInfo[]) => {
     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
   });
    }

   startCamera()
   {
    this.showWebcam=!this.showWebcam;
    // WebcamUtil.getAvailableVideoInputs()
    // .then((mediaDevices: MediaDeviceInfo[]) => {
    //   this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    // });
   }
    validateDetail(mode)
    {
    var flag:boolean;
    flag=true;
    var mdate = new Date();
    var msg:any;
    this.isLoadingResults=true;
    msg="Before add please rectify following mistakes:-"+'<br><br> <ul>';
    if(this.EmpNo==undefined||this.EmpNo=='')
    {flag=false; msg=msg+"<li>Employee code not entred</li>"}
    if(this.newData.NAME==undefined||this.newData.NAME=='' )
    {flag=false; msg=msg+"<li>Employee not exsits</li>"}
     if(this.newData.ADVANCEAMT==undefined||this.newData.ADVANCEAMT=='' )
     {flag=false; msg=msg+"<li>Amount not entred</li>"}
     if(this.newData.ADVANCETYPEID==undefined||this.newData.ADVANCETYPEID=='' )
     {flag=false; msg=msg+"<li>Type of requirement not entred</li>"}
     if(this.newData.REASON==undefined||this.newData.REASON=='' )
     {flag=false; msg=msg+"<li>Reason not entred</li>"}
     if((this.newData.BILLNO==undefined||this.newData.BILLNO=='') && this.newData.ADVANCETYPEID==5)
     {flag=false; msg=msg+"<li>Bill No not entred.</li>"}
     if((this.newData.INSTALLMENTAMT==undefined||this.newData.INSTALLMENTAMT=='') && this.newData.ADVANCETYPEID==2)
     {flag=false; msg=msg+"<li>Loan Installment not entred.</li>"}
     
     if((this.fileName=='Error'||this.fileName=='') && (this.newData.ADVANCETYPEID==5 || this.newData.ADVANCETYPEID==6))
     {flag=false; msg=msg+"<li>Please upload file.</li>"}
     msg=msg+"</ul>";
       if(flag==false)
       {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
         data: {
           wrongData: 'validation',
           displayMsg:msg
         }
       });
       this.isLoadingResults=false;
       }
      else
      {
        this.saveRecord(mode)
      }
  }
 
  saveRecord(mode)
  {
    var savedata:any={};
    var saveList:any=[];
    var msg:any,mId:any;
    if(mode=='add')
    {
      msg="Saved sucessfully";
      mId="-1";
    }
    else
    {
      msg="updated sucessfully";
      mId=this.newData.ID;
    }
   if(mode=='add')
    {
      savedata.Id=":a"; 
      savedata.DATED=":b"; 
      savedata.BRANCHID=this.boid;
      savedata.USERID=this.userid;
      savedata.EMPID=this.newData.EMPID;
    }
    else
    {
      savedata.MDATE=":b"; 
    }
    savedata.BILLNO= this.newData.BILLNO;
    savedata.ADVANCEAMT= this.newData.ADVANCEAMT;
    savedata.ADVANCETYPEID= this.newData.ADVANCETYPEID;
    savedata.REASON=this.newData.REASON;
    savedata.FILENAME=this.fileName;
    savedata.INSTALLMENTAMT=this.newData.INSTALLMENTAMT;
    saveList.push(savedata);
  
    const  params = new  HttpParams()
   
    .set('id', mId)
    .set('empno', this.EmpNo)
    .set('token', this.token)
    .set('data', JSON.stringify(saveList));
    
  this.http.post(this.original_url+"/user/saveAdvanceForm", params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .subscribe((res) => {
    this.allData=res;
    this.fieldArray=this.allData.Table;
    this.newData={};
    if (this.fieldArray!=undefined)
    { 
      this.isAddNew=true;
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'sucess',
                displayMsg:msg
              }
            });
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
  showRecord(data)
  {
   
    if(data.APPROVEDBYAUTHORITY=="N")
    {
      Object.assign(this.newData, {
        ID:data.ID,
        EMPID:data.EMPID, 
        NAME:data.NAME, 
        DESIGNATION:data.DESIGNATION, 
        DEPARTMENT:data.DEPARTMENT, 
        ADVANCEAMT: data.ADVANCEAMT,
        ADVANCETYPEID:data.ADVANCETYPEID,
        REASON:data.REASON,
        BILLNO:data.BILLNO,
        INSTALLMENTAMT:data.INSTALLMENTAMT
       });
       this.fileName=data.FILENAME;
      this.isAddNew=false;
    }
    else
    {
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'You cannot modified approved application'
        }
      });
    }
  
    debugger;
  }
 
  onFileSelected(event)
  {
    console.log(event);
    this.selectedfile=event;
    this.fileUploaded=true;
  }
  uploadfile()
  {
    this.uploadFile(this.selectedfile);
  }
  uploadFileImage(file: File) {
   this.isLoadingResults=true;
    this.upload.uploadFile(this.original_url+ '/Master/upload/UploadFile?pPath=PaymentRequirment', file)
      .subscribe(
        event => {
          
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${this.progress}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          console.log("my data", event);
          console.log("Upload Error:", err.error.text);
          this.fileName= err.error.text;
          if(this.fileName!="Error")
          {
            this.message="File Upload Sucessfully";
            this.fileUploaded=false;
            this.isLoadingResults=false;
          }
          else
          {
            this.message="Some think went Wrong";
          }
          
        }, () => {
          console.log("Upload done");
        }
      );
  }
  uploadFile(files: FileList) {
    if (files.length == 0) {
      console.log("No file selected!");
      return

    }
    let file: File = files[0];

    this.upload.uploadFile(this.original_url+ '/Master/upload/UploadFile?pPath=PaymentRequirment', file)
      .subscribe(
        event => {
          
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${this.progress}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          console.log("my data", event);
          console.log("Upload Error:", err.error.text);
          this.fileName= err.error.text;
          if(this.fileName!="Error")
          {
            this.message="File Upload Sucessfully";
            this.fileUploaded=false;
          }
          else
          {
            this.message="Some think went Wrong";
          }
          
        }, () => {
          console.log("Upload done");
        }
      )
  }
  download(filename: string) {
    this.upload.downloadNoteReceipt("PaymentRequirment",filename).subscribe(res => {
      console.log(res);

      let checkFileType =  filename.split('.').pop();
      var fileType;
      debugger;
      checkFileType=checkFileType.toLowerCase();
      if(checkFileType == "txt")
      {
        fileType = "text/plain";
      }
      if(checkFileType == "pdf")
      {
        fileType = "application/pdf";
      }
      if(checkFileType == "doc")
      {
        fileType = "application/vnd.ms-word";
      }
      if(checkFileType == "docx")
      {
        fileType = "application/vnd.ms-word";
      }
      if(checkFileType == "xls"||checkFileType == "xlsx")
      {
        fileType = "application/vnd.ms-excel";
      }
      if(checkFileType == "png")
      {
        fileType = "image/png";
      }
      if(checkFileType == "jpg")
      {
        fileType = "image/jpeg";
      }
      if(checkFileType == "jpeg")
      {
        fileType = "image/jpeg";
      }
      if(checkFileType == "gif")
      {
        fileType = "image/gif";
      }
      if(checkFileType == "csv")
      {
        fileType = "text/csv";
      }
      // var newBlob = new Blob([res], { type: "application/pdf" });

      var newBlob = new Blob([res], { type: fileType });
      debugger;
   
   
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }
    var newurl = window.URL.createObjectURL(newBlob);
    window.open(newurl);

    //  // For other browsers: 
    //         // Create a link pointing to the ObjectURL containing the blob.
    //         const data = window.URL.createObjectURL(newBlob);

    //         var link = document.createElement('a');
    //         link.href = data;
    //         link.download = "receipt."+checkFileType;
    //         // this is necessary as link.click() does not work on the latest firefox
    //         link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    //         setTimeout(function () {
    //             // For Firefox it is necessary to delay revoking the ObjectURL
    //             window.URL.revokeObjectURL(data);
    //         }, 100);

    }, error => {
      console.log(error);
    })
  }
 
   showData()
   {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/HR/HR/getAdvancePaymentReqList?empno="+this.EmpNo+"&userid="+this.userid+"&token="+this.token).subscribe((res: any[])=> {
      this.allData=res;
     this.allData=this.allData.Table[0];
     Object.assign(this.newData, {
      EMPID:this.allData.EMPID, 
      NAME:this.allData.NAME, 
      DESIGNATION:this.allData.DESIGNATION, 
      DEPARTMENT:this.allData.DEPARTMENT, 
      BILLNO:'',
      ADVANCEAMT: '',
      ADVANCETYPE:  '',
      REASON:'',
      INSTALLMENTAMT:''
     });
     this.fileName='';
     this.message='';
     
     this.allData=res;
      this.fieldArray=this.allData.Table;
      this.isLoadingResults=false;
      console.log("ravinder pal", res);
    },errr=>{
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'Please check you internet coneectivity'
        }
        
      });
      this.isLoadingResults=false;
    });
   }

   getAdvancetype()
   {
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/user/getAdvancetype?token="+this.token).subscribe((res: any[])=> {
      this.allData=res;
     this.advancetypeList=this.allData.Table;
    
      this.isLoadingResults=false;
    },errr=>{
      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: {
          wrongData: 'wrongData',
          displayMsg:'Please check you internet coneectivity'
        }
        
      });
      this.isLoadingResults=false;
    });
   }
  }
  
 
 
 