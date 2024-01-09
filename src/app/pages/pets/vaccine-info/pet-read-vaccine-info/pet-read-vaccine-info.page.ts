import { DataService } from 'src/app/services/data.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { VaccineService } from 'src/app/services/pets/vaccine.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { ImageModalPage } from 'src/app/components/image-modal/image-modal.page';

@Component({
  selector: 'app-pet-read-vaccine-info',
  templateUrl: './pet-read-vaccine-info.page.html',
  styleUrls: ['./pet-read-vaccine-info.page.scss'],
})
export class PetReadVaccineInfoPage implements AfterViewInit, OnDestroy {
  public finishedLoading: boolean;
  public user: User;
  private subscription: Subscription = new Subscription();
  public petId: string = '';
  image = '';
  imageUrl: string | ArrayBuffer;
  localServerUrl = 'http://localhost:3000/';
  productionServerUrl = 'https://api.cuidame.tech';

  constructor(
    private vaccineService: VaccineService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    public dataService: DataService,
    private modalController: ModalController
  ) {
    this.finishedLoading = false;

    

  }

  async ngAfterViewInit() {
    this.dataService.setActiveFlag(1);

    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
    await this.getAll();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();
    // console.log(this.petId);
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

  // Función para formatear la fecha
  formatDate(fechaISO: Date): string {
    const day = fechaISO.getDate().toString().padStart(2, '0');
    const month = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const year = fechaISO.getFullYear();
    return `${year}-${month}-${day}`;
  }

  vaccine = [
    {
      id: '',
      name: '',
      laboratory: '',
      startdate: '',
      nextdate: '',
      dose: '',
      photourl: '',
      photoname: '',
    },
  ];

  async getAll() {
    const sub = this.vaccineService
      .getAll(this.petId, this.user.session_token)
      .subscribe(
        (response) => {
          response.forEach((vaccineItem) => {
            vaccineItem.startdate = this.formatDate(
              new Date(vaccineItem.startdate)
            );
            if (vaccineItem.nextdate != null)
              vaccineItem.nextdate = this.formatDate(
                new Date(vaccineItem.nextdate)
              );
          });
          this.vaccine = response;

          this.finishedLoading = true;
          // console.log(this.vaccine);
        },
        (error) => {
          // console.error(error);
          this.finishedLoading = false;
        }
      );
    this.subscription.add(sub);
  }

  goToAdd() {
    this.navCtrl.navigateForward('/private/vaccine/add');
    const dataToSend = false;
    this.dataService.setData(dataToSend);
  }

  goToEdit(id: string) {
    this.navCtrl.navigateForward('/private/vaccine/edit');
    const dataToSend = id;
    this.dataService.setData(dataToSend);
    const dataToSendHeader = 'vaccine';
    this.dataService.setDataHeader(dataToSendHeader);
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
