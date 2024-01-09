import { PetsService } from 'src/app/services/pets/pets.service';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { StorageService } from 'src/app/services/storage.service';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

import { User } from 'src/app/interfaces';
import { NgForm } from '@angular/forms';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pet-create-basic-info',
  templateUrl: 'pet-create-basic-info.page.html',
  styleUrls: ['pet-create-basic-info.page.scss'],
})
export class PetCreateBasicInfoPage implements OnInit, OnDestroy {
  dataPage: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private userService: UserService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private storageService: StorageService,
    public alertController: AlertController,
    public actionSheet: ActionSheetController,
    private camera: Camera,
    private crop: Crop,
    private petsService: PetsService,
    private loadingCtrl: LoadingController
  ) {
    this.cargaFinalizada = false;
    this.dataPage = this.dataService.getDataPage();
    this.petcode = this.dataService.getCode();
    // console.log('Code?', this.petcode);
  }

  public user: User;
  public code: string;

  public type: string;
  public petcode: any;
  public hashcode: any;

  public cargaFinalizada: boolean;

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
    estatura: '',
    temperamento: '',
    nochip: '',
  };

  license = {
    code: '',
  };

  title = 'uploadfiles';
  image = '';

  uploadProgress: number | undefined;
  uploadResponse: string | undefined;
  //selectedFile: File | undefined;

  imageUrl: string | ArrayBuffer;
  securePath: any;

  photos = new Array<string>();

  openFileInput() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    fileInput.click();
  }

  handleFileInput(event: any) {
    // console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      this.image = file;
      // console.log(this.image);
    }
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getHashcode();
  }

  async getHashcode() {
    try {
      if (this.petcode != '') {
        this.petsService.getHashcode(this.petcode).subscribe(
          (response) => {
            const { hashcode } = response;
            this.hashcode = hashcode;
            // console.log(this.hashcode);
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.hashcode = '';
      }
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnDestroy() {}

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }

  async savePet(form: NgForm) {
    if (!form.valid) {
      // console.log(form);
      this.toastMessage.presentToast('Por favor revisa los campos');
      return;
    }

    const formData = new FormData();
    formData.append('id_usuario', this.user.id);
    formData.append('hashcode', this.hashcode);

    formData.append('nombre', this.pet.nombre);
    formData.append('especie', this.pet.especie);
    formData.append('raza', this.pet.raza);
    formData.append('peso', this.pet.peso);
    formData.append('sexo', this.pet.sexo);
    formData.append('color', this.pet.color);
    formData.append('fechanacimiento', this.pet.fechanacimiento);
    formData.append('descripcion', this.pet.descripcion);
    formData.append('seguro', this.pet.seguro);
    formData.append('estatura', this.pet.estatura);
    formData.append('temperamento', this.pet.temperamento);
    formData.append('nochip', this.pet.nochip);
    formData.append('file', this.image);

    // console.log(formData);

    const loading = await this.showLoading();

    const pesoValue = parseInt(this.pet.peso, 10);
    const heightValue = parseInt(this.pet.estatura, 10);

    try {
      if (!this.image) {
        this.toastMessage.presentToast('Por favor, agrega una imagen');
      } else if (isNaN(pesoValue) || pesoValue <= 0) {
        this.toastMessage.presentToast('El peso debe ser un número mayor a 1');
      } else if (isNaN(heightValue) || heightValue <= 0) {
        this.toastMessage.presentToast(
          'La estatura debe ser un número mayor a 1'
        );
      } else {
        const resp = await this.userService
          .addPet(formData, this.user.session_token)
          .toPromise();
        this.toastMessage.presentToast(resp.message);

        if (resp.success === true) {
          this.dataService.setData(resp.success);
          const { id } = resp.id;
          // console.log('INDENTIFIER', resp.id)
          this.petsService
            .addPetIdentifier(resp.id, this.user.session_token)
            .toPromise();
          this.storageService.setPetId(id);

          this.toastMessage.presentToast(resp.message);
          this.navCtrl.navigateForward('/private/vaccine/add');
        }
        //console.log(resp);
      }
    } catch (e) {
      console.log('Error al guardar información de mascota', e);
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
          // this.dataService.user = userp;
          //console.log('User coming from storage', this.user);
          // console.log('User coming from data service',this.dataService.user);
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }
}
