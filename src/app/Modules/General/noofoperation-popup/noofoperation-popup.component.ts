import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-noofoperation-popup',
  templateUrl: './noofoperation-popup.component.html',
  styleUrls: ['./noofoperation-popup.component.css']
})
export class NoofoperationPopupComponent implements OnInit {

  original_url = environment.baseUrl;
  segementlable:any;
  action:any;
  newData:any={};
  items:Array<any>=[];
  itemsOffer:Array<any>=[];
  itemsnew:Array<any>=[];
  enquiryid:any;
  routeAction:any;
  userinfo: any;
  branchinfo: any;
  coid: any;
  boid: any;
  fyid: any;
  userid: any;
  useraccesstoken: any;
  branch1Data: any;
  id: any;
  toolTypeArray:Array<any>=[];
  oprArray:Array<any>=[];

  constructor(
    public dialogRef: MatDialogRef<NoofoperationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private enquiryservice: EnquiryService,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.id = data.id;
    this.toolTypeArray=data.toolTypeArray;
    this.oprArray=data.oprArray;
    this.newData=data.newData;
    this.routeAction = data.routeAction;
    console.log("oparray",this.oprArray)
    if(this.oprArray!=[]){
       this.toolTypeArray.forEach((element ) => {
        this.oprArray.forEach((element1 ) => {
         if(element.DIETYPEID==element1.WASTAGEID){
          element.selected=true;
          element.value=element1.VALUE;
          console.log("enter in function")
         }
        });
      });
    }

  }
  
  ngOnInit() {
  }
  

  
  savesegement(){

    var oparray: Array<any> = [];
    let i = 0;
    for (let mdata of this.toolTypeArray) {
      if(mdata.selected==true){
      oparray.push({
        ID: i + 1,
        NAME : mdata.DIETYPEDESC,
        VALUE : mdata.value,
        WASTAGEID : mdata.DIETYPEID
      });
      i++;
    }
    }
      this.closeSegment(oparray)
  }

  closeSegment(oparray)
  {
  console.log("this.items", oparray);
    this.dialogRef.close({data: oparray});
  }

}
