import { Component, OnDestroy, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription, finalize } from 'rxjs';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { NetworkService } from 'src/app/services/network.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.page.html',
  styleUrls: ['./logged.page.scss'],
})
export class LoggedPage implements OnInit, OnDestroy {
  public cargaFinalizada: boolean;
  private sub: Subscription;
  result: string;
  agreement: string = '';

  constructor(
    public navCtrl: NavController,
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController,
    public alertController: AlertController,
    private networkService: NetworkService,
    private userService: UserService,
    public inAppBrows: InAppBrowser,
    private router: Router,
    private dataService: DataService,
    private loadingCtrl: LoadingController
  ) {
    this.cargaFinalizada = false;
    this.networkService.checkNetwork();
  }

  greetingMessage: string = '';

  setGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      return (this.greetingMessage = 'Buenos días');
    } else if (currentHour >= 12 && currentHour < 18) {
      return (this.greetingMessage = 'Buenas tardes');
    } else {
      return (this.greetingMessage = 'Buenas noches');
    }
  }

  public user: User;
  id: number = 0;

  license = {
    code: '',
  };

  hashcode: '';
  service: '';

  name: string;
  greeting: boolean = false;

  type: string;

  getGreeting() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          const { name } = user;
          this.name = name;
          this.greeting = true;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.whichService();
    await this.getGreeting();
    this.setGreeting();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  goToPetCare() {
    const dataToSend = true;
    this.dataService.setData(dataToSend);
    this.navCtrl.navigateForward('/private/pages/care');
  }


  goTab1() {
    // this.navCtrl.pop();
    this.navCtrl.navigateForward('/tab1');
  }

  goContacts() {
    // this.navCtrl.pop();
    this.navCtrl.navigateForward('/contacts');
  }

  goObjetos() {
    this.navCtrl.navigateForward('/objetos-mascotas');
  }

  goMascotas() {
    this.navCtrl.navigateForward('/private/pets/all');
  }

  async whichService() {
    if (!this.service.includes('health')) this.navCtrl.navigateRoot(['/private/pets/all']);
    if (this.service.includes('health')) {
      this.cargaFinalizada = true;
    } 
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
          this.id = Number(this.user.id);
          const {service } = userp;
          this.service = service;
          console.log("🚀 ~ file: logged.page.ts:154 ~ LoggedPage ~ .then ~ this.service:", this.service)
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }

  exitApp(): void {
    this.navCtrl.navigateRoot('/initial');
    this.storageService.clear();
  }

  deleteAccount() {
    this.navCtrl.navigateForward('/borrar-cuenta');
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

  goToUpdateUser() {
    this.navCtrl.navigateForward('/updateuser');
  }
  goToPass() {
    this.navCtrl.navigateForward('/resetpassword');
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
          icon: 'people',
          text: 'Contactos',

          handler: () => {
            this.goContacts();
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
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }
  async logOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
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
}
