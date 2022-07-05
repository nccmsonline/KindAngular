import { ImageViewComponent } from './../../../General/image-view/image-view.component';
import { Global } from 'src/app/Global';
import { HttpClient, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { ValidationComponent } from 'src/app/validation/validation.component';

@Component({
  selector: 'app-resume-status-popup',
  templateUrl: './resume-status-popup.component.html',
  styleUrls: ['./resume-status-popup.component.css']
})
export class ResumeStatusPopupComponent implements OnInit {

 
  original_url=environment.baseUrl;
  imageUrl =environment.imageUrl;
  newData:any={};
  statusarray:Array<any>=[];
  emptyShow='';
  imagesArray: Array<any> = [];
  PopData:any;
  type:any;
  isLoadingResults=false;
  disabledData:boolean=true;
  docimgurl:any;
  formData = new FormData();
  isDownloading: boolean;
  resumeID:any;
 

  constructor(
    private http: HttpClient,
    // private resumeListService: ResumeListService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private globalVar: Global,
    public dialogRef: MatDialogRef<ResumeStatusPopupComponent>,private translate: TranslateService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.PopData = data.rowData;
    this.type=data.type;
    this.resumeID=this.PopData.ID
    this.newData.imagePath = '';
    this.isLoadingResults=true;
    this.http.get(this.original_url+"/HR/Resume/GetResumeStatus?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&id="+this.resumeID)
      .subscribe(event => {
        let temp;
        temp=event,
        this.statusarray=temp.Table;
        this.isLoadingResults=false;
        this.imagesArray = temp.Table2;
        
        this.imagesArray.forEach(rowDetail => {
          let fileenamee = rowDetail.FILENAME;
          this.extensionFileCheck(fileenamee, rowDetail);
          if(rowDetail.checkImgType == 'img'){
          this.getImageFromService(rowDetail);
          }
        });

      });
  }

  getImageFromService(res) {
    this.isLoadingResults = true;
    this.http.get(this.original_url + '/Master/Upload/DownloadFile?url='+res.IMAGEINFO+'&fileName='+res.FILENAME+'&osservertype=windows&module=HR&form=Resume&RefNo='+this.PopData.ID, { responseType: "blob" } )
    .subscribe(data => {
      this.createImageBlob(data, res);
      this.isLoadingResults = false;
    }, error => {
      this.isLoadingResults = false;
    });
  }
  
  createImageBlob(image: Blob, res) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.docimgurl = reader.result;
       res.images = this.docimgurl.replace("data:application/json;base64", 'data:image/jpeg;base64');
      //  res.images = [{source: this.docimgurl, thumbnail: this.docimgurl, title: this.docimgurl}];
    }, false);
  
    if (image) {
       reader.readAsDataURL(image);
    }
   }

    // Image View
  imageView(rowDetail)
  {
    const dialogRef = this.dialog.open(ImageViewComponent, {
      width:'700px',
      data  : {
        data: rowDetail.images
      }
     });
  }

   
  removeImageArray(index) {
    this.imagesArray.splice(index, 1);
  }

  download(rowDetail) {
    this.isDownloading = true;
    let url = rowDetail.IMAGEINFO;
    let fileenamee = rowDetail.FILENAME;  
    this.http.get(this.original_url + '/Master/Upload/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype=windows&module=HR&form=Resume&RefNo='+this.PopData.ID, { responseType: "blob" } )
    .subscribe(res => {

      let checkFileType =  url.split('.').pop();
      var fileType;
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
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }

            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            link.download = fileenamee;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            this.isDownloading = false;
            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
            }, 100);

    }, error => {
      let errorMessage:any;
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = 'Some Error has been occurred! <br> Error : '+ error.error.message;
      } else {
          // server-side error
          errorMessage = 'Some Error has been occurred! <br> Error Code : ' +error.status+ ' - ' +error.statusText;
      }
      this.isDownloading = false;
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: errorMessage,
            action: ''
          }
        });
    })
   
  }

  ngOnInit() {
    this.newData.STATUS = this.PopData.STATUSID;
    this.newData.REMARKS = this.PopData.REMARKS;
    this.newData.DUEON = this.PopData.DUEON;
    if(this.newData.DUEON == '' || this.newData.DUEON == null || this.newData.DUEON == undefined)
    {
      this.disabledData = true;
      this.newData.DUONCHECKBOX = false;
    }
    else
    {
      this.disabledData = false;
      this.newData.DUONCHECKBOX = true;
    }
    
  }

  attention(event)
  {
    if(event.checked == true)
    {
      this.disabledData = false;
    }
    else
    {
      this.disabledData = true;
    }
  }

  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
  // const uploadReq = new HttpRequest('POST', this.original_url + '/Master/Upload/UploadingallFiles?statementtype=Update&userid=' + this.globalVar.UserId + '&module=HR&form=Resume&refid=' + this.PopData.ID + '&osservertype=' + this.globalVar.osservertype + '&remarks=&tablename=Resume_Images&imagesArray=' + JSON.stringify(this.formData) + '&refparentid=1' + this.formData, {

    upload(files) {
      let fileenamee = files[0].name;
      if (fileenamee.indexOf(' ') !== -1) {
        this.isLoadingResults = false;
        const dialogRef = this.dialog.open(ValidationComponent, {
          data: {
            msg: 'Please remove space from file name',
            action: ''
          }
        });
      } else {
  
        var imgURL:any;
        if (files.length === 0)
          return;
  
        var reader = new FileReader();
        reader.readAsDataURL(files[0]); 
        reader.onload = (_event) => { 
          imgURL = reader.result; 
          for (let file of files) {
            this.imagesArray.push({
              FILENAME: file.name,
              images: imgURL
              // images : [{source: imgURL, thumbnail: imgURL, title: imgURL}]
            });
            this.imagesArray.forEach(rowDetail => {
              let fileenamee = rowDetail.FILENAME;
              this.extensionFileCheck(fileenamee, rowDetail);
            });
            this.formData.append(file.name, file);
          }
        }
      }
    }
    extensionFileCheck(fileenamee, rowDetail)
    {
      let checkFileType = fileenamee.split('.').pop();
      if (checkFileType == "txt") {
        rowDetail.checkImgType = 'text';
      }
      if (checkFileType == "pdf") {
        rowDetail.checkImgType = 'pdf';
      }
      if (checkFileType == "doc") {
        rowDetail.checkImgType = 'doc';
      }
      if (checkFileType == "docx") {
        rowDetail.checkImgType = 'doc';
      }
      if (checkFileType == "xls" || checkFileType == "xlsx") {
        rowDetail.checkImgType = 'xl';
      }
      if (checkFileType == "png") {
        rowDetail.checkImgType = 'img';
      }
      if (checkFileType == "jpg") {
        rowDetail.checkImgType = 'img';
      }
      if (checkFileType == "jpeg") {
        rowDetail.checkImgType = 'img';
      }
      if (checkFileType == "gif") {
        rowDetail.checkImgType = 'img';
      }
      if (checkFileType == "mp4" || checkFileType == "3gp" || checkFileType == "WebM" || checkFileType == "MOV" || checkFileType == "AVI"|| checkFileType == "MKV" || checkFileType == "FLV"|| checkFileType == "WMV") {
        rowDetail.checkImgType = 'mp4';
      }
      if (checkFileType == "") {
        rowDetail.checkImgType = 'img';
      }


    }



  resumeStatusSave(hdata)
  {
    this.isLoadingResults=true;
    var dueondate ='';
    if(this.newData.DUEON == undefined || this.newData.DUEON == '' || this.newData.DUEON == null){dueondate=''}else{dueondate= formatDate(this.newData.DUEON, 'yyyy-MM-dd', 'en-US')}
    const  params = new  HttpParams()
    .set('statementtype', 'Insert')
    .set('coid', this.globalVar.CommpanyId)
    .set('boid', this.globalVar.BranchId)
    .set('resumeid', this.PopData.ID)
    .set('userid', this.globalVar.UserId)
    .set('statusId', this.newData.STATUS)
    .set('remarks', this.newData.REMARKS)
    .set('dueon',dueondate);


    var imageArray: Array<any> = [];
    var m = 0;
    for (let mdata of this.imagesArray) {
      imageArray.push({
        id: m+1,
        irdid:this.PopData.ID,
        itemid:0,
        SRNO: m + 1,
        IMAGEINFO: mdata.FILENAME,
        REMARKS: mdata.REMARKS,
        isactive: 1
      });
      m++
    }

    setTimeout(() => {
      // this.isLoadingResults=false;
      if (this.imagesArray.length! > 0) {
        let progress: number;
        let message: any;
        const uploadReq = new HttpRequest('POST', this.original_url + '/Master/Upload/UploadingallFiles?statementtype=Update&userid=' + this.globalVar.UserId + '&module=HR&form=Resume&refid=' + this.PopData.ID + '&osservertype=Windows&remarks=&tablename=Resume_Images&imagesArray=' + JSON.stringify(imageArray) + '&refparentid=1', this.formData, {
          reportProgress: true
        });
        this.http.request(uploadReq).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress){
            progress = Math.round(100 * event.loaded / event.total); 
          }
          if (event.type === HttpEventType.Response){
            this.isLoadingResults=false;
            this.successDialog();
            this.dialogRef.close();
            message = event.body.toString();
          }
        });          
      }
      else {
        this.isLoadingResults=false;
        this.successDialog();
        this.dialogRef.close();
      }

    }, 1000);
    
    this.http.post(this.original_url+"/HR/Resume/UpdateResumeStatus", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe((res) => {
      debugger
      if (this.imagesArray.length! > 0) {
        let progress: number;
        let message: any;
        const uploadReq = new HttpRequest('POST', this.original_url + '/Master/Upload/UploadingallFiles?statementtype=Update&userid=' + this.globalVar.UserId + '&module=HR&form=Resume&refid=' + this.PopData.ID + '&osservertype=' + this.globalVar.osservertype + '&remarks=&tablename=Resume_Images&imagesArray=' + JSON.stringify(imageArray) + '&refparentid=1', this.formData, {
          reportProgress: true
        });
        this.http.request(uploadReq).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress){
            progress = Math.round(100 * event.loaded / event.total); 
          }
          if (event.type === HttpEventType.Response){
            this.isLoadingResults=false;
            this.successDialog();
            this.dialogRef.close();
            message = event.body.toString();
          }
        });          
      }
      else {
        this.isLoadingResults=false;
        this.successDialog();
        this.dialogRef.close();
      }
    });
  }

}
