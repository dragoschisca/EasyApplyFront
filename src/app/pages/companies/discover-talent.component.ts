import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CandidateService } from "../../services/candidate.service";
import { CandidateDto } from "../../models/candidate.model";
import { ToastService } from "../../core/services/toast.service";

@Component({
  selector: "app-discover-talent",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in font-sans pb-20">
      <!-- Header -->
      <div
        class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-100 pb-8"
      >
        <div>
          <p
            class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] mb-3"
          >
            Talent Discovery
          </p>
          <h2
            class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none"
          >
            Discover <span class="text-indigo-600">Top Talent</span>
          </h2>
          <p class="text-gray-500 mt-3 text-base font-medium max-w-xl">
            Browse our pool of candidates and find your next game-changer.
            Search by name or location.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-sm text-center"
          >
            <p
              class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5"
            >
              Available
            </p>
            <p class="text-2xl font-black text-gray-900">
              {{ candidates.length }}
            </p>
          </div>
          <div
            class="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-3 shadow-sm text-center"
          >
            <p
              class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5"
            >
              Showing
            </p>
            <p class="text-2xl font-black text-indigo-700">
              {{ filteredCandidates.length }}
            </p>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applySearch()"
            placeholder="Search by name or email..."
            class="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
        <div class="relative">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          <input
            type="text"
            [(ngModel)]="locationQuery"
            (ngModelChange)="applySearch()"
            placeholder="Filter by location..."
            class="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm min-w-[200px]"
          />
        </div>
        <button
          *ngIf="searchQuery || locationQuery"
          (click)="clearSearch()"
          class="px-5 py-3.5 bg-red-50 text-red-600 font-bold rounded-2xl text-sm hover:bg-red-100 transition-all border border-red-100"
        >
          Clear
        </button>
      </div>

      <!-- Loading -->
      <div
        *ngIf="isLoading"
        class="flex flex-col items-center justify-center py-32 space-y-4"
      >
        <div class="relative w-16 h-16">
          <div
            class="absolute inset-0 border-4 border-indigo-100 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <p class="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
          Searching talent pool...
        </p>
      </div>

      <!-- Empty Search Results -->
      <div
        *ngIf="
          !isLoading && filteredCandidates.length === 0 && candidates.length > 0
        "
        class="text-center py-20"
      >
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300"
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
        <h3 class="text-xl font-black text-gray-700 mb-2">
          No candidates found
        </h3>
        <p class="text-gray-500 mb-6">
          No candidates match "{{ searchQuery || locationQuery }}"
        </p>
        <button
          (click)="clearSearch()"
          class="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
        >
          Clear search
        </button>
      </div>

      <!-- No Candidates at all -->
      <div
        *ngIf="!isLoading && candidates.length === 0"
        class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
      >
        <div
          class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-indigo-300"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-black text-gray-700 mb-2">
          No Candidates Available
        </h3>
        <p class="text-gray-400">
          The talent pool is empty. Candidates will appear here once they
          register.
        </p>
      </div>

      <!-- Talent Grid -->
      <div
        *ngIf="!isLoading && filteredCandidates.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          *ngFor="let candidate of paginatedCandidates"
          class="group bg-white rounded-[2rem] p-7 shadow-lg shadow-gray-200/30 border border-gray-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/20 transition-all duration-400 flex flex-col"
        >
          <!-- Avatar & Name -->
          <div class="flex items-center gap-5 mb-5">
            <div
              class="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
            >
              {{ candidate.firstName.charAt(0)
              }}{{ candidate.lastName.charAt(0) }}
            </div>
            <div>
              <h3
                class="font-black text-lg text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight"
              >
                {{ candidate.fullName }}
              </h3>
              <p
                class="text-indigo-600 font-semibold text-xs mt-0.5 flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {{ candidate.location || "Remote / Flexible" }}
              </p>
            </div>
          </div>

          <!-- Bio -->
          <p
            *ngIf="candidate.bio"
            class="text-sm text-gray-500 font-medium leading-relaxed mb-5 line-clamp-2 flex-1"
          >
            {{ candidate.bio }}
          </p>
          <div *ngIf="!candidate.bio" class="flex-1 mb-5">
            <p class="text-sm text-gray-300 italic">No bio provided.</p>
          </div>

          <!-- Links -->
          <div class="space-y-2 mb-5">
            <a
              *ngIf="candidate.linkedInUrl"
              [href]="candidate.linkedInUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2.5 text-sm text-blue-600 font-bold p-2.5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all group/link"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                />
              </svg>
              <span class="truncate">LinkedIn Profile</span>
              <svg
                class="w-3 h-3 ml-auto opacity-50 group-hover/link:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <a
              *ngIf="candidate.gitHubUrl"
              [href]="candidate.gitHubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2.5 text-sm text-gray-800 font-bold p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group/link"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span class="truncate">GitHub Profile</span>
              <svg
                class="w-3 h-3 ml-auto opacity-50 group-hover/link:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <!-- Stats -->
          <div
            class="flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-5"
          >
            <div class="text-center">
              <p class="text-lg font-black text-gray-900 leading-tight">
                {{ candidate.cvsCount }}
              </p>
              <p
                class="text-[9px] font-bold text-gray-400 uppercase tracking-wider"
              >
                CVs
              </p>
            </div>
            <div class="h-8 w-px bg-gray-200"></div>
            <div class="text-center">
              <p class="text-lg font-black text-gray-900 leading-tight">
                {{ candidate.applicationsCount }}
              </p>
              <p
                class="text-[9px] font-bold text-gray-400 uppercase tracking-wider"
              >
                Applied
              </p>
            </div>
            <div class="h-8 w-px bg-gray-200"></div>
            <div class="text-center">
              <p
                class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5"
              >
                Joined
              </p>
              <p class="text-xs font-bold text-gray-700">
                {{ candidate.createdAt | date : "MMM y" }}
              </p>
            </div>
          </div>

          <!-- Portfolio Button -->
          <a
            *ngIf="candidate.portfolioUrl"
            [href]="candidate.portfolioUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-200/50 hover:bg-indigo-700 hover:shadow-indigo-300/50 flex items-center justify-center gap-2 group/btn mt-auto"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            View Portfolio
            <svg
              class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
          <button
            *ngIf="!candidate.portfolioUrl"
            class="w-full bg-gray-100 text-gray-400 font-bold py-3.5 rounded-2xl cursor-not-allowed mt-auto text-sm"
          >
            No Portfolio Available
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div
        *ngIf="!isLoading && filteredCandidates.length > pageSize"
        class="flex justify-center items-center gap-3 pt-4"
      >
        <button
          [disabled]="page === 1"
          (click)="changePage(page - 1)"
          class="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div class="flex items-center gap-1">
          <span
            *ngFor="let p of pageNumbers"
            (click)="changePage(p)"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm cursor-pointer transition-all"
            [ngClass]="
              p === page
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            "
          >
            {{ p }}
          </span>
        </div>
        <button
          [disabled]="page >= totalPages"
          (click)="changePage(page + 1)"
          class="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    `,
  ],
})
export class DiscoverTalentComponent implements OnInit {
  private candidateService = inject(CandidateService);
  private toastService = inject(ToastService);

