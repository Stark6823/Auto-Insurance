import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { FrontPageComponent } from "../pages/front-page/front-page.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', // Use templateUrl here
  styleUrls: ['./home.component.css'], // Add this line if you have CSS for this component,
  // Removed invalid 'imports' property
  imports: [CommonModule, FormsModule,FrontPageComponent]
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.redirectToRolePage(user);
    }
  }

  getUserRole(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? user.role : null;
  }

  redirectToRolePage(user: User) {
    const userId = user.userId;
    const userName = user.username;
    const role = user.role;

    switch (role) {
      case 'ADMIN':
        this.router.navigate(['admin'], { queryParams: { id: userId, name: userName } });
        break;
      case 'AGENT':
        this.router.navigate(['agent'], { queryParams: { id: userId, name: userName } });
        break;
      case 'CUSTOMER':
        this.router.navigate(['customer'], { queryParams: { id: userId, name: userName } });
        break;
      default:
        // Handle unexpected roles or no role
        break;
    }
  }
}