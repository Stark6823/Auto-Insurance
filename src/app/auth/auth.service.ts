import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  gender: string;
  city: string;
  role: string;
  profileImage?: string;
}

interface LoginResponse {
  token: string;
  user: User;
  message: string;
  role:string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
 


  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        })
      );
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-password`, { email, newPassword });
  }


  sendOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { email });
  }


  sendRegistrationOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-registration-otp`, { email });
  }
  
  

  verifyOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

 
  updateUser(userId: string, userData: any): Observable<any> {
    const formData = new FormData();
    
   
    if (userData.profileImage && typeof userData.profileImage === 'string') {
      if (userData.profileImage.startsWith('data:')) {
        try {
          const blob = this.dataURItoBlob(userData.profileImage);
          formData.append('profileImage', blob, 'profile.jpg');
        } catch (e) {
          console.error('Image conversion error:', e);
        }
      } else {
        formData.append('profileImage', userData.profileImage);
      }
    }

  
    Object.keys(userData).forEach(key => {
      if (key !== 'profileImage') {
        const value = userData[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
    });

    return this.http.patch(`${this.apiUrl}/users/${userId}`, formData).pipe(
      catchError((error: any) => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  
}