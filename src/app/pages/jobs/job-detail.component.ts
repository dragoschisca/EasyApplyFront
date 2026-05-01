import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { JobService } from "../../services/job.service";
import { JobDto } from "../../models/job.model";
import { AuthService } from "../../core/services/auth.service";
import { ToastService } from "../../core/services/toast.service";
import { JobApplyModalComponent } from "./job-apply-modal.component";
import { SavedJobService } from "../../services/saved-job.service";
import { CandidateService } from "../../services/candidate.service";

@Component({
  selector: "app-job-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, JobApplyModalComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <!-- Top Navigation Blur Bar (Mobile/Sticky) -->
      <div
        class="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden"
      >
        <a routerLink="/jobs" class="p-2 -ml-2 text-slate-600">
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </a>
        <h2 class="text-sm font-black text-slate-900 truncate px-4">
          {{ job?.title }}
        </h2>
        <button
          (click)="onApply()"
          class="bg-indigo-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-indigo-200"
        >
          Apply
        </button>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div
          *ngIf="isLoading"
          class="flex flex-col justify-center items-center py-32 space-y-6"
        >
          <div class="relative w-20 h-20">
            <div
              class="absolute inset-0 border-4 border-indigo-100 rounded-full"
            ></div>
            <div
              class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
            ></div>
          </div>
          <p class="text-slate-400 font-bold tracking-widest uppercase text-xs">
            Fetching Opportunity...
          </p>
        </div>

        <div *ngIf="!isLoading && job" class="space-y-10 animate-in">
          <!-- Breadcrumbs & Actions -->
          <div class="hidden md:flex items-center justify-between">
            <nav class="flex items-center space-x-2 text-sm font-bold">
              <a
                routerLink="/jobs"
                class="text-slate-400 hover:text-indigo-600 transition-colors"
                >Jobs</a
              >
              <svg
                class="w-4 h-4 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span class="text-slate-900">{{ job.title }}</span>
            </nav>

            <div class="flex items-center gap-3">
              <button
                (click)="onToggleSave()"
                class="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                <svg
                  class="w-5 h-5"
                  [class.fill-pink-500]="isSaved"
                  [class.text-pink-500]="isSaved"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {{ isSaved ? "Saved" : "Save for Later" }}
              </button>
              <button
                class="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Hero Main Card -->
          <div
            class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
          >
            <div
              class="relative overflow-hidden bg-slate-900 px-8 py-12 md:px-16 md:py-20 text-white"
            >
              <!-- Decorative background elements -->
              <div
                class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/20 to-transparent"
              ></div>
              <div
                class="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"
              ></div>

              <div
                class="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12"
              >
                <div class="max-w-3xl">
                  <div class="flex flex-wrap items-center gap-3 mb-8">
                    <span
                      class="px-4 py-1.5 bg-white/10 backdrop-blur-md text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10"
                    >
                      {{ job.category || "Professional" }}
                    </span>
                    <span
                      *ngIf="job.locationType === 0"
                      class="px-4 py-1.5 bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/10"
                    >
                      Remote
                    </span>
                    <span
                      *ngIf="job.locationType === 2"
                      class="px-4 py-1.5 bg-amber-500/10 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-amber-500/10"
                    >
                      Hybrid
                    </span>
                    <span
                      class="px-4 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
                    >
                      Posted {{ job.createdAt | date : "MMM d" }}
                    </span>
                  </div>

                  <h1
                    class="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1]"
                  >
                    {{ job.title }}
                  </h1>

                  <div class="flex flex-wrap items-center gap-10">
                    <div
                      class="flex items-center group cursor-pointer"
                      [routerLink]="['/companies', job.companyId]"
                    >
                      <div
                        class="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3"
                      >
                        {{ job.companyName.charAt(0) }}
                      </div>
                      <div class="ml-5">
                        <p
                          class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1"
                        >
                          Hiring Company
                        </p>
                        <p
                          class="text-xl font-black group-hover:text-indigo-400 transition-colors"
                        >
                          {{ job.companyName }}
                        </p>
                      </div>
                    </div>

                    <div class="hidden sm:block w-px h-12 bg-white/10"></div>

                    <div class="flex items-center">
                      <div
                        class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400"
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
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <p
                          class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1"
                        >
                          Location
                        </p>
                        <p class="text-lg font-bold">{{ job.location }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="lg:w-80 space-y-4">
                  <button
                    (click)="onApply()"
                    class="w-full bg-indigo-600 hover:bg-white hover:text-indigo-900 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-95 text-xl"
                  >
                    Apply Now
                  </button>
                  <p
                    class="text-center text-xs text-slate-500 font-bold uppercase tracking-widest"
                  >
                    Quick apply: 2 mins
                  </p>
                </div>
              </div>
            </div>

            <!-- Content Layout -->
            <div class="flex flex-col lg:flex-row">
              <!-- Left: Detailed Content -->
              <div
                class="flex-1 p-8 md:p-16 space-y-16 border-r border-slate-100"
              >
                <section>
                  <div class="flex items-center gap-4 mb-8">
                    <div
                      class="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"
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
                          stroke-width="2.5"
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                    </div>
                    <h2 class="text-2xl font-black text-slate-900">
                      Job Description
                    </h2>
                  </div>
                  <div
                    class="text-slate-600 leading-relaxed text-lg font-medium space-y-4 whitespace-pre-wrap"
                  >
                    {{ job.description }}
                  </div>
                </section>

                <section>
                  <div class="flex items-center gap-4 mb-8">
                    <div
                      class="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"
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
                          stroke-width="2.5"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 class="text-2xl font-black text-slate-900">
                      Core Requirements
                    </h2>
                  </div>
                  <div
                    class="bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-slate-100 text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap"
                  >
                    {{ job.requirements }}
                  </div>
                </section>

                <!-- Premium Matching Insight -->
                <section
                  *ngIf="isCandidate && candidateProfile"
                  class="relative"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 rounded-[3rem] blur-3xl"
                  ></div>
                  <div
                    class="relative bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-indigo-500/5"
                  >
                    <div class="flex flex-col md:flex-row items-center gap-12">
                      <div class="relative w-40 h-40 flex-shrink-0">
                        <svg class="w-full h-full transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="74"
                            stroke="currentColor"
                            stroke-width="12"
                            fill="transparent"
                            class="text-slate-100"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="74"
                            stroke="currentColor"
                            stroke-width="12"
                            fill="transparent"
                            [attr.stroke-dasharray]="464.7"
                            [attr.stroke-dashoffset]="
                              464.7 * (1 - matchScore / 100)
                            "
                            stroke-linecap="round"
                            class="text-indigo-600 transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div
                          class="absolute inset-0 flex flex-col items-center justify-center"
                        >
                          <span
                            class="text-4xl font-black text-slate-900 leading-none"
                            >{{ matchScore }}%</span
                          >
                          <span
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2"
                            >AI Match</span
                          >
                        </div>
                      </div>

                      <div class="flex-1 text-center md:text-left">
                        <h3
                          class="text-3xl font-black text-slate-900 mb-6 tracking-tight"
                        >
                          Why you're a Top Choice
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div
                            *ngFor="let reason of matchReasons"
                            class="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div
                              class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5"
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
                                  stroke-width="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span
                              class="text-sm font-bold text-slate-700 leading-tight"
                              >{{ reason }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Right Sidebar: Stats -->
              <aside
                class="w-full lg:w-96 bg-slate-50/50 p-8 md:p-12 space-y-10"
              >
                <div>
                  <h3
                    class="text-sm font-black text-slate-400 uppercase tracking-widest mb-8"
                  >
                    Role Highlights
                  </h3>

                  <div class="space-y-8">
                    <div class="group">
                      <p
                        class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors"
                      >
                        Salary Range
                      </p>
                      <p class="text-2xl font-black text-slate-900">
                        {{
                          job.salaryMin
                            ? (job.salaryMin | number : "1.0-0") +
                              " - " +
                              (job.salaryMax | number : "1.0-0") +
                              " MDL"
                            : "Negotiable"
                        }}
                      </p>
                    </div>

                    <div>
                      <p
                        class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2"
                      >
                        Employment Type
                      </p>
                      <div
                        class="inline-flex px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 shadow-sm"
                      >
                        {{ job.employmentType }}
                      </div>
                    </div>

                    <div>
                      <p
                        class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2"
                      >
                        Engagement
                      </p>
                      <p
                        class="text-lg font-bold text-slate-900 flex items-center"
                      >
                        <span
                          class="w-3 h-3 bg-indigo-500 rounded-full mr-3 animate-pulse"
                        ></span>
                        {{ job.viewsCount || 0 }} people viewed
                      </p>
                    </div>
                  </div>
                </div>

                <div class="pt-10 border-t border-slate-200">
                  <div
                    class="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer"
                    [routerLink]="['/companies', job.companyId]"
                  >
                    <div class="relative z-10">
                      <p
                        class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4"
                      >
                        The Employer
                      </p>
                      <h4
                        class="text-xl font-black mb-3 group-hover:text-indigo-400 transition-colors"
                      >
                        {{ job.companyName }}
                      </h4>
                      <p class="text-sm text-slate-400 leading-relaxed mb-6">
                        Explore the company profile, values and other open
                        roles.
                      </p>
                      <div
                        class="flex items-center text-indigo-400 font-black text-sm uppercase tracking-widest"
                      >
                        View Company
                        <svg
                          class="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>
                    <!-- Decoration -->
                    <div
                      class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"
                    ></div>
                  </div>
                </div>

                <div class="pt-8">
                  <button
                    (click)="onApply()"
                    class="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    Quick Apply
                  </button>
                </div>
              </aside>
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
  styles: [
    `
      :host {
        display: block;
      }
      .animate-in {
        animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
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
    const id = this.route.snapshot.paramMap.get("id");
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
        this.toastService.error("Failed to load job details.");
      },
    });
  }

  checkIfSaved() {
    if (
      !this.authService.isLoggedIn() ||
      this.authService.currentUser()?.role !== "Candidate"
    )
      return;

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
            const existing = saves.find((s) => s.jobId === this.job?.id);
            if (existing) {
              this.isSaved = true;
              this.savedJobId = existing.id;
            }
          },
        });
      },
    });
  }

  calculateMatch() {
    if (!this.job || !this.candidateProfile) return;

    // Base score is lower if no CV is uploaded
    let score = this.candidateProfile.cvsCount > 0 ? 50 : 20;
    this.matchReasons = [];

    if (this.candidateProfile.cvsCount === 0) {
      this.matchReasons.push("Upload a CV to improve matching accuracy");
    }

    // Analyze Skills & Category
    if (
      this.job.category &&
      this.candidateProfile.bio
        ?.toLowerCase()
        .includes(this.job.category.toLowerCase())
    ) {
      score += 20;
      this.matchReasons.push(`Matches your interest in ${this.job.category}`);
    }

    // Analyze Location
    if (
      this.job.location &&
      this.candidateProfile.location &&
      (this.job.location.includes(this.candidateProfile.location) ||
        this.candidateProfile.location.includes(this.job.location))
    ) {
      score += 15;
      this.matchReasons.push(`Perfectly located in ${this.job.location}`);
    }

    // Work Mode
    if (this.job.locationType === 0) {
      score += 10;
      this.matchReasons.push("Offers full remote flexibility");
    } else if (this.job.locationType === 2) {
      score += 5;
      this.matchReasons.push("Flexible hybrid work model");
    }

    // Salary match (simplified)
    if (this.job.salaryMin && this.job.salaryMin >= 20000) {
      score += 5;
      this.matchReasons.push("High compensation bracket");
    }

    this.matchScore = Math.min(score, 98);
  }

  onToggleSave() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error("Please log in to save jobs.");
      return;
    }

    if (this.authService.currentUser()?.role !== "Candidate") {
      this.toastService.error("Only candidates can save jobs.");
      return;
    }

    if (this.isSaved && this.savedJobId) {
      this.savedJobService.removeJob(this.savedJobId).subscribe({
        next: () => {
          this.isSaved = false;
          this.savedJobId = null;
          this.toastService.success("Job removed from saved.");
        },
      });
    } else if (this.candidateId && this.job) {
      this.savedJobService.saveJob(this.candidateId, this.job.id).subscribe({
        next: (res) => {
          this.isSaved = true;
          this.savedJobId = res.id;
          this.toastService.success("Job saved!");
        },
      });
    } else {
      // Handle edge case where candidateId might not be loaded yet
      const userId = this.authService.currentUser()?.id;
      if (userId) {
        this.candidateService.getByUserId(userId).subscribe((candidate) => {
          this.candidateId = candidate.id;
          this.onToggleSave();
        });
      }
    }
  }

  onApply() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error(
        "Please log in as a candidate to apply for this job."
      );
      return;
    }

    if (this.authService.currentUser()?.role !== "Candidate") {
      this.toastService.error("Only candidates can apply to jobs.");
      return;
    }

    this.isApplyModalOpen = true;
  }

  onApplySuccess() {
    // Optionally update UI state (e.g. change "Apply Now" to "Applied")
  }
}
