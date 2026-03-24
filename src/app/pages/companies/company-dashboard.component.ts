import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { CompanyService } from '../../services/company.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../core/services/auth.service';
import { JobDto } from '../../models/job.model';
import { ApplicationDto } from '../../models/application.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">

      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div class="relative">
          <p class="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Employer Dashboard 🏢</p>
          <h2 class="text-3xl font-black mb-2">{{ companyName || 'Your Company' }}</h2>
          <p class="text-slate-400 text-sm max-w-lg">Manage your job postings, track applicants, and grow your team.</p>
          <div class="flex flex-wrap gap-3 mt-6">
            <a routerLink="/jobs/create" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-lg">
              + Post a Job
            </a>
            <a routerLink="/company-jobs" class="bg-white/10 border border-white/10 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              View My Listings
            </a>
            <a routerLink="/applicants" class="bg-white/10 border border-white/10 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              Review Applicants
            </a>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <p class="text-3xl font-black text-gray-900">{{ activeJobsCount }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">Active Job Posts</p>
          <a routerLink="/company-jobs" class="text-xs text-indigo-600 font-semibold mt-3 inline-block hover:underline">Manage →</a>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p class="text-3xl font-black text-gray-900">{{ pendingCount }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">Pending Applicants</p>
          <a routerLink="/applicants" class="text-xs text-amber-600 font-semibold mt-3 inline-block hover:underline">Review →</a>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <p class="text-3xl font-black text-gray-900">{{ totalViews }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">Total Job Views</p>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <!-- Recent Applicants -->
        <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              Recent Applicants
            </h3>
            <a routerLink="/applicants" class="text-xs font-semibold text-indigo-600 hover:underline">See all</a>
          </div>
          <div class="divide-y divide-gray-50">
            <div *ngIf="recentApplicants.length === 0" class="p-8 text-center text-gray-400 text-sm font-medium">
              No applicants yet — <a routerLink="/jobs/create" class="text-indigo-600 hover:underline">post a job</a> to start receiving applications.
            </div>
            <div *ngFor="let app of recentApplicants" class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer" routerLink="/applicants">
              <div class="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0 uppercase">
                {{ (app.candidateName || 'U').charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 text-sm">{{ app.candidateName || 'Unknown Applicant' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Applied for <span class="font-semibold text-gray-700">{{ app.jobTitle }}</span> · {{ app.createdAt | date:'MMM d' }}</p>
              </div>
              <span class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg flex-shrink-0"
                    [ngClass]="{
                      'bg-yellow-50 text-yellow-600': app.status === 'Pending',
                      'bg-blue-50 text-blue-600': app.status === 'Interviewing',
                      'bg-red-50 text-red-500': app.status === 'Rejected',
                      'bg-green-50 text-green-600': app.status === 'Accepted'
                    }">{{ app.status }}</span>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="lg:col-span-2 flex flex-col gap-5">

          <!-- My Active Jobs -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-50">
              <h3 class="font-bold text-gray-900">Active Listings</h3>
              <a routerLink="/company-jobs" class="text-xs font-semibold text-indigo-600 hover:underline">Manage</a>
            </div>
            <div class="divide-y divide-gray-50">
              <div *ngFor="let job of activeJobs.slice(0, 4)" class="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-gray-800 truncate">{{ job.title }}</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">{{ job.viewsCount }} views · {{ job.applicationsCount }} applications</p>
                </div>
                <a [routerLink]="['/jobs/edit', job.id]" class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </a>
              </div>
              <div *ngIf="activeJobs.length === 0" class="p-6 text-center text-gray-400 text-sm">
                No active listings. <a routerLink="/jobs/create" class="text-indigo-600 hover:underline font-semibold">Post one →</a>
              </div>
            </div>
          </div>

          <!-- Upgrade Banner -->
          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div class="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
            <p class="font-bold text-lg relative">Go Premium</p>
            <p class="text-indigo-100 text-xs mt-1 mb-4 relative">Get 5× more applicants & featured listings.</p>
            <button class="bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors relative">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyDashboardComponent implements OnInit {
  private jobService = inject(JobService);
  private companyService = inject(CompanyService);
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);

  companyName = '';
  activeJobsCount = 0;
  pendingCount = 0;
  totalViews = 0;
  activeJobs: JobDto[] = [];
  recentApplicants: ApplicationDto[] = [];

  ngOnInit() { this.fetchData(); }

  fetchData() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.companyService.getByUserId(userId).pipe(
      switchMap(company => {
        this.companyName = company.companyName || '';
        return this.jobService.getByCompanyId(company.id, false);
      })
    ).subscribe({
      next: (jobs) => {
        this.activeJobs = jobs.filter(j => j.isActive);
        this.activeJobsCount = this.activeJobs.length;
        this.totalViews = jobs.reduce((s, j) => s + (j.viewsCount || 0), 0);

        jobs.forEach(job => {
          this.applicationService.getByJobId(job.id).subscribe({
            next: (apps) => {
              const pending = apps.filter(a => a.status === 'Pending');
              this.pendingCount += pending.length;
              this.recentApplicants.push(...apps);
              this.recentApplicants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              if (this.recentApplicants.length > 5) this.recentApplicants = this.recentApplicants.slice(0, 5);
            }
          });
        });
      }
    });
  }
}
