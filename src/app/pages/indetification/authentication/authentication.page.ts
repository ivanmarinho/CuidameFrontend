import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { of, throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseApi } from 'src/app/interfaces';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  data = {};
  nombresPersonalMedico: string;
  numeroID: string;
  authentication: string;
  responseApi$: Observable<ResponseApi>;
  errorMsg: string;
  public avatar = {
    img: '',
    label: 'Policia',
    seleccionado: true
  };

  constructor( private dataService: DataService,
               private authService: AuthenticationService,
               public navCtrl: NavController,
               private toastMessage: ToastMessage ) { }



  ngOnInit() {
    this.avatar = this.dataService.getAvatar();
    // this.avatar.label = 'Policia';
    console.log(this.avatar);
  }

  back(){
    this.navCtrl.back();
  }

  navigateInitial(){
    this.navCtrl.navigateRoot('initial');
  }

  authPolicia(){
    this.authService.getAuth(this.avatar.label,this.numeroID,`${this.authentication}`).subscribe( resp => {
      console.log(resp);
      if (resp.success){
       this.navCtrl.navigateForward('/tab1');
       this.toastMessage.presentToast('Autenticacion realizada');
      }else{
        this.dataService.isCivilAccesing = true;
        this.navCtrl.navigateForward('/tab1');

      // this.toastMessage.presentToast('Datos de autenticación no válidos.');


      }
    });
  }

  insertMed(ccform){
    if(ccform.valid){
      console.log(ccform.value.nombres);
      this.authService.insertarMedico(ccform.value.nombres, ccform.value.numberID).subscribe(resp => {
        if (resp.success){
          this.navCtrl.navigateForward('/tab1');
        }else{
          this.toastMessage.presentToast('Algo salió mal, por favor intente ingresar como ciudadano');
        }
      });
    }else{
      this.toastMessage.presentToast('Por favor ingresa tu documento de identidad');
    }
  }

  authTemporal(ccform){
    if(ccform.valid){
      this.navCtrl.navigateForward('/tab1');

    }else{
      this.toastMessage.presentToast('Por favor ingresa tu documento de identidad');
    }
  }

  onClickAuth(){

  switch(this.avatar.label) {
    case 'Policia': {
        this.authService.getAuth(this.avatar.label,this.numeroID,`${this.authentication}`).subscribe( resp => {
          console.log(resp);
          if (resp.success){
           this.navCtrl.navigateForward('/tab1');
           this.toastMessage.presentToast('Autenticacion realizada');
          }else{
            this.dataService.isCivilAccesing = true;
            this.navCtrl.navigateForward('/tab1');

          // this.toastMessage.presentToast('Datos de autenticación no válidos.');


          }
        });
        break;
    }
    case 'Personal médico': {
      this.authService.getAuth(this.avatar.label,this.numeroID,`${this.authentication}`).subscribe( resp => {
        console.log(resp);
        if (resp.success){
         this.navCtrl.navigateForward('/tab1');
         this.toastMessage.presentToast('Autenticacion realizada');
        }else{
          this.dataService.isCivilAccesing = true;
          this.navCtrl.navigateForward('/tab1');

        this.toastMessage.presentToast('Datos de autenticación no válidos.');
        }
      });
      break;
    }
    case 'Bombero': {
      this.authService.getAuth(this.avatar.label,this.numeroID,`${this.authentication}`).subscribe( resp => {
        console.log(resp);
        if (resp.success){
         this.navCtrl.navigateForward('/tab1');
         this.toastMessage.presentToast('Autenticacion realizada');
        }else{
          this.dataService.isCivilAccesing = true;
          this.navCtrl.navigateForward('/tab1');

        this.toastMessage.presentToast('Datos de autenticación no válidos.');
        }
      });
      break;
    }
    case 'Defensa civíl': {
      this.authService.getAuth(this.avatar.label,this.numeroID,`${this.authentication}`).subscribe( resp => {
        console.log(resp);
        if (resp.success){
         this.navCtrl.navigateForward('/tab1');
         this.toastMessage.presentToast('Autenticacion realizada');
        }else{
          this.dataService.isCivilAccesing = true;
          this.navCtrl.navigateForward('/tab1');
        // this.toastMessage.presentToast('Datos de autenticación no válidos.');
        }
      });
      break;;
    }
    default: {
      this.authService.getAuth(this.avatar.label,this.numeroID,`${this.authentication}`).subscribe( resp => {
        console.log(resp);
        if (resp.success){
         this.navCtrl.navigateForward('/tab1');
         this.toastMessage.presentToast('Autenticacion realizada');
        }else{
          this.dataService.isCivilAccesing = true;
          this.navCtrl.navigateForward('/tab1');
        // this.toastMessage.presentToast('Datos de autenticación no válidos.');
        }
      });
      break;
    }
  }
}


}
