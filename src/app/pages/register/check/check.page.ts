import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {interval, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-check',
  templateUrl: './check.page.html',
  styleUrls: ['./check.page.scss'],
})
export class CheckPage implements OnInit {


  totalSecs = 60;
  subscription: Subscription;
  user: User;

  desactivarBotonReenviar = true;

  finishDate: Date = new Date();
  constructor( private dataService: DataService,
                private userService: UserService,
                private storageService: StorageService,
                public toastMessage: ToastMessage,
                public navCtrl: NavController, ) { }

  async ngOnInit() {
    await this.storageService.init(); //Iniciar servicio storage
    await this.getUser();
    this.reenviar();
  }

  reenviar(){
    this.totalSecs = 60;
    this.subscription = this.start().subscribe(); //comenzar conteo atras

    this.userService.resendEmail(this.user, this.user.session_token).subscribe( resp => {
      if (resp.success){
          this.toastMessage.presentToast('Se ha enviado el correo electrónico nuevamente.');
          // this.navCtrl.pop();
          // this.navCtrl.navigateBack('/initial');
          // this.storageService.clear();
      }else{
        console.log('Error al enviar correo electronico');
      }
      });
    this.desactivarBotonReenviar = true;  //desactivar boton

  }

  updateTime() {

    this.totalSecs = this.totalSecs - 1;
    console.log(this.totalSecs);
    if (this.totalSecs <= 0){
      this.subscription.unsubscribe();//terminar conteo atras
      this.desactivarBotonReenviar = false;  //activar boton
    }

}

start() {
  return interval(1000).pipe(
    map(() => {
      this.updateTime();
    })
  );
}

async getUser(){
  await this.storageService.loadUser().then( (userp) => {
    if(userp){
      this.user = userp;
      this.dataService.user = userp;
    }else {
      this.user = null;
    }
  }).catch( (e) => console.log('Error obteniento user storage',e));
}

}
