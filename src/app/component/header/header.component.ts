import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { RoleGuard } from '../../auth/role.guard';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  showProfileCard = false;
  showDetailedProfileCard = false;
  currentUser: User | null = null;
  profileImage = 'assets/userlogo001.png';
  showAvatarOptions = false;
  showAvatarOptionsDetailed = false;
  editingDetailedField: string | null = null;
  editedUserId: number | null = null;
  editedEmail: string = '';
  editedUsername: string = '';

  @Output() profileImageUpdated = new EventEmitter<string>();
  private profileUpdateSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router, private roleGuard: RoleGuard) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.profileUpdateSubscription = this.profileImageUpdated.subscribe(() => {
      this.loadCurrentUser();
    });
  }

  ngOnDestroy(): void {
    if (this.profileUpdateSubscription) {
      this.profileUpdateSubscription.unsubscribe();
    }
  }

  loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.profileImage) {
      this.profileImage = this.currentUser.profileImage;
    } else {
      this.profileImage = 'assets/userlogo001.png';
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
    this.currentUser = null;
    this.closeProfileCard();
    this.closeDetailedProfileCard();
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
    this.showAvatarOptionsDetailed = false;
    this.closeDetailedProfileCard();
  }

  closeProfileCard() {
    this.showProfileCard = false;
    this.showAvatarOptions = false;
    this.showAvatarOptionsDetailed = false;
    
    this.closeDetailedProfileCard();
    
  }

  toggleEditAvatarOptions() {
    this.showAvatarOptions = !this.showAvatarOptions;
    this.showAvatarOptionsDetailed = false;
  }

  toggleEditAvatarOptionsDetailed() {
    this.showAvatarOptionsDetailed = !this.showAvatarOptionsDetailed;
    this.showAvatarOptions = false;
  }

  removeProfileImage() {
    this.profileImage = 'assets/userlogo001.png';
    if (this.currentUser) {
      this.currentUser.profileImage = this.profileImage;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.profileImageUpdated.emit(this.profileImage);
    }
    this.showAvatarOptions = false;
    this.showAvatarOptionsDetailed = false;
  }

  uploadProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Data URL:', e.target.result); // Add this line
        this.profileImage = e.target.result;
        if (this.currentUser) {
          this.currentUser.profileImage = this.profileImage;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.profileImageUpdated.emit(this.profileImage);
        }
      };
      reader.readAsDataURL(file);
      this.showAvatarOptions = false;
      this.showAvatarOptionsDetailed = false;
    }
  }

  openDetailedProfile() {
    this.showDetailedProfileCard = true;
    this.loadCurrentUserForEdit();
    this.closeProfileCard();
    this.showDetailedProfileCard = true;
    
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
    // this.loadCurrentUserForEdit();
  }

  saveDetailedChanges() {
    if (this.currentUser) {
      if (this.editingDetailedField === 'userId' && this.editedUserId !== null) {
        this.currentUser.userId = this.editedUserId;
      } 
       if (this.editingDetailedField === 'email') {
        this.currentUser.email = this.editedEmail;
      }
      if (this.editingDetailedField === 'username') {
        this.currentUser.username = this.editedUsername;
      }
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.editingDetailedField = null;
      this.closeDetailedProfileCard();
      this.loadCurrentUser();
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