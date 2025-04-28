import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-dash-board',
  imports: [CommonModule],
  templateUrl: './agent-dash-board.component.html',
  styleUrl: './agent-dash-board.component.css'
})
export class AgentDashBoardComponent {
  activeSection: string= 'dashboard';

  dashboardCards = [

        { title: 'Manage Policyholders' },
     
        { title: 'Process Claims' },
    
        { title: 'Handle Insurance Policies' },
    
        { title: 'Track Commissions & Sales' },
    
       
    
      ];
    
    
    
      tickets = [
    
        { id: 101, userId: 'U001', issue: 'Policy renewal issue', createdDate: '2024-03-20', resolvedDate: '2024-03-22' },
    
        { id: 102, userId: 'U002', issue: 'Claim processing delay', createdDate: '2024-03-21', resolvedDate: null }
    
      ];
    
    
    
      pendingTickets = [
    
        { id: 103, userId: 'U003', issue: 'Incorrect policy details', createdDate: '2024-03-22' },
    
        { id: 104, userId: 'U004', issue: 'Claim not updated', createdDate: '2024-03-23' }
    
      ];
    
    
    
      acceptTicket(ticketId: number) {
    
        this.pendingTickets = this.pendingTickets.filter(ticket => ticket.id !== ticketId);
    
        alert(`Ticket ${ticketId} has been accepted`);
    
      }
    
    
    
      declineTicket(ticketId: number) {
    
        this.pendingTickets = this.pendingTickets.filter(ticket => ticket.id !== ticketId);
    
        alert(`Ticket ${ticketId} has been declined`);
    
      }

  showSection(section: string) {
    this.activeSection = section;
  }
  
}
