import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.page.html',
  styleUrls: ['./identify.page.scss'],
})
export class IdentifyPage implements OnInit {

  objeto = '';
  escaneado = '';

  public select = [
    {
      img: 'manilla.png',
      label: 'Manilla',
      seleccionado: true
    },
    {
      img: 'otros.png',
      label: 'Otros',
      seleccionado: false
    }
  ];

  constructor( private modalCtrl: ModalController,
               private dataService: DataService,
               public toastMessage: ToastMessage,
               public navCtrl: NavController, ) { }

  ngOnInit() {
  }

  back(){
    this.navCtrl.back();
  }


  navigateInitial(){
    this.navCtrl.navigateRoot('initial');
  }

  onNextForCiudadano(){
    this.dataService.isCivilAccesing = true;
    this.navCtrl.navigateForward('/tab1');
  }

  onNextForEmergencia(){
    this.navCtrl.navigateForward('/access');
  }

  goNextObjeto(){
    this.dataService.verifObjeto = this.objeto;
    this.dataService.verifObjetoEscaneado = this.escaneado;
    this.modalCtrl.dismiss();

  }

  onChange(){
    console.log('change');
    this.objeto = '';
  }

  seleccionar(selection){
    this.select.forEach( av => av.seleccionado = false);
    selection.seleccionado = true;
  }

}
