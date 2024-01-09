import { ToastMessage } from 'src/app/utils/toastMessage';
import { UserService } from 'src/app/services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {
  email: string = '';

  constructor(
    private dataService: DataService,
    private userService: UserService,
    private toastMessage: ToastMessage,
    private platform: Platform,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  // const dataToSend = this.registerO.email;
  // this.dataService.setData(dataToSend);

  ngOnInit() {}

  isSending: boolean = false;
  remainingTime: number = 0;

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }

  async sendResetEmail() {
    if (this.isSending) {
      return;
    }
  
    const loading = await this.showLoading();
  
    try {
      const resp = await this.userService.forgotPassword(this.email).toPromise();
      if (resp.success) {
        this.toastMessage.presentToast(resp.message);
        this.isSending = true;
        this.remainingTime = 120;
        this.resetForm();
        this.setSendTimeout();
      } else {
        this.toastMessage.presentToast(resp.message);
        this.resetForm();
        this.setSendTimeout();
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }
  

  private resetForm() {
    this.email = '';
  }

  private setSendTimeout() {
    setTimeout(() => {
      this.isSending = false;
      this.remainingTime = 0;
    }, 120000); // 120000 ms = 2 minutos

    // Actualizar el tiempo restante cada segundo
    const interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(interval);
      }
    }, 1000); // 1000 ms = 1 segundo
  }
}
