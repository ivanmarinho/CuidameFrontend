import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { VeterinarianService } from 'src/app/services/pets/veterinarian.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-edit-veterinarian',
  templateUrl: './edit-veterinarian.page.html',
  styleUrls: ['./edit-veterinarian.page.scss'],
})
export class EditVeterinarianPage implements OnInit {
  private user: User;
  public petId: string = '';
  public selectedDepartment: number | null = null; // Inicializado en null
  public selectedCityId: number | null = null; // Inicializado en null
  public departments: any[] = [];
  public townships: any[] = [];
  public vet_id = '';
  public finishedLoading: boolean;

  constructor(
    private veterinarianService: VeterinarianService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private userService: UserService,
    private dataService: DataService,
    private loadingCtrl: LoadingController

  ) {
    this.finishedLoading = false;
    this.vet_id = this.dataService.getData();
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getDepartments();
    this.getTownshipsForSelectedDepartment();
    await this.get();
  }

  types = [
    {
      valor: 'Número de Identificación Tributaria',
      etiqueta: 'NIT',
    },
    {
      valor: 'Cédula Ciudadana',
      etiqueta: 'C.C',
    },
    {
      valor: 'Cédula Extranjera',
      etiqueta: 'C.E',
    },
    {
      valor: 'Tarjeta Extranjera',
      etiqueta: 'T.E',
    },
    {
      valor: 'Pasaporte',
      etiqueta: 'PAS',
    },
  ];

  veterinarian = {
    id: '',
    fullname: '',
    idtype: '',
    idnumber: '',
    phone: '',
    department: '',
    city_id: '',
    address: '',
    email: '',
  };

  onDepartmentChange(event: any) {
    this.selectedDepartment = event.detail.value;
    this.selectedCityId = null;
    this.getTownshipsForSelectedDepartment();
  }

  async getDepartments() {
    this.userService.getDepartments().subscribe(
      (data: any) => {
        this.departments = data;
      },
      (error) => console.error('Error al obtener los departamentos:', error)
    );
  }

  getTownshipsForSelectedDepartment() {
    if (this.selectedDepartment !== null) {
      this.userService.getTownships(this.selectedDepartment).subscribe(
        (data: any) => {
          this.townships = data;
  
          if (this.townships.length > 0) {
            this.veterinarian.city_id = this.townships[0].id;
          }
        },
        (error) => console.error('Error al obtener las ciudades:', error)
      );
    } else {
      this.townships = [];
    }
  }
  
  async update(form: NgForm) {
    if (form.valid) {
      const data = {
        city_id: this.selectedCityId,
        ...this.veterinarian,
      };

      const loading = await this.showLoading();

      try {
        const resp = await this.veterinarianService
          .update(data, this.user.session_token)
          .toPromise();
        if (resp.success) {
          this.toastMessage.presentToast(resp.message);
          this.navCtrl.navigateRoot('/private/veterinarian/show');
        }
        this.toastMessage.presentToast(resp.message);
      } catch (e) {
        // console.log('Error al actualizar la información del veterinario');
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
    this.veterinarianService
      .getOne(this.vet_id, this.user.session_token)
      .subscribe(
        (response) => {
          this.veterinarian = response;
          // console.log(this.veterinarian);
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
