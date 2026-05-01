import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { ApplicationService } from "../../services/application.service";
import { JobService } from "../../services/job.service";
import { ToastService } from "../../core/services/toast.service";
import { ApplicationDto } from "../../models/application.model";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-job-applicants",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-8 animate-fade-in font-sans pb-20">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-8"
      >
        <div>
          <a
            routerLink="/company-jobs"
            class="inline-flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 mb-4 transition-all group"
          >
            <svg
              class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Postings
          </a>
          <h2
            class="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight"
          >
            {{ jobTitle }}
            <span
              class="text-indigo-400 font-medium text-xl block sm:inline mt-1 sm:mt-0 sm:ml-2"
              >— Applicants</span
            >
          </h2>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <!-- Stats badges -->
          <div class="flex gap-3">
            <div
              class="text-center bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm"
            >
              <p
                class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5"
              >
                Total
              </p>
              <p class="text-2xl font-black text-gray-900">
                {{ applications.length }}
              </p>
            </div>
            <div
              class="text-center bg-green-50 border border-green-100 rounded-2xl px-5 py-3 shadow-sm"
            >
              <p
                class="text-[9px] font-black text-green-400 uppercase tracking-widest mb-0.5"
              >
                Accepted
              </p>
              <p class="text-2xl font-black text-green-700">
                {{ countByStatus("Accepted") }}
              </p>
            </div>
            <div
              class="text-center bg-yellow-50 border border-yellow-100 rounded-2xl px-5 py-3 shadow-sm"
            >
              <p
                class="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-0.5"
              >
                Pending
              </p>
              <p class="text-2xl font-black text-yellow-700">
                {{ countByStatus("Pending") }}
              </p>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="relative">
            <select
              [(ngModel)]="statusFilter"
              (ngModelChange)="applyFilter()"
              class="pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer hover:bg-gray-50 transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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
          Loading Applicants...
        </p>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!isLoading && applications.length === 0"
        class="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200"
      >
        <div
          class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200/50 text-indigo-300"
        >
          <svg
            class="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-gray-900 mb-3">
          No Applications Yet
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto font-medium">
          Your job post is live, but no one has applied yet. It usually takes
          24-48h to see candidates.
        </p>
      </div>

      <!-- Filtered Empty State -->
      <div
        *ngIf="
          !isLoading &&
          applications.length > 0 &&
          filteredApplications.length === 0
        "
        class="bg-indigo-50/50 rounded-[2.5rem] p-16 text-center border border-indigo-100"
      >
        <p class="text-lg font-black text-gray-600 mb-2">
          No
          <span class="text-indigo-600">{{ statusFilter }}</span> applications
        </p>
        <button
          (click)="statusFilter = ''; applyFilter()"
          class="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-2"
        >
          Clear filter
        </button>
      </div>

      <!-- Applicants List -->
      <div
        *ngIf="!isLoading && filteredApplications.length > 0"
        class="grid gap-6"
      >
        <div
          *ngFor="let app of filteredApplications"
          class="bg-white rounded-[2rem] p-7 shadow-lg shadow-gray-200/40 border border-gray-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/20 transition-all duration-400 group"
        >
          <div
            class="flex flex-col lg:flex-row gap-8 items-start lg:items-center"
          >
            <!-- Avatar & Info -->
            <div class="flex items-center gap-5 min-w-[260px]">
              <div class="relative flex-shrink-0">
                <div
                  class="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                >
                  {{ app.candidateName?.charAt(0) || "C" }}
                </div>
                <!-- Status dot -->
                <div
                  class="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-xl border-2 border-white shadow-md flex items-center justify-center"
                  [ngClass]="{
                    'bg-yellow-400': app.status === 'Pending',
                    'bg-blue-500': app.status === 'Reviewed',
                    'bg-indigo-500': app.status === 'Shortlisted',
                    'bg-green-500': app.status === 'Accepted',
                    'bg-red-400': app.status === 'Rejected'
                  }"
                ></div>
              </div>
              <div>
                <h3
                  class="font-black text-xl text-gray-900 mb-0.5 group-hover:text-indigo-600 transition-colors"
                >
                  {{ app.candidateName || "Anonymous" }}
                </h3>
                <p class="text-sm text-gray-500 font-semibold">
                  {{ app.candidateEmail }}
                </p>
                <p
                  class="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1"
                >
                  {{ app.createdAt | date : "MMM d, yyyy" }}
                </p>
              </div>
            </div>

            <!-- Center: CV & Score -->
            <div
              class="flex-1 flex flex-col sm:flex-row gap-6 w-full items-start sm:items-center"
            >
              <!-- CV Download -->
              <div class="flex-1">
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  CV / Resume
                </p>
                <button
                  (click)="viewCv(app)"
                  [disabled]="!app.cvPath"
                  class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group/cv disabled:opacity-40 disabled:cursor-not-allowed"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span class="truncate max-w-[160px]">{{
                    app.cvFileName || "Download CV"
                  }}</span>
                </button>
              </div>

              <!-- AI Score -->
              <div
                *ngIf="app.compatibilityScore != null"
                class="flex flex-col items-start sm:items-center"
              >
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  AI Match
                </p>
                <div class="flex items-baseline gap-1">
                  <span
                    class="text-3xl font-black"
                    [ngClass]="{
                      'text-green-600': app.compatibilityScore >= 70,
                      'text-yellow-600':
                        app.compatibilityScore >= 40 &&
                        app.compatibilityScore < 70,
                      'text-red-500': app.compatibilityScore < 40
                    }"
                    >{{ app.compatibilityScore.toFixed(0) }}</span
                  >
                  <span class="text-base font-bold text-indigo-500">%</span>
                </div>
                <div
                  class="w-20 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden"
                >
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    [style.width.%]="app.compatibilityScore"
                    [ngClass]="{
                      'bg-green-500': app.compatibilityScore >= 70,
                      'bg-yellow-400':
                        app.compatibilityScore >= 40 &&
                        app.compatibilityScore < 70,
                      'bg-red-400': app.compatibilityScore < 40
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="w-full lg:w-56 flex flex-col gap-3">
              <!-- Status Selector -->
              <div class="relative">
                <select
                  [ngModel]="app.status"
                  (ngModelChange)="updateStatus(app.id, $event)"
                  class="w-full pl-4 pr-8 py-3 font-bold border-2 border-transparent rounded-2xl bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer appearance-none text-sm"
                  [ngClass]="{
                    'text-yellow-700': app.status === 'Pending',
                    'text-blue-700': app.status === 'Reviewed',
                    'text-indigo-700': app.status === 'Shortlisted',
                    'text-green-700': app.status === 'Accepted',
                    'text-red-600': app.status === 'Rejected'
                  }"
                >
                  <option value="Pending">🕐 Pending</option>
                  <option value="Reviewed">👁 Reviewed</option>
                  <option value="Shortlisted">⭐ Shortlisted</option>
                  <option value="Accepted">✅ Accepted</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
                <svg
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <!-- Buttons row -->
              <div class="flex gap-2">
                <a
                  [routerLink]="['/applicants', app.id, 'analysis']"
                  class="flex-1 bg-gray-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs text-center transition-all shadow-lg shadow-gray-200 hover:bg-indigo-600 hover:shadow-indigo-200 flex items-center justify-center gap-1.5"
                >
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Analysis
                </a>
                <a
                  *ngIf="app.candidateEmail"
                  [href]="'mailto:' + app.candidateEmail"
                  class="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-100 text-gray-400 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                  title="Send Email"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
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
    `,
  ],
})
export class JobApplicantsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);
  private toastService = inject(ToastService);

  jobId: string | null = null;
  jobTitle = "Loading...";
  applications: ApplicationDto[] = [];
  filteredApplications: ApplicationDto[] = [];
  isLoading = true;
  statusFilter = "";

  viewCv(app: ApplicationDto) {
    if (!app.cvPath) return;
    const baseUrl = environment.apiUrl.replace("/api", "");
    window.open(`${baseUrl}${app.cvPath}`, "_blank");
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.jobId = params["jobId"];
      if (this.jobId) {
        this.loadJobInfo();
        this.loadApplicants();
      } else {
        this.isLoading = false;
        this.toastService.error(
          "No job specified. Access this page from a job posting."
        );
      }
    });
  }

  loadJobInfo() {
    if (!this.jobId) return;
    this.jobService.getById(this.jobId).subscribe({
      next: (job) => (this.jobTitle = job.title),
      error: () => (this.jobTitle = "Unknown Job"),
    });
  }

  loadApplicants() {
    if (!this.jobId) return;
    this.applicationService.getByJobId(this.jobId).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.filteredApplications = apps;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error("Failed to load applicants.");
        this.isLoading = false;
      },
    });
  }

  applyFilter() {
    if (!this.statusFilter) {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(
        (a) => a.status === this.statusFilter
      );
    }
  }

  countByStatus(status: string): number {
    return this.applications.filter((a) => a.status === status).length;
  }

  updateStatus(appId: string, newStatus: string) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app || app.status === newStatus) return;

    const previousStatus = app.status;
    app.status = newStatus; // Optimistic update

    this.applicationService.updateStatus(appId, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Status updated to ${newStatus}`);
        this.applyFilter(); // Re-apply filter after update
      },
      error: () => {
        app.status = previousStatus; // Revert on error
        this.toastService.error("Failed to update status. Please try again.");
      },
    });
  }
}
