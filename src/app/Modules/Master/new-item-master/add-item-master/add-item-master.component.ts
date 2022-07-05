import { Global } from './../../../../Global';
import { HttpClient, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from 'src/app/Dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddNewItemMasterComponent } from 'src/app/Modules/General/item-master/add-new-item-master/add-new-item-master.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/Dialog/confirmation-dialog/confirmation-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-add-item-master',
  templateUrl: './add-item-master.component.html',
  styleUrls: ['./add-item-master.component.css']
})
export class AddItemMasterComponent implements  OnInit {
  original_url = environment.baseUrl;
  lCategoryId:any;
  title="Add New Item";
  newData:any={};
  token:any;
  userid:any;
  itemId:any;
  isLoadingResults=false;
  mainCategory:Array<any>=[];
  subCategory:Array<any>=[];
  subFilterCategory:Array<any>=[];
  itemMaterialList:Array<any>=[];
  filteredItemMaterial:Array<any>=[];
  itemTypeList:Array<any>=[];
  filteredItemTYpe:Array<any>=[];
  gstArray:Array<any>=[];
  allParameters:Array<any>=[];
  allFilterParameters:Array<any>=[];
  ItemTypeParameters:Array<any>=[];
  ItemTypeFilterParameters:Array<any>=[];
  gstArrayList:Array<any>=[];
  unitArrayList:Array<any>=[];
  belongto:Array<any>=[];

  allData:any={};
  subCatName="";
  matCatName="";
  ravinder=0;
  expression="";
  expression1="";
  mainCode="";
  subCode="";
  MaterialCode="";
  typeCode="";
  itemCode="";
  typeitemType="";
  DataGet : Array<any> = [];
  isLoading: boolean;
  allDataGet: any;
  action : string;
  codedisable= true;

    constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddItemMasterComponent>,
      private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,private router: Router
      ,public globalVar:Global) { 
        let currentUser = sessionStorage.getItem("currentUser");
        currentUser = JSON.parse(currentUser);
        this.token = currentUser['TOKEN'];
        this.userid = currentUser['USERID'];
        this.itemId=  data.itemId;
        this.action = data.action;
        this.newData.ISSTOCKABLE=1;
        console.log('data',data)
        if(this.action=='new'){
        this.isLoadingResults=true;
        this.http.get(this.original_url + "/Masters/ItemMaster/getcommonapiitems?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid)
        .subscribe((res) => {
          let allDataGet: any;
         allDataGet = res;
         this.belongto=allDataGet.Table;
         this.mainCategory=allDataGet.Table1;
         this.subFilterCategory=allDataGet.Table2;
         this.unitArrayList=allDataGet.Table3;
         this.gstArray=allDataGet.Table4;
          this.isLoadingResults=false;          
        },error => {
          this.isLoadingResults = false;
        }
  );
      }
      else{
        this.isLoadingResults=true;
        this.http.get(this.original_url + "/Masters/ItemMaster/getitemsdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid+"&itemid="+this.itemId)
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet=res;
          this.newData=allDataGet.Table[0];
          this.newData.UNIT = parseInt(this.newData.UNIT)
          if (this.newData.VATINPUT == undefined || this.newData.VATINPUT == null || this.newData.VATINPUT == '' || this.newData.VATINPUT == "N" || this.newData.VATINPUT == '0') { this.newData.VATINPUT = false; } else { this.newData.VATINPUT = true }
          if (this.newData.EXCISEINPUT == undefined || this.newData.EXCISEINPUT == null || this.newData.EXCISEINPUT == '' || this.newData.EXCISEINPUT == "N" || this.newData.EXCISEINPUT == '0') { this.newData.EXCISEINPUT = false; } else { this.newData.EXCISEINPUT = true }
          if (this.newData.CAPGOODSITEM == undefined || this.newData.CAPGOODSITEM == null || this.newData.CAPGOODSITEM == '' || this.newData.CAPGOODSITEM == "N" || this.newData.CAPGOODSITEM == '0') { this.newData.CAPGOODSITEM = false; } else { this.newData.CAPGOODSITEM = true }
          if (this.newData.ISPRDNITEM == undefined || this.newData.ISPRDNITEM == null || this.newData.ISPRDNITEM == '' || this.newData.ISPRDNITEM == "N" || this.newData.ISPRDNITEM == '0') { this.newData.ISPRDNITEM = false; } else { this.newData.ISPRDNITEM = true }
          if (this.newData.STOCKABLE == undefined || this.newData.STOCKABLE == null || this.newData.STOCKABLE == '' || this.newData.STOCKABLE == "N" || this.newData.STOCKABLE == '0') { this.newData.STOCKABLE = false; } else { this.newData.STOCKABLE = true }
          this.belongto=allDataGet.Table1;
          this.mainCategory=allDataGet.Table2;
          this.subFilterCategory=allDataGet.Table3;
          this.unitArrayList=allDataGet.Table4;
          this.gstArray=allDataGet.Table5;
          this.isLoadingResults=false;
        });
    }
  }



    getGlobalData(data){
          return JSON.stringify(data);
    }

    onMainCategoryClose(maincatid)
    {
//      let maincatid=data.MAINCATEGORYID;
      
      this.mainCode= this.mainCategory.find(x=>x.CATEGORYID==maincatid).CODE;
      this.newData.ITEMCODE=this.mainCode+this.subCode+this.MaterialCode+this.typeCode;

      console.log("maincatid",maincatid);
      this.subFilterCategory=this.subCategory.filter(x=>x.MAINCATEGORYID==maincatid);
      console.log("subFilterCategory",this.subFilterCategory);
      this.newData.SUBCATEGORYID=null;
    }
    onSubCategoryClose(subCatid, itemid)
    {
     // let subCatid=data.SUBCATEGORYID;
     debugger;
      this.subCode= this.subFilterCategory.find(x=>x.CATEGORYID==subCatid).CODE;
      this.subCatName= this.subFilterCategory.find(x=>x.CATEGORYID==subCatid).CATEGORY;
      this.newData.ITEMCODE=this.mainCode+this.subCode+this.MaterialCode+this.typeCode;
      this.newData.ITEMNAME=this.subCatName;
      console.log("itemMaterialList",this.itemMaterialList);
      this.filteredItemMaterial=this.itemMaterialList.filter(x=>x.SUBCATEGORYID==subCatid);
      this.newData.MATERIALTYPEID=null;
    //   this.http.get(this.original_url+"/Master/getItemParameters?mid="+subCatid+"&itemid="+itemid+"&flag=S").subscribe(res=>{
    //     this.allData=res;
    //     this.allParameters=this.allData.Table;
    //     this.allFilterParameters=this.allParameters.filter(x=>x.TYPE=='FIELD');
    //  });
    //  console.log("allFilterParameters",this.allFilterParameters);
    }

    onMaterailChangeClose(materialid)
    {
    //  let materialid=data.MATERIALTYPEID;
    debugger;
      this.MaterialCode= this.filteredItemMaterial.find(x=>x.CATEGORYID==materialid).CODE;
      this.matCatName= this.filteredItemMaterial.find(x=>x.CATEGORYID==materialid).CATEGORY;
      this.newData.ITEMCODE=this.mainCode+this.subCode+this.MaterialCode+this.typeCode;
      this.newData.ITEMNAME= this.matCatName+' ' + this.subCatName;
      console.log("itemMaterialList",this.filteredItemTYpe);
      this.filteredItemTYpe=this.itemTypeList.filter(x=>x.MATERIALTYPEID==materialid);
      this.newData.ITEMTYPEID=null;
      //this.allFilterParameters=this.allParameters.filter(x=>x.MATERIALCATGID==materialid);
    }
    // onItemTypeClose(itemTypeid)
    // {
    //  // let subCatid=data.SUBCATEGORYID;
     
    //   this.http.get(this.original_url+"/Master/getItemParameters?mid="+itemTypeid+"&flag=T").subscribe(res=>{
    //     this.allData=res;
    //    this.ItemTypeParameters=this.allData.Table;
    //    this.ItemTypeFilterParameters=this.allParameters.filter(x=>x.TYPE=='FIELD');
    //    this.allFilterParameters=this.allParameters.filter(x=>x.TYPE=='FIELD');
    //    this.ItemTypeFilterParameters.forEach(el=>{
    //     this.allFilterParameters.push(el);
    //    });

    //  });
    //  console.log("allFilterParameters",this.allFilterParameters);
    // }

    onParameterValueChange()
    {
      let i=0;
      this.newData.ITEMNAME= this.matCatName+' ' + this.subCatName;
      let tmpArray:Array<any>=[];
      tmpArray=this.allFilterParameters.filter(x=>x.FLAG=='S');
      // this.allFilterParameters.forEach(el=>{
      //   if(el.VALUE!=undefined&&el.VALUE!=0&&el.VALUE!='')
      //   {
      //     if(i>0)
      //     {this.newData.ITEMNAME+=' *';}
      //     this.newData.ITEMNAME+=' ' + el.VALUE;
      //      i++;
      //   }
      // });
      tmpArray.forEach(el=>{
        if(el.VALUE!=undefined&&el.VALUE!=0&&el.VALUE!='')
        {
          if(i>0)
          {this.newData.ITEMNAME+=' *';}
          this.newData.ITEMNAME+=' ' + el.VALUE;
           i++;
        }
      });
      this.newData.ITEMNAME= this.newData.ITEMNAME+' ' + this.typeitemType;
      i=0;
      tmpArray=this.allFilterParameters.filter(x=>x.FLAG=='T');
      tmpArray.forEach(el=>{
        if(el.VALUE!=undefined&&el.VALUE!=0&&el.VALUE!='')
        {
          if(i>0)
          {this.newData.ITEMNAME+=' *';}
          this.newData.ITEMNAME+=' ' + el.VALUE;
           i++;
        }
      });
    }


    
    onTypeChangeClose(materialid, itemid)
    {
     // let materialid=data.ITEMTYPEID;
     this.allFilterParameters=[];
      // this.http.get(this.original_url+"/Master/getItemParameters?mid="+materialid+"&itemid="+itemid+"&flag=T").subscribe(res=>{
      //   this.allData=res;
      //  this.ItemTypeParameters=this.allData.Table;
      //  this.ItemTypeFilterParameters=this.ItemTypeParameters.filter(x=>x.TYPE=='FIELD');
      //  this.allFilterParameters=this.allParameters.filter(x=>x.TYPE=='FIELD');
       
      //  this.ItemTypeFilterParameters.forEach(el=>{
      //   this.allFilterParameters.push(el);
      //  });

    //  });
    //  debugger;
     this.typeCode= this.filteredItemTYpe.find(x=>x.ITEMTYPEID==materialid).CODE;
     this.typeitemType= this.filteredItemTYpe.find(x=>x.ITEMTYPEID==materialid).ITEMTYPE;
      this.newData.ITEMCODE=this.mainCode+this.subCode+this.MaterialCode+this.typeCode;
    }
    ngOnInit() {

    }

    catgchange(catgid){
      console.log(catgid,"catgid")
        if(catgid==1){
          this.codedisable=false;
        }
        else{this.codedisable=true;
        }
    }

    onRectUnitSelect(id)
    {
      this.newData.ISSUINGUNITID=id;
    }
    validateBeforeSave(data,action){
      
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data :-</h5>";
    // if (this.newData.MachineName == undefined || this.newData.MachineName == '' || this.newData.MachineName == null) { flag = false; msg = msg + "* Please Enter Machine Name<br/>" }
    // if ((this.newData.MaintBy == "true" || this.newData.MaintBy == "1") && (this.newData.MainSupplierId == '' || this.newData.MainSupplierId == "0" || this.newData.MainSupplierId == undefined)) { flag = false; msg = msg + "* Please Select Maintenance Party <br/>" }
    // if ((this.newData.UnderWty == '1' || this.newData.UnderWty == "1") && (this.newData.Wtyupto == '' || this.newData.Wtyupto == undefined)) { flag = false; msg = msg + "* Please Select Warranty Upto Date Or Uncheck Warranty Option <br/>" }
    // if ((this.newData.UnderAMC == '1' || this.newData.UnderAMC == "1") && (this.newData.AMCFrom == '' || this.newData.AMCFrom == undefined || this.newData.AMCUpto == '' || this.newData.AMCUpto == undefined)) { flag = false; msg = msg + "* Please Select AMC Dates Or Uncheck AMC Option <br/>" }
    if (data.ITEMCODE == undefined || data.ITEMCODE == '' || data.ITEMCODE == null) { flag = false; msg = msg + "*Please Enter Item Code<br/>" }
    if (data.BELONGSTOID == undefined || data.BELONGSTOID == '' || data.BELONGSTOID == null) { flag = false; msg = msg + "*Belongs To Catg. not selected<br/>" }
    if (data.GROUPID == undefined || data.GROUPID == '' || data.GROUPID == null) { flag = false; msg = msg + "*Main Catg. not selected<br/>" }
    if (data.SUBGROUPID == undefined || data.SUBGROUPID == '' || data.SUBGROUPID == null) { flag = false; msg = msg + "*Sub Catg. not selected<br/>" }
    if (data.ITEMNAME == undefined || data.ITEMNAME == '' || data.ITEMNAME == null) { flag = false; msg = msg + "*Please Enter Item Name<br/>" }
    if (data.UNIT == undefined || data.UNIT == '' || data.UNIT == null) { flag = false; msg = msg + "*Unit not selected<br/>" }
    if (data.ABCCLASS == undefined || data.ABCCLASS == '' || data.ABCCLASS == null) { flag = false; msg = msg + "*ABC Class not selected<br/>" }
    if (data.GSTID == undefined || data.GSTID == '' || data.GSTID == null) { flag = false; msg = msg + "*GST Type not selected<br/>" }
    if (data.LOCATION == undefined || data.LOCATION == '' || data.LOCATION == null) { flag = false; msg = msg + "*Please Enter Location<br/>" }


    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
    else {
      this.saveData(data,action);
    }
  }


    saveData(data,action){
        this.isLoadingResults = true;
        // machinedetail array
        let newArray: Array<any> = [];
        let assetdetail: Array<any> = [];
        let ITEMCODE,BELONGSTOID,GROUPID,SUBGROUPID,ITEMNAME,ITEMDESCRIPTION,UNIT,ABCCLASS,GSTID,
        LOCATION,VATINPUT,EXCISEINPUT,CAPGOODSITEM,ISPRDNITEM,STOCKABLE,MINIMUMLEVEL,MAXIMUMLEVEL,REORDERLEVEL,
        REORDERQTY,ISTEMP;
    
        ITEMCODE=this.globalVar.checknull(data.ITEMCODE , "number")
        BELONGSTOID=this.globalVar.checknull(data.BELONGSTOID , "number")
        GROUPID=this.globalVar.checknull(data.GROUPID , "number")
        SUBGROUPID=this.globalVar.checknull(data.SUBGROUPID , "number")
        UNIT=this.globalVar.checknull(data.UNIT , "number")
        GSTID=this.globalVar.checknull(data.GSTID , "number")
        VATINPUT=this.globalVar.checknull(data.VATINPUT , "number")
        EXCISEINPUT=this.globalVar.checknull(data.EXCISEINPUT , "number")
        CAPGOODSITEM=this.globalVar.checknull(data.CAPGOODSITEM , "number")
        ISPRDNITEM=this.globalVar.checknull(data.ISPRDNITEM , "number")
        STOCKABLE=this.globalVar.checknull(data.STOCKABLE , "number")
        ITEMNAME=this.globalVar.checknull(data.ITEMNAME , "string")
        ITEMDESCRIPTION=this.globalVar.checknull(data.ITEMDESCRIPTION , "string")
        ABCCLASS=this.globalVar.checknull(data.ABCCLASS , "string")
        LOCATION=this.globalVar.checknull(data.LOCATION , "string")
        MINIMUMLEVEL=this.globalVar.checknull(data.MINIMUMLEVEL , "string")
        MAXIMUMLEVEL=this.globalVar.checknull(data.MAXIMUMLEVEL , "string")
        REORDERLEVEL=this.globalVar.checknull(data.REORDERLEVEL , "string")
        REORDERQTY=this.globalVar.checknull(data.REORDERQTY , "string")

        if (data.VATINPUT == undefined || data.VATINPUT == null || data.VATINPUT == '' || data.VATINPUT == "false" || data.VATINPUT == '0') { VATINPUT = "N"; } else { VATINPUT = "Y" }
        if (data.EXCISEINPUT == undefined || data.EXCISEINPUT == null || data.EXCISEINPUT == '' || data.EXCISEINPUT == "false" || data.EXCISEINPUT == '0') { EXCISEINPUT = "N"; } else { EXCISEINPUT = "Y" }
        if (data.CAPGOODSITEM == undefined || data.CAPGOODSITEM == null || data.CAPGOODSITEM == '' || data.CAPGOODSITEM == "false" || data.CAPGOODSITEM == '0') { CAPGOODSITEM = "N"; } else { CAPGOODSITEM = "Y" }
        if (data.ISPRDNITEM == undefined || data.ISPRDNITEM == null || data.ISPRDNITEM == '' || data.ISPRDNITEM == "false" || data.ISPRDNITEM == '0') { ISPRDNITEM = "N"; } else { ISPRDNITEM = "Y" }
        if (data.STOCKABLE == undefined || data.STOCKABLE == null || data.STOCKABLE == '' || data.STOCKABLE == "false" || data.STOCKABLE == '0') { STOCKABLE = "N"; } else { STOCKABLE = "Y" }

       
       
        newArray.push(
          {
            ITEMID:this.itemId,
            ITEMCODE:ITEMCODE,
            BELONGSTOID:BELONGSTOID,
            GROUPID:GROUPID,
            SUBGROUPID:SUBGROUPID,
            ITEMNAME:ITEMNAME,
            ITEMDESCRIPTION:ITEMDESCRIPTION,
            UNIT:UNIT,
            ABCCLASS:ABCCLASS,
            GSTID:GSTID,
            LOCATION:LOCATION,
            VATINPUT:VATINPUT,
            EXCISEINPUT:EXCISEINPUT,
            CAPGOODSITEM: CAPGOODSITEM,
            ISPRDNITEM: ISPRDNITEM,
            STOCKABLE: STOCKABLE,
            MINIMUMLEVEL: MINIMUMLEVEL,
            MAXIMUMLEVEL: MAXIMUMLEVEL,
            REORDERLEVEL: REORDERLEVEL,
            REORDERQTY: REORDERQTY,
            USERID : this.globalVar.UserId,         
            EDATE : '',
            BRANCHID : this.globalVar.BranchId,    
            COMPANYID: this.globalVar.CommpanyId,
            RECEIVINGUNITID : UNIT,
            ISSUINGUNITID  : UNIT,
            UOM : UNIT,
            P_OR_I : 'I',           

          });
        // fixed asset detail array
            
        const params = new HttpParams()
          .set('statementtype', action)
          .set('coid', this.globalVar.CommpanyId)
          .set('userid', this.globalVar.UserId)
          .set('boid', this.globalVar.BranchId)
          .set('accesstoken', this.globalVar.Token)
          .set('id', this.itemId)
          .set('itemarray', JSON.stringify(newArray))
        this.http.post(this.original_url + "/Masters/ItemMaster/SaveItems", params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
          .subscribe((res) => {
            this.isLoadingResults = false;
            this.successDialog();
            this.dialogRef.close();
          },error => {
            this.isLoadingResults = false;
          });
      }
  
      successDialog() {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: {
            wrongData: 'sucess'
          }
        });
      }
  }

