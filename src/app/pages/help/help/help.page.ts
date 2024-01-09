import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}

  info() {}
  contactanos() {
    this.navCtrl.navigateForward('/contactus');
  }
  borrarCuenta() {
    this.navCtrl.navigateForward('/borrar-cuenta');
  }
}
