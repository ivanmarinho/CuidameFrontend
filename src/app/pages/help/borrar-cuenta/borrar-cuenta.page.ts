/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-borrar-cuenta',
  templateUrl: './borrar-cuenta.page.html',
  styleUrls: ['./borrar-cuenta.page.scss'],
})
export class BorrarCuentaPage implements OnInit {

  constructor(  private userService: UserService,
                private navCtrl: NavController,
                private alertController: AlertController,
                private storageService: StorageService,
                private dataService: DataService ) { }

  ngOnInit() {
  }

  async deleteInfo(){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro de eliminar tu cuenta?',
      message: 'Esta acción eliminará tu cuenta y TODOS los datos relacionados con esta, ¿deseas continuar?',
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
            console.log(this.dataService.user['email']);
            const respuesta = await this.userService.deleteUser(this.dataService.user['email']).toPromise();
            console.log(respuesta);
            console.log('brandocuieta');

            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          }
        }
      ]
    });
    await alert.present();


  }
}
