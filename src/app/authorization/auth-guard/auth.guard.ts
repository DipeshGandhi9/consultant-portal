import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from '@ngxs/store';
import { AutenticationState } from 'src/app/store/authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public store : Store, private router : Router
  ) { }
   
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):any {
   let isUserAuthenticated = localStorage.getItem("isUserAuthenticated");
   const isloggedIn = this.store.selectSnapshot(AutenticationState.isUserLoggedIn);

    if(isUserAuthenticated == 'true' || isloggedIn) {
      return true
    }
    this.router.navigate(['/login']); 
    return false
  }
}
