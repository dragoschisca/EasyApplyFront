import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CandidateDto, UpdateCandidateDto } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] pb-12 animate-in fade-in duration-700">
      <!-- Premium Hero Header -->
      <div class="relative h-64 bg-[#0f172a] overflow-hidden mb-[-4rem]">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 z-0"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <!-- Animated Background Elements -->
        <div class="absolute top-[-10%] left-[-5%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>

        <div class="max-w-6xl mx-auto px-6 pt-12 relative z-10">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav class="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4">
                <span class="opacity-60">Dashboard</span>
                <svg class="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </nav>
              <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                My Professional <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Profile</span>
              </h1>
              <p class="text-indigo-100/70 text-lg max-w-xl">
                Refine your digital presence and let top companies discover your unique value.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div *ngIf="isLoading" class="flex flex-col items-center justify-center p-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-indigo-100/20 mt-16">
          <div class="relative w-20 h-20">
            <div class="absolute inset-0 rounded-full border-4 border-indigo-50"></div>
            <div class="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-6 text-gray-500 font-semibold tracking-wide animate-pulse uppercase text-sm">Synchronizing Profile...</p>
        </div>

        <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Sidebar: Profile Overview -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-[2.5rem] shadow-2xl premium-side-shadow border border-white p-2 overflow-hidden sticky top-8">
              <div class="bg-indigo-50/50 rounded-[2rem] p-8 text-center">
                <div class="relative inline-block mb-6">
                  <div class="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1 shadow-xl rotate-3 group hover:rotate-0 transition-transform duration-500">
                    <div class="w-full h-full rounded-[1.25rem] bg-white flex items-center justify-center text-4xl font-black text-indigo-600 overflow-hidden">
                      {{ candidateData?.firstName?.charAt(0) }}{{ candidateData?.lastName?.charAt(0) }}
                    </div>
                  </div>
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                </div>
                
                <h2 class="text-2xl font-black text-gray-900 leading-tight mb-1">{{ candidateData?.fullName }}</h2>
                <p class="text-indigo-600 font-bold text-sm tracking-wide uppercase mb-6">{{ candidateData?.email }}</p>
                
                <div class="flex flex-wrap justify-center gap-2 mb-8">
                  <span class="px-3 py-1 bg-white text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Candidate</span>
                  <span class="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">{{ candidateData?.cvsCount }} Assets</span>
                </div>

                <div class="grid grid-cols-2 gap-3 pb-2">
                  <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 group hover:border-indigo-100 transition-colors">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Applied</p>
                    <p class="text-2xl font-black text-gray-900">{{ candidateData?.applicationsCount }}</p>
                  </div>
                  <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 group hover:border-purple-100 transition-colors">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-purple-400 transition-colors">Success</p>
                    <p class="text-2xl font-black text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div class="px-6 py-6 space-y-4">
                <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50 text-indigo-700 font-bold transition-all group">
                  <span class="flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile Settings
                  </span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold transition-all group">
                  <span class="flex items-center gap-3 text-gray-400">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Manage CVs
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content: Detailed Forms -->
          <div class="lg:col-span-3 space-y-8">
            <div class="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/10 border border-white overflow-hidden p-1">
              <div class="bg-white rounded-[2rem] p-8 md:p-12">
                <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-12">
                  
                  <!-- Section 1: Identity -->
                  <div class="relative">
                    <div class="absolute -left-12 top-0 hidden md:flex flex-col items-center">
                      <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">1</div>
                      <div class="w-px h-full bg-indigo-100 my-2"></div>
                    </div>
                    
                    <h3 class="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                      Identity & Contact
                      <span class="h-1 w-12 bg-indigo-600 rounded-full"></span>
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                        <div class="relative group">
                          <input type="text" formControlName="firstName" placeholder="Alex" 
                            class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                          <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                        <div class="relative group">
                          <input type="text" formControlName="lastName" placeholder="Smith"
                            class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                        </div>
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Connectivity</label>
                        <div class="relative group">
                          <input type="tel" formControlName="phone" placeholder="+373..."
                            class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                          <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1c-8.284 0-15-6.716-15-15V5z" /></svg>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Operational Base</label>
                        <div class="relative group">
                          <input type="text" formControlName="location" placeholder="Chisinau, MD"
                            class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                          <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section 2: Digital Ecosystem -->
                  <div class="relative">
                    <div class="absolute -left-12 top-0 hidden md:flex flex-col items-center">
                      <div class="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">2</div>
                      <div class="w-px h-full bg-purple-100 my-2"></div>
                    </div>
                    
                    <h3 class="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                      Digital Ecosystem
                      <span class="h-1 w-12 bg-purple-600 rounded-full"></span>
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          LinkedIn Professional
                        </label>
                        <div class="relative group">
                          <input type="url" formControlName="linkedInUrl" placeholder="linkedin.com/in/username"
                            class="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                          <div class="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#0077b5] group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          Forge (GitHub)
                        </label>
                        <div class="relative group">
                          <input type="url" formControlName="gitHubUrl" placeholder="github.com/username"
                            class="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                          <div class="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-900 group-focus-within:bg-gray-900 group-focus-within:text-white transition-all">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          </div>
                        </div>
                      </div>
                      <div class="md:col-span-2 space-y-3">
                        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Personal Nexus (Portfolio)</label>
                        <div class="relative group">
                          <input type="url" formControlName="portfolioUrl" placeholder="https://yourportfolio.dev"
                            class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300">
                          <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section 3: Professional Saga -->
                  <div class="relative">
                    <div class="absolute -left-12 top-0 hidden md:flex flex-col items-center">
                      <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">3</div>
                    </div>
                    
                    <h3 class="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                      Professional Saga
                      <span class="h-1 w-12 bg-blue-600 rounded-full"></span>
                    </h3>
                    
                    <div class="space-y-3">
                      <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">About Your Mission</label>
                      <textarea formControlName="bio" rows="8" 
                        placeholder="Detail your professional achievements, expertise, and what drives you..."
                        class="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900 placeholder:text-gray-300 leading-relaxed"></textarea>
                    </div>
                  </div>

                  <!-- Premium Footer Actions -->
                  <div class="pt-12 flex flex-col sm:flex-row justify-end items-center gap-6">
                    <button type="button" (click)="loadProfile()" 
                      class="text-sm font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors px-4 py-2">
                      Reset Inputs
                    </button>
                    <button type="submit" [disabled]="profileForm.invalid || isSaving" 
                      class="relative group overflow-hidden bg-gray-900 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100">
                      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span class="relative flex items-center gap-3 uppercase tracking-widest text-[13px]">
                        <span *ngIf="isSaving">
                          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                        </span>
                        {{ isSaving ? 'Preserving...' : 'Update Saga' }}
                        <svg *ngIf="!isSaving" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-in { animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    input::placeholder, textarea::placeholder {
      font-weight: 500;
      opacity: 0.5;
    }
    
    .premium-side-shadow {
      box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.3);
    }
  `]
})
export class CandidateProfileComponent implements OnInit {
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    location: [''],
    linkedInUrl: [''],
    gitHubUrl: [''],
    portfolioUrl: [''],
    bio: ['']
  });

  candidateData: CandidateDto | null = null;
  isLoading = true;
  isSaving = false;

  userId: string = '';

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.userId = user.id;
      this.loadProfile();
    }
  }

  loadProfile() {
    this.isLoading = true;
    this.candidateService.getByUserId(this.userId).subscribe({
      next: (data) => {
        this.candidateData = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          location: data.location,
          linkedInUrl: data.linkedInUrl,
          gitHubUrl: data.gitHubUrl,
          portfolioUrl: data.portfolioUrl,
          bio: data.bio
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load profile parameters.');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.userId) {
      this.isSaving = true;
      const dto: UpdateCandidateDto = this.profileForm.value as any;
      
      this.candidateService.update(this.userId, dto).subscribe({
        next: (updated) => {
          this.candidateData = updated;
          this.toastService.success('Profile updated successfully!');
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Failed to update profile.');
          this.isSaving = false;
        }
      });
    }
  }
}
