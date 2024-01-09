/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController, ModalController, NavController } from '@ionic/angular';
import jsQR from 'jsqr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastMessage } from '../../utils/toastMessage';
import { WaitMessage } from '../../utils/waitMessage';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  @ViewChild('video',{ static: false}) video: ElementRef;
  @ViewChild('canvas',{ static: false}) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  stream: any;


  loading: HTMLIonLoadingElement;

  scanActive = true;
  scanResult = null;

  constructor( private toastMessage: ToastMessage,
               private authService: AuthenticationService,
               private navCtrl: NavController,
               private dataService: DataService,
               private toastCtrl: ToastController,
               private loadingCtrl: LoadingController,
               private modalCtrl: ModalController,
               private waitMessage: WaitMessage ) { }

  async ngAfterViewInit(){
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });





    this.videoElement.srcObject = this.stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

   stopVideoOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live' && track.kind === 'video') {
            track.stop();
        }
    });
}

  ngOnDestroy(){
    this.scanActive = false;
    this.stopVideoOnly(this.stream);
  }

  ngOnInit() {
  }

  async scan(){
    console.log('SCAN');
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA){
      if (this.loading){
        await this.loading.dismiss();
        // this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });


      if (code){
        console.log('El codigo QR tiene la siguiente información:',code);
        this.waitMessage.present();
        const resp = await this.authService.verificarQrPolicia(code.data).toPromise();

        console.log(resp);
        this.waitMessage.dismiss();


        if (resp.success){
          this.toastMessage.presentToast('Se ha verificado correctamente la identidad del policia');
          this.navCtrl.navigateForward('/tab1');
          this.modalCtrl.dismiss();
        }else{
          this.toastMessage.presentToast('No hemos logrado verificar su identidad.');
          this.dataService.isCivilAccesing = true;
          this.navCtrl.navigateForward('/tab1');
          this.modalCtrl.dismiss();
        }

        //Codigo de verificación






      }
      else{
        if(this.scanActive){
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    }else{
      requestAnimationFrame(this.scan.bind(this));
    }
  }


  async startScan(){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();
  }

  stopScan(){
    this.scanActive = false;
  }

  reset(){
    this.scanResult = null;
  }

  async showQRToast(){
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

}
