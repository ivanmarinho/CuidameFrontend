import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { VaccineService } from 'src/app/services/pets/vaccine.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-pet-create-vaccine-info',
  templateUrl: './pet-create-vaccine-info.page.html',
  styleUrls: ['./pet-create-vaccine-info.page.scss'],
})
export class PetCreateVaccineInfoPage implements OnInit {
  public user: User;
  public petId: string = '';
  image = '';
  imageUrl: string | ArrayBuffer;
  button: boolean;

  constructor(
    private vaccineService: VaccineService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    public dataService: DataService,
    private loadingCtrl: LoadingController
  ) {
    this.button = true;
    this.button = this.dataService.getData();
    // console.log(this.button);
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();
    // console.log(this.petId);
  }

  vaccine = {
    name: '',
    laboratory: '',
    startDate: '',
    nextDate: '',
    dose: '',
    photoUrl: '',
    photoName: '',
  };

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

  validateDateRange(form: NgForm) {
    const startDate = new Date(form.value.startDate);
    const nextDate = new Date(form.value.nextDate);
    if (startDate > nextDate) {
      form.controls['nextDate'].setErrors({ 'incorrectDate': true });
    } else {
      form.controls['nextDate'].setErrors(null);
    }
  }

  async add(form: NgForm) {
    this.validateDateRange(form);
    if (!form.valid) {
      this.toastMessage.presentToast('Por favor revisa los campos');
      return;
    }

    const formData = new FormData();
    formData.append('pet_id', this.petId);

    formData.append('name', this.vaccine.name);
    formData.append('laboratory', this.vaccine.laboratory);
    formData.append('startDate', this.vaccine.startDate);
    formData.append('nextDate', this.vaccine.nextDate);
    formData.append('dose', this.vaccine.dose);
    formData.append('file', this.image);

    const loading = await this.showLoading()

    try {
      if (!this.image) {
        this.toastMessage.presentToast('Por favor, agrega una imagen');
      } else {
        const resp = await this.vaccineService
          .add(formData, this.user.session_token)
          .toPromise();

        if (this.button === false)
          this.navCtrl.navigateRoot('/private/vaccine/show');
        if (resp.success === true) {
          this.imageUrl = null;

          this.dataService.setData(resp.success);
          form.resetForm();
          this.button = true;
          this.toastMessage.presentToast(resp.message);
        }
        //console.log(resp);
      }
    } catch (e) {
      console.log('Error al guardar información de mascota', e);
    }finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }

  goToDisease() {
    this.navCtrl.navigateForward('/private/disease/add');
    this.dataService.setData(true);
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }
}
