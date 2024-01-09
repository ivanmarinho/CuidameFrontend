import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { DataService } from '../../../services/data.service';
import { QrCodeService } from '../../../services/qr-code.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from '../../../utils/waitMessage';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { QrScannerPage } from '../../qr-scanner/qr-scanner.page';
import { VerificationPage } from '../verification/verification.page';
import { AuthenticationPage } from '../authentication/authentication.page';


@Component({
  selector: 'app-access',
  templateUrl: './access.page.html',
  styleUrls: ['./access.page.scss'],
})
export class AccessPage implements OnInit {

codeRequest: string;
ubicacion = {};
// notFound = false;

 public avatars = [
    {
      img: 'persona.png',
      label: 'Ciudadano',
      seleccionado: true
    },
    {
      img: 'policia.png',
      label: 'Policia',
      seleccionado: false
    },
    {
      img: 'paramedico.png',
      label: 'Personal médico',
      seleccionado: false
    },
    {
      img: 'bombero.png',
      label: 'Bombero',
      seleccionado: false
    },
    {
      img: 'militar.png',
      label: 'Defensa civíl',
      seleccionado: false
    }
];

  avatarSlide = {
    slidesPerView: 1.6
  };

  constructor(public navCtrl: NavController,
              private dataService: DataService,
              private route: ActivatedRoute,
              private qrCode: QrCodeService,
              private geolocation: Geolocation,
              public toastMessage: ToastMessage,
              public waitMessage: WaitMessage,
              private barcodeScanner: BarcodeScanner,
              private modalCtrl: ModalController
              ) { }

  async ngOnInit() {
    await this.getPosition();
    // this.enviarNotificacion();
    // await this.openVerificationModal();
  }

  seleccionar(persona: string){

    this.avatars.forEach( av => av.seleccionado = false);
    const avatar = {
      img: '',
      label: persona,
      seleccionado: true
    };
    this.dataService.setAvatar(avatar); //El avatar seleccionado esta en el dataserivce
    if(persona === 'Policia'){
      this.navCtrl.navigateForward('qr-scanner');
    }else{
      this.navCtrl.navigateForward('/authentication');
    }
    this.dataService.isCivilAccesing = false;
  }

  seleccionarAvatar(avatar){
    this.avatars.forEach( av => av.seleccionado = false);
    avatar.seleccionado = true;
    this.dataService.setAvatar(avatar); //El avatar seleccionado esta en el dataserivce
    if (this.dataService.getAvatar().label === 'Ciudadano'){
      this.dataService.isCivilAccesing = true;
      this.navCtrl.navigateForward('/tab1');
    }else if (this.dataService.getAvatar().label === 'Policia'){
      this.openQRScannerModal();

    }
    else{
      this.navCtrl.navigateForward('/authentication');
      this.dataService.isCivilAccesing = false;
    }
  }

  back(){
    this.navCtrl.back();
  }
  navigateInitial(){
    this.navCtrl.navigateRoot('initial');
  }

  async openQRScannerModal(){
    const modal = await this.modalCtrl.create({
      component: QrScannerPage
    });
    await modal.present();
  }

  // async openVerificationModal(){
  //   const modal = await this.modalCtrl.create({
  //     component: VerificationPage,
  //     backdropDismiss: false
  //   });
  //   await modal.present();

  //   await modal.onDidDismiss();

  // }

  // next(){
  //   if (this.dataService.getAvatar().label === 'Ciudadano'){
  //     this.navCtrl.navigateForward('/tab1');
  //   }else{
  //     this.navCtrl.navigateForward('/authentication');
  //   }
  // }

  // async enviarNotificacion(){
  //   this.codeRequest =  this.route.snapshot.paramMap.get('codeRequest');
  //   this.dataService.setCodeRequest(this.codeRequest);
  //   const resp = await this.qrCode.findByCode(this.codeRequest,this.ubicacion,this.dataService.verifObjeto).toPromise();
  //   console.log('codrequest',resp);
  //   // if(!resp.success){this.notFound = true;}
  //   this.toastMessage.presentToast(resp.message);

  // };

  async getPosition(){
    this.waitMessage.present();
    try{
      const resp = await this.geolocation.getCurrentPosition();

      if (resp){
        this.ubicacion = {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        };
        console.log('objeto ubicacion',this.ubicacion);
      }

    }catch(error){
      console.log('Error getting location', error);
    }
    this.waitMessage.dismiss();


  }

    scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('EL barcode es el siguiente');
      console.log('Barcode data', barcodeData.text);
     }).catch(err => {
         console.log('Error', err);
     });
  }

}
