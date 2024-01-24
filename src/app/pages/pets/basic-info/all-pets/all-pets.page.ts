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
  personaArray = [
    {
      code: '',
      nombre: '',
      agreement: '',
      photourl: '',
      fecha_nacimiento: '',
      genero: '',
    },
  ];

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
    this.navCtrl.navigateRoot('/private/data/all');
  }

  getEdadYGenero(persona: any): { edad: number; genero: string } {
    const fechaNacimiento = new Date(persona.fecha_nacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const genero = persona.genero.toLowerCase();

    return { edad: Number(edad.toString()), genero: genero };
  }

  getImagenPorEdadYGenero(persona: any): string {
    const { edad, genero } = this.getEdadYGenero(persona);

    if (edad < 18) {
      return genero === 'masculino'
        ? 'uploads/person/avatars/avatar_child.png'
        : 'uploads/person/avatars/avatar_girl.jpg';
    } else {
      return genero === 'masculino'
        ? 'uploads/person/avatars/avatar_man.png'
        : 'uploads/person/avatars/avatar_woman.jpg';
    }
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
    this.dataService.setPersonOrPet(true);
  }

  goToPerson(hashcode: string, agreement: string, name: string) {

    const persona = this.personaArray.find((per) => per.code === hashcode);
    const { edad, genero } = this.getEdadYGenero(persona);

    let tipoPersona: string;
    if (edad < 18) {
      tipoPersona = genero === 'masculino' ? 'niño' : 'niña';
    } else {
      tipoPersona = genero === 'masculino' ? 'hombre' : 'mujer';
    }

    this.navCtrl.navigateForward('/private/pages/manage');
    this.storageService.setPersonHashcode(hashcode);
    this.dataService.setPersonOrPet(false);
    this.storageService.setPetAgreement(agreement);

    this.storageService.setPersonName(name);

    this.dataService.setPersonGender(tipoPersona);
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
