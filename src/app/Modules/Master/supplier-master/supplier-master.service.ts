import { Injectable,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SupplierMasterService {
  original_url=environment.baseUrl;
  userinfo: any;
  coid: any;
  boid: any;
  userid:any;
  token:any;
  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();
  
  constructor(private http: HttpClient) {
      let user = sessionStorage.getItem("currentUser");
      this.userinfo = JSON.parse(user);
      this.token = this.userinfo['TOKEN'];
      this.userid = this.userinfo['USERID'];
      this.boid = this.userinfo['boid'];
    }
  
  // getData()
  // {
  //   return this.http.get(this.original_url+"/FA")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }
  Currencylist()
  {
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/CurrencyList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  supplierCategoryList() {
    return this.http.get(this.original_url+"/Masters/SupplierMaster/SupplierCategoryList?PageNumber=1&PageSize=1&sort=1&coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  SupplierList() {
    return this.http.get(this.original_url+"/Master/getERPSupplierList?token="+this.token)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  CountryList() {
    return this.http.get(this.original_url+"/Masters/CommonMasters/GetAllCountryList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  // StateList() {
  //   return this.http.get(this.original_url+"/Masters/CommonMasters/GetStateList")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }
  
  // CityList() {
  //   return this.http.get(this.original_url+"/Masters/CommonMasters/AllCityList")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  BankList() {
    return this.http.get(this.original_url+"/Masters/CommonMasters/AllBankList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  savePushData(data, pushData)
  {
    this.onfieldArrayPush.next(pushData);
  }
}