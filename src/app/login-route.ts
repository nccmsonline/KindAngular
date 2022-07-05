import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class LoginRoute implements CanActivate {

  public redirectUrl: string;

  constructor(private router: Router){
	}

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot){
	//	console.log("my url", state.url);
		this.redirectUrl = state.url;
		
		return this.checkLogin(this.redirectUrl);
	}

	checkLogin(url: string): boolean{
		let user = sessionStorage.getItem("currentUser");
		if(user !=null){
			return true;
		}
		else{
			this.router.navigate(['/login']);
		}
	}
}