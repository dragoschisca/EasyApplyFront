import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { candidateGuard } from './core/guards/candidate.guard';
import { companyGuard } from './core/guards/company.guard';

import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { WelcomeComponent } from './pages/welcome/welcome.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      
      // Candidate Routes
      { 
        path: 'profile', 
        canActivate: [candidateGuard],
        loadComponent: () => import('./pages/candidates/candidate-profile.component').then(m => m.CandidateProfileComponent) 
      },
      { 
        path: 'cvs', 
        canActivate: [candidateGuard],
        loadComponent: () => import('./pages/candidates/cv-management.component').then(m => m.CvManagementComponent) 
      },
      { 
        path: 'applications', 
        canActivate: [candidateGuard],
        loadComponent: () => import('./pages/candidates/applied-jobs.component').then(m => m.AppliedJobsComponent) 
      },
      { 
        path: 'saved-jobs', 
        canActivate: [candidateGuard],
        loadComponent: () => import('./pages/candidates/saved-jobs.component').then(m => m.SavedJobsComponent) 
      },

      // Company Routes
      { 
        path: 'company-profile', 
        canActivate: [companyGuard],
        loadComponent: () => import('./pages/companies/company-profile.component').then(m => m.CompanyProfileComponent) 
      },
      { 
        path: 'company-jobs', 
        canActivate: [companyGuard],
        loadComponent: () => import('./pages/companies/company-jobs.component').then(m => m.CompanyJobsComponent) 
      },
      { 
        path: 'applicants', 
        canActivate: [companyGuard],
        loadComponent: () => import('./pages/companies/job-applicants.component').then(m => m.JobApplicantsComponent) 
      },
      { 
        path: 'discover-talent', 
        canActivate: [companyGuard],
        loadComponent: () => import('./pages/companies/discover-talent.component').then(m => m.DiscoverTalentComponent) 
      },
      { 
        path: 'applicants/:id/analysis', 
        canActivate: [companyGuard],
        loadComponent: () => import('./pages/companies/applicant-analysis.component').then(m => m.ApplicantAnalysisComponent) 
      },

      // Shared / Entity Routes
      { 
        path: 'jobs',
        children: [
          { path: '', loadComponent: () => import('./pages/jobs/job-list.component').then(m => m.JobListComponent) },
          { path: 'explore', loadComponent: () => import('./pages/jobs/explore-jobs.component').then(m => m.ExploreJobsComponent) },
          { path: 'create', canActivate: [companyGuard], loadComponent: () => import('./pages/companies/create-job.component').then(m => m.CreateJobComponent) },
          { path: 'edit/:id', canActivate: [companyGuard], loadComponent: () => import('./pages/companies/create-job.component').then(m => m.CreateJobComponent) },
          { path: ':id', loadComponent: () => import('./pages/jobs/job-detail.component').then(m => m.JobDetailComponent) }
        ]
      },
      {
        path: 'companies',
        children: [
          { path: ':id', loadComponent: () => import('./pages/companies/company-detail.component').then(m => m.CompanyDetailComponent) }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
