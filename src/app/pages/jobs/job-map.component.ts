import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { JobDto } from '../../models/job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full relative group">

      <!-- Map Background -->
      <div
        #mapContainer
        class="h-full w-full z-0 transition-opacity duration-700"
        [class.opacity-0]="!mapReady"
      ></div>

      <!-- Overlay Loader -->
      <div
        *ngIf="!mapReady"
        class="absolute inset-0 bg-[#f8fafc] flex items-center justify-center z-[1002]"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-full border-4 border-indigo-50 border-t-indigo-600 animate-spin"></div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Map...</p>
        </div>
      </div>

      <!-- Glassmorphic Zoom Controls -->
      <div class="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
        <button (click)="zoomIn()" class="premium-map-btn" title="Zoom In">+</button>
        <button (click)="zoomOut()" class="premium-map-btn" title="Zoom Out">−</button>
      </div>

      <!-- No Markers Empty State (jobs exist but none have coordinates) -->
      <div
        *ngIf="mapReady && markerCount === 0 && jobs.length > 0"
        class="absolute inset-0 bg-white/40 backdrop-blur-md z-[1001] flex items-center justify-center text-center p-10"
      >
        <div class="max-w-sm bg-white p-12 rounded-[3rem] shadow-2xl border border-white">
          <div class="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-400">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
          </div>
          <h4 class="text-xl font-black text-gray-900 mb-2">No Map Coordinates</h4>
          <p class="text-gray-500 text-sm font-medium leading-relaxed">
            These jobs don't have map coordinates yet. Try the <strong>Near Me</strong> filter to find nearby jobs, or browse the list.
          </p>
        </div>
      </div>

      <!-- No Jobs Empty State -->
      <div
        *ngIf="mapReady && jobs.length === 0"
        class="absolute inset-0 bg-white/40 backdrop-blur-md z-[1001] flex items-center justify-center text-center p-10"
      >
        <div class="max-w-sm bg-white p-12 rounded-[3rem] shadow-2xl border border-white">
          <div class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
          </div>
          <h4 class="text-2xl font-black text-gray-900 mb-2">No Jobs Found</h4>
          <p class="text-gray-500 text-sm font-medium leading-relaxed">
            No job clusters found. Try adjusting your search or radius.
          </p>
        </div>
      </div>

      <!-- Bottom Badge -->
      <div
        *ngIf="mapReady && markerCount > 0"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-gray-900/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
      >
        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
          {{ markerCount }} of {{ jobs.length }} Opportunities Mapped
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; }

    .premium-map-btn {
      width: 48px; height: 48px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.8);
      display: flex; align-items: center; justify-content: center;
      color: #0f172a; font-weight: 900; font-size: 20px;
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
      cursor: pointer;
    }
    .premium-map-btn:hover { background:#fff; transform:translateY(-2px); box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); }
    .premium-map-btn:active { transform:scale(0.95); }

    ::ng-deep .leaflet-popup-content-wrapper {
      border-radius: 1.5rem !important; padding: 0 !important; overflow: hidden !important;
      background: rgba(255,255,255,0.97) !important; backdrop-filter: blur(16px) !important;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
      border: 1px solid rgba(255,255,255,0.5) !important;
    }
    ::ng-deep .leaflet-popup-content { margin: 0 !important; width: 300px !important; }
    ::ng-deep .leaflet-popup-tip-container { display: none; }
    ::ng-deep .leaflet-control-attribution { display: none; }
    ::ng-deep .leaflet-popup-close-button { display: none !important; }
  `],
})
export class JobMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() jobs: JobDto[] = [];
  @Input() selectedJobId?: string;
  @Input() userLat: number | null = null;
  @Input() userLng: number | null = null;
  @Input() radiusKm: number | null = null;

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  mapReady = false;
  markerCount = 0;

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private radiusCircle?: L.Circle;
  private jobToMarker = new Map<string, L.Marker>();
  private readonly defaultCenter: L.LatLngExpression = [47.0105, 28.8638];
  private mapInitialized = false;

  private router = inject(Router);
  private ngZone = inject(NgZone);

  ngAfterViewInit() {
    // Delay slightly to let the DOM fully render before Leaflet measures the container.
    setTimeout(() => this.initMap(), 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.mapInitialized) return;

    if (changes['jobs']) {
      this.updateMarkers();
    }
    if (changes['selectedJobId'] && this.selectedJobId) {
      this.focusOnJob(this.selectedJobId);
    }
    if (changes['userLat'] || changes['userLng'] || changes['radiusKm']) {
      this.updateRadiusCircle();
    }
  }

  ngOnDestroy() {
    this.clearMarkers();
    if (this.radiusCircle) {
      this.radiusCircle.remove();
      this.radiusCircle = undefined;
    }
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  // ── Map Setup ──────────────────────────────────────────────────────────────

  private initMap() {
    if (this.mapInitialized || !this.mapContainer?.nativeElement) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.defaultCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(this.map);

    this.mapInitialized = true;
    this.mapReady = true;
    this.updateMarkers();
    this.updateRadiusCircle();
  }

  // ── Marker Management ──────────────────────────────────────────────────────

  private clearMarkers() {
    this.markers.forEach(m => {
      m.off(); // Remove all event listeners to prevent memory leaks
      m.remove();
    });
    this.markers = [];
    this.jobToMarker.clear();
    this.markerCount = 0;
  }

  private updateMarkers() {
    if (!this.map || !this.mapInitialized) return;

    this.clearMarkers();

    if (this.jobs.length === 0) return;

    const bounds = L.latLngBounds([]);
    let addedToMap = 0;

    for (const job of this.jobs) {
      // Only place markers for jobs that have coordinates stored in the DB.
      // Client-side geocoding has been removed — the backend owns coordinates.
      if (job.latitude == null || job.longitude == null) continue;

      const coords: [number, number] = [job.latitude, job.longitude];
      this.addMarker(job, coords, bounds);
      addedToMap++;
    }

    this.markerCount = addedToMap;

    if (addedToMap > 0) {
      this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }

  private addMarker(job: JobDto, coords: [number, number], bounds: L.LatLngBounds) {
    const initial = job.companyName?.charAt(0)?.toUpperCase() || '?';

    const markerIcon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:48px;height:56px;cursor:pointer;">
          <div style="
            width:48px;height:48px;
            background:white;border-radius:16px;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 8px 24px -4px rgba(99,102,241,0.4);
            border:2px solid rgba(99,102,241,0.3);
            font-weight:900;font-size:18px;color:#4f46e5;
          ">${initial}</div>
          <div style="
            position:absolute;bottom:0;left:50%;transform:translateX(-50%);
            width:8px;height:8px;background:#4f46e5;border-radius:50%;
            box-shadow:0 0 0 3px rgba(99,102,241,0.2);
          "></div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
    });

    const marker = L.marker(coords, { icon: markerIcon }).addTo(this.map!);
    this.jobToMarker.set(job.id, marker);

    const salary = job.salaryMin
      ? `${job.salaryMin.toLocaleString()} MDL`
      : 'Negotiable';

    const locationLabel = job.locationType === 0 ? 'Remote'
      : job.locationType === 2 ? 'Hybrid' : 'On-site';

    const popupContent = `
      <div style="font-family:system-ui,sans-serif;padding:0;">
        <div style="padding:20px 20px 16px;">
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="padding:2px 10px;background:#4f46e5;color:white;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;border-radius:6px;">
              ${job.category || 'General'}
            </span>
            <span style="padding:2px 10px;background:#f3f4f6;color:#6b7280;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-radius:6px;">
              ${locationLabel}
            </span>
          </div>
          <h4 style="font-size:16px;font-weight:900;color:#111827;margin:0 0 4px;line-height:1.3;">${job.title}</h4>
          <p style="font-size:12px;font-weight:600;color:#6b7280;margin:0 0 14px;">${job.companyName}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #f3f4f6;padding-top:14px;">
            <div>
              <div style="font-size:8px;font-weight:900;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">Salary</div>
              <div style="font-size:14px;font-weight:900;color:#4f46e5;">${salary}</div>
            </div>
            <button
              data-job-id="${job.id}"
              class="map-view-job-btn"
              style="padding:10px 18px;background:#111827;color:white;font-size:10px;font-weight:900;
                     text-transform:uppercase;letter-spacing:0.05em;border-radius:10px;border:none;cursor:pointer;"
            >
              View Job →
            </button>
          </div>
        </div>
      </div>
    `;

    const popup = L.popup({
      closeButton: false,
      offset: [0, -20],
      maxWidth: 300,
    }).setContent(popupContent);

    marker.bindPopup(popup);

    // Click → navigate via Angular Router (not raw href — avoids full-page reload)
    const clickHandler = () => {
      marker.openPopup();
      // Delegate to popup button after DOM settles
    };
    const popupOpenHandler = () => {
      // Run navigation inside Angular zone so change detection works
      setTimeout(() => {
        const btn = document.querySelector<HTMLButtonElement>(`[data-job-id="${job.id}"].map-view-job-btn`);
        if (btn) {
          btn.addEventListener('click', () => {
            this.ngZone.run(() => this.router.navigate(['/jobs', job.id]));
          }, { once: true });
        }
      }, 0);
    };

    marker.on('click', clickHandler);
    marker.on('popupopen', popupOpenHandler);

    this.markers.push(marker);
    bounds.extend(coords);
  }

  // ── Radius Circle ──────────────────────────────────────────────────────────

  private updateRadiusCircle() {
    if (!this.map || !this.mapInitialized) return;

    // Remove existing circle
    if (this.radiusCircle) {
      this.radiusCircle.remove();
      this.radiusCircle = undefined;
    }

    if (this.userLat == null || this.userLng == null || this.radiusKm == null) return;

    this.radiusCircle = L.circle([this.userLat, this.userLng], {
      radius: this.radiusKm * 1000, // metres
      color: '#4f46e5',
      fillColor: '#4f46e5',
      fillOpacity: 0.06,
      weight: 2,
      dashArray: '6, 6',
    }).addTo(this.map);

    // Add user location dot
    L.circleMarker([this.userLat, this.userLng], {
      radius: 8,
      color: '#fff',
      fillColor: '#4f46e5',
      fillOpacity: 1,
      weight: 3,
    }).addTo(this.map);

    this.map.setView([this.userLat, this.userLng], this.getZoomForRadius(this.radiusKm));
  }

  /** Returns a reasonable zoom level for a given km radius. */
  private getZoomForRadius(km: number): number {
    if (km <= 2) return 14;
    if (km <= 5) return 13;
    if (km <= 10) return 12;
    if (km <= 25) return 11;
    if (km <= 50) return 10;
    return 9;
  }

  // ── Focus ──────────────────────────────────────────────────────────────────

  private focusOnJob(jobId: string) {
    const marker = this.jobToMarker.get(jobId);
    if (marker && this.map) {
      this.map.setView(marker.getLatLng(), 15);
      marker.openPopup();
    }
  }

  // ── Public zoom controls ───────────────────────────────────────────────────

  zoomIn() { this.map?.zoomIn(); }
  zoomOut() { this.map?.zoomOut(); }
}
