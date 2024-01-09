import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';
import { DataService } from '../../../services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  objeto = '';
  escaneado = '';
  codeRequest: string;
  identificado: boolean; //Variable true si el codigo tiene asginado un paciente
  ubicacion = {
    latitude: null,
    longitude: null
  };

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

  type: string;
  
  public cargaFinalizada: boolean;

  constructor( private modalCtrl: ModalController,
               private dataService: DataService,
               public toastMessage: ToastMessage,
               public navCtrl: NavController,
               public waitMessage: WaitMessage,
               private route: ActivatedRoute,
               private qrCode: QrCodeService,
               private geolocation: Geolocation,
               private storageService: StorageService, 
               private userService: UserService) { 
                this.cargaFinalizada = false;
               }

  async ngOnInit() {
    await this.getPosition();
    this.consultarCodigo();
    await this.storageService.init();
    this.storageService.clear();

  }

  async consultarCodigo(){
    this.codeRequest =  this.route.snapshot.paramMap.get('codeRequest');
    this.dataService.setCodeRequest(this.codeRequest);
    const resp = await this.qrCode.findByCode(this.codeRequest,this.ubicacion,this.dataService.verifObjeto).toPromise();
    //console.log('codrequest',resp);
    const code = resp.data.code;

    this.userService.getLicence(code).subscribe(
      (response) => {
        const { license } = response;
        this.type = license;
        //console.log(this.type);
        this.cargaFinalizada = true;
      },
      (error) => {
        console.error(error);
      }
    );

    // console.log(code)
    if (resp.success === true){
     this.identificado = true;
    }else{
      this.identificado = false;
    }
   // console.log('identi',this.identificado);
    // if(!resp.success){this.notFound = true;}
    this.toastMessage.presentToast(resp.message);

  };

  async getPosition(){
    this.waitMessage.present();
    try{
      const resp = await this.geolocation.getCurrentPosition();

      if (resp){
        this.ubicacion.latitude = resp.coords.latitude;
        this.ubicacion.longitude = resp.coords.longitude;
       // console.log('objeto ubicacion',this.ubicacion);
        this.dataService.setScanLocation(this.ubicacion);
      }

    }catch(error){
      console.log('Error getting location', error);
    }
    this.waitMessage.dismiss();


  }

  continuePersona(){
    this.navCtrl.navigateForward('/identify');
  }

  continueObjeto(){
    this.navCtrl.navigateForward('/tab2');
  }

    continueMascota(){
    this.navCtrl.navigateForward('/tab3');
  }

  goNextObjeto(){
    this.dataService.verifObjeto = this.objeto;
    this.dataService.verifObjetoEscaneado = this.escaneado;
    this.modalCtrl.dismiss();

  }

  onNextForEmployee(){
    this.navCtrl.navigateForward('/tab1');
  }

  onChange(){
    //console.log('change');
    this.objeto = '';
  }

  seleccionar(selection){
    this.select.forEach( av => av.seleccionado = false);
    selection.seleccionado = true;
  }

}
