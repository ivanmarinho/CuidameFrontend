import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { UbicacionService } from 'src/app/services/ubication.service';
import { ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

// declare let google: any;

declare let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;
let currentInfoWindow: google.maps.InfoWindow;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapsPage implements OnDestroy {
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  map: any;
  service: any;
  private ubicacionSubscription: Subscription;
  markers: google.maps.Marker[] = [];

  constructor(public ubicacionService: UbicacionService) {}

  ngOnDestroy() {
    if (this.ubicacionSubscription) {
      this.ubicacionSubscription.unsubscribe();
    }
    if (this.map) {
      for (let marker of this.markers) {
        marker.setMap(null);
      }
      this.markers = [];
      this.map = null;
    }
  }

  async ngAfterViewInit() {
    try {
      await this.loadScripts();
      this.getLocation();

    } catch (error) {
      console.error('Error al cargar las librerías de Google Maps.');
    }
  }

  // ngAfterViewInit() {
  //   if (!window.google) {
  //     this.loadScripts();
  //   } else {
  //     this.getLocation();
  //   }
  //   // if (this.map) {
  //   //   this.map = null;
  //   // }
  //   // this.getLocation();
  // }

  async loadScripts() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBOYnIDyO_2Fy1XkEz9XN_Y_Kv4YTyV1NI&libraries=places`;
    script.async = true;
    script.defer = true;

    // script.onload = () => {
    //   setTimeout(() => {
    //     this.getLocation();
    //   }, 1000);
    // };

    document.head.appendChild(script);
  }

  async getLocation() {
    this.ubicacionSubscription = this.ubicacionService
      .obtenerUbicacion()
      .subscribe(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.initMap(latitude, longitude);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
  }

  async initMap(lat: number, lng: number) {
    if (!google.maps) {
      console.error('Error: Google Maps library not loaded.');
      return;
    }

    if (this.mapRef && this.mapRef.nativeElement) {
      //@ts-ignore
      // const { Map } = (await google.maps.importLibrary( 'maps' )) as google.maps.MapsLibrary;
      // //@ts-ignore
      // const { AdvancedMarkerElement } = (await google.maps.importLibrary( 'marker' )) as google.maps.MarkerLibrary;

      const Map = google.maps.Map;
      const AdvancedMarkerElement = google.maps.Marker;

      const position = new google.maps.LatLng(lat, lng);
      const options = {
        center: position,
        zoom: 16,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true,
      };

      this.map = new Map(this.mapRef.nativeElement, options);

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: { lat: lat, lng: lng },
      });

      this.service = new google.maps.places.PlacesService(this.map);

      this.searchNearbyVets(position);
    } else {
      console.error('Error: mapRef or its nativeElement is undefined.');
    }
  }

  searchNearbyVets(position: google.maps.LatLng) {
    const request = {
      location: position,
      radius: 5000,
      type: 'veterinary_care',
    };

    this.service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          this.createCustomMarker(results[i]);
        }
      }
    });
  }

  async createCustomMarker(place: google.maps.places.PlaceResult) {
    //@ts-ignore
    const { AdvancedMarkerElement } = (await google.maps.importLibrary( 'marker' )) as google.maps.MarkerLibrary;
    // const paw = document.createElement('img');
    // paw.src = 'assets/pets/ico_marker.png';

    const paw = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
      icon: paw
     });
     

    // this.markers.push(marker);
    // console.log(this.markers)

    marker.addListener('click', () => {
      this.showInfoWindow(place);
    });
  }

  showInfoWindow(place: google.maps.places.PlaceResult) {
    const content = `
    <div class="vet-card">
    <div class="vet-container">
      <img
        class="vet-profile"
        src="/assets/pets/image-veterinarian.svg"
        alt="vet"
      />
      <div class="vet-info">
        <div class="info">
          <label class="vet-title">${place.name}</label>
          <label class="vet-desc">Nombre</label>
        </div>
        <div class="info">
          <label class="vet-title">${place.adr_address}</label>
          <label class="vet-desc">Dirección</label>
        </div>
      </div>
    </div>
  </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: content,
    });

    if (this.map && place.geometry && place.geometry.location) {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      infoWindow.setPosition(place.geometry.location);
      infoWindow.open(this.map);

      currentInfoWindow = infoWindow;
    } else {
      console.error(
        'Unable to open info window. Map or place data is invalid.'
      );
    }
  }
}
