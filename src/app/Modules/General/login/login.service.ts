import { Injectable, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  original_url=environment.baseUrl;
  onLoginChanged: BehaviorSubject<any> = new BehaviorSubject('');
  branch1FinacialID: BehaviorSubject<any> = new BehaviorSubject('');
  branch2FinacialID: BehaviorSubject<any> = new BehaviorSubject('');


  constructor( @Inject('BASE_URL') private baseUrl : string,
    private http: HttpClient,
    private router: Router
  ) {}
  getFillFyData(data)
  {
    //   return this.http.get(this.baseUrl+"/User/getFyData?UserName="+data.UserName+"&Password="+data.Password)
    //   .pipe(
    //     map((data) => {
    //       console.log("1", data);
    //       return data;
    //     })
    // );
    const  params = new  HttpParams()
    .set('UserName', data.UserName)
    .set('Password', data.Password)
    .set('companyid', data.COMPANYID);
   
    
    return this.http.post(this.original_url+"/user/getFyData", params.toString(), {
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         }).pipe(
              map((data) => {
                console.log("1", data);
                return data;
              })
          );
  }
  login(data)
  {
      console.log("data", data);
    //   return this.http.get(this.baseUrl+"/user/getFyData?UserName="+data.UserName+"&Password="+data.Password)
    //   .pipe(
    //     map((data) => {
    //       console.log("1", data);
    //       return data;
    //     })
    // );
    // return this.http.post(this.baseUrl+"/user/getmenulist", params.toString(), {
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //   })
    //   .subscribe((res) => {
    //     return res;
    // });
  }
  getCompanyList()
  {
      return this.http.get(this.original_url+"/user/getCompanyData")
      .pipe(
        map((data) => {
          console.log("1", data);
          return data;
        })
    );
  }
  
  getmenulist(userid,isadmin,boid)
  {
    console.log("1", "data");
    
      return this.http.get(this.original_url+"/user/getmenulist?userId="+userid+"&isadmin="+isadmin+"&boid="+boid)
      .pipe(
        map((data) => {
          console.log("1", data);
          return data;
        })
    );


  
}
  
  getUrl(show, branch1, branch2)
  {
    // if(this.router.url === '/login')
    // {
      this.onLoginChanged.next(show);
      this.branch1FinacialID.next(branch1);
      this.branch2FinacialID.next(branch2);
    // }
  }


getBranchAndFyList(companyid)
{
    return this.http.get(this.original_url+"/user/getBranchAndFyList?companyid="+companyid)
    .pipe(
      map((data) => {
        console.log("1", data);
        return data;
      })
  );
}
getPartyDetail(gstin, mobile)
{
    
    return this.http.get(this.original_url+"/master/getPartyDetail?gstin="+gstin+"&regMob="+mobile)
    .pipe(
      map((data) => {
        console.log("1", data);
        return data;
      })
  );
}

}