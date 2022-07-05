import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-new-item-belongs-to',
  templateUrl: './add-new-item-belongs-to.component.html',
  styleUrls: ['./add-new-item-belongs-to.component.css']
})
export class AddNewItemBelongsToComponent implements OnInit {
  original_url = environment.baseUrl;
lCategoryId:any;
title="Add New Category";
newData:any={};
token:any;
userid:any;
isLoadingResults=false;
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddNewItemBelongsToComponent>,
    private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,private router: Router) { 
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
      this.lCategoryId=  data.CATEGORYID;
      if(parseInt(this.lCategoryId)>0)
      {
        this.newData.CODE=data.CODE;
        this.newData.CATEGORY=data.CATEGORY;
        this.title="Edit Category";
      }
    }

  ngOnInit() {
  }
  validateDetail(data)
  {
    var flag:boolean;
    flag=true;
    var msg:any;
    if(data.sch==''||data.sch==undefined)
    {
      data.sch=false;
    }
    msg="<h5>Before add please rectify following mistakes:-</h5>";
      if(data.CODE==undefined||data.CODE=='' )
      {flag=false; msg=msg+"* Short code not entred<br/>"}
      if(data.CATEGORY==undefined||data.CATEGORY=='' )
      {flag=false; msg=msg+"* Category Name entred<br/>"}
   


      if(flag==false) {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'validation',
            displayMsg:msg
          }
        });
      }
    return flag;
  }
  saveCategory()
  {
    this.isLoadingResults=true;
    let data:any={};
    let header:Array<any>=[];
    if(this.validateDetail(this.newData))
    {
        if(this.lCategoryId==0)
        {
          data.CategoryId=":A";
          data.createdby=":B";
          data.edate=":C";
        }
        else
        {
          data.modifiedby=":B";
          data.mdate=":C";
        }
        data.CODE=this.newData.CODE;
        data.CATEGORY=this.newData.CATEGORY;
        header.push(data);
        const  params = new  HttpParams()
        .set('catgId', this.lCategoryId)
        .set('userid', this.userid)
        .set('data', JSON.stringify(header))
        .set('token', this.token);

        this.http.post(this.original_url+"/Master/SaveBelongsToCategory", params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .subscribe((res) => {
          this.isLoadingResults=false;
          let reqno1:any;
          reqno1=res;
          if (parseInt(reqno1)>0)
          {
              this.successDialog('sucess','Data Saved');
            // this.router.navigate(['/item-belongs-to']);
            this.dialogRef.close();
          }
          else
          {
            this.successDialog('wrongData','Some Error has been occurred!');
          }
        },
        error=>{
          this.isLoadingResults=false;
          this.successDialog('validation','Some Error has been occurred!');
        }
        );
    }
    else
    {
      this.isLoadingResults=false;
    }
  }
  successDialog(type, msg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: type,
        displayMsg:msg
      }
    });
  }
}
