import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
})
export class MascotasPage implements OnInit {

  editFlag: string;
  title ='Añadir una mascota';
  textNextButton = 'Siguiente';

  // code: string;

  user: User;
  name: string;



  mascota = {
  nombre: '',
  especie: '',
  raza: '',
  descripcion: '',
  };


  constructor(  private userService: UserService,
                public navCtrl: NavController,
                public toastMessage: ToastMessage,
                private dataService: DataService,
                private storageService: StorageService,
                private route: ActivatedRoute,
                public alertController: AlertController
                ) { }

  async ngOnInit() {
    this.editFlag = this.route.snapshot.paramMap.get('editFlag');
    this.setEdit();
    await this.storageService.init(); //Await para darle tiempo a que se inicie el servicio antes de obtener el usuario (LoadUser)
    await this.getUser();
                                                      // que lo obtuvo del storage que lo obtuvo del inicio de sesion

  }


  setEdit(){ //La parte visual de la edicion se hace con angular en el documento html

  }


  public async logOut(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro?',
      message: 'Tu sesión se cerrará y los cambios no se guardarán. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'Cerrar sesión',
          id: 'confirm-button',
          handler: () => {
            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          }
        }
      ]
    });

    await alert.present();
  }



  //Boton siguiente formulario

 async guardar( fLogin: NgForm ){

    if(fLogin.valid){

      const formMascota = {
        idUsuario: this.user.id,
        hashcode: this.user.hashcode,
        ...this.mascota,
      };

      try{
        const resp = await this.userService.registerMascota(formMascota,this.user.session_token).toPromise();
        this.toastMessage.presentToast(resp.message);
        this.navCtrl.navigateRoot('logged');

      }catch(e){
        console.log('Error al guardar informacion de mascota');
      }

    }else{
      this.toastMessage.presentToast('Por favor revisa los campos');
    }
  }

//obtener usuario guardado en el almacenamiento del dispositivo

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        // this.dataService.user = userp;
        console.log('User coming from storage',this.user);
        // console.log('User coming from data service',this.dataService.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }

}
