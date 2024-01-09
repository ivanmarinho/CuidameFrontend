import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UbicacionService } from 'src/app/services/ubication.service';


let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;
let currentInfoWindow: google.maps.InfoWindow;


@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class MapModalComponent implements OnInit {
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  map: any;
  service: any;
  private ubicacionSubscription: Subscription;


  constructor(public ubicacionService: UbicacionService, private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }

  async ngOnInit() {
    await this.loadScripts();
  }

  async loadScripts() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBOYnIDyO_2Fy1XkEz9XN_Y_Kv4YTyV1NI&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.getLocation();
    };

    document.head.appendChild(script);
  }

  async getLocation() {
    this.ubicacionSubscription = this.ubicacionService.obtenerUbicacion().subscribe(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.initMap(latitude, longitude);
        // this.searchNearbyPlaces(latitude, longitude);
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
      }
    );
  }

  async initMap(lat: number, lng: number) {
    if (this.mapRef && this.mapRef.nativeElement) {
      // Request needed libraries.
      //@ts-ignore
      const { Map } = (await google.maps.importLibrary( 'maps' )) as google.maps.MapsLibrary;
      //@ts-ignore
      const { AdvancedMarkerElement } = (await google.maps.importLibrary( 'marker' )) as google.maps.MarkerLibrary;

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
      type: 'veterinary_care' 
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
    const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary( 'marker' )) as google.maps.MarkerLibrary;
    const beachFlagImg = document.createElement('img');
    beachFlagImg.src = 'assets/pets/ico_marker.png';

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: place.geometry.location, 
      content: beachFlagImg,
    });

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
      content: content
    });

    if (this.map && place.geometry && place.geometry.location) {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      infoWindow.setPosition(place.geometry.location);
      infoWindow.open(this.map);

      currentInfoWindow = infoWindow;
    } else {
      console.error('Unable to open info window. Map or place data is invalid.');
    }
  }


  // searchNearbyPlaces(lat: number, lng: number) {
  //  if (this.map){
  //   const service = new google.maps.places.PlacesService(this.map);

  //   const request: google.maps.places.PlaceSearchRequest = {
  //     location: new google.maps.LatLng(lat, lng),
  //     radius: 5000,
  //     type: 'veterinary_care',
  //   };

  //   service.nearbySearch(request, (results, status) => {
  //     if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //       for (const place of results) {
  //         var marker = new google.maps.Marker({
  //           map: this.map,
  //           place: {
  //             placeId: results[0].place_id,
  //             location: results[0].geometry.location
  //           }
  //         });
  //       }
  //     }
  //   });
  //  }else {
  //   console.error('Google Maps API no está cargada correctamente.');
  //  }
  // }

  // searchNearbyPlaces(lat: number, lon: number) {
  //   if (google.maps && google.maps.places && this.map) {
  //     const service = new google.maps.places.PlacesService(this.map);

  //     const request: google.maps.places.PlaceSearchRequest = {
  //       location: new google.maps.LatLng(lat, lon),
  //       radius: 5000,
  //       type: 'veterinary_care',
  //     };

  //     service.nearbySearch(request, (results, status) => {
  //       if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //         for (const place of results) {
  //           this.addMarker(place);
  //         }
  //       }
  //     });
  //   } else {
  //     console.error('Google Maps API no está cargada correctamente.');
  //   }
  // }

  // async addMarker(place) {
  //   if (this.map) {

  //     //@ts-ignore
  //     const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary( 'marker' )) as google.maps.MarkerLibrary;
  //     const location = place.geometry.location;

  //     const pinBackground = new PinElement({
  //       background: '#FBBC04',
  //     });
  //     const markerViewBackground = new AdvancedMarkerElement({
  //       map: this.map,
  //       position: location,
  //       content: pinBackground.element,
  //     });

  //     // const marker = new google.maps.Marker({
  //     //   position: location,
  //     //   title: place.name,
  //     // });

  //     markerViewBackground.setMap(this.map);
  //   } else {
  //     console.error('El mapa no está definido.');
  //   }
  // }
}
