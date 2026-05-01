import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import * as L from "leaflet";
import { JobDto } from "../../models/job.model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-job-map",
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
          <div
            class="w-12 h-12 rounded-full border-4 border-indigo-50 border-t-indigo-600 animate-spin"
          ></div>
          <p
            class="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse"
          >
            Loading Map...
          </p>
        </div>
      </div>

      <!-- Geocoding Progress -->
      <div
        *ngIf="mapReady && isGeocoding"
        class="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-lg flex items-center gap-3"
      >
        <div
          class="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"
        ></div>
        <span class="text-xs font-bold text-indigo-700"
          >Locating addresses on map...</span
        >
      </div>

      <!-- Glassmorphic Zoom Controls -->
      <div class="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
        <button (click)="zoomIn()" class="premium-map-btn" title="Zoom In">
          +
        </button>
        <button (click)="zoomOut()" class="premium-map-btn" title="Zoom Out">
          −
        </button>
      </div>

      <!-- No Markers Empty State -->
      <div
        *ngIf="mapReady && !isGeocoding && markerCount === 0 && jobs.length > 0"
        class="absolute inset-0 bg-white/40 backdrop-blur-md z-[1001] flex items-center justify-center text-center p-10"
      >
        <div
          class="max-w-sm bg-white p-12 rounded-[3rem] shadow-2xl border border-white"
        >
          <div
            class="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-400"
          >
            <svg
              class="h-10 w-10"
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
          <h4 class="text-xl font-black text-gray-900 mb-2">
            Addresses Not Found
          </h4>
          <p class="text-gray-500 text-sm font-medium leading-relaxed">
            Could not geocode the job addresses. Jobs may not have detailed
            addresses set.
          </p>
        </div>
      </div>

      <div
        *ngIf="mapReady && jobs.length === 0"
        class="absolute inset-0 bg-white/40 backdrop-blur-md z-[1001] flex items-center justify-center text-center p-10"
      >
        <div
          class="max-w-sm bg-white p-12 rounded-[3rem] shadow-2xl border border-white"
        >
          <div
            class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-400"
          >
            <svg
              class="h-10 w-10"
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
          <h4 class="text-2xl font-black text-gray-900 mb-2">No Jobs Found</h4>
          <p class="text-gray-500 text-sm font-medium leading-relaxed">
            No job clusters found. Try adjusting your search.
          </p>
        </div>
      </div>

      <!-- Bottom Badge -->
      <div
        *ngIf="mapReady && markerCount > 0"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-gray-900/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
      >
        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <span
          class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
          >{{ markerCount }} of {{ jobs.length }} Opportunities Mapped</span
        >
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .premium-map-btn {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0f172a;
        font-weight: 900;
        font-size: 20px;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      }
      .premium-map-btn:hover {
        background: #fff;
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }
      .premium-map-btn:active {
        transform: scale(0.95);
      }

      ::ng-deep .leaflet-popup-content-wrapper {
        border-radius: 1.5rem !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(16px) !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
      }
      ::ng-deep .leaflet-popup-content {
        margin: 0 !important;
        width: 280px !important;
      }
      ::ng-deep .leaflet-popup-tip-container {
        display: none;
      }
      ::ng-deep .leaflet-control-attribution {
        display: none;
      }
    `,
  ],
})
export class JobMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() jobs: JobDto[] = [];
  @ViewChild("mapContainer") mapContainer!: ElementRef;

  mapReady = false;
  isGeocoding = false;
  markerCount = 0;
  private map?: L.Map;
  private markers: L.Marker[] = [];
  private geocodeCache = new Map<string, [number, number] | null>();

  private readonly defaultCenter: L.LatLngExpression = [47.0105, 28.8638];

  constructor(private router: Router, private http: HttpClient) {}

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["jobs"] && this.map) {
      this.updateMarkers();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.defaultCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
      }
    ).addTo(this.map);

    this.mapReady = true;
    this.updateMarkers();
  }

  private async updateMarkers() {
    if (!this.map) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];
    this.markerCount = 0;

    if (this.jobs.length === 0) return;

    this.isGeocoding = true;
    const bounds = L.latLngBounds([]);

    for (const job of this.jobs) {
      let coords: [number, number] | null = null;

      // Use stored lat/lng from DB first
      if (job.latitude && job.longitude) {
        coords = [job.latitude, job.longitude];
      } else {
        // Try geocoding the address, then fallback to location
        const addressToGeocode = job.address || job.location;
        if (addressToGeocode) {
          coords = await this.geocodeAddress(addressToGeocode);
        }
      }

      if (coords) {
        this.addMarker(job, coords, bounds);
      }
    }

    this.isGeocoding = false;

    if (this.markers.length > 0) {
      this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }

  private async geocodeAddress(
    address: string
  ): Promise<[number, number] | null> {
    // Check cache first
    if (this.geocodeCache.has(address)) {
      return this.geocodeCache.get(address)!;
    }

    try {
      const encoded = encodeURIComponent(address);
      const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
      const results: any[] = await firstValueFrom(
        this.http.get<any[]>(url, {
          headers: { "Accept-Language": "en" },
        })
      );

      if (results && results.length > 0) {
        const coords: [number, number] = [
          parseFloat(results[0].lat),
          parseFloat(results[0].lon),
        ];
        this.geocodeCache.set(address, coords);
        // Small delay to respect Nominatim rate limits (1 req/sec)
        await new Promise((resolve) => setTimeout(resolve, 1100));
        return coords;
      }

      this.geocodeCache.set(address, null);
      return null;
    } catch {
      this.geocodeCache.set(address, null);
      return null;
    }
  }

  private addMarker(
    job: JobDto,
    coords: [number, number],
    bounds: L.LatLngBounds
  ) {
    const markerIcon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative;width:48px;height:56px;cursor:pointer;">
          <div style="
            width:48px;height:48px;
            background:white;
            border-radius:16px;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 8px 24px -4px rgba(99,102,241,0.4);
            border:2px solid rgba(99,102,241,0.3);
            font-weight:900;font-size:18px;
            color:#4f46e5;
            transition:all 0.3s;
          ">${job.companyName.charAt(0).toUpperCase()}</div>
          <div style="
            position:absolute;bottom:0;left:50%;transform:translateX(-50%);
            width:8px;height:8px;
            background:#4f46e5;
            border-radius:50%;
            box-shadow:0 0 0 3px rgba(99,102,241,0.2);
          "></div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
    });

    const marker = L.marker(coords, { icon: markerIcon }).addTo(this.map!);

    const salary = job.salaryMin
      ? `${job.salaryMin.toLocaleString()} MDL`
      : "Negotiable";

    const locationTypeLabel =
      job.locationType === 0
        ? "Remote"
        : job.locationType === 2
        ? "Hybrid"
        : "On-site";

    const popupContent = `
      <div style="font-family:system-ui,sans-serif;padding:0;">
        <div style="padding:16px 20px 12px;">
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="padding:2px 10px;background:#4f46e5;color:white;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;border-radius:6px;">${
              job.category || "General"
            }</span>
            <span style="padding:2px 10px;background:#f3f4f6;color:#6b7280;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-radius:6px;">${locationTypeLabel}</span>
          </div>
          <h4 style="font-size:15px;font-weight:900;color:#111827;margin:0 0 4px;line-height:1.3;">${
            job.title
          }</h4>
          <p style="font-size:12px;font-weight:600;color:#6b7280;margin:0 0 12px;">${
            job.companyName
          }</p>
          <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #f3f4f6;padding-top:12px;">
            <div>
              <div style="font-size:8px;font-weight:900;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">Salary</div>
              <div style="font-size:13px;font-weight:900;color:#4f46e5;">${salary}</div>
            </div>
            <a href="/jobs/${job.id}" style="
              padding:8px 16px;
              background:#111827;color:white;
              font-size:10px;font-weight:900;
              text-transform:uppercase;letter-spacing:0.05em;
              border-radius:10px;
              text-decoration:none;
              transition:background 0.2s;
            ">View Job</a>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: false,
      offset: [0, -20],
      maxWidth: 280,
    });

    marker.on("click", () => marker.openPopup());
    marker.on("mouseover", () => marker.openPopup());

    this.markers.push(marker);
    this.markerCount++;
    bounds.extend(coords);
  }

  zoomIn() {
    this.map?.zoomIn();
  }
  zoomOut() {
    this.map?.zoomOut();
  }
}
