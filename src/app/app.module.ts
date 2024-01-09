import { ContainerModule } from './modules/container/contenedor.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Network } from '@ionic-native/network/ngx';


@NgModule({
  declarations: [AppComponent],

  entryComponents: [],
  imports: [
    ContainerModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    Ng2SearchPipeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    OneSignal,
    InAppBrowser,
    BarcodeScanner,
    File,
    Camera,
    ImagePicker,
    Crop,
    Network,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
