import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { PetsService } from 'src/app/services/pets/pets.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
// const images = environment.images;
@Component({
  selector: 'app-all-pets',
  templateUrl: './all-pets.page.html',
  styleUrls: ['./all-pets.page.scss'],
})
export class AllPetsPage implements AfterViewInit {
  public finishedLoading: boolean;
  public finishedPersonaLoading: boolean;
  public user: User;
  private subscription: Subscription = new Subscription();
  private subscriptionPersona: Subscription = new Subscription();
  public searchTerm: string = '';
  id = 0;

  localServerUrl = 'http://localhost:3000/';
  productionServerUrl = 'https://api.cuidame.tech/';
  uidentificador: string = '';

  pet: boolean = false;

  license = {
    code: '',
  };

  petsArray = [{ id: '', nombre: '', agreement: '', photourl: '' }];
  personaArray = [{ id: '', nombre: '', agreement: '', photourl: '' }];

  hashcode: '';

  name: string;
  greeting: boolean = false;

  type: string;
  constructor(
    public navCtrl: NavController,
    private storageService: StorageService,
    private petsService: PetsService,
    private dataService: DataService,
    private userService: UserService
  ) {
    this.finishedLoading = false;
  }

  async ngAfterViewInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getUsersPets();
    this.navCtrl.navigateRoot('/private/pets/all');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goToCreatePet() {
    this.navCtrl.navigateForward('/petcode');
  }

  goToPet(id: string, agreement: string) {
    this.navCtrl.navigateForward('/private/pages/manage');
    this.storageService.setPetId(id);
    this.storageService.setPetAgreement(agreement);
  }

  goToPerson(hashcode: string) {
    this.navCtrl.navigateForward('/tab1');
    this.storageService.setPacientHashcode(hashcode);
  }

  async getUsersPets() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          this.uidentificador = this.user.id;
          const petSubscription = this.petsService
            .getAllPets(this.uidentificador, this.user.session_token)
            .subscribe(
              (response) => {
                this.petsArray = response;

                this.finishedLoading = true;
                // console.log(this.petsArray);
              },
              (error) => {
                console.error(error);
                this.finishedLoading = false;
              }
            );

          const personaSub = this.userService
            .getAllPersons(this.uidentificador, this.user.session_token)
            .subscribe(
              (response) => {
                this.personaArray = response;
                // console.log("🚀 ~ AllPetsPage ~ .then ~ this.personaArray:", this.personaArray)
                
                this.finishedPersonaLoading = true;
              },
              (error) => {
                console.error(error);
                this.finishedPersonaLoading = false;
              }
            );
          this.subscription.add(petSubscription);
          this.subscription.add(personaSub);
        }
      })
      .catch((error) => {
        this.finishedLoading = false;
        this.finishedPersonaLoading = false;

        // console.error(error);
      });
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
          const { name } = userp;
          this.name = name;
          // this.dataService.user = userp;
          this.id = Number(this.user.id);
          // console.log('User coming from data service',this.dataService.user);
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }
}
