import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegisterObjectPage } from '../register-object/register-object.page';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';
@Component({
  selector: 'app-objetos-mascotas',
  templateUrl: './objetos-mascotas.page.html',
  styleUrls: ['./objetos-mascotas.page.scss'],
})
export class ObjetosMascotasPage implements OnInit {

  // eslint-disable-next-line max-len
  pertenencias = ['Chaqueta','Billetera','Computadora','Carpeta de documentos','Bicicleta','Billetera','Computadora','Carpeta de documentos','Bicicleta','Billetera','Computadora','Carpeta de documentos','Bicicleta'];
  user: User;

  objetos = {};

  constructor( private modalCtrl: ModalController,
              private userService: UserService,
              public navCtrl: NavController,
              public toastMessage: ToastMessage,
              private storageService: StorageService,
              public waitMessage: WaitMessage,
              public alertController: AlertController) {}


  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    this.fillObjects();
  }


  async fillObjects(){
    this.objetos = await this.userService.retrieveInfo(this.user.hashcode,'objetos',this.user.id).toPromise();
    console.log(this.objetos);
  }


  async anadirObjeto(){
    const modal = await this.modalCtrl.create({
      component: RegisterObjectPage,
      backdropDismiss: true,

    });
    modal.onDidDismiss().then(
      () => {
        console.log('la que si');
        this.fillObjects();
      }
    );
    return await modal.present();
  }

  async deleteObject(objetoSeleccionado: string){
    console.log('BSSS',objetoSeleccionado);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro?',
      message: '¿Desear quitar ese objeto de tu lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'ELIMINAR',
          id: 'confirm-button',
          handler: async () => {
            const respuesta = await this.userService.deleteObject({
              objeto: objetoSeleccionado,
              hashcode: this.user.hashcode
            }).toPromise();
            console.log(respuesta);
            this.fillObjects();
          }
        }
      ]
    });
    await alert.present();

  }

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        console.log('getting user objetosmascotas',this.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }

}
