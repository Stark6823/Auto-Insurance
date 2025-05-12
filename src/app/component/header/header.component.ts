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
[x: string]: any;
  showProfileCard = false;
  showDetailedProfileCard = false;
  currentUser: User | null = null;
  profileImage = '../assets/userlogo001.png';
  showAvatarOptions = false;
  showAvatarOptionsDetailed = false;
  editingDetailedField: string | null = null;
  editedUserId: string = '';
  editedEmail: string = '';
  editedUsername: string = '';
  editedGender: string = '';
  editedPhoneNumber: string = '';
  editedCity: string = '';
  editedRole: string = '';
  isLoading = false;

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
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      if (this.currentUser && this.currentUser.profileImage) {
        this.profileImage ='http://localhost:3000'+ this.currentUser.profileImage;
      } else {
        this.profileImage = '/assets/userlogo001.png';
      }
    } else {
      this.currentUser = null;
      this.profileImage = '../assets/userlogo001.png';
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
    this.profileImage = '../assets/userlogo001.png';
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
      
      this.editedUsername = `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
      this.editedGender = this.currentUser.gender || '';
      this.editedPhoneNumber = this.currentUser.phoneNumber || '';
      this.editedCity = this.currentUser.city || '';
     
    }
  }

  editDetailedField(field: string) {
    this.editingDetailedField = field;
    if (!this.currentUser) return;
  
    switch (field) {
      case 'all':
        this.loadCurrentUserForEdit();
        break;
      case 'username':
        this.editedUsername = `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
        break;
      case 'gender':
        this.editedGender = this.currentUser.gender || '';
        break;
      case 'phoneNumber':
        this.editedPhoneNumber = this.currentUser.phoneNumber || '';
        break;
      case 'city':
        this.editedCity = this.currentUser.city || '';
        break;
      default:
        break;
    }
  }
  
  saveDetailedChanges() {
    if (this.currentUser && this.currentUser._id) {
      const updateData: any = {};
      
      // Only update fields that are being edited
      if (this.editingDetailedField === 'all' || this.editingDetailedField === 'username') {
        const [firstName, ...lastNameArr] = this.editedUsername.split(' ');
        updateData.firstName = firstName;
        updateData.lastName = lastNameArr.join(' ');
      }
  
      if (this.editingDetailedField === 'all' || this.editingDetailedField === 'gender') {
        updateData.gender = this.editedGender;
      }
  
      if (this.editingDetailedField === 'all' || this.editingDetailedField === 'phoneNumber') {
        updateData.phoneNumber = this.editedPhoneNumber;
      }
  
      if (this.editingDetailedField === 'all' || this.editingDetailedField === 'city') {
        updateData.city = this.editedCity;
      }
  
      // Preserve profile image in update data
      if (this.currentUser.profileImage) {
        updateData.profileImage = this.currentUser.profileImage;
      }
  
      this.authService.updateUser(this.currentUser._id, updateData).subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUser = { ...this.currentUser, ...response.user };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.editingDetailedField = null;
            this.loadCurrentUser();
          }
        },
        error: (err) => {
          console.error('Update failed:', err);
        }
      });
    }
  }

  uploadProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file || !this.currentUser || !this.currentUser._id) {
      return;
    }
  
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      console.error('File too large');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (result) {
        this.updateProfileImage(result);
      }
    };
    reader.onerror = () => {
      console.error('File reading error');
    };
    reader.readAsDataURL(file);
  }
  
  private updateProfileImage(imageData: string): void {
    if (!this.currentUser || !this.currentUser._id) {
      return;
    }
  
    this.isLoading = true;
    this.authService.updateUser(this.currentUser._id, {
      profileImage: imageData
    }).subscribe({
      next: (response) => {
        if (response.success && this.currentUser) {
          this.profileImage = response.user.profileImage || '../assets/userlogo001.png';
          console.log(response.user.profileImage);
          this.currentUser.profileImage = this.profileImage;
          console.log('set profile image:', this.currentUser.profileImage);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.profileImageUpdated.emit(this.profileImage);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isLoading = false;
      }
    });
  }
  
  removeProfileImage(): void {
    if (!this.currentUser || !this.currentUser._id) {
      return;
    }
  
    this.isLoading = true;
  
    this.authService.updateUser(this.currentUser._id, {
      profileImage: null
    }).subscribe({
      next: (response) => {
        if (response.success) {
          // Set profileImage to default and bypass caching
          console.log('image Updated:', response.user.profileImage);
          this.profileImage = '';          
          // Update local storage and emit event
          if (this.currentUser) {
            this.currentUser.profileImage = this.profileImage;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.profileImageUpdated.emit(this.profileImage);
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Remove error:', err);
        this.isLoading = false;
      }
    });
  
    this.showAvatarOptions = false;
    this.showAvatarOptionsDetailed = false;
  }

  isAdminOrAgent(): boolean {
    return this.roleGuard.checkAdminOrAgent();
  }
}