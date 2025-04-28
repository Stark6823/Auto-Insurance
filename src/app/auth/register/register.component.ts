import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    user: User = {
      userId: 0,
      username: '',
      password: '',
      email: '',
      role: 'CUSTOMER',
      profileImage: ''
    };
      specialCode: string = '';
      showSpecialCodeInput = false;
      invalidCode = false;
      formSubmitted= false;
    
      constructor(private authService: AuthService, private router: Router) {}
    
      onSubmit() {
        this.formSubmitted = true; 
    
        if (!this.isFormValid()) {
          return; 
        }
    
        if (this.user.role === 'AGENT' || this.user.role === 'ADMIN') {
          if (!this.specialCode || !this.validateCode()) {
            this.invalidCode = true;
            return;
          }
        }
    
        this.authService.register(this.user).subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    
      onRoleChange() {
        this.showSpecialCodeInput = this.user.role === 'AGENT' || this.user.role === 'ADMIN';
        this.invalidCode = false; 
      }
    
      validateCode(): boolean {
        if (this.user.role === 'AGENT') {
          return this.specialCode === 'AGENT123';
        } else if (this.user.role === 'ADMIN') {
          return this.specialCode === 'ADMIN123';
        }
        return false;
      }
    
      

      goBackToHome(){
        this.router.navigate(['/home']);
      }





      



      isFormValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          this.user.username.trim() !== '' &&
          this.user.password.trim() !== '' &&
          this.user.email.trim() !== '' &&
          emailRegex.test(this.user.email) &&
          this.user.role.trim() !== ''
        );
      }
    }