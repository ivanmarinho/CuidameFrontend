import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastMessage {

  constructor(public toastController: ToastController) {
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000
    });
    toast.present();
  }

  async toasti(message: string, duration: number) {
    const toast = await this.toastController.create({
      message,
      duration
    });
    toast.present();
  }
}
