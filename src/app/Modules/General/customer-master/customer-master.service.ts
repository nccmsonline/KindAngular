import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerMasterService {

  userinfo: any;
  coid: any;
  boid: any

  private baseUrl = 'http://suvidhaapi.suvidhacloud.com/api';

  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();
  
  constructor(private http: HttpClient) {
    let user = sessionStorage.getItem("currentUser");
      this.userinfo = JSON.parse(user);
      this.coid = this.userinfo['coid'];
      this.boid = this.userinfo['boid'];
  }

  GetCustomerCategory()
  {
    return this.http.get(this.baseUrl+"/Masters/customermaster/CustomerCategoryList?pagenumber=1&pagesize=10&sort=categoryname&coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  
  getCustomerData()
  {
    return this.http.get(this.baseUrl+"/api/FA")
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  GetAllCountryList() {
    return this.http.get(this.baseUrl+"/Masters/CommonMasters/GetAllCountryList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  GetZoneList() {
    return this.http.get(this.baseUrl+"/Masters/CommonMasters/GetZoneList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  // GetRegionList() {
  //   return this.http.get(this.baseUrl+"/Masters/CommonMasters/GetRegionList")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  // GetAreaList() {
  //   return this.http.get(this.baseUrl+"/Masters/CommonMasters/GetAreaList")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  GetStateList(id) {
    let params = new HttpParams();
    params = params.append('Countryid', id);
    params = params.append('coid', this.coid);
    params = params.append('boid', this.boid);
    
    return this.http.get('http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/GetStateList', {params: params})
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  BankList() {
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/AllBankList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  Currencylist()
  {
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/CurrencyList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  bussinesslist()
  {
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/BUSSINESSSEGMENT?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  savePushData(data)
  {
    this.onfieldArrayPush.next(data);
  }

}
