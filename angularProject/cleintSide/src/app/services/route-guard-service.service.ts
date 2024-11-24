import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { globalConstants } from '../shared/globalConstants';
@Injectable({
  providedIn: 'root'
})
export class RouteGuardServiceService {

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoleArray = route.data['expectedRole'] || [];
    const token: any = localStorage.getItem('token');
  
    // Validate the token
    let tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }
  
    // Check user role against expected roles
    const userRole = tokenPayload.role;
    const isAuthorized = expectedRoleArray.includes(userRole);
  
    if (this.auth.isAuthenticated() && isAuthorized) {
      return true;
    }
  
    // Redirect unauthorized users
    this.snackbarService.openSnackBar(globalConstants.unAuthorized, globalConstants.error);
    this.router.navigate(['cafe/dashboard']);
    return false;
  }
  
}
