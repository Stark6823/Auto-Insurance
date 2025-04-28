import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { CommonModule } from '@angular/common';



@Component({

selector: 'app-login',

standalone: true,

imports: [FormsModule, CommonModule],

templateUrl: './login.component.html',

styleUrls: ['./login.component.css']

})

export class LoginComponent {

  username = '';
  password = '';
  newPassword = '';
  reenterPassword = '';
  forgotPasswordFlag = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate([`/${user.role.toLowerCase()}`]);
        } else {
          alert('Invalid credentials!');
        }
      },
      error: () => alert('Login failed!')
    });
  }

  goTORegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    this.forgotPasswordFlag = true;
  }

  resetPassword() {
    if (this.newPassword === this.reenterPassword) {
      if (this.auth.updatePassword(this.username, this.newPassword)) {
        alert('Password reset successfully! Please login with your new password.');
        this.forgotPasswordFlag = false;
        this.router.navigate(['/login']);
      } else {
        alert('User not found. Please try again.');
      }
    } else {
      alert('Passwords do not match.');
    }
  }

}