import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CandidateDashboardComponent } from '../candidates/candidate-dashboard.component';
import { CompanyDashboardComponent } from '../companies/company-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CandidateDashboardComponent, CompanyDashboardComponent],
  template: `
    <ng-container *ngIf="isCandidate()">
      <app-candidate-dashboard></app-candidate-dashboard>
    </ng-container>
    
    <ng-container *ngIf="isCompany()">
      <app-company-dashboard></app-company-dashboard>
    </ng-container>

    <!-- Fallback if Admin or Error -->
    <div *ngIf="!isCandidate() && !isCompany()" class="flex justify-center items-center h-64 text-gray-500">
       Invalid Role or Session Expired.
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);

  isCandidate(): boolean {
    return this.authService.currentUser()?.role === 'Candidate';
  }

  isCompany(): boolean {
    return this.authService.currentUser()?.role === 'Company';
  }
}
