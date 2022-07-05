import { Injectable, Inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndentEntryService {

  userinfo: any;
  coid: any;
  boid: any;
  value:any;
  costcentreid: any;

  private baseUrl = 'http://suvidhaapi.suvidhacloud.com/api';

  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private original_url : string) { 
      let user = sessionStorage.getItem("currentUser");
      this.userinfo = JSON.parse(user);
      this.coid = this.userinfo['coid'];
      this.boid = this.userinfo['boid'];
      this.costcentreid = this.userinfo['costcentreid'];
    }

  // getData()
  // {
  //   return this.http.get(this.baseUrl+"/Masters/GLAccountHeads/GetGLAccountHeads")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  getData()
  {
    return this.http.get(this.baseUrl+"/FA")
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  
  getdepartment() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getdepartment?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getindentor() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getindentor?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getcostcentre() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getcostcentre?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getsubcostcentre() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getsubcostcentre?costcentreid=1&coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getbrandlist() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getbrandlist?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getitemlist() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getitemlist?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
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

 getindentlist()
 {    console.log("id1",this.value);
   let params = new HttpParams();
    let user = sessionStorage.getItem("currentUser");
   this.userinfo = JSON.parse(user);
   this.coid = this.userinfo['coid'];
   this.boid = this.userinfo['boid'];
   params = params.append('sort', "Name");
   params = params.append('coid', this.coid);
   params = params.append('boid', this.boid);
 
   console.log("Params",params);
   return this.http.get("http://suvidhaapi.suvidhacloud.com/api/MaterialManagement/Indents/getindentlist", {params: params})
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