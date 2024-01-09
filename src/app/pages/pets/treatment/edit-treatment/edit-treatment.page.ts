import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { MedicamentService } from 'src/app/services/pets/medicament.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-edit-treatment',
  templateUrl: './edit-treatment.page.html',
  styleUrls: ['./edit-treatment.page.scss'],
})
export class EditTreatmentPage implements OnInit {
  public user: User;
  public petId: string = '';
  treatment_id: any;
  public finishedLoading: boolean;

  constructor(
    private medicamentService: MedicamentService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    public dataService: DataService,
    private loadingCtrl: LoadingController
  ) {
    this.finishedLoading = false;

    this.treatment_id = this.dataService.getData();
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
    await this.get();
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();
    // console.log(this.petId);
  }

  treatment = {
    id: '',
    typetreatment: '',
    name: '',
    status: '',
    startdate: '',
    enddate: '',
    frequency: '',
  };

  formatDate(fechaISO: Date): string {
    const day = fechaISO.getDate().toString().padStart(2, '0');
    const month = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const year = fechaISO.getFullYear();
    return `${year}-${month}-${day}`;
  }

  validateDateRange(form: NgForm) {
    const startDate = new Date(form.value.startdate);
    const endDate = new Date(form.value.enddate);
  
    if (startDate > endDate) {
      form.controls['enddate'].setErrors({ 'incorrectDate': true });
    } else {
      form.controls['enddate'].setErrors(null);
    }
  }

  async update(form: NgForm) {
    this.validateDateRange(form);
    if (form.valid) {
      const loading = await this.showLoading()
      try {
        const resp = await this.medicamentService
          .update(this.treatment, this.user.session_token)
          .toPromise();
        if (resp.success) {
          this.toastMessage.presentToast(resp.message);
          this.navCtrl.navigateRoot('/private/history/show');
        }
        this.toastMessage.presentToast(resp.message);
      } catch (e) {
        console.log('Error al guardar informacion del tratamiento');
      }finally {
        if (loading) {
          loading.dismiss();
        }
      }
    } else {
      this.toastMessage.presentToast('Por favor revisa los campos');
    }
  }

  async get() {
    this.medicamentService
      .getOne(this.treatment_id, this.user.session_token)
      .subscribe(
        (response) => {
          response.startdate = this.formatDate(new Date(response.startdate));
          response.enddate = this.formatDate(new Date(response.enddate));
          this.treatment = response;
          // console.log(this.treatment);
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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espera un momento, por favor...',
      cssClass: 'custom-loading',
    });

    loading.present();
    return loading;
  }
}
