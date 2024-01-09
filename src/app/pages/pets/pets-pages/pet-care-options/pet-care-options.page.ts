import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-pet-care-options',
  templateUrl: './pet-care-options.page.html',
  styleUrls: ['./pet-care-options.page.scss'],
})
export class PetCareOptionsPage implements OnInit {
  public isClicked = false;
  public agreement: string = '';
  public vetRequest: string = '';
  public serviceRequest: boolean = false;

  constructor(
    private inAppBrows: InAppBrowser,
    public storageService: StorageService,
    public navCtrl: NavController,
    public dataService: DataService
  ) {
    this.serviceRequest = this.dataService.getData();
  }

  toggleClick() {
    this.isClicked = !this.isClicked;
  }

  async ngOnInit() {
    await this.getPetAgreement();
  }

  async getPetAgreement() {
    this.agreement = this.storageService.getPetAgreement();
  }

  goToVeterinarians = async () => {
    this.vetRequest = 'veterinarians'
    this.dataService.setVetRequest(this.vetRequest)
    this.navCtrl.navigateForward('/private/pages/veterinarians')
  };
  openWhatsappBath = async () => {
    this.vetRequest = 'bathroom'
    this.dataService.setVetRequest(this.vetRequest)
    this.navCtrl.navigateForward('/private/pages/veterinarians')
  };
  openWhatsappHotel = async () => {
    this.vetRequest = 'hotel'
    this.dataService.setVetRequest(this.vetRequest)
    this.navCtrl.navigateForward('/private/pages/veterinarians')
  };
  openWhatsappSpa = async () => {
    this.vetRequest = 'wellness'
    this.dataService.setVetRequest(this.vetRequest)
    this.navCtrl.navigateForward('/private/pages/veterinarians')
  };

  // openWhatsappVet = async () => {
  //   if (this.agreement === 'IKE') {
  //     this.inAppBrows.create('https://wa.link/d0note', '_system');
  //   } else {
  //     this.inAppBrows.create('https://wa.link/iab530', '_system');
  //   }
  // };
  // openWhatsappBath = async () => {
  //   if (this.agreement === 'IKE') {
  //     this.inAppBrows.create('https://wa.link/6moeqq', '_system');
  //   } else {
  //     this.inAppBrows.create('https://wa.link/iab530', '_system');
  //   }
  // };
  // openWhatsappHotel = async () => {
  //   if (this.agreement === 'IKE') {
  //     this.inAppBrows.create('https://wa.link/64m8is', '_system');
  //   } else {
  //     this.inAppBrows.create('https://wa.link/iab530', '_system');
  //   }
  // };
  // openWhatsappSpa = async () => {
  //   if (this.agreement === 'IKE') {
  //     this.inAppBrows.create('https://wa.link/mkhjlg', '_system');
  //   } else {
  //     this.inAppBrows.create('https://wa.link/iab530', '_system');
  //   }
  // };
  openWhatsappStore = async () => {
    if (this.agreement === 'IKE') {
      this.inAppBrows.create('https://www.agrocampo.com.co/', '_system');
    } else {
      this.inAppBrows.create('https://www.agrocampo.com.co/', '_system');
    }
  };
  openWhatsappExequial = async () => {
    if (this.agreement === 'IKE') {
      this.inAppBrows.create('https://wa.link/69p5l0', '_system');
    } else {
      this.inAppBrows.create('https://wa.link/iab530', '_system');
    }
  };
}
