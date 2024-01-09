import { PetsService } from './../../services/pets/pets.service';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';
import { HTTP } from '@ionic-native/http/ngx';
import { ImageModalPage } from 'src/app/components/image-modal/image-modal.page';
import { environment } from 'src/environments/environment';
const url = environment.url;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  ubicacion = {};
  mascota = {
    petid: '',
    nombre: '',
    especie: '',
    raza: '',
    peso: '',
    sexo: '',
    fechanacimiento: '',
    descripcion: '',
    seguro: '',
    estatura: '',
    color: '',
    temperamento: '',
    nochip: '',
    photourl: '',
    photoname: '',
  };

  owner = {
    name: '',
    lastname: '',
    phone: '',
  };

  hashcode: string;
  infoUser = {};
  sinMascota: boolean;
  age = '';
  public finishedLoading: boolean;
  public finishedOwnerLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage,
    private storageService: StorageService,
    public waitMessage: WaitMessage,
    private dataService: DataService,
    private qrCode: QrCodeService,
    public alertController: AlertController,
    private modalController: ModalController,
    public petsService: PetsService
  ) {
    this.finishedLoading = false;
    this.finishedOwnerLoading = false;
  }

  ServerUrl = `${url}`;

  async ngOnInit() {
    this.hashcode = this.dataService.getCodeRequest();
    this.ubicacion = this.dataService.getScanLocation();
    // console.log('ubication', this.ubicacion);
    await this.buscarMascotas();
    await this.getOwner();
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

  // this.mascota.fechanacimiento = this.formatDate(
  //   new Date(this.mascota.fechanacimiento)
  // );
  // this.age = this.calculateAge(
  //   new Date(this.mascota.fechanacimiento)
  // );

  async getOwner() {
    try {
      this.petsService.getOwnerxPet(this.hashcode).subscribe(
        (response) => {
          this.owner = response;
          this.finishedOwnerLoading = true;
        },
        (error) => {
          // console.error(error);
          this.finishedOwnerLoading = false;
        }
      );
    } catch (error) {
      this.finishedOwnerLoading = false;
    }
  }

  async buscarMascotas() {
    try {
      const respMascota = await this.userService
        .retrieveInfo(this.hashcode, 'mascota', 'none')
        .toPromise();
      console.log(respMascota);

      if (respMascota.message === 'notFound') {
        this.finishedLoading = false;
      } else {
        this.finishedLoading = true;
      }
      // console.log('Pet', respMascota.data);

      respMascota.data.fechanacimiento = this.formatDate(
        new Date(respMascota.data.fechanacimiento)
      );
      this.age = this.calculateAge(new Date(respMascota.data.fechanacimiento));

      //console.log('respmasco', respMascota, this.mascota);

      // infoUser
      const respuesta = await this.userService
        .retrieveInfo(this.hashcode, 'user', 'none')
        .toPromise();
      this.infoUser = respuesta.data;
      // console.log('Usuario', this.infoUser);
      if (respMascota.message === 'notFound') {
        this.sinMascota = true;
        return;
      } else {
        this.mascota = respMascota.data;
        const respNoti = await this.qrCode
          .sendPetNotification(
            this.dataService.getCodeRequest(),
            this.dataService.getScanLocation(),
            '',
            this.mascota.nombre
          )
          .toPromise();

        //console.log('respnoti', respNoti);
      }
    } catch (e) {
      console.log('Error trayendo info de mascota', e);
    }
  }
}
