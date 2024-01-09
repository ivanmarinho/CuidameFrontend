import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { DiseaseService } from 'src/app/services/pets/disease.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-edit-disease',
  templateUrl: './edit-disease.page.html',
  styleUrls: ['./edit-disease.page.scss'],
})
export class EditDiseasePage implements OnInit {
  public user: User;
  public petId: string = '';
  disease_id: any;
  public finishedLoading: boolean;


  constructor(
    private diseaseService: DiseaseService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private dataService: DataService, private loadingCtrl: LoadingController
  ) {
    this.finishedLoading = false;

    this.disease_id = this.dataService.getData();
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.get()
  }

  disease = {
    id: '',
    typediseasecondition: '',
    name: '',
    diagnosticdate: '',
    status: '',
    description: '',
  };

  formatDate(fechaISO: Date): string {
    const day = fechaISO.getDate().toString().padStart(2, '0');
    const month = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const year = fechaISO.getFullYear();
    return `${year}-${month}-${day}`;
  }

  async update(form: NgForm) {
    if (form.valid) {

      const loading = await this.showLoading();
      try {
        const resp = await this.diseaseService
          .update(this.disease, this.user.session_token)
          .toPromise();
        this.toastMessage.presentToast(resp.message);
        if (resp.success) {
          this.navCtrl.navigateRoot('/private/history/show');
        }
      } catch (e) {
        console.log('Error al actualizar la información de la condición');
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
    this.diseaseService
      .getOne(this.disease_id, this.user.session_token)
      .subscribe(
        (response) => {
          response.diagnosticdate = this.formatDate(new Date(response.diagnosticdate));
          this.disease = response;
          // console.log(this.disease);
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
