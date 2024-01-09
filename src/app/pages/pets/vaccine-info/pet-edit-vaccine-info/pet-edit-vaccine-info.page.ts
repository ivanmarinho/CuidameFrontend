import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { VaccineService } from 'src/app/services/pets/vaccine.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-pet-edit-vaccine-info',
  templateUrl: './pet-edit-vaccine-info.page.html',
  styleUrls: ['./pet-edit-vaccine-info.page.scss'],
})
export class PetEditVaccineInfoPage implements OnInit {
  public user: User;
  public petId: string = '';
  public finishedLoading: boolean;
  vaccine_id: any;
  image = '';
  imageUrl: string | ArrayBuffer;
  imageLoaded: boolean = false;

  localServerUrl = 'http://localhost:3000/';
  productionServerUrl = 'https://api.cuidame.tech';

  constructor(
    private vaccineService: VaccineService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private dataService: DataService,
    private loadingCtrl: LoadingController
  ) {
    this.finishedLoading = false;
    this.vaccine_id = this.dataService.getData();
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.get();
  }

  vaccine = {
    id: '',
    name: '',
    laboratory: '',
    startdate: '',
    nextdate: '',
    dose: '',
    photourl: '',
    photoname: '',
  };

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

  formatDate(fechaISO: Date): string {
    const day = fechaISO.getDate().toString().padStart(2, '0');
    const month = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const year = fechaISO.getFullYear();
    return `${year}-${month}-${day}`;
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }

  validateDateRange(form: NgForm) {
    const startDate = new Date(form.value.startdate);
    const nextDate = new Date(form.value.nextdate);
    if (startDate > nextDate) {
      form.controls['nextdate'].setErrors({ 'incorrectDate': true });
    } else {
      form.controls['nextdate'].setErrors(null);
    }
  }


  async update(form: NgForm) {
    this.validateDateRange(form);
    if (!form.valid) {
      // console.log(form);
      this.toastMessage.presentToast('Por favor revisa los campos');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.vaccine.id);
    formData.append('name', this.vaccine.name);
    formData.append('laboratory', this.vaccine.laboratory);
    formData.append('startDate', this.vaccine.startdate);
    formData.append('nextDate', this.vaccine.nextdate);
    formData.append('dose', this.vaccine.dose);
    formData.append('photourl', this.vaccine.photourl);
    formData.append('photoname', this.vaccine.photoname);

    if (this.image) {
      formData.append('file', this.image);
    }

    const loading = await this.showLoading();

    try {
      const resp = await this.vaccineService
        .update(formData, this.user.session_token)
        .toPromise();
      this.toastMessage.presentToast(resp.message);
      if (resp.success) {
        this.imageUrl = null;
      }
      this.navCtrl.navigateForward('/private/vaccine/show');
      // console.log(resp.message);
    } catch (e) {
      console.log('Error al guardar información de vacuna', e);
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }

  async get() {
    this.vaccineService
      .getOne(this.vaccine_id, this.user.session_token)
      .subscribe(
        (response) => {
          response.nextdate = this.formatDate(new Date(response.nextdate));
          response.startdate = this.formatDate(new Date(response.startdate));
          this.vaccine = response;
          // console.log(this.vaccine);
          this.finishedLoading = true;
        },
        (error) => {
          this.finishedLoading = true;
        }
      );
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
}
