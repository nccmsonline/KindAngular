import { Injectable,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierMasterService {
  
  userinfo: any;
  coid: any;
  boid: any;
  original_url=environment.baseUrl;
  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();
  
  constructor(private http: HttpClient) {
      let user = sessionStorage.getItem("currentUser");
      this.userinfo = JSON.parse(user);
      this.coid ="1";
      this.boid = "1";
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
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/CommonMasters/getSupplierCategoryList?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  supplierCategoryList() {
    return this.http.get(this.original_url+"/Master/getSupplierCategoryList")
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  SupplierList() {
    return this.http.get(this.original_url+"/Masters/SupplierMaster/SupplierList?PageNumber=1&PageSize=50&sort=1&coid="+this.coid+"&boid="+this.boid+"&supplierid=0")
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  CountryList() {
    return this.http.get(this.original_url+"/Master/getCountryList")
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
    return this.http.get(this.original_url+"/Master/getBankList")
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