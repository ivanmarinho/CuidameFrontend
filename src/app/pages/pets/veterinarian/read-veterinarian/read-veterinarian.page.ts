import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { VeterinarianService } from 'src/app/services/pets/veterinarian.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { UbicacionService } from 'src/app/services/ubication.service';
import { MapModalComponent } from 'src/app/components/map-modal/map-modal.component';

@Component({
  selector: 'app-read-veterinarian',
  templateUrl: './read-veterinarian.page.html',
  styleUrls: ['./read-veterinarian.page.scss'],
})
export class ReadVeterinarianPage implements AfterViewInit {
  public finishedLoading: boolean;
  public user: User;
  private subscription: Subscription = new Subscription();
  public petId: string = '';
  public latitude: number | undefined;
  public longitude: number | undefined;

  constructor(
    private veterianrianService: VeterinarianService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private dataService: DataService,
    public inAppBrows: InAppBrowser,
    private modalCtrl: ModalController

  ) {
    this.finishedLoading = false;

  }

  async goMaps() {
    // this.navCtrl.navigateForward('/maps')
    const modal = await this.modalCtrl.create({
      component: MapModalComponent,
    });
    modal.present();
  }
  async ngAfterViewInit() {
    this.dataService.setActiveFlag(3);
    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
    await this.getAll();
    // this.obtenerUbicacion()
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();

    // console.log(this.petId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  veterinarian = [
    {
      id: '',
      fullname: '',
      idType: '',
      idNumber: '',
      phone: '',
      city: '',
      department: '',
      address: '',
      email: '',
      calendy: '',
      link: false
    },
  ];

  goToCalendy(url: string){
    this.inAppBrows.create(url, '_system');
  }

  async getAll() {
    const sub = this.veterianrianService
      .getAll(this.petId, this.user.session_token)
      .subscribe(
        (response) => {
          response.forEach((item) => {
            item.city =
              item.city.charAt(0).toUpperCase() +
              item.city.slice(1).toLowerCase();
          });

          response.forEach(element => {
            if (element.calendy == null) {
              element.link = false;
            } else {
              element.link = true;
            }
          });

          this.veterinarian = response;

          this.finishedLoading = true;
          // console.log(this.veterinarian);
        },
        (error) => {
          // console.error(error);
          this.finishedLoading = false;
        }
      );
    this.subscription.add(sub);
  }

  goToAdd() {
    this.navCtrl.navigateForward('/private/veterinarian/add');
    const dataToSend = false;
    this.dataService.setData(dataToSend);
  }

  goToEdit(id: string) {
    this.navCtrl.navigateForward('/private/veterinarian/edit');
    this.dataService.setData(id);
    const dataToSendHeader = 'veterinarian';
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
