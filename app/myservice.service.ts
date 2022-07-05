import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  private baseUrl = 'http://112.196.6.170:8081';
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

}
