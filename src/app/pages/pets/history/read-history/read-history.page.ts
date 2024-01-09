import { AfterViewInit, Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { DiseaseService } from 'src/app/services/pets/disease.service';
import { MedicamentService } from 'src/app/services/pets/medicament.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-read-history',
  templateUrl: './read-history.page.html',
  styleUrls: ['./read-history.page.scss'],
})
export class ReadHistoryPage implements AfterViewInit {
  isExpanded: boolean = false;
  toggleText: string = '+ Más';
  selectedDisease: any = null;
  selectedTreatment: any = null;
  zIndex = 1000;
  zIndexT = 500;

  toggleDescription(dis: any) {
    if (this.selectedDisease === dis) {
      this.selectedDisease = null;
    } else {
      this.selectedDisease = dis;
    }
  }

  toggleDescriptionT(item: any) {
    if (this.selectedTreatment === item) {
      this.selectedTreatment = null;
    } else {
      this.selectedTreatment = item;
    }
  }

  public finishedLoading: boolean;
  public finishedLoading_: boolean;
  public user: User;
  private subscription: Subscription = new Subscription();
  public petId: string = '';

  constructor(
    private diseaseService: DiseaseService,
    private treatmentService: MedicamentService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private dataService: DataService
  ) {
    this.finishedLoading = false;
    this.finishedLoading_ = false;


  }

  async ngAfterViewInit() {
    this.dataService.setActiveFlag(2);
    await this.storageService.init();
    await this.getUser();
    await this.getPetId();
    await this.getAllDisease();
    await this.getAllTreatment();
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();

    //console.log(this.petId);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatDate(fechaISO: Date): string {
    const day = fechaISO.getDate().toString().padStart(2, '0');
    const month = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const year = fechaISO.getFullYear();
    return `${year}-${month}-${day}`;
  }

  disease = [
    {
      id: '',
      typediseasecondition: '',
      name: '',
      diagnosticdate: '',
      status: '',
      description: '',
      hCardZIndex: '',
      descripCardZIndex: ''
    },
  ];

  treatment = [
    {
      id: '',
      typetreatment: '',
      name: '',
      status: '',
      startdate: '',
      enddate: '',
      frequency: '',
      TCardZIndex: '',
      descripCardZIndexT: ''
    },
  ];

  goToEdit(id: string) {
    this.navCtrl.navigateForward('/private/disease/edit');
    const dataToSend = id;
    this.dataService.setData(dataToSend);
    const dataToSendHeader = 'history';
    this.dataService.setDataHeader(dataToSendHeader);
    // console.log('Clicked!');
  }

  goToAdd() {
    this.navCtrl.navigateForward('/private/disease/add');
    const dataToSend = false;
    this.dataService.setData(dataToSend);
  }

  async getAllDisease() {
    const sub = this.diseaseService
      .getAll(this.petId, this.user.session_token)
      .subscribe(
        (response) => {
          response.forEach((item, index) => {
            item.diagnosticdate = this.formatDate(
              new Date(item.diagnosticdate)
            );
            item.hCardZIndex = this.zIndex--;
            item.descripCardZIndex = this.zIndex--;
          });

          this.disease = response;

          this.finishedLoading = true;
          // console.log(this.disease);
        },
        (error) => {
          console.error(error);
          this.finishedLoading = false;
        }
      );
    this.subscription.add(sub);
  }

  async getAllTreatment() {
    const sub = this.treatmentService
      .getAll(this.petId, this.user.session_token)
      .subscribe(
        (response) => {
          response.forEach((item, index) => {
            item.startdate = this.formatDate(new Date(item.startdate));
            item.enddate = this.formatDate(new Date(item.enddate));
            item.TCardZIndex = this.zIndexT--;
            item.descripCardZIndexT = this.zIndexT--;
          });
          this.treatment = response;

          this.finishedLoading_ = true;
          // console.log(this.treatment);
        },
        (error) => {
          console.error(error);
          this.finishedLoading_ = false;
        }
      );
    this.subscription.add(sub);
  }

  goToEditTreatment(id: string) {
    this.navCtrl.navigateForward('/private/treatment/edit');
    const dataToSend = id;
    this.dataService.setData(dataToSend);
    const dataToSendHeader = 'history';
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
