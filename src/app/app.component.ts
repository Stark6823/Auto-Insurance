import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from "./component/footer/footer.component";
import { filter } from 'rxjs';
// import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Auto Insurance Management System';
  hideHeaderFooter: boolean = false;
  constructor(private authService: AuthService,private router:Router) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideHeaderFooter = this.router.url.includes('/login') || this.router.url.includes('/register');
      });

   } // Check if the user is logged in

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  } // Check if the user is an admin

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  } // Check if the user is an agent

  isAgent(): boolean {
    return this.authService.hasRole('AGENT');
  } // Check if the user is a customer

  isCustomer(): boolean {
    return this.authService.hasRole('CUSTOMER');
  } // Logout the user

  logout() {
    this.authService.logout();

    window.location.href = '/login'; // Redirect to login page
  }
}
