import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
  isLoading = false;
  otpSent = false;
  otpVerified = false;
  showOtpSection = false;
   enteredOtp: string = '';

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router) 
  {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      role: ['', Validators.required],
      specialCode: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
      
    }),

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]{6}$/)]]
    });
  }


// Add these methods inside your RegisterComponent class

sendOTP() {
  if (!this.user.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email)) {
    this.errorMessage = 'Please enter a valid email';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.authService.sendOTP(this.user.email).subscribe({
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
  const email = this.user.email; // Retrieve email from the user object
  const otp = this.enteredOtp; // Retrieve entered OTP from the input field

  if (!otp || otp.length !== 6) {
    this.errorMessage = 'Please enter a valid 6-digit OTP.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  // Call the AuthService to verify the OTP
  this.authService.verifyOTP(email, otp).subscribe({
    next: (response) => {
      console.log(response); // Log response for debugging
      this.isLoading = false;
      this.successMessage = 'OTP verified successfully!';
      this.otpVerified = true;
    },
    error: (error) => {
      console.error(error); // Log error for debugging
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
    gender: '', // Added missing property
    city: ''    // Added missing property
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

    // If you have special code logic for certain roles
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
      this.user.role // add other required fields as needed
    );
  }

  validateCode(): boolean {
    // Implement your special code validation logic here
    return this.specialCode === 'SECRET123'; // Example
  }
}