import { Injectable,Inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountGroupMasterService {
  userinfo : any;
  coid : any;
  boid : any
  value:any;
  

 

  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();
  
  constructor(private http: HttpClient,
    @Inject('BASE_URL') private original_url : string) { }
  
  // getGetGLAccountHeads()
  // {
  //   return this.http.get(this.original_url+"/Masters/GLAccountHeads/GetGLAccountHeads")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  getGetGLAccountHeads()
  {    console.log("id1",this.value);
    let params = new HttpParams();
     let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
   // params = params.append('PageNumber',"1");
   // params = params.append('PageSize', this.value);
    params = params.append('sort', "Name");
    params = params.append('coid', this.coid);
    params = params.append('boid', this.boid);
  
    console.log("Params",params);
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountGroup/GetGLAllAccountGroup", {params: params})
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  
  savaRecords(id)
  {
    this.value = id
    console.log("id",id);
  }


  savePushData(res)
  {
    this.onfieldArrayPush.next(res);
  }
}