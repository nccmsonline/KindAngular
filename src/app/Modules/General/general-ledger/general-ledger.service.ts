import { Injectable,Inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerService {
  userinfo : any;
  coid : any;
  boid : any
  value:any;
  

 

  private _onDataChanged: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this._onDataChanged.asObservable();

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private original_url : string) { }

  // getData()
  // {
  //   return this.http.get(this.original_url+"/Masters/GLAccountGroup/GetGLAccountGroup")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  // getGetGLAllAccountGroup()
  // {
  //   return this.http.get(this.original_url+"/Masters/GLAccountGroup/GetGLAllAccountGroup")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }
  getGetGLAllAccountGroup()
  {   
    let params = new HttpParams();
     let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];
   
   // params = params.append('sort', "Name");
    params = params.append('coid', this.coid);
    params = params.append('boid', this.boid);
  
    console.log("Params",params);
    return this.http.get("http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountHeads/GetGLAccountHeads", {params: params})
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
    }
  // getGetGLAccountHeads()
  // {
  //   return this.http.get(this.original_url+"/Masters/GLAccountHeads/GetGLAccountHeads")
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  // }

  savePushData(params)
  {
    return this.http.post("http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountHeads/manageGLAccountHead", {params: params})
      .subscribe((res) => {
        this._onDataChanged.next(res);
        return res;
      });
  }
}