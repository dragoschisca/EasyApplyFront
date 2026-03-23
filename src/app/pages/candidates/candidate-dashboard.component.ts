import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';
import { SavedJobService } from '../../services/saved-job.service';
import { AuthService } from '../../core/services/auth.service';
import { CandidateService } from '../../services/candidate.service';
import { CvService } from '../../services/cv.service';
import { ToastService } from '../../core/services/toast.service';
import { ApplicationDto } from '../../models/application.model';
import { JobDto } from '../../models/job.model';
import { CandidateDto } from '../../models/candidate.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">

      <!-- Welcome -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div class="relative">
          <p class="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Welcome back 👋</p>
          <h2 class="text-3xl font-black mb-2">Your Job Dashboard</h2>
          <p class="text-indigo-100 text-sm max-w-md">Track your applications, discover new jobs, and manage your CV all in one place.</p>
          <div class="flex gap-3 mt-6">
            <a routerLink="/jobs" class="bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
              Browse Jobs
            </a>
            <a routerLink="/cvs" class="bg-white/10 border border-white/20 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              Manage CVs
            </a>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-gray-900">{{ applicationsCount }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">Total Applications</p>
          <a routerLink="/applications" class="text-xs text-indigo-600 font-semibold mt-3 inline-block hover:underline">View all →</a>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-pink-50 group-hover:bg-pink-100 transition-colors flex items-center justify-center">
              <svg class="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-gray-900">{{ savedCount }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">Saved Jobs</p>
          <a routerLink="/saved-jobs" class="text-xs text-pink-600 font-semibold mt-3 inline-block hover:underline">View all →</a>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-gray-900">{{ activeApplicationsCount }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">Active / In Review</p>
        </div>
      </div>

      <!-- Quick CV Upload Row -->
      <div class="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4 text-center md:text-left">
          <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Quick CV Upload</h3>
            <p class="text-xs text-gray-500 font-medium">Add a new resume to your profile for faster testing.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input type="file" #fileInput (change)="onFileSelected($event)" accept=".pdf,.doc,.docx" class="hidden">
          <button (click)="fileInput.click()" 
                  class="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors shadow-sm truncate max-w-[200px]">
            {{ selectedFile ? selectedFile.name : 'Select File...' }}
          </button>
          <button (click)="uploadCv()" [disabled]="!selectedFile || isUploadingCv"
                  class="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-50">
            <span *ngIf="isUploadingCv" class="animate-spin inline-block mr-1">...</span>
            {{ isUploadingCv ? 'Uploading' : 'Upload CV' }}
          </button>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <!-- Recent Applications (wider) -->
        <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 class="font-bold text-gray-900">Recent Applications</h3>
            <a routerLink="/applications" class="text-xs font-semibold text-indigo-600 hover:underline">See all</a>
          </div>
          <div class="divide-y divide-gray-50">
            <div *ngIf="recentApplications.length === 0" class="p-8 text-center text-gray-400">
              <p class="text-sm font-medium">No applications yet.</p>
              <a routerLink="/jobs" class="text-indigo-600 text-xs font-bold hover:underline mt-2 inline-block">Start exploring jobs →</a>
            </div>
            <div *ngFor="let app of recentApplications" class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                {{ (app.companyName || '?').charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 text-sm truncate">{{ app.jobTitle }}</p>
                <p class="text-xs text-gray-500">{{ app.companyName }} • {{ app.createdAt | date:'MMM d' }}</p>
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

        <!-- Recommended Jobs (narrower) -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              For You
            </h3>
            <a routerLink="/jobs" class="text-xs font-semibold text-indigo-600 hover:underline">All jobs</a>
          </div>
          <div class="divide-y divide-gray-50">
            <div *ngFor="let job of recommendedJobs" class="px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer" [routerLink]="['/jobs', job.id]">
              <p class="font-bold text-gray-900 text-sm hover:text-indigo-600 transition-colors">{{ job.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ job.companyName }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">{{ job.employmentType }}</span>
                <span *ngIf="job.location" class="text-[10px] text-gray-400">{{ job.location }}</span>
              </div>
            </div>
            <div *ngIf="recommendedJobs.length === 0" class="p-8 text-center text-gray-400 text-sm">Loading...</div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class CandidateDashboardComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);
  private savedJobService = inject(SavedJobService);
  private authService = inject(AuthService);
  private candidateService = inject(CandidateService);
  private cvService = inject(CvService);
  private toastService = inject(ToastService);

  applicationsCount = 0;
  savedCount = 0;
  activeApplicationsCount = 0;
  recentApplications: ApplicationDto[] = [];
  recommendedJobs: JobDto[] = [];

  isUploadingCv = false;
  selectedFile: File | null = null;
  candidateId = '';

  ngOnInit() { this.fetchData(); }

  fetchData() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.candidateService.getByUserId(userId).pipe(
      switchMap((candidate: CandidateDto) => {
        this.candidateId = candidate.id;
        this.applicationService.getByCandidateId(candidate.id).subscribe({
          next: (apps: ApplicationDto[]) => {
            this.applicationsCount = apps.length;
            this.activeApplicationsCount = apps.filter(a => a.status === 'Pending' || a.status === 'Interviewing').length;
            this.recentApplications = [...apps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
          }
        });
        this.savedJobService.getByCandidateId(candidate.id).subscribe({
          next: (saves: any[]) => this.savedCount = saves.length
        });
        return this.jobService.search(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 5);
      })
    ).subscribe({
      next: (res: any) => this.recommendedJobs = res.jobs
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadCv() {
    if (!this.selectedFile || !this.candidateId) return;

    this.isUploadingCv = true;
    const fileName = this.selectedFile.name.split('.')[0];

    this.cvService.upload(this.candidateId, fileName, this.selectedFile, true).subscribe({
      next: () => {
        this.toastService.success('CV uploaded successfully!');
        this.isUploadingCv = false;
        this.selectedFile = null;
      },
      error: () => {
        this.toastService.error('Failed to upload CV.');
        this.isUploadingCv = false;
      }
    });
  }
}
