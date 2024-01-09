import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { DiseaseService } from 'src/app/services/pets/disease.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-create-disease',
  templateUrl: './create-disease.page.html',
  styleUrls: ['./create-disease.page.scss'],
})
export class CreateDiseasePage implements OnInit {
  public user: User;
  public petId: string = '';
  button: boolean;

  constructor(
    private diseaseService: DiseaseService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    public dataService: DataService,
    private modalController: ModalController, private loadingCtrl: LoadingController
  ) {
    this.button = true;
    this.button = this.dataService.getData();
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

  disease = {
    typeDiseaseCondition: '',
    name: '',
    diagnosticDate: '',
    status: '',
    description: '',
  };

  async add(form: NgForm) {
    if (form.valid) {
      const data = {
        pet_id: this.petId,
        ...this.disease,
      };

      const loading = await this.showLoading();

      try {
        const resp = await this.diseaseService
          .add(data, this.user.session_token)
          .toPromise();

        if (resp.success === true) {
          form.resetForm();
          this.dataService.setData(resp.success);
          this.toastMessage.presentToast(resp.message);
        }
      } catch (e) {
        console.log('Error al guardar informacion de la condición');
      } finally {
        if (loading) {
          loading.dismiss();
        }
      }
    } else {
      this.toastMessage.presentToast('Por favor revisa los campos');
    }
  }

  goToTreatment() {
    this.navCtrl.navigateRoot('/private/treatment/add');
    this.dataService.setData(true);
    this.button = false;
  }

  goToTreatmentT() {
    this.navCtrl.navigateRoot('/private/treatment/add');
    this.dataService.setData(false);
    this.button = false;
  }

  goToHistory() {
    this.navCtrl.navigateRoot('/private/history/show');
    this.button = true;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: '¿Deseas agregar algún tratamiento a tu mascota?',
        buttons: [
          {
            text: 'Si',
            handler: () => {
              this.goToTreatment();
            },
          },
          {
            text: 'No',
            handler: () => {
              this.goToHistory();
            },
          },
        ],
      },
    });
    return await modal.present();
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
