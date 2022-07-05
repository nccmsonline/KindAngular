import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-item-sub-category',
  templateUrl: './add-new-item-sub-category.component.html',
  styleUrls: ['./add-new-item-sub-category.component.css']
})
export class AddNewItemSubCategoryComponent implements OnInit {
  original_url = environment.baseUrl;
  lCategoryId:any;
  title="Add New Sub Category";
  newData:any={};
  token:any;
  userid:any;
  isLoadingResults=false;
  mainCategory:Array<any>=[];
  parameterList:Array<any>=[];
  parameterSelectedList:Array<any>=[];
  operatorList:Array<any>=[];
  allData:any={};
  ravinder=0;
  expression="";
  expression1="";
    constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddNewItemSubCategoryComponent>,
      private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,private router: Router) { 
        let currentUser = sessionStorage.getItem("currentUser");
        currentUser = JSON.parse(currentUser);
        this.token = currentUser['TOKEN'];
        this.userid = currentUser['USERID'];
        this.lCategoryId=  data.CATEGORYID;
        this.mainCategory=data.mainCat;
        this.parameterList=data.param;

        this.operatorList.push({OPERATOR:'(',TYPE:'OPEN BRAKET'})
        this.operatorList.push({OPERATOR:')',TYPE:'CLOSE BRAKET'})
        this.operatorList.push({OPERATOR:'*',TYPE:'OPERATOR'})
        this.operatorList.push({OPERATOR:'/',TYPE:'OPERATOR'})
        this.operatorList.push({OPERATOR:'+',TYPE:'OPERATOR'})
        this.operatorList.push({OPERATOR:'-',TYPE:'OPERATOR'})
        this.newData.HAVEFORMULA=0;
        debugger;
        if(parseInt(this.lCategoryId)>0)
        {
          this.newData.CODE=data.CODE;
          this.newData.CATEGORY=data.CATEGORY;
          this.newData.MAINCATEGORYID=data.MAINCATEGORYID;
          if(data.HAVEFORMULA=="N")
          {
            this.newData.HAVEFORMULA=0;
          }
          else
          {
            this.newData.HAVEFORMULA=1;
          }
          //this.newData.HAVEFORMULA=data.HAVEFORMULA;
          this.title="Edit Sub Category";
          http.get(this.original_url+"/Master/getSubCategoryParameterDetail?subcatgid="+this.lCategoryId).subscribe((res)=>{
            this.allData=res;
            this.parameterSelectedList=this.allData.Table;
            this.parameterSelectedList.forEach(el=>{
              this.expression=this.expression+el.PARAMETERNAME;
              if(el.TYPE=="FIELD")
              {
                this.expression1=this.expression1+"1";
              }
              else
              {
                this.expression1=this.expression1+el.PARAMETERNAME;
              }
            });
           
          });

        }
      }
  
    ngOnInit() {
    }
    onMasterListClick(data)
    {
      let tmpData:any={};
      if(this.validateExpress("FIELD") )
      {
          tmpData.PARAMETERNAME=data.PARAMETERNAME;
          tmpData.PARAMETERID=data.PARAMETERID;
          tmpData.TYPE="FIELD";
          tmpData.id=this.parameterSelectedList.length+1;
          this.parameterSelectedList.push(tmpData);
        //  this.parameterList.splice (this.parameterList.indexOf(data),1);
          this.expression=this.expression+data.PARAMETERNAME;
          this.expression1=this.expression1+"1";
      }
    }   
    onOperatedListClick(data)
    {
      if(this.validateExpress(data.TYPE))
      {
        this.expression=this.expression+data.OPERATOR;
        this.expression1=this.expression1+data.OPERATOR;
        let tmpData:any={};
        tmpData.id=this.parameterSelectedList.length+1;
        tmpData.PARAMETERNAME=data.OPERATOR;
        tmpData.PARAMETERID=0;
        
        if(data.OPERATOR=="(" && data.OPERATOR!=")")
        {
          tmpData.TYPE="OPEN BRAKET";
        }
        else if( data.OPERATOR==")")
        {
          tmpData.TYPE="CLOSE BRAKET";
        }
        else
        {
          tmpData.TYPE="OPERATOR";
          
        }
        
        this.parameterSelectedList.push(tmpData);
      }
      
    }
    validateExpress(pType)
    {
      try
      {
        if( this.parameterSelectedList.length<=0 || this.newData.HAVEFORMULA==false)
        {
          return true;
        }
        let tmp =this.parameterSelectedList[this.parameterSelectedList.length-1];
        if(pType==tmp.TYPE && pType!="OPEN BRAKET" && pType!="CLOSE BRAKET")
        {
          this.successDialog('wrongData','Con not you 2 fields and OPERATOR same time');
          return false;
        }
        else if((pType=="OPEN BRAKET" && tmp.TYPE =="CLOSE BRAKET")||pType=="OPEN BRAKET" && tmp.TYPE =="CLOSE BRAKET")
        {
          this.successDialog('wrongData','Please use OPERATOR after closing braket/before opening braket');
          return false;
        }
        else if(pType=="FIELD" && tmp.TYPE =="CLOSE BRAKET")
        {
          this.successDialog('wrongData','Please use OPERATOR after closing braket');
          return false;
        }
        else if(tmp.TYPE=="FIELD" && pType =="OPEN BRAKET")
        {
          this.successDialog('wrongData','Please use OPERATOR after closing braket');
          return false;
        }
        else
        {
          return true;
        }
      }
      catch(exp)
      {
        this.successDialog('wrongData','Error');
        return false;
      }
    }
    onSelectedListClick(data)
    {
      let tmpData:any={};
      tmpData.PARAMETERNAME=data.PARAMETERNAME;
     // this.parameterList.push(data);
      this.parameterSelectedList.splice (this.parameterSelectedList.indexOf(data),1);
    }  
    // onMainCategoryClose(maincatid)
    // {
    //   console.log("maincatid",maincatid);
    //   this.subFilterCategory=this.subCategory.filter(x=>x.MAINCATEGORYID==maincatid);
    //   console.log("subFilterCategory",this.subFilterCategory);
    //  this.newData.SUBCATEGORYID=null;
    // }
    testExpression()
    {
      if( this.myfuntion(this.expression1))
      {
        this.successDialog('sucess','');
      }
      else
      {
        this.successDialog('wrongData','Error');
      }
    }
    myfuntion(pexp)
    {
      try{
        let r=eval(this.expression1);
        return true;
      }
      catch (Error) 
      {
        return false;
      }
    }
    clearExpression()
    {
      this.expression1="";
      this.expression="";
      this.parameterSelectedList=[];
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
        if(data.MAINCATEGORYID==undefined||data.MAINCATEGORYID=='' )
        {flag=false; msg=msg+"* Main Category not selected<br/>"}
        if(data.CODE==undefined||data.CODE=='' )
        {flag=false; msg=msg+"* Short code not entred<br/>"}
        if(data.CATEGORY==undefined||data.CATEGORY=='' )
        {flag=false; msg=msg+"* Category Name entred<br/>"}
        if(this.myfuntion(this.expression1)==false && this.parameterSelectedList.length>0)
        {flag=false; msg=msg+"* Your formula have an error.<br/>"}
  
  
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
      let detail:Array<any>=[];
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
          data.MAINCATEGORYID=this.newData.MAINCATEGORYID;
          if(this.newData.HAVEFORMULA)
          {
            data.HAVEFORMULA="Y";
          }
          else
          {
            data.HAVEFORMULA="N";
          }
          header.push(data);
          let i=0;
          this.parameterSelectedList.forEach((el)=>{
            let temp:any={};
            temp.subCatgid=":a";
            temp.ID=++i;
            temp.PARAMETERNAME=el.PARAMETERNAME;
            temp.PARAMETERID=el.PARAMETERID;
            
            temp.TYPE=el.TYPE;
            detail.push(temp);
          });
        //  header.push(data);
          const  params = new  HttpParams()
          .set('catgId', this.lCategoryId)
          .set('userid', this.userid)
          .set('data', JSON.stringify(header))
          .set('parameter', JSON.stringify(detail))
          .set('token', this.token);
  
          this.http.post(this.original_url+"/Master/SaveItemSubCategory", params.toString(), {
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
  