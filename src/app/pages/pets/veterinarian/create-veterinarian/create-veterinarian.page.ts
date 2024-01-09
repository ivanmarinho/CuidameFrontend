import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { VeterinarianService } from 'src/app/services/pets/veterinarian.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-create-veterinarian',
  templateUrl: './create-veterinarian.page.html',
  styleUrls: ['./create-veterinarian.page.scss'],
})
export class CreateVeterinarianPage implements OnInit {
  public user: User;
  public petId: string = '';
  selectedDepartment: number | null = null; // Inicializado en null
  selectedCityId: number | null = null; // Inicializado en null
  departments: any[] = [];
  townships: any[] = [];

  button: boolean = true;

  constructor(
    private veterinarianService: VeterinarianService,
    private storageService: StorageService,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private userService: UserService,
    private dataService: DataService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) {
    this.button = true;
    this.button = this.dataService.getData();
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    this.getDepartments();
    this.getTownshipsForSelectedDepartment();
    await this.getPetId();
  }

  async getPetId() {
    this.petId = this.storageService.getPetId();
    console.log(this.petId);
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
    fullName: '',
    idType: '',
    idNumber: '',
    phone: '',
    city_id: '',
    address: '',
    email: '',
  };

  onDepartmentChange(event: any) {
    this.selectedDepartment = event.detail.value;
    this.selectedCityId = null; // Reiniciar el valor de la ciudad al cambiar el departamento
    this.getTownshipsForSelectedDepartment();
  }

  getDepartments() {
    this.userService.getDepartments().subscribe(
      (data: any) => {
        this.departments = data;
        // console.log(this.departments);
        // console.log(this.selectedDepartment);
      },
      (error) => console.error('Error al obtener los departamentos:', error)
    );
  }

  getTownshipsForSelectedDepartment() {
    if (this.selectedDepartment !== null) {
      this.userService.getTownships(this.selectedDepartment).subscribe(
        (data: any) => {
          this.townships = data;
          // console.log(this.townships);
        },
        (error) => console.error('Error al obtener las ciudades:', error)
      );
    } else {
      this.townships = []; // Limpiar la lista de ciudades si no se selecciona un departamento
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phoneNumber);
  }

  async add(form: NgForm) {
    if (form.valid) {
      const data = {
        pet_id: this.petId,
        city_id: this.selectedCityId,
        ...this.veterinarian,
      };

      if (!this.isValidEmail(this.veterinarian.email)) {
        this.toastMessage.presentToast('Por favor, agrega un correo válido');
        return;
      }

      if (!this.isValidPhoneNumber(this.veterinarian.phone)) {
        this.toastMessage.presentToast(
          'Por favor, ingresa un número de teléfono válido.'
        );
        return;
      }

      const loading = await this.showLoading();

      try {
        // console.log(data);
        const resp = await this.veterinarianService
          .add(data, this.user.session_token)
          .toPromise();

        if (resp.success) {
          if (this.button === false)
            this.navCtrl.navigateRoot('/private/veterinarian/show');

          form.resetForm();
          this.button = true;
          this.toastMessage.presentToast(resp.message);
        }
      } catch (e) {
        console.log('Error al guardar información');
      } finally {
        if (loading) {
          loading.dismiss();
        }
      }
    } else {
      this.toastMessage.presentToast('Por favor revisa los campos');
    }
  }

  goToPets() {
    this.navCtrl.navigateForward('/private/pets/all');
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
