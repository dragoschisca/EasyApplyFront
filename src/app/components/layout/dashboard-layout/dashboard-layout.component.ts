import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-indigo-900 text-white flex flex-col shadow-xl transition-all duration-300">
        <div class="h-16 flex items-center justify-center border-b border-indigo-800 px-6">
          <h1 class="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">EasyApply</h1>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-2">
          <!-- Common Links -->
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
             class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>

          <!-- Candidate Links -->
          <ng-container *ngIf="authService.currentUser()?.role === 'Candidate'">
            <a routerLink="/jobs" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Find Jobs
            </a>
            <a routerLink="/applications" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Applications
            </a>
            <a routerLink="/saved-jobs" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Saved Jobs
            </a>
            <a routerLink="/profile" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </a>
          </ng-container>

          <!-- Company Links -->
          <ng-container *ngIf="authService.currentUser()?.role === 'Company'">
            <a routerLink="/company-jobs" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              My Postings
            </a>
            <a routerLink="/jobs/create" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Job
            </a>
            <a routerLink="/discover-talent" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Discover Talent
            </a>
            <a routerLink="/company-profile" routerLinkActive="bg-indigo-800 border-l-4 border-indigo-400"
               class="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-r-lg transition-colors group">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company Profile
            </a>
          </ng-container>
        </nav>
        
        <div class="px-4 py-4 border-t border-indigo-800">
          <button (click)="logout()" class="w-full flex items-center px-4 py-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <div class="text-gray-500 font-medium">
             Welcome back, <span class="text-indigo-600 font-semibold">{{ authService.currentUser()?.firstName || 'User' }}</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md shadow-indigo-200">
              {{ (authService.currentUser()?.firstName?.charAt(0) || 'U') | uppercase }}
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50/50">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
    // Usually inject router and navigate to '/login'
    window.location.href = '/login';
  }
}
