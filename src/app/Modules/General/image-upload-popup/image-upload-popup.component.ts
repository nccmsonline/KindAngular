import { Global } from './../../../Global';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { ImageViewComponent } from '../image-view/image-view.component';
import { EmployeeMasterService } from '../employee-master/employee-master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-upload-popup',
  templateUrl: './image-upload-popup.component.html',
  styleUrls: ['./image-upload-popup.component.css']
})
export class ImageUploadPopupComponent implements OnInit {

  imagesArray: Array<any> = [];
  original_url=environment.baseUrl;
  images_url = environment.imageUrl;
  newData:any={};
  isLoadingResults = false;
  itemid:any;
  routeID:any;
  myDate = new Date();
  uploadformData = new FormData();
  formDataArray: Array<any> = [];
  docimgurl:any;
  type:any;
  msid:any;
  actid:any;
  form: any;
  module: any;

  constructor(
    private employeeMasterService: EmployeeMasterService,
    public dialogRef: MatDialogRef<ImageUploadPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private http: HttpClient,
    private globalVar: Global
  ) { 
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.itemid = data.itemid;
    this.routeID = data.routeID;
    this.type = data.type;
    this.form = data.form;
    this.module = data.module;
    let imageArrayCommon = data.actionDetail.imagesArray;
    // if(this.type=='pmsimg'){
    //   this.msid= data.actionDetail.msid;
    //   this.actid= data.actionDetail.id;
    // }
    if(imageArrayCommon.length > 0)
    {
      this.imagesArray = imageArrayCommon;
      this.imagesArray.forEach(res => {
        // if (this.type == 'pmsimg') {
        //   res.itemid = res.actid;
        // }
          this.getImageFromService(res);
       
        if(res.FILENAME == undefined || res.FILENAME == null || res.FILENAME == '') { } else {
          let fileenamee = res.FILENAME;
        this.extensionFileCheck(fileenamee, res);
      }
      });
      console.log("this.imagesArray", this.imagesArray);
    }
  }

  ngOnInit() {
    
  }

  // Download
  download(rowDetail) {
    let url = rowDetail.IMAGEINFO;
    let fileenamee = rowDetail.FILENAME; 
   
      this.http.get(this.original_url + '/Master/Upload/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype=windows&module='+this.module+'&form='+this.form+'&RefNo='+this.routeID, { responseType: "blob" } )
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
          fileType = "text/";
        }
        // var newBlob = new Blob([res], { type: "application/pdf" });
        var newBlob = new Blob([res], { type: fileType });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
      }
        const data = window.URL.createObjectURL(newBlob);
  
        var link = document.createElement('a');
        link.href = data;
       //  link.download = "receipt."+checkFileType;
        link.download = fileenamee;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  
        setTimeout(function () {
            window.URL.revokeObjectURL(data);
        }, 100);
      }, error => {
      })

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

   // DP Change
  uploadattachment(files) {
    let fileenamee = files[0].name;
    // change by gurpreet for replace space in image name at 27/07/2021 
    fileenamee=fileenamee.replace(/ /g,"_")
    // if (fileenamee.indexOf(' ') !== -1) {
    //   this.isLoadingResults = false;
    //   const dialogRef = this.dialog.open(ValidationComponent, {
    //     data: {
    //       msg: 'Please remove space from file name',
    //       action: ''
    //     }
    //   });
    // } else {
    var imgURL:any;
    var imgURL:any;
    if (files.length === 0)
      return;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      imgURL = reader.result; 
      for (let file of files) {
      
   
        this.imagesArray.push({
          FILENAME: file.name.replace(/ /g,"_"),
          images: imgURL,
          itemid:this.itemid
        });
    

        this.imagesArray.forEach(rowDetail => {
          let fileenamee = rowDetail.FILENAME;
          this.extensionFileCheck(fileenamee, rowDetail);
        });
        this.uploadformData.append(file.name, file);
      
      
          this.formDataArray.push({
            FILENAME: file.name.replace(/ /g,"_"),
            file: file,
            itemid:this.itemid
          });
      
      
        // this.uploadformData.append(file.name, file);
      }
    }
  }
    // console.log(" this.imagesArray", this.imagesArray);
// }

getImageFromService(res) {
  this.isLoadingResults = true;
  this.http.get(this.original_url + '/Master/Upload/DownloadFile?url='+res.IMAGEINFO+'&fileName='+res.FILENAME+'&osservertype=windows&module='+this.module+'&form='+this.form+'&RefNo='+this.routeID, { responseType: "blob" } )
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

  removeImageArray(index){
    this.imagesArray.splice(index, 1);
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
    if (checkFileType == "") {
      rowDetail.checkImgType = 'img';
    }
    if (checkFileType == "" || checkFileType == "txt" || checkFileType == "pdf" || checkFileType == "doc" || checkFileType == "xls"
    || checkFileType == "xlsx" || checkFileType == "png" || checkFileType == "jpg" || checkFileType == "jpeg"
    || checkFileType == "gif") {
      checkFileType == "";
    }else{
      rowDetail.checkImgType = 'img';
    }
  }

   // Save
   SaveImage(){
    // let array:Array<any> = [];;
    // array.push(this.imagesArray);
    // array.push(this.uploadformData);
    console.log(this.imagesArray,'123')
    this.dialogRef.close({'imageArray': this.imagesArray, 'formdata': this.formDataArray, 'close': 'ok'});
  
  }
}
