import { PetsService } from './../../../../services/pets/pets.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { StorageService } from 'src/app/services/storage.service';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pet-edit-basic-info',
  templateUrl: 'pet-edit-basic-info.page.html',
  styleUrls: ['pet-edit-basic-info.page.scss'],
})
export class PetEditBasicInfoPage implements OnInit {
  public user: User;
  public code: string;
  public type: string;
  public cargaFinalizada: boolean;
  public petId: string = '';
  public id: string = '';
  public sub: Subscription;
  localServerUrl = 'http://localhost:3000/';
  productionServerUrl = 'https://api.cuidame.tech';

  license = {
    code: '',
  };

  age = '';
  image = '';
  imageLoaded: boolean = false;
  imageUrl: string | ArrayBuffer;

  pet = {
    hashcode: '',
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
    photourl: '',
    photoname: '',
  };

  constructor(
    private petsService: PetsService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private storageService: StorageService,
    public alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.cargaFinalizada = false;
  }

  openFileInput() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    fileInput.click();
  }

  handleFileInput(event: any) {
    //console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.imageLoaded = true;
      };
      this.image = file;
      //console.log(this.image);
    }
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getPetId();
    await this.getUser();
    await this.getPet();
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
        return `${years} año${years > 1 ? 's' : ''} y ${months} mes${
          months > 1 ? 'es' : ''
        }`;
      }
    }
  }

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
      //console.log(form)
      this.toastMessage.presentToast('Por favor revisa los campos');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.petId);

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
    formData.append('photourl', this.pet.photourl);
    formData.append('photoname', this.pet.photoname);

    // console.log(formData.getAll);

    const pesoValue = parseInt(this.pet.peso, 10);

    const heightValue = parseInt(this.pet.estatura, 10);

    // Only append the 'file' field if there is a new image selected
    if (this.image) {
      formData.append('file', this.image);
    }

    const loading = await this.showLoading();

    try {
      if (isNaN(pesoValue) || pesoValue <= 0) {
        this.toastMessage.presentToast('El peso debe ser un número mayor a 1');
      } else if (isNaN(heightValue) || heightValue <= 0) {
        this.toastMessage.presentToast(
          'La estatura debe ser un número mayor a 1'
        );
      } else {
        const resp = await this.petsService
          .addupdate(formData, this.user.session_token)
          .toPromise();
        this.toastMessage.presentToast(resp.message);
        if (resp.success) {
          this.navCtrl.navigateForward('/private/data/show');
        }
      }
      // console.log(resp.message);
    } catch (e) {
      console.log('Error al guardar información de mascota', e);
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();
    console.log(this.petId);
  }

  // Función principal getPet
  async getPet() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          const { id } = user;
          //console.log(id);

          this.petsService
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

                //console.log(this.pet);
                this.cargaFinalizada = true;
              },
              (error) => {
                console.error(error);
              }
            );
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
