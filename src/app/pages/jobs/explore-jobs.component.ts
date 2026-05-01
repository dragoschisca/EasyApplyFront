import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { JobService } from "../../services/job.service";
import { JobDto } from "../../models/job.model";
import { JobMapComponent } from "./job-map.component";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: "app-explore-jobs",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JobMapComponent],
  template: `
    <div
      class="flex flex-col h-[calc(100vh-64px)] overflow-hidden font-sans bg-[#F8FAFC]"
    >
      <!-- Top Search Bar -->
      <div
        class="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-5 z-30 shadow-sm flex flex-col md:flex-row gap-5 items-center"
      >
        <h1
          class="text-2xl font-black text-slate-900 flex items-center gap-3 min-w-max mr-6"
        >
          <div
            class="p-2 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <span class="tracking-tight">Explore Jobs</span>
        </h1>

        <div class="relative flex-1 max-w-2xl group">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchTermChange($event)"
            class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium placeholder:text-slate-400 shadow-inner"
            placeholder="Search by title, skills or keywords..."
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="resetFilters()"
            class="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors px-4 py-2 hover:bg-slate-50 rounded-xl"
          >
            Reset
          </button>
          <a
            routerLink="/jobs"
            class="inline-flex items-center bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            List View
          </a>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden relative">
        <!-- Sidebar: Discovery List -->
        <aside
          [class.translate-x-0]="isSidebarOpen"
          [class.-translate-x-full]="!isSidebarOpen"
          class="absolute md:relative z-20 w-[380px] h-full bg-white/70 backdrop-blur-2xl border-r border-slate-200 transition-transform duration-500 shadow-2xl md:shadow-none flex flex-col"
        >
          <!-- Quick Stats -->
          <div class="p-6 bg-indigo-600 text-white relative overflow-hidden">
            <div class="relative z-10">
              <p
                class="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1"
              >
                Live Opportunities
              </p>
              <p class="text-2xl font-black">
                {{ totalResults }}
                <span class="text-indigo-200 font-medium">Found in Area</span>
              </p>
            </div>
            <!-- Abstract background shape -->
            <div
              class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            ></div>
          </div>

          <!-- The List -->
          <div
            class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-slate-50/50"
          >
            <div *ngIf="isLoading" class="space-y-4">
              <div
                *ngFor="let i of [1, 2, 3, 4, 5]"
                class="h-32 bg-white rounded-3xl animate-pulse border border-slate-100"
              ></div>
            </div>

            <div
              *ngFor="let job of jobs; let i = index"
              class="p-5 bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group relative overflow-hidden"
              [style.animation-delay]="i * 50 + 'ms'"
              [routerLink]="['/jobs', job.id]"
              (mouseenter)="hoveredJobId = job.id"
              (mouseleave)="hoveredJobId = null"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300"
                >
                  {{ job.companyName.charAt(0) }}
                </div>
                <div class="min-w-0">
                  <h4
                    class="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-0.5"
                  >
                    {{ job.title }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <p class="text-xs font-bold text-slate-500">
                      {{ job.companyName }}
                    </p>
                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <p
                      class="text-[10px] font-black text-indigo-600 uppercase tracking-wider"
                    >
                      {{ job.category || "Tech" }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-auto">
                <div
                  class="bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/50"
                >
                  <span class="text-xs font-black text-indigo-700">{{
                    job.salaryMin
                      ? (job.salaryMin | number) + " MDL"
                      : "Negotiable"
                  }}</span>
                </div>
                <div
                  class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors"
                >
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ job.location }}
                </div>
              </div>

              <!-- Hover accent -->
              <div
                class="absolute top-0 left-0 w-1 h-full bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
              ></div>
            </div>

            <div
              *ngIf="!isLoading && jobs.length === 0"
              class="text-center py-20 px-10"
            >
              <div
                class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"
              >
                <svg
                  class="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-2">
                No results found
              </h3>
              <p class="text-sm text-slate-500 mb-8">
                Try adjusting your filters or search terms.
              </p>
              <button
                (click)="resetFilters()"
                class="w-full py-4 bg-indigo-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-100 transition-all"
              >
                Clear everything
              </button>
            </div>
          </div>
        </aside>

        <!-- Toggle Button for Mobile -->
        <button
          (click)="isSidebarOpen = !isSidebarOpen"
          class="md:hidden absolute bottom-8 left-8 z-40 p-5 bg-slate-900 text-white rounded-full shadow-2xl active:scale-90 transition-transform"
        >
          <svg
            class="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              *ngIf="!isSidebarOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              *ngIf="isSidebarOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Map Area -->
        <main class="flex-1 relative bg-[#F1F5F9]">
          <app-job-map [jobs]="jobs"></app-job-map>

          <!-- Overlay Info (Optional) -->
          <div class="absolute top-6 right-6 z-10 pointer-events-none">
            <div
              class="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-sm flex items-center gap-3"
            >
              <div class="flex -space-x-2">
                <div
                  *ngFor="let i of [1, 2, 3]"
                  class="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
                ></div>
              </div>
              <p class="text-xs font-bold text-slate-600">Active map view</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 20px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      .p-5 {
        animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class ExploreJobsComponent implements OnInit {
  private jobService = inject(JobService);

  jobs: JobDto[] = [];
  isLoading = true;
  searchTerm = "";
  totalResults = 0;
  isSidebarOpen = true;
  hoveredJobId: string | null = null;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.loadJobs();
      });

    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService
      .search(
        this.searchTerm,
        "",
        "",
        "",
        "",
        undefined,
        undefined,
        undefined,
        1,
        50
      )
      .subscribe({
        next: (res) => {
          this.jobs = res.jobs;
          this.totalResults = this.jobs.length;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onSearchTermChange(term: string) {
    this.searchSubject.next(term);
  }

  resetFilters() {
    this.searchTerm = "";
    this.loadJobs();
  }
}
