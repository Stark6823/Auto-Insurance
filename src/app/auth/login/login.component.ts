import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  newPassword = '';
  reenterPassword = '';
  otp = '';
  forgotPasswordFlag = false;
  otpVerificationFlag = false;
  
  
  isLoading = false;
  isOtpLoading = false;
  isVerifying = false;
  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordsDoNotMatch = false;
  otpTimer = 0;
  

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  toastDuration = 5000;
  
  private timerSubscription?: Subscription;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.router.navigate(
        [`${user.role.toLowerCase()}`],
        { queryParams: { userId: user._id, name: user.firstName || user.lastName || '' } }
      );
    }
  }
  
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }
    
    this.isLoading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        const user = response?.user || response;
        if (user && user.role) {
          this.showToast('Login successful! Redirecting...','success');
          localStorage.setItem('currentUser', JSON.stringify(user));
          

          setTimeout(() => {
            this.router.navigate(
              [`${user.role.toLowerCase()}`],
              { queryParams: { userId: user._id || user._id, name: user.firstName || user.lastName || '' } }
            );
          }, 1000);
        } else {
          this.showToast('Login failed: User role not found.', 'error');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast('Login failed! Please check your credentials.', 'error');
        this.isLoading = false;
        console.error('Login error:', err);
      }
    });
  }

  goTORegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    this.forgotPasswordFlag = true;
    this.passwordsDoNotMatch = false;
  }

  cancelReset() {
    this.forgotPasswordFlag = false;
    this.otpVerificationFlag = false;
    this.newPassword = '';
    this.reenterPassword = '';
    this.otp = '';
    this.passwordsDoNotMatch = false;
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  sendPasswordResetOTP() {
    if (!this.email) {
      this.showToast('Please enter your email address', 'error');
      return;
    }
    
    if (this.newPassword !== this.reenterPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }
    
    this.passwordsDoNotMatch = false;
    this.isOtpLoading = true;

    this.auth.sendOTP(this.email)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.otpVerificationFlag = true;
            this.forgotPasswordFlag = false;
            this.showToast('OTP sent to your email. Please check your inbox.', 'success');
            this.startOtpTimer();
          } else {
            this.showToast('Failed to send OTP. Please try again.', 'error');
          }
          this.isOtpLoading = false;
        },
        error: (err) => {
          console.error('OTP send error:', err);
          this.showToast('Failed to send OTP. Please check your email and try again.', 'error');
          this.isOtpLoading = false;
        }
      });
  }

  verifyAndResetPassword() {
    if (!this.otp) {
      this.showToast('Please enter OTP', 'error');
      return;
    }
    
    this.isVerifying = true;

    this.auth.verifyOTP(this.email, this.otp).
    subscribe({
      next: (response: any) => {
        if (response.message === 'OTP verified successfully') {
          
          this.updatePasswordInDatabase();
        } else {
          this.showToast('OTP verification failed. Please try again.', 'error');
          this.isVerifying = false;
        }
      },
      error: (err) => {
        console.error('OTP verification error:', err);
        this.showToast('OTP verification failed. Please try again.', 'error');
        this.isVerifying = false;
      }
    });
  }

  updatePasswordInDatabase() {
    this.auth.updatePassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        this.showToast('Password reset successfully! Please login with your new password.', 'success');
        setTimeout(() => {
          this.cancelReset();
        }, 1500);
        this.isVerifying = false;
      },
      error: (err) => {
        console.error('Password update error:', err);
        this.showToast('Failed to update password. Please try again.', 'error');
        this.isVerifying = false;
      }
    });
  }
  
  /**
   * @param message 
   * @param type 
   */
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    
  
    setTimeout(() => {
      this.toastVisible = false;
    }, this.toastDuration);
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
 
  startOtpTimer() {
    this.otpTimer = 30; 
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    this.timerSubscription = interval(1000)
      .pipe(take(61))
      .subscribe(() => {
        if (this.otpTimer > 0) {
          this.otpTimer--;
        }
      });
  }

  resendOTP() {
    if (this.otpTimer > 0) return;
    
    this.auth.sendOTP(this.email)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.showToast('OTP resent to your email', 'success');
            this.startOtpTimer();
          } else {
            this.showToast('Failed to resend OTP', 'error');
          }
        },
        error: (err) => {
          console.error('OTP resend error:', err);
          this.showToast('Failed to resend OTP', 'error');
        }
      });
  }
}