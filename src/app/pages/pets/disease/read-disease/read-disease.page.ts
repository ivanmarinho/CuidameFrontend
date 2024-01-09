import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { DiseaseService } from 'src/app/services/pets/disease.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-read-disease',
  templateUrl: './read-disease.page.html',
  styleUrls: ['./read-disease.page.scss'],
})
export class ReadDiseasePage implements OnInit, OnDestroy {
  public finishedLoading: boolean;
  public user: User;
  private subscription: Subscription = new Subscription();
  public petId: string = '';

  constructor(
    private diseaseService: DiseaseService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController
  ) {
    this.finishedLoading = false;
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  disease = {
    id: '',
    typeDiseaseCondition: '',
    name: '',
    diagnisticDate: '',
    status: '',
    description: '',
  };

  async getAll() {
    const sub = this.diseaseService.getAll(this.petId, this.user.session_token).subscribe(
      (response) => {
        this.disease = response;

        this.finishedLoading = true;
        // console.log(this.disease);
      },
      (error) => {
        // console.error(error);
        this.finishedLoading = false;
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
