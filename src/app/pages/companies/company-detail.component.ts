import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobDto } from '../../models/job.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CompanyDto {
  id: string;
  companyName: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  location?: string;
}

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-10 font-sans">
      <div *ngIf="isLoading" class="flex flex-col justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="!isLoading && company" class="space-y-12">
        
        <!-- Company Header Hero -->
        <div class="bg-white rounded-[32px] p-8 sm:p-12 shadow-xl shadow-indigo-500/5 border border-gray-100 relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
            <!-- Logo -->
            <div class="w-32 h-32 bg-indigo-600 rounded-[28px] shadow-2xl shadow-indigo-600/20 flex items-center justify-center text-white text-5xl font-black shrink-0 relative group">
              {{ company.companyName.charAt(0) }}
              <div class="absolute -inset-2 bg-indigo-600/20 rounded-[34px] scale-0 group-hover:scale-100 transition-transform duration-500 -z-10"></div>
            </div>

            <div class="flex-1 text-center md:text-left">
              <div class="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {{ company.industry || 'Leading Enterprise' }}
                </span>
                <span class="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Verified Employer
                </span>
              </div>
              
              <h1 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                {{ company.companyName }}
              </h1>
              
              <div class="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium">
                <p class="flex items-center">
                  <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {{ company.location || 'Global Presence' }}
                </p>
                <a [href]="company.website" target="_blank" class="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 115.656 5.656l-1.102 1.101" /></svg>
                  Visit Website
                </a>
              </div>
            </div>
            
            <div class="shrink-0 flex flex-col gap-3">
              <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
                 <p class="text-3xl font-black text-indigo-700 leading-none mb-1">{{ jobs.length }}</p>
                 <p class="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Open Positions</p>
              </div>
            </div>
          </div>
          
          <!-- Background Decoration -->
          <div class="absolute right-0 top-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- About Section -->
          <div class="lg:col-span-2 space-y-10">
            <section>
              <h2 class="text-3xl font-black text-gray-900 mb-8 pt-4">Company Overview</h2>
              <div class="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm relative group">
                <div class="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap relative z-10 italic">
                   "{{ company.description || 'This company has not provided a description yet, but they are clearly focused on finding the best talent to join their innovative teams globally.' }}"
                </div>
                <div class="absolute top-6 left-6 text-gray-100 text-8xl font-serif leading-none select-none">"</div>
              </div>
            </section>

            <!-- Jobs List -->
            <section>
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-3xl font-black text-gray-900">Current Openings</h2>
                <div class="h-px flex-1 bg-gray-100 mx-8"></div>
              </div>
              
              <div class="space-y-4">
                <div *ngFor="let job of jobs" class="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer" [routerLink]="['/jobs', job.id]">
                  <div class="flex justify-between items-center">
                    <div class="flex-1 min-w-0">
                       <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 truncate">{{ job.title }}</h3>
                       <div class="flex gap-4 text-sm text-gray-500">
                         <span class="flex items-center">
                           <svg class="w-4 h-4 mr-1.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                           {{ job.employmentType }}
                         </span>
                         <span class="flex items-center">
                           <svg class="w-4 h-4 mr-1.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2"/></svg>
                           {{ job.location }}
                         </span>
                       </div>
                    </div>
                    <div class="shrink-0 ml-4">
                       <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                         <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div *ngIf="jobs.length === 0" class="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                   <p class="text-gray-400 font-bold">No active positions currently.</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Quick Stats Sidebar -->
          <div class="space-y-8">
             <div class="bg-indigo-900 text-white rounded-[40px] p-10 shadow-2xl shadow-indigo-900/40 relative overflow-hidden h-fit">
                <div class="relative z-10 space-y-8">
                   <h3 class="text-xl font-black text-indigo-200 uppercase tracking-widest text-[10px]">Why join us?</h3>
                   <div class="space-y-8">
                      <div class="flex items-start">
                         <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 shrink-0 text-indigo-300">
                           <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2"/></svg>
                         </div>
                         <div>
                            <p class="font-bold text-lg leading-tight mb-1">Fast Growing</p>
                            <p class="text-xs text-indigo-300/80">Be part of an industry leader.</p>
                         </div>
                      </div>
                      <div class="flex items-start">
                         <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 shrink-0 text-indigo-300">
                           <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2"/></svg>
                         </div>
                         <div>
                            <p class="font-bold text-lg leading-tight mb-1">Top Talent</p>
                            <p class="text-xs text-indigo-300/80">Learn from the best in class.</p>
                         </div>
                      </div>
                   </div>
                   
                   <hr class="border-white/10">
                   
                   <p class="text-xs text-indigo-200/50 leading-relaxed italic uppercase font-bold text-center tracking-tighter">
                     EASY APPLY EXPERT NETWORK
                   </p>
                </div>
                
                <!-- Decoration -->
                <div class="absolute -left-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CompanyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private http = inject(HttpClient);
  
  company: CompanyDto | null = null;
  jobs: JobDto[] = [];
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompany(id);
      this.loadJobs(id);
    }
  }

  loadCompany(id: string) {
    this.isLoading = true;
    this.http.get<CompanyDto>(`${environment.apiUrl}/company/${id}`).subscribe({
      next: (company) => {
        this.company = company;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to load company details.');
      }
    });
  }

  loadJobs(companyId: string) {
    this.jobService.getByCompanyId(companyId).subscribe({
      next: (jobs) => this.jobs = jobs,
      error: () => console.error('Failed to load company jobs')
    });
  }
}
