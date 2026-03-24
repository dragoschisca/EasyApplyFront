import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans selection:bg-indigo-100 overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 to-teal-50/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <!-- Hero Section -->
      <div class="relative max-w-7xl mx-auto px-6 pt-24 pb-32 sm:pt-32 sm:px-8 lg:pt-40 flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Gen Career Platform
        </div>

        <h1 class="text-6xl sm:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          Find your dream job <br class="hidden sm:block"> 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">faster than ever.</span>
        </h1>

        <p class="max-w-2xl text-xl text-gray-500 font-medium mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          EasyApply connects top talent with innovative companies in Moldova. <br class="hidden sm:block">
          One profile, endless opportunities, instant applications.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <button routerLink="/jobs" class="bg-gray-900 text-white font-black py-5 px-10 rounded-2xl hover:bg-black hover:-translate-y-1 transition-all shadow-2xl shadow-gray-200 active:scale-95 text-lg">
            Explore Openings
          </button>
          <button *ngIf="!currentUser" routerLink="/register" class="bg-white text-gray-900 border-2 border-gray-100 font-black py-5 px-10 rounded-2xl hover:border-gray-200 hover:-translate-y-1 transition-all active:scale-95 text-lg">
            Join the Community
          </button>
          <button *ngIf="currentUser" routerLink="/dashboard" class="bg-indigo-50 text-indigo-600 font-black py-5 px-10 rounded-2xl hover:bg-indigo-100 hover:-translate-y-1 transition-all active:scale-95 text-lg">
            Go to Dashboard
          </button>
        </div>

        <!-- Floating Abstract UI Elements (Visual Candy) -->
        <div class="hidden lg:block absolute top-[20%] -left-12 rotate-[-6deg] animate-float opacity-90 delay-500">
           <div class="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 w-72">
             <div class="flex items-center gap-4 mb-4">
               <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">S</div>
               <div>
                  <div class="h-2.5 w-24 bg-gray-100 rounded-full mb-2"></div>
                  <div class="h-2 w-16 bg-gray-50 rounded-full"></div>
               </div>
             </div>
             <div class="space-y-3">
               <div class="h-2 w-full bg-gray-50 rounded-full"></div>
               <div class="h-2 w-4/5 bg-gray-50 rounded-full"></div>
               <div class="flex justify-between items-center mt-6">
                  <div class="h-8 w-24 bg-indigo-50 rounded-xl"></div>
                  <div class="h-4 w-4 rounded-full bg-indigo-100"></div>
               </div>
             </div>
           </div>
        </div>

        <div class="hidden lg:block absolute top-[40%] -right-12 rotate-[8deg] animate-float-delayed opacity-90 delay-700">
           <div class="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 w-64">
             <div class="text-xs font-black text-indigo-400 mb-4 tracking-widest uppercase italic">Recent Match</div>
             <div class="flex items-center gap-3">
               <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
               <div class="flex-1">
                 <div class="h-2.5 w-full bg-gray-100 rounded-full mb-2"></div>
                 <div class="h-2 w-3/4 bg-gray-50 rounded-full"></div>
               </div>
             </div>
             <div class="mt-6 flex gap-1">
               <div class="h-1.5 w-8 bg-indigo-600 rounded-full"></div>
               <div class="h-1.5 w-8 bg-indigo-200 rounded-full"></div>
               <div class="h-1.5 w-8 bg-indigo-100 rounded-full"></div>
             </div>
           </div>
        </div>
      </div>

      <!-- Feature Grid -->
      <div class="max-w-7xl mx-auto px-6 py-32 sm:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="group">
            <div class="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4">Instant Apply</h3>
            <p class="text-gray-500 font-medium leading-relaxed">Save your preference and apply to jobs with just one click. No more filling redundant forms.</p>
          </div>
          <div class="group cursor-pointer" routerLink="/jobs/explore">
            <div class="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner group-hover:bg-purple-100">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">Interactive Map</h3>
            <p class="text-gray-500 font-medium leading-relaxed">Visualize where your next office is. Search jobs by proximity and find the best commute for you.</p>
          </div>
          <div class="group">
            <div class="w-16 h-16 bg-pink-50 rounded-[1.5rem] flex items-center justify-center text-pink-600 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4">AI Verification</h3>
            <p class="text-gray-500 font-medium leading-relaxed">Our smart verification builds trust between you and the company, highlighting your best skills.</p>
          </div>
        </div>
      </div>

      <!-- Trust Footer -->
      <div class="bg-gray-50/50 py-24">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-12 italic">Empowering companies across Moldova</p>
          <div class="flex flex-wrap justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
             <div class="text-2xl font-black tracking-tighter text-gray-900 italic">TECH-CORP</div>
             <div class="text-2xl font-black tracking-tighter text-gray-900">MODERN.SCALE</div>
             <div class="text-2xl font-black tracking-tighter text-gray-900">FIN-LABS</div>
             <div class="text-2xl font-black tracking-tighter text-gray-900 italic">FUTURE_FLOW</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(-6deg); }
      50% { transform: translateY(-20px) rotate(-4deg); }
    }
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0) rotate(8deg); }
      50% { transform: translateY(-25px) rotate(10deg); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
    
    .animate-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WelcomeComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser();
}
