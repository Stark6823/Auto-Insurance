import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
 // registerForm: FormGroup;
  otpForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
 
  isLoading = false;
  otpSent = false;
  otpVerified = false;
  showOtpSection = false;
  enteredOtp: string = '';
  otpTimer = 0;
 
  
  currentStep: number = 1;
  confirmPassword: string = '';
  private timerSubscription?: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) 
  {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]{6}$/)]]
    });
  }

  
  nextStep() {
    if (this.currentStep === 1 && !this.isPersonalDetailsValid()) {
      this.formSubmitted = true;
      return;
    }
    
    if (this.currentStep === 2 && !this.isSecurityDetailsValid()) {
      return;
    }
    
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  
  isPersonalDetailsValid(): boolean {
    return !!(
      this.user.firstName &&
      this.user.lastName &&
      this.user.email &&
      this.user.phoneNumber &&
      this.user.gender &&
      this.user.city &&
      this.user.role &&
      (this.user.role !== 'AGENT' || this.specialCode)
    );
  }

  isSecurityDetailsValid(): boolean {
    return !!(
      this.user.password &&
      this.user.password.length >= 6 &&
      this.confirmPassword &&
      this.user.password === this.confirmPassword
    );
  }

  
  getPasswordStrength(): number {
    if (!this.user.password) return 0;
    
    let strength = 0;
    
    if (this.user.password.length >= 8) strength += 25;
    else if (this.user.password.length >= 6) strength += 15;
    
  
    if (/[A-Z]/.test(this.user.password)) strength += 25;
    if (/[0-9]/.test(this.user.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(this.user.password)) strength += 25;
    
    return Math.min(strength, 100);
  }
  
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 30) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  }

  
  sendRegistrationOTP() {
    if (!this.user.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.sendRegistrationOTP(this.user.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'OTP sent to your email';
        this.otpSent = true;
        this.showOtpSection = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP';
      }
    });
  }

  verifyOTP() {
    const email = this.user.email; 
    const otp = this.enteredOtp; 

    if (!otp || otp.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    
    this.authService.verifyOTP(email, otp).subscribe({
      next: (response) => {
        console.log(response); 
        this.isLoading = false;
        this.successMessage = 'OTP verified successfully!';
        this.otpVerified = true;
      },
      error: (error) => {
        console.error(error); 
        this.isLoading = false;
        this.errorMessage = 'Invalid or expired OTP. Please try again.';
        this.otpVerified = false;
      }
    });
  }

  goBackToHome() {
    this.router.navigate(['/']);
  }

  onRoleChange() {
    if (this.user.role === 'AGENT') {
      this.specialCode = '';
    }
  }
  
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    gender: '',
    city: ''
  };

  specialCode: string = '';
  invalidCode: boolean = false;
  errorMsg: string | null = null;
  formSubmitted: boolean = false;
  
  onSubmit() {
    console.log('Form submitted', this.user);
    this.formSubmitted = true;
    this.errorMsg = null;

    if (!this.isFormValid()) {
      console.log('Form is invalid');
      return;
    }

    
    if (this.user.role === 'AGENT') {
      if (!this.specialCode || !this.validateCode()) {
        this.invalidCode = true;
        console.log('Invalid special code');
        return;
      }
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {

        this.errorMessage = err.error?.error || 'Registration failed';
        console.log('Registration error', err);
      }
    });
  }
  isFormValid(): boolean {
    return !!(
      this.user.firstName &&
      this.user.lastName &&
      this.user.email &&
      this.user.password &&
      this.user.role &&
      this.user.phoneNumber &&
      this.user.gender &&
      this.user.city &&
      this.otpVerified &&
      (this.user.role !== 'AGENT' || (this.specialCode && this.validateCode()))
    );
  }

  validateCode(): boolean {
    
    return this.specialCode === 'SECRET123'; 
  }


  resendOTP() {
    if (this.otpTimer > 0) return;
    this.isLoading = true;
    this.authService.sendRegistrationOTP(this.user.email)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.isLoading = false;
            console.log('OTP resent to your email', 'success');
            this.startOtpTimer();
          } else {
            console.log('Failed to resend OTP', 'error');
          }
        },
        error: (err) => {
          console.error('OTP resend error:', err);
          console.log('Failed to resend OTP', 'error');
        }
      });
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
  
}