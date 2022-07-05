import { Injectable } from '@angular/core';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  private baseUrl = environment.baseUrl;
  private messageSource=new BehaviorSubject<string>("");
  currentMessage=this.messageSource.asObservable();
  
  private CompanyNameSource=new BehaviorSubject<string>("");
  CompanyName=this.CompanyNameSource.asObservable();
  
  private CompanyAddressSource=new BehaviorSubject<string>("");
  CompanyAddress=this.CompanyAddressSource.asObservable();

  private CompanyAddress1Source=new BehaviorSubject<string>("");
  CompanyAddress1=this.CompanyAddress1Source.asObservable();

  private CompanyAddress2Source=new BehaviorSubject<string>("");
  CompanyAddress2=this.CompanyAddress2Source.asObservable();

  private WorkingDateSource=new BehaviorSubject<string>("");
  WorkingDate=this.WorkingDateSource.asObservable();

  private UserIdSource=new BehaviorSubject<string>("");
  UserId=this.UserIdSource.asObservable();
  
  private UserNameSource=new BehaviorSubject<string>("");
  UserName=this.UserNameSource.asObservable();

  private BranchIdSource=new BehaviorSubject<string>("");
  BranchId=this.BranchIdSource.asObservable();

  private FYIdSource=new BehaviorSubject<string>("");
  FYId=this.FYIdSource.asObservable();

  private DatabaseUserSource=new BehaviorSubject<string>("");
  DatabaseUser=this.DatabaseUserSource.asObservable();

  private ServerIPSource=new BehaviorSubject<string>("");
  ServerIP=this.ServerIPSource.asObservable();

  private FinancialYearStartDateSource=new BehaviorSubject<string>("");
  FinancialYearStartDate=this.FinancialYearStartDateSource.asObservable();
  private FinancialYearEndDateSource=new BehaviorSubject<string>("");
  FinancialYearEndDate=this.FinancialYearEndDateSource.asObservable();

 
  constructor(private http:HttpClient) { }
  changeMessage(meaasge:string)
  {
    this.messageSource.next(meaasge);
  }

  setCompanyName(meaasge:string)
  {
    this.CompanyNameSource.next(meaasge);
  }
  
  setCompanyAddress(meaasge:string)
  {
    this.CompanyAddressSource.next(meaasge);
  }
  setCompanyAddress1(meaasge:string)
  {
    this.CompanyAddress1Source.next(meaasge);
  }
  setCompanyAddress2(meaasge:string)
  {
    this.CompanyAddress2Source.next(meaasge);
  }
  setUserId(meaasge:string)
  {
    this.UserIdSource.next(meaasge);
  }
  setWorkingDate(meaasge:string)
  {
    this.WorkingDateSource.next(meaasge);
  }
  setBranchId(meaasge:string)
  {
    this.BranchIdSource.next(meaasge);
  }
  setUserName(meaasge:string)
  {
    this.UserNameSource.next(meaasge);
  }
  setServerIP(meaasge:string)
  {
    this.ServerIPSource.next(meaasge);
  }
  setFinancialYearStartDate(meaasge:string)
  {
    this.FinancialYearStartDateSource.next(meaasge);
  }
  setFinancialYearEndDate(meaasge:string)
  {
    this.FinancialYearEndDateSource.next(meaasge);
  }
  setFYID(meaasge:string)
  {
    this.FYIdSource.next(meaasge);
  }
  setDatabaseUser(meaasge:string)
  {
    this.DatabaseUserSource.next(meaasge);
  }

  getmenulist(userid,isadmin,boid)
  {
    console.log("1", "data");
    //
      return this.http.get(this.baseUrl+"/api/user/getmenulist?userId="+userid+"&isadmin="+isadmin+"&boid="+boid)
      .pipe(
        map((data) => {
          console.log("1", data);
          return data;
        })
    );
  }

  sendOTP(msg, OTP)
  {
    // var OTP=0;
    // OTP=parseInt( ((Math.random()*10000).toFixed(0)));
    // if(OTP<1000)
    // {
    //   OTP=OTP*10;
    // }
    
    var urls=environment.baseUrl;
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    var ServerIP=CompanyData['SERVERIP'];
    var FYUSER=CompanyData['FYUSER'];
    var boid = CompanyData['BRANCHID'];
    
    console.log("CompanyData",CompanyData);
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    var userid = currentUser['USERID'];
    var token = currentUser['TOKEN'];
    
    this.http.get(urls+"/user/SendEmail?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+boid+"&userid="+userid+"&token="+token+"&toEmail=sidhant.sehgal@kapsonsindustries.com&subject=OTP&bodytext="+ msg+" : <B> "+OTP+" </b>").subscribe((res)=>{
      console.log("res", res);
    });

    // this.http.get("https://cors-anywhere.herokuapp.com/http://5.9.0.178:8000/Sendsms?user=kind.jal&password=123456&sender=KINDPL&dest="+mobilenos+"&apid=91819&text="+ msg+" : "+OTP+"&dcs=0").subscribe((res)=>{
    //   console.log("res", res);
    // });

    // return OTP;

    // this.http.get(urls+"/master/SendSMS?token="+token+"&msg="+msg).subscribe((res)=>{
    //  // console.log("res", res);
    //   return res;
    // });
    
  }
  sendNewSMS(msg)
  {
    var urls=environment.baseUrl;
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    var userid = currentUser['USERID'];
    var token = currentUser['TOKEN'];
    return this.http.get(urls+"/master/SendSMS?token="+token+"&msg="+msg).pipe(
      map((data) => {
        console.log("1", data);
        return data;
      })
  );
  }
  sendSupplierOTP(msg, mobilenos)
  {
    var OTP=0;
    OTP=parseInt( ((Math.random()*10000).toFixed(0)));
    if(OTP<1000)
    {
      OTP=OTP*10;
    }
    this.http.get("https://cors-anywhere.herokuapp.com/http://5.9.0.178:8000/Sendsms?user=kind.jal&password=123456&sender=KINDPL&dest="+mobilenos+"&apid=91819&text="+ msg+" : "+OTP+"&dcs=0").subscribe((res)=>{
      console.log("res", res);
    });
    return OTP;
  }
}
