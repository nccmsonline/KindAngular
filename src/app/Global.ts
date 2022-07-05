import { Subject } from 'rxjs';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
//import { debug } from 'console';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Global {
//---------------------------------------- Global variables declared and intialized --------------------------------
 afterLogin:Subject<any> = new Subject();

 original_url = environment.baseUrl;
  languageSet: string;
  companyName: any;
  Address1: any;
  GSTIn: any;
  telephone: any;
  fax: any;
  email: any;
  pan: any;
  WorkingDate: any;
  AddressOne: string;
  FinancialYearStartDate: any;
  FinancialYearEndDate: any;
  Puremail: any;
  ServerDate: any;
  BranchId: any;
  Token: any;
  EmpId: any;
  IsAdmin: any;
  IsCEO: any;
  IsHR: any;
  IsStore: any;
  UserName: any;
  NameOfUser: any;
  UserId: any;
  CompanyStateId: any;
  CommpanyId: any;
  CompanyName: any;
  menu : any;
  menuList : Array<any>=[];
  userid:any;
  fyid:any;
  osservertype: any;
  myDate = new Date();
  monthStartDate = new Date(this.myDate.getFullYear(), this.myDate.getMonth(), 1);

  constructor(private http: HttpClient
  ) {
    this.setData();
    this.afterLogin.subscribe(e =>  {
      this.setData();
    });
  }

  setData(){
    let currentBranch = sessionStorage.getItem("currentBranch");
    if(currentBranch==null||currentBranch==undefined)
    {return;}
    var CompanyData = JSON.parse(currentBranch);
    this.companyName=CompanyData['COMPANYNAME'];
    this.Address1=CompanyData['ADDRESS'];
    this.Address1 = CompanyData['ADDRESS1'];
    this.AddressOne=CompanyData['ADDRESS']+' '+CompanyData['ADDRESS1'];
    this.GSTIn = CompanyData['COMPANYGSTNO'];
    this.telephone = CompanyData['TELEPHONE'];
    this.fax = CompanyData['FAX'];
    this.Puremail = CompanyData['EMAIL'];
    this.pan = CompanyData['COMPANYPAN'];
    this.WorkingDate=   CompanyData['WORKINGDATE'] ;
    this.FinancialYearStartDate = CompanyData["FINANCIALYEARSTARTDATE"];
    this.FinancialYearEndDate = CompanyData["FINANCIALYEARENDDATE"];
    this.ServerDate=   CompanyData['SEVERDATE'] ;
    this.BranchId=   CompanyData['BRANCHID'] ;
    this.fyid=   CompanyData['FYID'] ;
    this.Token=   CompanyData['TOKEN'] ;
    this.CompanyStateId=   CompanyData['COMPANYSTATEID'] ;
    
    let currentLogin = sessionStorage.getItem("currentUser");
    if(currentLogin==null||currentLogin==undefined)
    {return;}
    var LoginData = JSON.parse(currentLogin);
    this.EmpId=   LoginData['EMPID'] ;
    this.IsAdmin=   LoginData['ISADMIN'] ;
    this.IsCEO=   LoginData['ISCEO'] ;
    this.IsHR=   LoginData['ISHR'] ;
    this.IsStore=   LoginData['ISSTOREUSER'] ;
    this.UserName=   LoginData['USERNAME'] ;
    this.NameOfUser=   LoginData['NAMEOFUSER'] ;
    this.UserId=   LoginData['USERID'] ;
    this.userid=this.UserId
    console.log("userid",this.UserId)
    let company = sessionStorage.getItem("companyData");
    if(company==null||company==undefined)
    {return;}
    var LoginCompany = JSON.parse(company);
    this.CommpanyId=   LoginCompany['COMPANYID'] ;
    this.CompanyName=   LoginCompany['companyname'] ;
    
    // User Rights
    this.menu = sessionStorage.getItem("menuList");
    this.menuList = this.menu!=null?JSON.parse(this.menu):[];

    // Language
    this.languageSet = sessionStorage.getItem("languageSet");

  
  }

  //----------------------------------------global Functions-----------------------------------------


  formatDateNew(text: any){
    let check: any;
    if(text == "" || text == null || text == undefined)
    {
      check = '';
    }
    else{
      check=formatDate(text, 'yyyy-MM-dd', 'en-US');
      check = "date '"+check+"'"
    }
    return check;
  }

  checknull(text: any, type: string) {
    let check: any;
    if(type=="string" || type=="number"){
      if (text == "" || text == null || text == undefined || text == 'NaN' || text == NaN) {
        if (type == "string") {
          check = "";
        }
        else if (type == "number") {
          check = 0;
        }
        else if (type == "decimal") {
          check = 0.00;
        }
      }
      else{
        check=text;
      }
    }
    else if (type == "array"){
      if(text == "" || text == null || text == undefined)
      {
        check = [];
      }
      else if(text.length==0) {
        check = [];
      }
      else{
        check=text;
      }
    }

    else if (type == "Date"){
      if(text == "" || text == null || text == undefined)
      {
        check = '';
      }
      else{
        check=formatDate(text, 'yyyy-MM-dd', 'en-US');;
      }
    }
    else if (type == "DateMMM"){
      if(text == "" || text == null || text == undefined)
      {
        check = '';
      }
      else{
        check=formatDate(text, 'dd-MMM-yyyy', 'en-US');;
      }
    }
    else if (type == "DateTime"){
      if(text == "" || text == null || text == undefined)
      {
        check = '';
      }
      else{
        check=formatDate(text, 'yyyy-MM-dd  hh:mm:ss', 'en-US'); 
      }
    }

    else if (type == "Time"){
      if(text == "" || text == null || text == undefined)
      {
        check = '';
      }
      else{
        check=formatDate(text, 'hh:mm:ss', 'en-US'); 
      }
    }

    

    else if (type == "boolean"){
      if(text == "" || text == null || text == undefined)
      {
        check = false;
      }
      else{
        check = true; 
      }
    }

    return check;
  }

  checkHtml(text: any){
    console.log("111",text);
    let data: any;
    if(text!=undefined && text!=null && text!='' && text!=[]){
      data = text.replace(/&(nbsp|amp|quot|lt|gt);/g,'').trim();
      data = data.replace(/(nbsp|amp|quot|lt|gt);/g,'').trim();
    }
    else{
      data='';
    }
   
    return data;
  }

  removeNBSP(text: any){
    console.log("111",text);
    let data: any;
    if(text!=undefined && text!=null && text!='' && text!=[]){
      data = text.replace(/&(nbsp|amp|quot|lt|gt);/g,'abc').trim();
      data = data.replace(/(nbsp|amp|quot|lt|gt);/g,'abc').trim();
    }
    else{
      data='';
    }
   
    return data;
  }

  sendError(error){
    console.log("global error",error);
    let data: any;
  }

 
}
