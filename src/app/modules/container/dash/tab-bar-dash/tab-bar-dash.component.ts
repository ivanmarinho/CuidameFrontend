import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { Browser } from '@capacitor/browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab-bar-dash',
  templateUrl: './tab-bar-dash.component.html',
  styleUrls: ['./tab-bar-dash.component.scss'],
})
export class TabBarDashComponent implements OnInit {
  result: string;

  @Input() enableBackButton: boolean = true;
  @Input() enableMiddleButton: boolean = true;
  @Input() enableExitButton: boolean = true;

  constructor(
    public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService,
    public alertController: AlertController,
    private router: Router,
    private inAppBrows: InAppBrowser,
    private userService: UserService,
    private dataService: DataService,
    private loadingCtrl: LoadingController,
  ) {}

  // Routes on which the tab-bar will be blue

  urls = [
    '/private/pets/all',
    '/logged',
    '/private/pets/show',
    '/private/vaccine/show',
    '/private/treatment/show',
    '/private/veterinarian/show',
    '/private/history/show',
    '/private/pages/manage',
    '/private/pages/care',
    '/private/pages/veterinarians',
  ];

  isUrlInArray(urls: string[]): boolean {
    return urls.includes(this.router.url);
  }

  isHomeRoute(): boolean {
    return this.router.url === '/private/pets/all';
  }

  isEditRoute(): boolean {
    return this.router.url === '/editpet';
  }

  exitApp(): void {
    this.navCtrl.navigateRoot('/initial');
    this.storageService.clear();
  }

  deleteAccount() {
    this.navCtrl.navigateForward('/borrar-cuenta');
  }

  goToUpdateUser() {
    this.navCtrl.navigateForward('/updateuser');
  }
  goToPass() {
    this.navCtrl.navigateForward('/resetpassword');
  }

  openWhatsapp = async () => {
    const loading = await this.showLoading();
    try {
      this.inAppBrows.create('https://walink.co/26ea7b', '_system');
    } catch (error) {
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  };

  openEmail = async () => {
    const loading = await this.showLoading();
    try {
      await Browser.open({ url: 'mailto:cuidame@esmart-tek.com' });
    } catch (error) {
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  };

  async deleteInfo() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro de eliminar tu cuenta?',
      message:
        'Esta acción eliminará tu cuenta y TODOS los datos relacionados con esta, ¿deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        },
        {
          text: 'ELIMINAR',
          id: 'confirm-button',
          handler: async () => {
            const respuesta = await this.userService
              .deleteUser(this.dataService.user['email'])
              .toPromise();
            console.log(respuesta);
            console.log('brandocuieta');

            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          },
        },
      ],
    });
    await alert.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }

  async menu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Menu',
      mode: 'ios',
      cssClass: 'left-content',
      buttons: [
        {
          icon: 'person',
          text: 'Eliminar cuenta',

          role: 'destructive',
          handler: () => {
            this.deleteInfo();
          },
        },
        {
          icon: 'logo-whatsapp',
          text: 'Whatsapp',

          handler: () => {
            this.openWhatsapp();
          },
        },

        {
          icon: 'mail',
          text: 'Correo Electrónico',
          handler: () => {
            this.openEmail();
          },
        },
        {
          icon: 'person',
          text: 'Modificar Datos del Propietario',

          handler: () => {
            this.goToUpdateUser();
          },
        },
        {
          icon: 'key',
          text: 'Cambiar Contraseña',

          handler: () => {
            this.goToPass();
          },
        },

        {
          icon: 'exit',
          text: 'Cerrar Sesión',
          handler: () => {
            this.logOut();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    this.result = JSON.stringify(result, null, 2);
  }

  goHelpPage() {
    this.navCtrl.navigateForward('/help');
  }

  async logOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: '¿Estás seguro?',
      message: '¿Deseas cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        },
        {
          text: 'Cerrar sesión',
          id: 'confirm-button',
          handler: () => {
            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {}

  // goBack() {
  //   this.navCtrl.back();
  // }

  goBack() {
    const currentUrl = this.router.url;

    const targetRoutes = [
      '/private/pets/all',

      '/private/pages/manage',
      '/private/pets/show',
      '/private/vaccine/show',
      '/private/history/show',
      '/private/veterinarian/show',
    ];

    if (targetRoutes.includes(currentUrl)) {
      const currentIndex = targetRoutes.indexOf(currentUrl);

      if (currentIndex > 0) {
        const targetRoute = targetRoutes[currentIndex - 1];
        this.navCtrl.navigateForward(targetRoute);
      } else {
        this.navCtrl.back();
      }
    } else {
      this.navCtrl.back();
    }
  }

  redirect() {
    this.navCtrl.navigateForward('/initial');
  }
}
