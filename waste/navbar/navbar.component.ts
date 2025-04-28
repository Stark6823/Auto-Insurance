// import { Component } from '@angular/core';
// import { AuthService } from '../auth/auth.service'; // Adjust path as needed
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { routes } from '../app.routes';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent {
//   title = 'Auto Insurance'; // Replace with your company name
//   isLoggedIn: boolean = false;
//   constructor(private authService: AuthService,
//          private router: Router) 
//    {
//     this.isLoggedIn = this.authService.getCurrentUser() !== null;
//   }
//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }

// }