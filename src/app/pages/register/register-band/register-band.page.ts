/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from '../../../utils/waitMessage';

@Component({
  selector: 'app-register-band',
  templateUrl: './register-band.page.html',
  styleUrls: ['./register-band.page.scss'],
})
export class RegisterBandPage implements OnInit {
  registerBand = {
    code: '',
    pin: '',
    parentesco: '',
    usuarioPaciente: true,
  };

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage,
    private dataService: DataService,
    public waitMessage: WaitMessage
  ) {}

  ngOnInit() {}

  // Clear the parentesco input if the checkbox is checked
  IdPed(event) {
    this.registerBand.parentesco = event.target.value;
  }

  reset() {
    this.registerBand.parentesco = '';
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  async next(regBand: NgForm) {
    if (regBand.valid) {
      this.dataService.setUsuarioPaciente(
        regBand.form.value['usuarioPaciente']
      );
      //Line 37 Guardar en memoria volatil (data service) si el usuario es el mismo paciente
      this.waitMessage.present();
      try {
        // console.log(regBand.form.value);

        const resp = await this.userService.bandAuth(regBand).toPromise();
        if (resp.success) {
          this.navCtrl.navigateForward('/register');
          this.dataService.registerBand = regBand.form.value;
        } else {
          // this.registerBand.code = '';
          // this.registerBand.pin = '';
        }
        this.toastMessage.presentToast(resp.message);
        // console.log(resp);
      } catch (e) {
        console.log('Error auth band', e);
      }
    } else {
      this.toastMessage.presentToast('Por favor, revisa el formulario');
    }
    this.waitMessage.dismiss();
  }

  back() {
    this.navCtrl.back();
  }
}
