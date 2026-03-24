import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { JobDto } from '../../models/job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 relative">
      <div #mapContainer class="h-full w-full z-0"></div>
      
      <!-- Custom Map Controls Overlay -->
      <div class="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button (click)="zoomIn()" class="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-bold text-xl">+</button>
        <button (click)="zoomOut()" class="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-bold text-xl">−</button>
      </div>

      <div *ngIf="jobs.length === 0" class="absolute inset-0 bg-white/60 backdrop-blur-sm z-[1001] flex items-center justify-center text-center p-8">
        <div class="max-w-xs">
          <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          </div>
          <h4 class="text-lg font-black text-gray-900 mb-1">No markers to show</h4>
          <p class="text-gray-500 text-sm font-medium">Try adjusting your filters to find jobs with locations.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; }
    .leaflet-popup-content-wrapper {
      border-radius: 1.25rem !important;
      padding: 0 !important;
      overflow: hidden !important;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
    }
    .leaflet-popup-content {
      margin: 0 !important;
      width: 280px !important;
    }
    .leaflet-popup-tip-container { display: none; }
  `]
})
export class JobMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() jobs: JobDto[] = [];
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map?: L.Map;
  private markers: L.Marker[] = [];
  
  // Default center (Chisinau)
  private readonly defaultCenter: L.LatLngExpression = [47.0105, 28.8638];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobs'] && this.map) {
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
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.updateMarkers();
  }

  private updateMarkers() {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const bounds = L.latLngBounds([]);

    this.jobs.forEach(job => {
      // Prioritize real coordinates from the backend
      let coords: L.LatLngExpression | null = null;
      
      if (job.latitude && job.longitude) {
        coords = [job.latitude, job.longitude];
      } else {
        // Fallback to pseudo-geocoding for jobs without precise coordinates
        coords = this.getCoordinatesFromAddress(job.address || job.location || '');
      }
      
      if (coords) {
        const markerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative group">
              <div class="absolute -inset-2 bg-indigo-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 border-2 border-white transform hover:scale-110 active:scale-95 transition-all duration-300 relative z-10">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker(coords, { icon: markerIcon }).addTo(this.map!);
        
        const popupContent = `
          <div class="p-0 font-sans overflow-hidden group/popup">
            <div class="relative h-20 bg-indigo-600 overflow-hidden">
               <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90"></div>
               <div class="absolute top-4 left-4 flex items-center gap-3">
                 <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-black text-xs border border-white/20">
                   ${job.companyName.charAt(0)}
                 </div>
                 <div class="text-white">
                   <div class="text-[9px] font-black uppercase tracking-widest opacity-70 mb-0.5">${job.category || 'General'}</div>
                   <div class="text-xs font-bold truncate max-w-[150px]">${job.companyName}</div>
                 </div>
               </div>
            </div>
            <div class="p-5">
              <h4 class="text-sm font-black text-gray-900 mb-3 line-clamp-1">${job.title}</h4>
              <div class="flex items-center justify-between gap-4">
                 <div class="flex flex-col">
                   <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Salary</span>
                   <span class="text-xs font-black text-indigo-600">${job.salaryMin ? job.salaryMin.toLocaleString() + ' MDL' : 'Negotiable'}</span>
                 </div>
                 <a href="/jobs/${job.id}" class="px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-lg hover:bg-black transition-all">View Details</a>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: false,
          offset: [0, -10]
        });
        this.markers.push(marker);
        bounds.extend(coords);
      }
    });

    if (this.markers.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }

  private getCoordinatesFromAddress(address: string): L.LatLngExpression | null {
    // This is a VERY crude simulation of geocoding for the demo.
    // In production, you would call a geocoding API (Google Maps, Mapbox, OpenStreetMap).
    
    // Base coords for Chisinau
    const baseLat = 47.0105;
    const baseLng = 28.8638;

    // Use string hashing to generate consistent pseudo-coordinates for the same address
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = ((hash << 5) - hash) + address.charCodeAt(i);
      hash |= 0;
    }

    // Slightly offset based on hash to spread them around Chisinau
    const latOffset = (hash % 100) / 2000;
    const lngOffset = ((hash >> 1) % 100) / 2000;

    return [baseLat + latOffset, baseLng + lngOffset];
  }

  zoomIn() { this.map?.zoomIn(); }
  zoomOut() { this.map?.zoomOut(); }
}
