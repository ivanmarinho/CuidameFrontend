import { PetsService } from './../../../../services/pets/pets.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription, range } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { StorageService } from 'src/app/services/storage.service';
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Storage } from '@ionic/storage-angular';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActivatedRoute } from '@angular/router';
import { ImageModalPage } from 'src/app/components/image-modal/image-modal.page';

@Component({
  selector: 'app-pet-read-basic-info',
  templateUrl: 'pet-read-basic-info.page.html',
  styleUrls: ['pet-read-basic-info.page.scss'],
})
export class PetReadBasicInfoPage implements AfterViewInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  public user: User;
  public code: string;

  public imageSrc: SafeResourceUrl | undefined;
  public type: string;

  public tmpBase64: any;
  private tmp: any;
  public file: File;

  public petId: string = '';

  public finishedLoading: boolean;
  public finishedOwnerLoading: boolean;

  public activeFlag: string = '';
  public agreement: string = '';

  localServerUrl = 'http://localhost:3000/';
  productionServerUrl = 'https://api.cuidame.tech';

  pet = {
    nombre: '',
    especie: '',
    raza: '',
    peso: '',
    sexo: '',
    color: '',
    fechanacimiento: '',
    descripcion: '',
    seguro: '',
    petid: '',
    estatura: '',
    temperamento: '',
    nochip: '',
    photourl: '',
    photoname: '',
  };

  age = '';

  license = {
    code: '',
  };

  id = 0;

  ownerId: string = '';

  owner = {
    name: '',
    lastname: '',
    phone: '',
    city: '',
    department: '',
  };

  constructor(
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private storageService: StorageService,
    public alertController: AlertController,
    public inAppBrows: InAppBrowser,
    public petsService: PetsService,
    public dataService: DataService,
    private modalController: ModalController
  ) {
    this.finishedLoading = false;
    this.finishedOwnerLoading = false;
    this.file = this.tmp;
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();
    // console.log(this.petId);
  }

  async getPetAgreement() {
    const selectedAgreement = this.getRandomAgreement();
    this.agreement = this.storageService.getPetAgreement();
    // console.log(this.agreement);
    if (this.agreement === 'null') {
      this.agreement = selectedAgreement;
    }
  }

  async ngAfterViewInit() {
    this.dataService.setActiveFlag(0);
    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
    await this.getPetAgreement();
    this.getPet();
    this.getOwner();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAd = async () => {

    if (this.agreement == 'SeguroPeludo') {
      this.inAppBrows.create('https://www.seguropeludo.com.co/', '_system');
    } else if (this.agreement === 'IKE') {
      this.inAppBrows.create(
        'https://ikeasistencia.com.co/soluciones.html',
        '_system'
      );
    }
  };

  getRandomAgreement(): string {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? 'SeguroPeludo' : 'IKE';
  }

  async showImageModal(url: string, path: string) {
    path = path.replace(/\\/g, '/');
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        imageUrl: url + path,
      },
    });

    return await modal.present();
  }

  // Función para formatear la fecha de nacimiento
  formatDate(fechaISO: Date): string {
    const day = fechaISO.getDate().toString().padStart(2, '0');
    const month = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const year = fechaISO.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Función para calcular la edad en años y meses
  calculateAge(fechaNacimiento: Date): string {
    const fechaActual = new Date();
    const yearNacimiento = fechaNacimiento.getFullYear();
    const monthNacimiento = fechaNacimiento.getMonth();
    const yearActual = fechaActual.getFullYear();
    const monthActual = fechaActual.getMonth();

    const edadEnMeses =
      (yearActual - yearNacimiento) * 12 + (monthActual - monthNacimiento);

    if (edadEnMeses < 12) {
      return `${edadEnMeses} meses`;
    } else {
      const years = Math.floor(edadEnMeses / 12);
      const months = edadEnMeses % 12;

      if (months === 0) {
        return `${years} año${years > 1 ? 's' : ''}`;
      } else {
        return `${years} año${years > 1 ? 's' : ''}`;
      }
    }
  }

  editPet() {
    this.navCtrl.navigateForward('/private/data/editpet');
    const dataToSendHeader = 'pets';
    this.dataService.setDataHeader(dataToSendHeader);
  }

  getOwner() {
    try {
      const ownerSubscription = this.petsService
        .getOwner(this.user.id, this.user.session_token)
        .subscribe(
          (response) => {
            this.owner = response;
            this.owner.city =
              response.city.charAt(0).toUpperCase() +
              response.city.slice(1).toLowerCase();
            // console.log(response)
            this.finishedOwnerLoading = true;
          },
          (error) => {
            // console.error(error);
            this.finishedOwnerLoading = false;
          }
        );
      this.subscription.add(ownerSubscription);
    } catch (error) {
      this.finishedOwnerLoading = false;
      // console.log(error);
    }
  }

  // Función principal getPet
  getPet() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          const { hashcode } = user;
          this.license.code = hashcode;

          const petSubscription = this.petsService
            .getOnePet(this.petId, this.user.session_token)
            .subscribe(
              (response) => {
                this.pet = response;
                this.pet.fechanacimiento = this.formatDate(
                  new Date(this.pet.fechanacimiento)
                );
                this.age = this.calculateAge(
                  new Date(this.pet.fechanacimiento)
                );

                // console.log(this.pet);
                this.finishedLoading = true;
                //console.log(this.finishedLoading)
              },
              (error) => {
                // console.error(error);
                this.finishedLoading = false;
              }
            );
          this.subscription.add(petSubscription);
        }
      })
      .catch((error) => {
        this.finishedLoading = false;
        // console.error(error);
      });
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
          // console.log('User coming from storage', this.user);
          this.id = Number(this.user.id);
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }
}
