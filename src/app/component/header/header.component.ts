import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { RoleGuard } from '../../auth/role.guard';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  showProfileCard = false;
  showDetailedProfileCard = false; // New property for the detailed card
  currentUser: User | null = null;
  profileImage = '/src/assets/userlogo001.png'; // Default image
  showAvatarOptions = false;
  editingDetailedField: string | null = null; // For the detailed card
  editedUserId: number | null = null;
  editedEmail: string = '';
  editedUsername: string = '';

  constructor(private authService: AuthService, private router: Router, private roleGuard: RoleGuard) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.profileImage) {
      this.profileImage = this.currentUser.profileImage;
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): string | null {
    return this.currentUser ? this.currentUser.role : null;
  }

  logout() {
    this.authService.logout();
    this.currentUser = null; // Explicitly clear the currentUser
    this.closeProfileCard(); // Close the main profile card on logout
    this.closeDetailedProfileCard(); // Close the detailed profile card on logout (in case it's open)
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  toggleProfileCard() {
    this.showProfileCard = !this.showProfileCard;
    this.showAvatarOptions = false;
    this.closeDetailedProfileCard(); // Ensure detailed card is closed when toggling main profile
  }

  closeProfileCard() {
    this.showProfileCard = false;
    this.showAvatarOptions = false;
    this.closeDetailedProfileCard();
  }

  toggleEditAvatarOptions() {
    this.showAvatarOptions = !this.showAvatarOptions;
  }

  removeProfileImage() {
    this.profileImage = '/src/assets/userlogo001.png';
    if (this.currentUser) {
      this.currentUser.profileImage = this.profileImage;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
    this.showAvatarOptions = false;
  }

  uploadProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
        if (this.currentUser) {
          this.currentUser.profileImage = this.profileImage;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
      };
      reader.readAsDataURL(file);
      this.showAvatarOptions = false;
    }
  }

  openDetailedProfile() {
    this.showDetailedProfileCard = true;
    this.loadCurrentUserForEdit(); // Load current user data for editing
    // this.closeProfileCard(); // Close the main profile card
  }

  closeDetailedProfileCard() {
    this.showDetailedProfileCard = false;
    this.editingDetailedField = null;
  }

  loadCurrentUserForEdit() {
    if (this.currentUser) {
      this.editedUserId = this.currentUser.userId;
      this.editedEmail = this.currentUser.email;
      this.editedUsername = this.currentUser.username;
    }
  }

  editDetailedField(field: string) {
    this.editingDetailedField = field;
    this.loadCurrentUserForEdit(); // Ensure latest data is in the edit fields
  }

  saveDetailedChanges() {
    if (this.currentUser) {
      if (this.editingDetailedField === 'userId' && this.editedUserId !== null) {
        this.currentUser.userId = this.editedUserId;
      } else if (this.editingDetailedField === 'email') {
        this.currentUser.email = this.editedEmail;
      } else if (this.editingDetailedField === 'username') {
        this.currentUser.username = this.editedUsername;
      }
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.editingDetailedField = null;
      this.closeDetailedProfileCard();
      this.loadCurrentUser(); // Update displayed data in the header card (if it's open again)
    }
  }

  goToMyProjects() {
    console.log('Go to My Projects');
  }

  goToInbox() {
    console.log('Go to Inbox');
  }

  toggleDarkMode() {
    console.log('Toggle Dark Mode');
  }

  goToAccountSettings() {
    console.log('Go to Account Settings');
  }

  isAdminOrAgent(): boolean {
    return this.roleGuard.checkAdminOrAgent();
  }
}