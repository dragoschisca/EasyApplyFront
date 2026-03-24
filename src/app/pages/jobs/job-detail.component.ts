import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobDto } from '../../models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { JobApplyModalComponent } from './job-apply-modal.component';
import { SavedJobService } from '../../services/saved-job.service';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, JobApplyModalComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10 font-sans">
      <div *ngIf="isLoading" class="flex flex-col justify-center items-center py-20 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="text-gray-500 font-medium">Loading job details...</p>
      </div>

      <div *ngIf="!isLoading && job" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <!-- Back Button -->
        <a routerLink="/jobs" class="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors group">
          <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all jobs
        </a>

        <!-- Main Card -->
        <div class="bg-white rounded-3xl shadow-xl shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          
          <!-- Header Hero Section -->
          <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 p-8 sm:p-12 text-white">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-3 py-1 bg-white/10 backdrop-blur-md text-indigo-100 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                    {{ job.category || 'Job Opportunity' }}
                  </span>
                  <span *ngIf="job.locationType === 0" class="px-3 py-1 bg-green-500/20 backdrop-blur-md text-green-200 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                    Remote
                  </span>
                  <span *ngIf="job.locationType === 2" class="px-3 py-1 bg-amber-500/20 backdrop-blur-md text-amber-200 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20">
                    Hybrid
                  </span>
                </div>
                
                <h1 class="text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">
                  {{ job.title }}
                </h1>
                
                <div class="flex flex-wrap items-center gap-y-3 gap-x-6 text-indigo-100">
                  <div class="flex items-center group cursor-pointer" [routerLink]="['/companies', job.companyId]">
                    <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-3 font-bold text-white transition-all group-hover:bg-white/20">
                      {{ job.companyName.charAt(0) || 'C' }}
                    </div>
                    <div>
                      <p class="text-xs text-indigo-300 font-medium">Company</p>
                      <p class="font-bold border-b border-transparent group-hover:border-indigo-300 transition-all">{{ job.companyName }}</p>
                    </div>
                  </div>
                  
                  <div class="h-10 w-px bg-white/10 hidden md:block"></div>
                  
                  <div>
                    <p class="text-xs text-indigo-300 font-medium capitalize">Location & Address</p>
                    <p class="font-bold flex items-center">
                      <svg class="h-4 w-4 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ job.location }} 
                      <span *ngIf="job.address" class="text-indigo-300 font-normal ml-2">— {{ job.address }}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-4">
                <div class="flex gap-3">
                  <button (click)="onApply()" class="flex-1 bg-white text-indigo-900 hover:bg-black hover:text-white font-black py-4 px-6 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 text-lg">
                    Apply Now
                  </button>
                  <button (click)="onToggleSave()" 
                          class="w-16 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-95" 
                          [title]="isSaved ? 'Remove from Saved' : 'Save Job'">
                    <svg class="w-6 h-6" [class.fill-pink-500]="isSaved" [class.text-pink-500]="isSaved" [class.text-white]="!isSaved" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <p class="text-[11px] text-indigo-300 text-center font-semibold uppercase tracking-wider">
                  Posted {{ job.createdAt | date:'longDate' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <!-- Left: Description and Requirements -->
            <div class="lg:col-span-2 space-y-12">
              <section>
                <h2 class="text-2xl font-black text-gray-900 mb-6 flex items-center">
                  <span class="w-2 h-8 bg-indigo-600 rounded-full mr-4"></span>
                  About the Role
                </h2>
                <div class="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {{ job.description }}
                </div>
              </section>

              <section>
                <h2 class="text-2xl font-black text-gray-900 mb-6 flex items-center">
                   <span class="w-2 h-8 bg-purple-500 rounded-full mr-4"></span>
                   Requirements
                </h2>
                <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <div class="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {{ job.requirements }}
                  </div>
                </div>
              </section>

              <!-- Premium Matching Insight (Personalization) -->
              <section *ngIf="isCandidate && candidateProfile" class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all"></div>
                <div class="relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/5">
                  <div class="flex flex-col md:flex-row items-center gap-10">
                    <!-- Gauge -->
                    <div class="relative w-32 h-32 flex-shrink-0">
                      <svg class="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" class="text-indigo-50"/>
                        <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="10" fill="transparent" 
                          [attr.stroke-dasharray]="364.4" 
                          [attr.stroke-dashoffset]="364.4 * (1 - matchScore / 100)"
                          stroke-linecap="round"
                          class="text-indigo-600 transition-all duration-1000 ease-out"/>
                      </svg>
                      <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-3xl font-black text-gray-900 leading-none">{{ matchScore }}%</span>
                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Match</span>
                      </div>
                    </div>
                    
                    <div class="flex-1">
                      <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight">Why this is your Next Move</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div *ngFor="let reason of matchReasons" class="flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-sm">
                          <div class="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span class="text-sm font-bold text-gray-700 leading-snug">{{ reason }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right: Stats and Quick Info -->
            <div class="space-y-8">
              <div class="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100/50">
                <h3 class="text-lg font-bold text-gray-900 mb-6">Job Overview</h3>
                
                <div class="space-y-6">
                  <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Salary Range</p>
                    <p class="text-xl font-black text-indigo-700">
                       {{ job.salaryMin ? (job.salaryMin | number:'1.0-0') + ' - ' + (job.salaryMax | number:'1.0-0') + ' MDL' : 'Negotiable' }}
                    </p>
                  </div>

                  <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Employment Type</p>
                    <p class="text-lg font-bold text-gray-900">{{ job.employmentType }}</p>
                  </div>

                  <div>
                     <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Popularity</p>
                     <p class="text-lg font-bold text-gray-900 flex items-center">
                       <svg class="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                       {{ job.viewsCount || 0 }} views
                     </p>
                  </div>
                </div>
                
                <hr class="my-8 border-indigo-100">
                
                <button (click)="onApply()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 mb-3">
                  Apply Today
                </button>
                <button (click)="onToggleSave()" class="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" [class.fill-pink-500]="isSaved" [class.text-pink-500]="isSaved" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ isSaved ? 'Saved' : 'Save for Later' }}
                </button>
              </div>

              <!-- Company Quick View -->
              <div class="bg-gray-900 text-white rounded-3xl p-8 relative overflow-hidden group cursor-pointer" [routerLink]="['/companies', job.companyId]">
                 <div class="relative z-10">
                   <h4 class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">About Employer</h4>
                   <h3 class="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{{ job.companyName }}</h3>
                   <p class="text-sm text-gray-400 mb-6">Click to view company profile and more openings.</p>
                   <span class="text-indigo-400 font-bold text-sm flex items-center">
                     View details
                     <svg class="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                   </span>
                 </div>
                 <!-- Decoration -->
                 <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-job-apply-modal
        [isOpen]="isApplyModalOpen"
        [jobId]="job?.id || ''"
        [jobTitle]="job?.title || ''"
        (closeEvent)="isApplyModalOpen = false"
        (applySuccessEvent)="onApplySuccess()"
      ></app-job-apply-modal>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-in { animation: animate-in 0.7s ease-out; }
    @keyframes animate-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private savedJobService = inject(SavedJobService);
  private candidateService = inject(CandidateService);
  
  job: JobDto | null = null;
  isLoading = true;
  isSaved = false;
  savedJobId: string | null = null;
  candidateId: string | null = null;

  isApplyModalOpen = false;

  isCandidate = false;
  candidateProfile: any = null;
  matchScore = 0;
  matchReasons: string[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
    }
  }

  loadJob(id: string) {
    this.isLoading = true;
    this.jobService.getById(id).subscribe({
      next: (job) => {
        this.job = job;
        this.isLoading = false;
        this.jobService.incrementViewCount(id).subscribe();
        this.checkIfSaved();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load job details.');
      }
    });
  }

  checkIfSaved() {
    if (!this.authService.isLoggedIn() || this.authService.currentUser()?.role !== 'Candidate') return;
    
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.candidateService.getByUserId(userId).subscribe({
      next: (candidate) => {
        this.candidateId = candidate.id;
        this.candidateProfile = candidate;
        this.isCandidate = true;
        this.calculateMatch();
        
        this.savedJobService.getByCandidateId(candidate.id).subscribe({
          next: (saves) => {
            const existing = saves.find(s => s.jobId === this.job?.id);
            if (existing) {
              this.isSaved = true;
              this.savedJobId = existing.id;
            }
          }
        });
      }
    });
  }

  calculateMatch() {
    if (!this.job || !this.candidateProfile) return;

    let score = 65; // Base score
    this.matchReasons = [];

    // Analyze Skills & Category
    if (this.job.category && this.candidateProfile.skills?.includes(this.job.category)) {
      score += 15;
      this.matchReasons.push(`Matches your focus in ${this.job.category}`);
    } else {
      this.matchReasons.push('Aligns with your professional background');
    }

    // Analyze Location
    if (this.job.location === this.candidateProfile.location) {
      score += 10;
      this.matchReasons.push(`Located in ${this.job.location}`);
    }

    // Analyze Salary
    if (this.job.salaryMin && this.job.salaryMin >= 15000) {
      score += 5;
      this.matchReasons.push('Competitive compensation package');
    }

    // Work Mode
    if (this.job.locationType === 0) {
      this.matchReasons.push('Offers full remote flexibility');
    } else if (this.job.locationType === 2) {
      this.matchReasons.push('Flexible hybrid work model');
    }

    this.matchScore = Math.min(score, 98);
  }

  onToggleSave() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Please log in to save jobs.');
      return;
    }

    if (this.authService.currentUser()?.role !== 'Candidate') {
      this.toastService.error('Only candidates can save jobs.');
      return;
    }

    if (this.isSaved && this.savedJobId) {
      this.savedJobService.removeJob(this.savedJobId).subscribe({
        next: () => {
          this.isSaved = false;
          this.savedJobId = null;
          this.toastService.success('Job removed from saved.');
        }
      });
    } else if (this.candidateId && this.job) {
      this.savedJobService.saveJob(this.candidateId, this.job.id).subscribe({
        next: (res) => {
          this.isSaved = true;
          this.savedJobId = res.id;
          this.toastService.success('Job saved!');
        }
      });
    } else {
      // Handle edge case where candidateId might not be loaded yet
      const userId = this.authService.currentUser()?.id;
      if (userId) {
        this.candidateService.getByUserId(userId).subscribe(candidate => {
          this.candidateId = candidate.id;
          this.onToggleSave();
        });
      }
    }
  }

  onApply() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Please log in as a candidate to apply for this job.');
      return;
    }
    
    if (this.authService.currentUser()?.role !== 'Candidate') {
      this.toastService.error('Only candidates can apply to jobs.');
      return;
    }

    this.isApplyModalOpen = true;
  }

  onApplySuccess() {
    // Optionally update UI state (e.g. change "Apply Now" to "Applied")
  }
}
