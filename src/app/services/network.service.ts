import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(private network: Network, private alertController: AlertController) {}

  checkNetwork() {
    const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.presentAlert('No tienes conexión a Internet');
    });
    disconnectSubscription.unsubscribe();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
