// ubicacion.service.ts

import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  constructor(private platform: Platform) {}

  obtenerUbicacion(): Observable<GeolocationPosition> {
    return new Observable((observer: Observer<GeolocationPosition>) => {
      if (this.platform.is('cordova')) {
        Geolocation.getCurrentPosition().then(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error(
          'La geolocalización no está soportada en este navegador.'
        );
      }
    });
  }
}
