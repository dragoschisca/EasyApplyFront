import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-screen bg-orange-50/30 overflow-hidden font-sans text-gray-900">
      
      <!-- Animated Background Blobs -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-multiply">
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div class="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div class="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>

      <!-- Navigation Bar (Glass) -->
      <nav class="relative z-10 w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto mt-4 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm">
        <div class="flex items-center gap-2">
           <svg class="h-8 w-8 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           <span class="text-2xl font-black tracking-tight text-gray-800">HireWave</span>
        </div>
        <div class="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <a href="#" class="hover:text-rose-500 transition-colors">Find Jobs</a>
          <a href="#" class="hover:text-rose-500 transition-colors">Companies</a>
          <a href="#" class="hover:text-rose-500 transition-colors">Resources</a>
        </div>
        <div class="flex items-center gap-4">
          <ng-container *ngIf="!currentUser">
            <button routerLink="/login" class="font-bold text-gray-700 hover:text-rose-500 transition-colors px-4 py-2">Login</button>
            <button routerLink="/register" class="bg-gradient-to-r from-rose-400 to-orange-400 text-white font-bold py-2.5 px-6 rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-rose-200 border border-white/20">Get Started</button>
          </ng-container>
          <ng-container *ngIf="currentUser">
            <button routerLink="/dashboard" class="bg-white/60 backdrop-blur-md text-gray-800 font-bold py-2.5 px-6 rounded-full hover:bg-white/80 transition-all border border-white/60 shadow-sm">Dashboard</button>
          </ng-container>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center">
        <!-- Hero Section -->
        <div class="text-center max-w-4xl mb-16 animate-fade-in-up">
          <h1 class="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Find Your Dream Job. <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Effortlessly.</span>
          </h1>
          <p class="text-xl sm:text-2xl text-gray-600 font-medium mb-10 max-w-2xl mx-auto">
            Connect with top companies hiring now across all industries and roles. Experience a smoother, faster apply process.
          </p>

          <!-- Massive Search Bar (Glass) -->
          <div class="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full p-2 flex flex-col md:flex-row items-center gap-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-shadow duration-500">
            <div class="flex-1 flex items-center px-6 py-3 w-full md:w-auto">
              <svg class="h-6 w-6 text-gray-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Job Title, Skills, or Keyword" class="w-full bg-transparent border-none text-gray-800 focus:outline-none focus:ring-0 font-medium text-lg placeholder-gray-400" />
            </div>
            <div class="w-px h-10 bg-gray-300 hidden md:block"></div>
            <div class="flex-1 flex items-center px-6 py-3 w-full md:w-auto">
              <svg class="h-6 w-6 text-gray-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input type="text" placeholder="Location or Remote" class="w-full bg-transparent border-none text-gray-800 focus:outline-none focus:ring-0 font-medium text-lg placeholder-gray-400" />
            </div>
            <button routerLink="/jobs" class="w-full md:w-auto bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-lg py-4 px-10 rounded-[2rem] hover:scale-105 hover:shadow-lg transition-all shrink-0">
              Search Jobs
            </button>
          </div>
        </div>

        <!-- Featured Jobs Slider / Cards (Glass) -->
        <div class="w-full text-left mb-10 mt-12 animate-fade-in-up animation-delay-200">
           <div class="flex justify-between items-end mb-8">
             <h2 class="text-3xl font-bold tracking-tight text-gray-800">Featured Opportunities</h2>
             <a routerLink="/jobs" class="font-bold text-rose-500 hover:text-rose-600">View All &rarr;</a>
           </div>

           <!-- Glass Card Grid -->
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Card 1 -->
              <div class="group bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl group-hover:bg-rose-300/50 transition-colors"></div>
                <div class="flex items-center gap-4 mb-6 relative">
                   <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-2xl font-black text-rose-500">Z</div>
                   <div>
                     <div class="text-lg font-bold text-gray-900 leading-tight">UX Designer</div>
                     <div class="text-sm font-medium text-gray-500">Zenith Creative</div>
                   </div>
                </div>
                <div class="flex gap-4 mb-8">
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</div>
                    <div class="font-semibold text-gray-800">Remote</div>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Salary</div>
                    <div class="font-semibold text-gray-800">$90,000</div>
                  </div>
                </div>
                <button class="w-full bg-white/60 border border-white/80 hover:bg-white text-gray-900 font-bold py-3 rounded-xl transition-colors backdrop-blur-sm shadow-sm relative">View Details</button>
              </div>

              <!-- Card 2 -->
              <div class="group bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl group-hover:bg-orange-300/50 transition-colors"></div>
                <div class="flex items-center gap-4 mb-6 relative">
                   <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm text-xl font-black text-white">N</div>
                   <div>
                     <div class="text-lg font-bold text-gray-900 leading-tight">Frontend Eng.</div>
                     <div class="text-sm font-medium text-gray-500">Nova Corp</div>
                   </div>
                </div>
                <div class="flex gap-4 mb-8">
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</div>
                    <div class="font-semibold text-gray-800">Chisinau</div>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</div>
                    <div class="font-semibold text-gray-800">Hybrid</div>
                  </div>
                </div>
                <button class="w-full bg-white/60 border border-white/80 hover:bg-white text-gray-900 font-bold py-3 rounded-xl transition-colors backdrop-blur-sm shadow-sm relative">View Details</button>
              </div>

              <!-- Card 3 -->
              <div class="group bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden hidden md:block">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-pink-200/50 rounded-full blur-2xl group-hover:bg-pink-300/50 transition-colors"></div>
                <div class="flex items-center gap-4 mb-6 relative">
                   <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-sm text-xl font-black text-white">E</div>
                   <div>
                     <div class="text-lg font-bold text-gray-900 leading-tight">Product Mgr</div>
                     <div class="text-sm font-medium text-gray-500">EcoTech</div>
                   </div>
                </div>
                <div class="flex gap-4 mb-8">
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</div>
                    <div class="font-semibold text-gray-800">Remote</div>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Salary</div>
                    <div class="font-semibold text-gray-800">$110,000</div>
                  </div>
                </div>
                <button class="w-full bg-white/60 border border-white/80 hover:bg-white text-gray-900 font-bold py-3 rounded-xl transition-colors backdrop-blur-sm shadow-sm relative">View Details</button>
              </div>

              <!-- Card 4 -->
              <div class="group bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden hidden lg:block">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-200/50 rounded-full blur-2xl group-hover:bg-blue-300/50 transition-colors"></div>
                <div class="flex items-center gap-4 mb-6 relative">
                   <div class="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-sm text-xl font-black text-white">S</div>
                   <div>
                     <div class="text-lg font-bold text-gray-900 leading-tight">Data Analyst</div>
                     <div class="text-sm font-medium text-gray-500">Statisfy</div>
                   </div>
                </div>
                <div class="flex gap-4 mb-8">
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</div>
                    <div class="font-semibold text-gray-800">London</div>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</div>
                    <div class="font-semibold text-gray-800">On-site</div>
                  </div>
                </div>
                <button class="w-full bg-white/60 border border-white/80 hover:bg-white text-gray-900 font-bold py-3 rounded-xl transition-colors backdrop-blur-sm shadow-sm relative">View Details</button>
              </div>
           </div>
        </div>

        <!-- Popular Categories Pill Buttons -->
        <div class="w-full text-center mt-12 mb-16 animate-fade-in-up animation-delay-400">
          <p class="text-gray-500 font-bold uppercase tracking-widest text-sm mb-6">Popular Categories</p>
          <div class="flex flex-wrap justify-center gap-4">
             <div class="bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer font-bold text-gray-700 flex items-center gap-2">
               <span class="w-3 h-3 rounded-full bg-rose-400"></span> Technology
             </div>
             <div class="bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer font-bold text-gray-700 flex items-center gap-2">
               <span class="w-3 h-3 rounded-full bg-orange-400"></span> Design
             </div>
             <div class="bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer font-bold text-gray-700 flex items-center gap-2">
               <span class="w-3 h-3 rounded-full bg-pink-400"></span> Marketing
             </div>
             <div class="bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer font-bold text-gray-700 flex items-center gap-2">
               <span class="w-3 h-3 rounded-full bg-amber-400"></span> Management
             </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    .animation-delay-200 { animation-delay: 200ms; }
    .animation-delay-400 { animation-delay: 400ms; }
    .animation-delay-2000 { animation-delay: 2000ms; }
    .animation-delay-4000 { animation-delay: 4000ms; }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }
  `]
})
export class WelcomeComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser();
}
