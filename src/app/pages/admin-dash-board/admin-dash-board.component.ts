import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dash-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dash-board.component.html',
  styleUrls: ['./admin-dash-board.component.css'],
})
export class AdminDashBoardComponent {
  activeSection: string = 'dashboard';
  agents: any[] = [];
  isLoading: boolean = false;
  approvedAgents: Set<string> = new Set();

  dashboardCards = [
    { title: 'Total Customers', value: 3500, bgColor: 'bg-primary' },
    { title: 'Total Policies', value: 2900, bgColor: 'bg-primary' },
    { title: 'Total Claims', value: 1500, bgColor: 'bg-primary' },
    { title: 'Resolved Policies', value: 1200, bgColor: 'bg-success' },
    { title: 'Pending Policies', value: 300, bgColor: 'bg-danger' },
  ];

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  showSection(section: string): void {
    this.activeSection = section;
    if (section === 'agent-info') {
      this.loadAgents();
    }
  }

  loadAgents(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/admin/agents')
      .subscribe({
        next: (data: any[]) => {
          this.agents = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading agents:', err);
          this.isLoading = false;
        }
      });
  }

  approveAgent(agentId: string): void {
    this.approvedAgents.add(agentId);
  }

  deleteAgent(agentId: string): void {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.http.delete(`http://localhost:3000/api/admin/agents/${agentId}`)
        .subscribe({
          next: () => {
            this.agents = this.agents.filter(a => a._id !== agentId);
            this.approvedAgents.delete(agentId);
          },
          error: (err: any) => {
            console.error('Error deleting agent:', err);
          }
        });
    }
  }

  private renderChart(): void {
    const canvas = document.getElementById('policyStatusChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Resolved', 'Pending', 'New Policies', 'Claims'],
        datasets: [{
          data: [1200, 300, 1400, 500],
          backgroundColor: ['green', 'red', 'blue', 'orange'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}