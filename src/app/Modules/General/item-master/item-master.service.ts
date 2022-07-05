import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemMasterService {

  userinfo: any;
  coid: any;
  boid: any;
  private baseUrl = 'http://suvidhaapi.suvidhacloud.com';

  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private original_url : string
    ) {   }

    Getitemtype()
   {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/itemmaster/getitemtype?coid=1")
    .pipe(
      map((data: any[]) => {
        console.log("coid",data)
        return data;
       
      })
   );
  }

  GetitemUOM()
  {
   let user = sessionStorage.getItem("currentUser");
   this.userinfo = JSON.parse(user);
   this.coid = this.userinfo['coid'];
   this.boid = this.userinfo['boid'];
   return this.http.get(this.original_url+"/Masters/itemmaster/getitemuom?PageNumber=1&PageSize=50&sort=1&coid="+this.coid+"&boid="+this.boid)
   .pipe(
     map((data: any[]) => {
       return data;
     })
  );
 }
 getSupplierList()
  {
   let user = sessionStorage.getItem("currentUser");
   this.userinfo = JSON.parse(user);
   this.coid = this.userinfo['coid'];
   this.boid = this.userinfo['boid'];
   return this.http.get(this.original_url+"/Masters/itemmaster/getsupplierlist?coid="+this.coid+"&boid="+this.boid)
   .pipe(
     map((data: any[]) => {
       return data;
     })
  );
 }

 getitemtype()
 {
  let user = sessionStorage.getItem("currentUser");
  this.userinfo = JSON.parse(user);
  this.coid = this.userinfo['coid'];
  return this.http.get(this.original_url+"/Masters/itemmaster/getitemtype?coid="+this.coid)
  .pipe(
    map((data: any[]) => {
      return data;
    })
 );
}
  
  getData()
  {
    // this.http.get('/api/item/ItemList')
    //   .subscribe((response) => {
    //     console.log("response", response);
    //   });
  }

  savePushData(data)
  {
    this.onfieldArrayPush.next(data);
  }
}