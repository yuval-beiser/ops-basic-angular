import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  implements CanActivate {
    constructor(public authService: AuthService, protected router: Router) { }

    canActivate() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
