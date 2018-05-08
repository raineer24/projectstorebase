import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AdminService } from './../services/admin.service';


@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expectedRole = route.data.expectedRole;

    const userData = JSON.parse(localStorage.getItem('selleruser'));

    if (!this.adminService.isAuthenticated() || userData.token.role !== expectedRole) {
      this.router.navigate(['/admin/login']);
      return false;
    }
    return true;
  }
}
