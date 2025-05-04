import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-dash-board',
  imports: [CommonModule],
  templateUrl: './customer-dash-board.component.html',
  styleUrl: './customer-dash-board.component.css'
})
export class CustomerDashBoardComponent {
  activeSection: string= 'dashboard';

  dashboardCards = [

     { title: 'My Policies' },
     
     { title: 'Create Policies' },
    
     { title: 'Details' },
    
      { title: 'Track Claims' },
    
     ];
    
     policies = [
    
     { id: 101, number: '7646', issue: 'Policy renewal issue', createdDate: '2024-03-20', resolvedDate: '2024-03-22' },
    
     { id: 102, number: '6832', issue: 'Claim processing delay', createdDate: '2024-03-21', resolvedDate: null }
    
     ];
    
   
    showSection(section: string) {
    this.activeSection = section;
    }
  
}
