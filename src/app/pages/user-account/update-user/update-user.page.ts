import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements AfterViewInit, OnInit {
  isDataLoaded: boolean = false;

  public user: User;

  tiposID = [
    {
      valor: 'tarjeta_identidad',
      etiqueta: 'T.I',
    },
    {
      valor: 'cedula_ciudadania',
      etiqueta: 'C.C',
    },
    {
      valor: 'cedula_extranjeria',
      etiqueta: 'C.E',
    },
    {
      valor: 'tarjeta_extranjeria',
      etiqueta: 'T.E',
    },
    {
      valor: 'pasaporte',
      etiqueta: 'PAS',
    },
  ];

  userinfo = {
    name: '',
    lastname: '',
    typeid: '',
    numberid: '',
    phone: '',
    city_id: '',
    address: '',
    department: '',
  };

  hashcode: '';

  name: string;
  greeting: boolean = false;

  type: string;
  service: '';

  license = {
    code: '',
  };

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage,
    private dataService: DataService,
    public waitMessage: WaitMessage,
    public inAppBrows: InAppBrowser,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private loadingCtrl: LoadingController
  ) {}
  selectedDepartment: number | null = null;
  selectedCityId: number | null = null;
  departments: any[] = [];
  townships: any[] = [];

  onDepartmentChange(event: any) {
    this.selectedDepartment = event.detail.value;
    this.selectedCityId = event.detail.value;
    this.getTownshipsForSelectedDepartment();
  }

  onDepartmentFocus(event: any) {
    if (!this.townships.length) {
      this.selectedDepartment = event.target.value;
      this.selectedCityId = null;
      this.getTownshipsForSelectedDepartment();
    }
  }

  ngOnInit(): void {
    this.getHashcode();
  }

  async ngAfterViewInit() {
    await this.storageService.init();
    await this.getDepartments();
    this.getUser();
  }

  async getDepartments() {
    this.userService.getDepartments().subscribe(
      (data: any) => {
        this.departments = data;
        // console.log('departments', this.departments);

        this.getUser();
      },
      (error) => console.error('Error al obtener los departamentos:', error)
    );
  }

  async getTownshipsForSelectedDepartment() {
    if (this.selectedDepartment !== null) {
      this.userService.getTownships(this.selectedDepartment).subscribe(
        (data: any) => {
          this.townships = data;
          if (this.townships.length > 0) {
            this.userinfo.city_id = this.townships[0].id;
          }
        },
        (error) => console.error('Error al obtener las ciudades:', error)
      );
    } else {
      this.townships = [];
    }
  }

  private async getOneUser() {
    const { id } = this.user;
    this.userService.getOneUser(id).subscribe(
      (data: any) => {
        const { city_id } = data;
        this.userinfo = data;
        this.userinfo = data;
        this.selectedDepartment = Number(this.userinfo.department);
        this.selectedCityId = city_id;

        this.loadCityData();
      },
      (error) => console.error('Error al obtener el usuario:', error)
    );
  }

  getHashcode() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          const { hashcode } = user;
          this.license.code = hashcode;
          this.hashcode = hashcode;
          // console.log(this.license);

          this.userService.getLicence(hashcode).subscribe(
            (response) => {
              // console.log(response);
              const { license } = response;
              const { agreement } = response;
              this.type = license;
              // console.log('Tipo', this.type);
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

  private async loadCityData() {
    if (this.selectedDepartment !== null) {
      this.getTownshipsForSelectedDepartment();
    }
  }

  async update(updateForm: NgForm) {
    if (updateForm.valid) {
      const data = { ...this.userinfo, city_id: this.selectedCityId };
      const loading = await this.showLoading();

      try {
        const resp = await this.userService
          .updateUser(data, this.user.session_token)
          .toPromise();
        if (resp.success) {
          await this.storageService.clear();
          this.storageService.set('user', resp.data);
          this.cdr.detectChanges();
          this.dataService.setUsuarioRegistrado(resp.data);
          this.toastMessage.presentToast(
            'Algunos cambios se actualizarán después de iniciar sesión.'
          );

          this.navCtrl.navigateRoot('/private/data/all');
        } else {
          this.toastMessage.presentToast(resp.message);
        }
      } catch (e) {
        console.log('Error al actualizar la información del veterinario');
      } finally {
        if (loading) {
          loading.dismiss();
        }
      }
    } else {
      this.toastMessage.presentToast('Por favor, revisa el formulario.');
    }
    this.waitMessage.dismiss();
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          this.user = user;
          this.getOneUser();
          const { service } = user;
          this.service = service;
        }
      })
      .catch((e) =>
        console.log('Error obteniendo usuario del almacenamiento', e)
      );
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
