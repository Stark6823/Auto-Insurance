import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    //state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const requiredRole = route.data['role'];
    const user = this.auth.getCurrentUser();

    if (!user) {
      return this.router.parseUrl('/login');
    }

    if (user.role === requiredRole) {
      return true;
    }

    return this.router.parseUrl('/home');
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const requiredRole = route.data['role'];
    const user = this.auth.getCurrentUser();

    if (!user) {
      return this.router.parseUrl('/login');
    }

    if (user.role === requiredRole) {
      return true;
    }

    return this.router.parseUrl('/home');
  }

  checkAdminOrAgent(): boolean {
    const user = this.auth.getCurrentUser();
    if (!user) return false;
    return user.role === 'ADMIN' || user.role === 'AGENT';
  }
}