  candidates: CandidateDto[] = [];
  filteredCandidates: CandidateDto[] = [];
  paginatedCandidates: CandidateDto[] = [];
  isLoading = true;

  searchQuery = "";
  locationQuery = "";

  page = 1;
  pageSize = 9;
  totalPages = 1;
  pageNumbers: number[] = [];

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.isLoading = true;
    this.candidateService.getAll(1, 200).subscribe({
      next: (data) => {
        this.candidates = data;
        this.filteredCandidates = data;
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error("Failed to load talent pool.");
        this.isLoading = false;
      },
    });
  }

  applySearch() {
    const q = this.searchQuery.toLowerCase().trim();
    const loc = this.locationQuery.toLowerCase().trim();

    this.filteredCandidates = this.candidates.filter((c) => {
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.bio?.toLowerCase().includes(q) ?? false);
      const matchesLocation =
        !loc || (c.location?.toLowerCase().includes(loc) ?? false);
      return matchesSearch && matchesLocation;
    });

    this.page = 1;
    this.updatePagination();
  }

  clearSearch() {
    this.searchQuery = "";
    this.locationQuery = "";
    this.filteredCandidates = this.candidates;
    this.page = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredCandidates.length / this.pageSize)
    );
    this.pageNumbers = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    ).slice(0, 10);
    this.paginatedCandidates = this.filteredCandidates.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
