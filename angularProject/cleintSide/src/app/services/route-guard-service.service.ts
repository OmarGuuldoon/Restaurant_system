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
    let expectedRoleArray = route.data['expectedRole'];

    // Check if expectedRoleArray is valid and is an array
    if (!Array.isArray(expectedRoleArray)) {
      console.error("Expected roles are not properly defined in route data.");
      this.router.navigate(['/']);
      return false;
    }

    const token: any = localStorage.getItem('token');
    let tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    let checkRole = false;
    // Check if the user's role matches any of the expected roles
    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true;
      }
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackbarService.openSnackBar(globalConstants.unAuthorized, globalConstants.error);
      this.router.navigate(['cafe/dashboard']);
      console.log("authorized user with legible role");
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
