import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-dash-board',
  imports: [CommonModule],
  templateUrl: './admin-dash-board.component.html',
  styleUrls: ['./admin-dash-board.component.css'],
})
export class AdminDashBoardComponent {
  activeSection: string = 'dashboard';

  dashboardCards = [
    { title: 'Total Customers', value: 3500, bgColor: 'bg-primary' },
    { title: 'Total Policies', value: 2900, bgColor: 'bg-primary' },
    { title: 'Total Claims', value: 1500, bgColor: 'bg-primary' },
    { title: 'Resolved Policies', value: 1200, bgColor: 'bg-success' },
    { title: 'Pending Policies', value: 300, bgColor: 'bg-danger' },
  ];

  constructor() {
    // Register all necessary Chart.js components
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  showSection(section: string) {
    this.activeSection = section;
  }

  private renderChart() {
    const canvas = document.getElementById('policyStatusChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas element with id "policyStatusChart" not found.');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for the canvas.');
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Resolved', 'Pending', 'New Policies', 'Claims'],
        datasets: [
          {
            data: [1200, 300, 1400, 500],
            backgroundColor: ['green', 'red', 'blue', 'orange'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}