/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  ubicacion = {};
  objetos = {}; //Objeto que tiene objetos con 'Objeto' y 'descripcion'
  objeto = '';
  descObjeto = '';
  hashcode: string;
  infoPaciente = {};
  sinObjetos: boolean;

  constructor(  private modalCtrl: ModalController,
                private userService: UserService,
                public navCtrl: NavController,
                public toastMessage: ToastMessage,
                private storageService: StorageService,
                public waitMessage: WaitMessage,
                private dataService: DataService,
                private qrCode: QrCodeService,
                public alertController: AlertController ) {}

  async ngOnInit() {
    this.hashcode = this.dataService.getCodeRequest();
    this.ubicacion = this.dataService.getScanLocation();
    console.log('ubication',this.ubicacion);
    await this.fillObjects();
  }

  handleChange(event){
    this.objeto = event.detail.value;
    Object.entries(this.objetos).forEach(([key, value], index) => {
      console.log(this.objeto,value);
      if (this.objeto === value['objeto']){
        this.descObjeto = value['descripcion'];
      }
    });

  }

  async fillObjects(){

    const respuestaObjetos = await this.userService.retrieveInfo(this.hashcode,'objetos','none').toPromise();
    this.objetos = respuestaObjetos.data;
    const respuesta = await this.userService.retrieveInfo(this.hashcode,'paciente','none').toPromise();
    this.infoPaciente = respuesta.data[0];
    console.log('infoPaciente',this.infoPaciente);
    console.log(this.objetos);
    if (!this.objetos){this.sinObjetos = true;}
  }

  async aceptar(){

    if(this.objeto === ''){
          this.toastMessage.presentToast('Por favor, selecciona un objeto');
          return;
    }
    const resp = await this.qrCode.findByCode(this.hashcode,this.ubicacion,this.objeto).toPromise();
    await this.qrCode.sendNotification(this.hashcode,this.ubicacion,this.objeto).toPromise();

    console.log('codrequest',resp);
    // if(!resp.success){this.notFound = true;}
    // this.toastMessage.presentToast(resp.message);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Gracias!',
      message: 'Hemos enviado la notificacion al propietario, por favor ponte en contacto con él.',
      buttons: [
        {
          text: 'Aceptar',
          // id: 'confirm-button',
          handler: () => {
            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          }
        }
      ]
    });

    await alert.present();
  };


}
