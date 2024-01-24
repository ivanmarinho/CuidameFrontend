import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import {
  ActionSheetController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { PetsService } from 'src/app/services/pets/pets.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';

@Component({
  selector: 'app-petcode',
  templateUrl: './petcode.page.html',
  styleUrls: ['./petcode.page.scss'],
})
export class PetcodePage implements OnInit {
  result: string;
  band = {
    code: '',
    agreement: '',
  };

  agreements: any[] = [];


  showOptions : boolean;
  showPersonaOptions: boolean;
  insurances = [
    {
      value: 'IKE',
      name: 'Iké Asistencia',
    },
    {
      value: 'SeguroPeludo',
      name: 'Seguro Peludo',
    },
  ];
  constructor(
    private dataService: DataService,
    private petsService: PetsService,
    public waitMessage: WaitMessage,
    public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    public alertController: AlertController,
    public toastMessage: ToastMessage,
    private storageService: StorageService,
    public inAppBrows: InAppBrowser,
    private userService: UserService
  ) {
    this.showOptions = false;
    this.showPersonaOptions = false;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  togglePersonaOptions() {
    this.showPersonaOptions = !this.showPersonaOptions;
  }

  ngOnInit() {
    this.navCtrl.navigateRoot('/petcode');
    this.showOptions = false;
    this.getAgreements()
  }

  addPersona(){
    this.navCtrl.navigateForward('/form1/new');
  }

  addPet() {
    const addpet = true;
    const dataToSend = '';
    this.dataService.setDataPage(addpet);
    this.dataService.setCode(dataToSend);
    this.navCtrl.navigateForward('/private/data/addpet');
  }

  exitApp(): void {
    this.navCtrl.navigateRoot('/initial');
    this.storageService.clear();
  }

  deleteAccount() {
    this.navCtrl.navigateForward('/borrar-cuenta');
  }

  openWhatsapp = async () => {
    this.inAppBrows.create('https://walink.co/26ea7b', '_system');
  };

  buyLicense = async () => {
    this.inAppBrows.create('https://wa.link/acbmse', '_system');
  };

  openEmail = async () => {
    await Browser.open({ url: 'mailto:cuidame@esmart-tek.com' });
  };

  goToUpdateUser() {
    this.navCtrl.navigateForward('/updateuser');
  }
  goToPass() {
    this.navCtrl.navigateForward('/resetpassword');
  }

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

  goContacts() {
    this.navCtrl.navigateForward('/contacts');
  }

  goHelpPage() {
    this.navCtrl.navigateForward('/help');
  }
  goToPets() {
    if (!this.showOptions && !this.showPersonaOptions) {
      this.navCtrl.navigateForward('/private/data/all');
    } else {
      this.showOptions = false;
      this.showPersonaOptions = false;
    }
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

  getAgreements() {
    this.userService.getAgreements().subscribe(
      (data: any) => {
        this.agreements = data;
      },
      (error) => console.error('Error al obtener los acuerdos:', error)
    );
  }
  

  async send(regBand: NgForm) {
    if (regBand.valid) {
      try {
        const resp = await this.petsService.petBandAuth(regBand).toPromise();
        if (resp.success == true) {
          const dataToSend = this.band.code;
          const addpet = true;
          this.dataService.setDataPage(addpet);
          this.dataService.setCode(dataToSend);
          this.navCtrl.navigateForward('/private/data/addpet');
        }
        this.toastMessage.presentToast(resp.message);
      } catch (e) {
        console.log('Error auth band', e);
      }
    } else {
      this.toastMessage.presentToast('Por favor, revisa el formulario');
    }
    this.waitMessage.dismiss();
  }

  async valid(regBand: NgForm) {
    if (regBand.valid) {
      try {
        const resp = await this.petsService.personBandAuth(regBand).toPromise();
        if (resp.success == true) {
          const dataToSend = this.band.code;
          this.dataService.setCode(dataToSend);
          this.navCtrl.navigateForward('/form1/new');
        }
        this.toastMessage.presentToast(resp.message);
      } catch (e) {
        console.log('Error auth band', e);
      }
    } else {
      this.toastMessage.presentToast('Por favor, revisa el formulario');
    }
    this.waitMessage.dismiss();
  }

}
