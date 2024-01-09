import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WaitMessage {

  isLoading: boolean;

  constructor( public loadingCtrl: LoadingController) {
  }

  async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      // duration: 5000,
      message: 'Cargando...'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }
}
