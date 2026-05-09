import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';
import { CompanyStatistics } from '../../models/company.model';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-company-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './company-analytics-dashboard.component.html',
  styleUrl: './company-analytics-dashboard.component.css'
})
export class CompanyAnalyticsDashboardComponent implements OnInit {
  public stats = signal<CompanyStatistics | null>(null);
  public isLoading = signal<boolean>(true);
  public error = signal<string | null>(null);

  // Line Chart Config
  public lineChartData: ChartData<'line'> = {
    datasets: [],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // Bar Chart Config
  public barChartData: ChartData<'bar'> = {
    datasets: [],
    labels: []
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    }
  };

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    const user = this.authService.currentUser();
    if (!user || !user.companyId) {
      this.error.set('Company profile not found.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.analyticsService.getCompanyAnalytics(user.companyId).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.prepareCharts(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load analytics data.');
        this.isLoading.set(false);
      }
    });
  }

  private prepareCharts(data: CompanyStatistics): void {
    // Prepare Line Chart
    this.lineChartData = {
      labels: data.weeklyProfileViews.map(v => new Date(v.date).toLocaleDateString(undefined, { weekday: 'short' })),
      datasets: [
        {
          data: data.weeklyProfileViews.map(v => v.views),
          label: 'Profile Views',
          fill: true,
          tension: 0.4,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1'
        }
      ]
    };

    // Prepare Bar Chart
    this.barChartData = {
      labels: data.topJobs.map(j => j.title),
      datasets: [
        {
          data: data.topJobs.map(j => j.viewsCount),
          label: 'Views',
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          data: data.topJobs.map(j => j.applicationsCount),
          label: 'Applicants',
          backgroundColor: '#10b981',
          borderRadius: 6
        }
      ]
    };
  }
}
