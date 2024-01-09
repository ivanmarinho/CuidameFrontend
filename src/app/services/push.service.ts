import { Injectable } from '@angular/core';

import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root'
})
export class PushService {

  userNotId: string;

  constructor(private oneSignal: OneSignal,
                     private dataService: DataService) { }

  initialSetup(){
    // this.oneSignal.setLogLevel(this.oneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG);
    this.oneSignal.startInit('d972c946-2ec3-48b7-bf2b-cc89f84320db', '606913227953');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
    console.log('Notificacion recibida',noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('Notificacion abierta',noti);
    });

    //Obtener ID del suscriptor
    this.oneSignal.getIds().then( info => {
      this.dataService.setNotificationID(info.userId);
    });

    this.oneSignal.endInit();
  }

}
