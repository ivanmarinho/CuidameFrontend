import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { VeterinarianService } from 'src/app/services/pets/veterinarian.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-veterinarians',
  templateUrl: './veterinarians.page.html',
  styleUrls: ['./veterinarians.page.scss'],
})
export class VeterinariansPage implements AfterViewInit {

  public finishedLoading: boolean;
  public finishedLoading_: boolean;

  public user: User;
  private subscription: Subscription = new Subscription();
  public petId: string = '';

  public vetRequest: string = ''

  constructor(
    private veterianrianService: VeterinarianService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private dataService: DataService,
    public inAppBrows: InAppBrowser

  ) {
    this.finishedLoading = false;
    this.finishedLoading_ = false;
    this.vetRequest = this.dataService.getVetRequest();
  }

  async ngAfterViewInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
    await this.getDatabaseVets();
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

  database = [
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
      price: '',
      link: false
    },
  ];

  goToCalendy(url: string){
    this.inAppBrows.create(url, '_system');
  }

  async getDatabaseVets(){
    const sub = this.veterianrianService
      .getDatabase(this.vetRequest, this.user.session_token)
      .subscribe(
        (response) => {
          response.forEach((item) => {
            item.city =
            item.city.charAt(0).toUpperCase() +
            item.city.slice(1).toLowerCase();
          });
          
          response.forEach(element => {
            if (element.calendy == null || element.calendy === '') {
              element.link = false;
            } else {
              element.link = true;
            }
          });
          
          this.database = response;
          //console.log('database:' + response)


          this.finishedLoading_ = true;
          //console.log(this.veterinarian);
        },
        (error) => {
          // console.error(error);
          this.finishedLoading_ = false;
        }
      );
    this.subscription.add(sub);
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
