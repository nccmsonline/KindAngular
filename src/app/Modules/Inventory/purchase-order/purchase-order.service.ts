import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  userinfo: any;
  coid: any;
  boid: any;

  private baseUrl = 'http://suvidhaapi.suvidhacloud.com/api';

   private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private original_url : string) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
  }

  getData()
  {
    return this.http.get(this.baseUrl+"/FA")
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

  savePushData(data)
  {
    console.log("data1",data);
    this.onfieldArrayPush.next(data);
  }
}
