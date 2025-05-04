import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  newPassword = '';
  reenterPassword = '';
  otp = '';
  forgotPasswordFlag = false;
  otpVerificationFlag = false;
  errorMessage: string | null = null;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        const user = response?.user || response;
        if (user && user.role) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(
            [`${user.role.toLowerCase()}`],
            { queryParams: { userId: user._id || user._id, name: user.firstName || user.lastName|| '' } }
          );
        } else {
          this.errorMessage = 'Login failed: User role not found.';
          alert(this.errorMessage);
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed!';
        alert(this.errorMessage);
        console.error('Login error:', err);
      }
    });
  }

  goTORegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    this.forgotPasswordFlag = true;
  }

  cancelReset() {
    this.forgotPasswordFlag = false;
    this.otpVerificationFlag = false;
    this.newPassword = '';
    this.reenterPassword = '';
    this.otp = '';
  }

  sendPasswordResetOTP() {
    if (this.newPassword !== this.reenterPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.http.post('http://localhost:3000/api/auth/send-otp', { email: this.email })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.otpVerificationFlag = true;
            this.forgotPasswordFlag = false;
            alert('OTP sent to your email. Please check your inbox.');
          } else {
            alert('Failed to send OTP. Please try again.');
          }
        },
        error: (err) => {
          console.error('OTP send error:', err);
          alert('Failed to send OTP. Please try again.');
        }
      });
  }

  verifyAndResetPassword() {
    if (!this.otp) {
      alert('Please enter OTP');
      return;
    }

    this.http.post('http://localhost:3000/api/auth/verify-otp', {
      email: this.email,
      otp: this.otp
    }).subscribe({
      next: (response: any) => {
        if (response.message === 'OTP verified successfully') {
          // OTP verified, now update password
          this.updatePasswordInDatabase();
        } else {
          alert('OTP verification failed. Please try again.');
        }
      },
      error: (err) => {
        console.error('OTP verification error:', err);
        alert('OTP verification failed. Please try again.');
      }
    });
  }

  updatePasswordInDatabase() {
    this.auth.updatePassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        alert('Password reset successfully! Please login with your new password.');
        this.cancelReset();
      },
      error: (err) => {
        console.error('Password update error:', err);
        alert('Failed to update password. Please try again.');
      }
    });
  }
}