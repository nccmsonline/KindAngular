import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SuccessDialogComponent } from '../.././../../Dialog/success-dialog/success-dialog.component';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { parseNumber } from '@progress/kendo-angular-intl';
@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.css']
})
export class AddNewItemComponent implements OnInit {
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
  allParameters:Array<any>=[];
  allFilterParameters:Array<any>=[];
  ItemTypeParameters:Array<any>=[];
  ItemTypeFilterParameters:Array<any>=[];
  gstArrayList:Array<any>=[];
  unitArrayList:Array<any>=[];

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
    constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddNewItemComponent>,
      private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,private router: Router) { 
        let currentUser = sessionStorage.getItem("currentUser");
        currentUser = JSON.parse(currentUser);
        this.token = currentUser['TOKEN'];
        this.userid = currentUser['USERID'];
        this.itemId=  data.ITEMID;
        this.newData.ISSTOCKABLE=1;
        http.get(this.original_url+"/Master/getItemDetail?itemid="+this.itemId).subscribe(res=>{
         
            this.allData=res;
            this.mainCategory=this.allData.Table1;
            this.subCategory=this.allData.Table2;
            this.itemMaterialList=this.allData.Table3;
            this.itemTypeList=this.allData.Table4;
           // this.allParameters=this.allData.Table5;
            this.gstArrayList=this.allData.Table6;
            this.unitArrayList=this.allData.Table7;
            let id =0;
            console.log("allData1",this.allData);
            if(this.itemId>0)
            {
              this.title="Update exsiting Item";
              this.newData=this.allData.Table[0];
              this.allData= JSON.parse(this.getGlobalData(this.allData.Table[0]));
              this.onMainCategoryClose(this.newData.MAINCATEGORYID);
              console.log("allData",this.allData);
              this.newData.SUBCATEGORYID=this.allData.SUBCATEGORYID;
              
              this.onSubCategoryClose(this.newData.SUBCATEGORYID, this.itemId);
              this.newData.MATERIALTYPEID=this.allData.MATERIALTYPEID;
              this.onMaterailChangeClose(this.newData.MATERIALTYPEID);
              this.newData.ITEMTYPEID=this.allData.ITEMTYPEID;
              this.onTypeChangeClose(this.newData.ITEMTYPEID, this.itemId);
              this.newData.ITEMCODE=this.allData.ITEMCODE;
              this.newData.ITEMNAME=this.allData.ITEMNAME;
            }
            
            console.log("res", res);
        });
  
       
        // this.newData.HAVEFORMULA=0;
        // if(parseInt(this.lCategoryId)>0)
        // {
        //   this.newData.CODE=data.CODE;
        //   this.newData.ITEMTYPE=data.ITEMTYPE;
        //   this.newData.MAINCATEGORYID=data.MAINCATEGORYID;
        //   this.onMainCategoryClose(this.newData.MAINCATEGORYID);
        //   this.newData.SUBCATEGORYID=data.SUBCATEGORYID;
        //   this.newData.MATERIALTYPEID=data.MATERIALTYPEID;
        //   this.title="Edit Item Type";
    
        // }
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
      this.http.get(this.original_url+"/Master/getItemParameters?mid="+subCatid+"&itemid="+itemid+"&flag=S").subscribe(res=>{
        this.allData=res;
        this.allParameters=this.allData.Table;
        this.allFilterParameters=this.allParameters.filter(x=>x.TYPE=='FIELD');
     });
     console.log("allFilterParameters",this.allFilterParameters);
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
      this.http.get(this.original_url+"/Master/getItemParameters?mid="+materialid+"&itemid="+itemid+"&flag=T").subscribe(res=>{
        this.allData=res;
       this.ItemTypeParameters=this.allData.Table;
       this.ItemTypeFilterParameters=this.ItemTypeParameters.filter(x=>x.TYPE=='FIELD');
       this.allFilterParameters=this.allParameters.filter(x=>x.TYPE=='FIELD');
       
       this.ItemTypeFilterParameters.forEach(el=>{
        this.allFilterParameters.push(el);
       });

     });
     debugger;
     this.typeCode= this.filteredItemTYpe.find(x=>x.ITEMTYPEID==materialid).CODE;
     this.typeitemType= this.filteredItemTYpe.find(x=>x.ITEMTYPEID==materialid).ITEMTYPE;
      this.newData.ITEMCODE=this.mainCode+this.subCode+this.MaterialCode+this.typeCode;
    }
    ngOnInit() {

    }
    onRectUnitSelect(id)
    {
      this.newData.ISSUINGUNITID=id;
    }
    validateDetail(data)
    {
     let itemParameterList:Array<any>=[];
      var flag:boolean;
      flag=true;
      var msg:any;
      if(data.sch==''||data.sch==undefined)
      {
        data.sch=false;
      }
      try
      {
        msg="<h5>Before add please rectify following mistakes:-</h5>";
        if(data.MAINCATEGORYID==undefined||data.MAINCATEGORYID=='' )
        {flag=false; msg=msg+"* Main Category not selected<br/>"}
        if(data.SUBCATEGORYID==undefined||data.SUBCATEGORYID=='' )
        {flag=false; msg=msg+"* Sub Category not selected<br/>"}
        if(data.MATERIALTYPEID==undefined||data.MATERIALTYPEID=='' )
        {flag=false; msg=msg+"* Item Material not selected<br/>"}
        if(data.ITEMTYPEID==undefined||data.ITEMTYPEID=='' )
        {flag=false; msg=msg+"* Item type not selected<br/>"}
        if(data.ITEMCODE==undefined||data.ITEMCODE=='' )
        {flag=false; msg=msg+"* Item code not entred<br/>"}
        if(data.ITEMNAME==undefined||data.ITEMNAME=='' )
        {flag=false; msg=msg+"* Item Name entred<br/>"}
        if(data.RECEIVINGUNITID==undefined||data.RECEIVINGUNITID=='' )
        {flag=false; msg=msg+"* Rect Unit not selected<br/>"}
        if(data.ISSUINGUNITID==undefined||data.ISSUINGUNITID=='' )
        {flag=false; msg=msg+"* Issue Unit not selected<br/>"}
        if((data.CONVERSIONFACT==undefined||data.CONVERSIONFACT=='')&&data.RECEIVINGUNITID!=data.ISSUINGUNITID )
        {flag=false; msg=msg+"* Conversion factor not entred<br/>"}
        if(data.ABCCLASS==undefined||data.ABCCLASS=='' )
        {flag=false; msg=msg+"* ABC Class not entred<br/>"}
        if(data.HSNCODE==undefined||data.HSNCODE=='' )
        {flag=false; msg=msg+"* HSN not entred<br/>"}
        if(data.GSTID==undefined||data.GSTID=='' )
        {flag=false; msg=msg+"* GST not selected<br/>"}
        this.allFilterParameters.forEach(el=>{
            if(el.VALUE==undefined||el.VALUE==''||el.VALUE==0)
            {flag=false; msg=msg+"* "+el.PARAMETERNAME+" value not entred<br/>"}
        });
        let i=1;
        this.allParameters.forEach(el=>{
          let tmp:any={};
          tmp.ID=el.ID;
          tmp.FLAG=el.FLAG;
          tmp.PARAMETERNAME=el.PARAMETERNAME;
          tmp.PARAMETERID=el.PARAMETERID;
          tmp.TYPE=el.TYPE;
          tmp.VALUE=el.VALUE;
          itemParameterList.push(tmp);
        });
        this.ItemTypeParameters.forEach(el=>{
          let tmp:any={};
         
          tmp.ID=el.ID;
          tmp.FLAG=el.FLAG;
          tmp.PARAMETERNAME=el.PARAMETERNAME;
          tmp.PARAMETERID=el.PARAMETERID;
          tmp.TYPE=el.TYPE;
          tmp.VALUE=el.VALUE;
          itemParameterList.push(tmp);
        });
      }
      catch(Error)
      {
        flag=false; "<h4> Some thing went wrong. Please contact to Administrator </h4>"
      }
      console.log("itemParameterList", itemParameterList);
        //this.http.get(this.original_url+"")
    
        const  params = new  HttpParams()
        .set('MainCategoryId', this.newData.MAINCATEGORYID)
        .set('SubCategoryId', this.newData.SUBCATEGORYID)
        .set('MaterialTypeId', this.newData.MATERIALTYPEID)
        .set('ItemTypeId', this.newData.ITEMTYPEID)
        .set('ItemId', this.itemId)
        .set('parameter', JSON.stringify(itemParameterList));
        
        this.http.post(this.original_url+"/Master/CheckItemDuplicacy", params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .subscribe((res) => {
          let isDupli:any;
          debugger;
          console.log("res",res);
          isDupli=res;
          if(parseInt( isDupli)==0)
          {
            flag=false; msg=msg+"* Duplicate Item Found<br/>"
          }
          if(flag==false) {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: {
                wrongData: 'validation',
                displayMsg:msg
              }
            });
          }
        });  
        
      return flag;
    }
    saveData()
    {
      this.isLoadingResults=true;
      let tmpdata:any={};
      let data:Array<any>=[];
      let itemParameterList:Array<any>=[];
      if(this.validateDetail(this.newData))
      {
          if(this.itemId==0)
          {
            tmpdata.itemId=":A";
            tmpdata.createdby=":B";
            tmpdata.createdon=":C";
          }
          else
          {
            tmpdata.modifiedby=":B";
            tmpdata.modifiedon=":C";
          }
          tmpdata.ITEMCODE=this.newData.ITEMCODE;
          tmpdata.ITEMNAME=this.newData.ITEMNAME;
          tmpdata.MAINCATEGORYID=this.newData.MAINCATEGORYID;
          tmpdata.SUBCATEGORYID=this.newData.SUBCATEGORYID;
          tmpdata.MATERIALTYPEID=this.newData.MATERIALTYPEID;
          tmpdata.ITEMTYPEID=this.newData.ITEMTYPEID;
          tmpdata.RECEIVINGUNITID=this.newData.RECEIVINGUNITID; 
          tmpdata.ISSUINGUNITID=this.newData.ISSUINGUNITID; 
          if(tmpdata.CONVERSIONFACT!=undefined && tmpdata.CONVERSIONFACT=='' )
          {
            tmpdata.CONVERSIONFACT=this.newData.CONVERSIONFACT;
          }
          else
          {
            tmpdata.CONVERSIONFACT=0;
          }
          tmpdata.ABCCLASS=this.newData.ABCCLASS;
          tmpdata.ISSTOCKABLE=this.newData.ISSTOCKABLE;
          tmpdata.HSNCODE=this.newData.HSNCODE; 
          tmpdata.GSTID=this.newData.GSTID; 
          data.push(tmpdata);
          let i=1;
          this.allParameters.forEach(el=>{
            let tmp:any={};
            tmp.ItemId=":A";
            tmp.ID=el.ID;
            tmp.FLAG=el.FLAG;
            tmp.PARAMETERNAME=el.PARAMETERNAME;
            tmp.PARAMETERID=el.PARAMETERID;
            tmp.TYPE=el.TYPE;
            tmp.VALUE=el.VALUE;
            itemParameterList.push(tmp);
          });
          this.ItemTypeParameters.forEach(el=>{
            let tmp:any={};
            tmp.ItemId=":A";
            tmp.ID=el.ID;
            tmp.FLAG=el.FLAG;
            tmp.PARAMETERNAME=el.PARAMETERNAME;
            tmp.PARAMETERID=el.PARAMETERID;
            tmp.TYPE=el.TYPE;
            tmp.VALUE=el.VALUE;
            itemParameterList.push(tmp);
          });
          const  params = new  HttpParams()
          .set('ItemId', this.itemId)
          .set('userid', this.userid)
          .set('data', JSON.stringify(data))
          .set('plist', JSON.stringify(itemParameterList))
          .set('token', this.token);
  
          this.http.post(this.original_url+"/Master/SaveItemMaster", params.toString(), {
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

