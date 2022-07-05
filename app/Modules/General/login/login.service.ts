import { Injectable, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

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
    .set('Password', data.Password);
   
    
    return this.http.post(this.baseUrl+"/user/getFyData", params.toString(), {
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
  
  getmenulist(userid,isadmin,boid)
  {
    console.log("1", "data");
    
      return this.http.get(this.baseUrl+"/user/getmenulist?userId="+userid+"&isadmin="+isadmin+"&boid="+boid)
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


getBranchAndFyList(data)
{
    console.log("data", data);
    return this.http.get(this.baseUrl+"/user/getBranchAndFyList?serverip="+data)
    .pipe(
      map((data) => {
        console.log("1", data);
        return data;
      })
  );
}
}