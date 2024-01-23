import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { PetsService } from 'src/app/services/pets/pets.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.scss'],
})
export class ManagementPage implements AfterViewInit {
  constructor(
    public navCtrl: NavController,
    private storageService: StorageService,
    private petsService: PetsService,
    private dataService: DataService,
  ) {}

 async ngAfterViewInit() {
  await this.storageService.init();
  await this.getPetId();
  await this.getUser();
  await this.getPet();
 }

 public pacientOrPet: boolean;
  public petId: string = '';
  public user: User;

  personName: string

  pet = {
    id: '',
    nombre: '',
  };

  async getPetId() {
    this.petId = this.storageService.getPetId();
    this.pacientOrPet = this.dataService.getPersonOrPet();
    this.personName = this.dataService.getPersonName()
  }

  goToPersonCare() {
    const dataToSend = true;
    this.dataService.setData(dataToSend);
    this.navCtrl.navigateForward('/private/pages/care');
  }

  goToPersonInfo(){
    this.navCtrl.navigateForward('/tab1');

  }
  async getPet() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          this.petsService
            .getOnePet(this.petId, this.user.session_token)
            .subscribe(
              (response) => {
                this.pet = response;
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

  goToPetInfo() {
    this.navCtrl.navigateForward('/private/data/show');
  }
  goToPetCare() {
    const dataToSend = false;
    this.dataService.setData(dataToSend);
    this.navCtrl.navigateForward('/private/pages/care');
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
