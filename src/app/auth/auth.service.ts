import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users: User[] = [
    { userId: 1, username: 'admin', password: '1234', email: 'admin@example.com', role: 'ADMIN',profileImage: 'https://via.placeholder.com/80/cccccc/ffffff?Text=Admin' },
    { userId: 2, username: 'agent', password: '1234', email: 'agent@example.com', role: 'AGENT', profileImage: 'https://via.placeholder.com/80/cccccc/ffffff?Text=Agent' },
    { userId: 3, username: 'customer', password: '1234', email: 'customer@example.com', role: 'CUSTOMER', profileImage: 'https://via.placeholder.com/80/cccccc/ffffff?Text=Customer' },
  ];

  constructor(private router: Router) {}

  login(username: string, password: string): Observable<User | null> {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return of(user || null);
  }

  register(user: User): Observable<User> {
    user.userId = this.users.length + 1;
    this.users.push(user);
    return of(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
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

  updatePassword(username: string, newPassword: string): boolean {
    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      this.users[userIndex].password = newPassword;
      localStorage.setItem('currentUser', JSON.stringify(this.users[userIndex]));
      return true;
    }
    return false;
  }
}