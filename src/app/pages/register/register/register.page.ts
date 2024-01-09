import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';
import { UserService } from '../../../services/user.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  passwordVisible: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;

  public toggleTextPassword(isConfirm: boolean = false): void {
    if (isConfirm) {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    } else {
      this.showPassword = !this.showPassword;
    }
  }

  public getType(isConfirm: boolean = false): string {
    return isConfirm
      ? this.showPasswordConfirm
        ? 'text'
        : 'password'
      : this.showPassword
      ? 'text'
      : 'password';
  }

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

  registerO = {
    name: '',
    lastname: '',
    typeID: '',
    numberID: '',
    phone: '',
    email: '',
    password: '',
    city_id: '',
    address: '',
    confirmPassword: '',
    aceptarTerminos: '',
  };

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage,
    private dataService: DataService,
    public waitMessage: WaitMessage,
    public inAppBrows: InAppBrowser
  ) {}
  selectedDepartment: number | null = null; // Inicializado en null
  selectedCityId: number | null = null; // Inicializado en null
  departments: any[] = [];
  townships: any[] = [];
  
  onDepartmentChange(event: any) {
    this.selectedDepartment = event.detail.value;
    this.selectedCityId = null; // Reiniciar el valor de la ciudad al cambiar el departamento
    this.getTownshipsForSelectedDepartment();
  }
  
  ngOnInit() {
    this.getDepartments();
  }
  
  getDepartments() {
    this.userService.getDepartments().subscribe(
      (data: any) => {
        this.departments = data;
        console.log(this.departments);
        console.log(this.selectedDepartment);
      },
      (error) => console.error('Error al obtener los departamentos:', error)
    );
  }
  
  getTownshipsForSelectedDepartment() {
    if (this.selectedDepartment !== null) {
      this.userService.getTownships(this.selectedDepartment).subscribe(
        (data: any) => {
          this.townships = data;
          console.log(this.townships);
        },
        (error) => console.error('Error al obtener las ciudades:', error)
      );
    } else {
      this.townships = []; // Limpiar la lista de ciudades si no se selecciona un departamento
    }
  }

  
  register(fRegister: NgForm) {
    if (
      fRegister.form.value.password !== fRegister.form.value.confirmPassword
    ) {
      this.toastMessage.presentToast(
        'Las contraseñas ingresadas no coinciden.'
      );
      return;
    }

    if (fRegister.form.value.password.length < 4) {
      this.toastMessage.presentToast(
        'La contraseña debe tener al menos 4 caracteres'
      );
      return;
    }

    if (!this.registerO.aceptarTerminos) {
      this.toastMessage.presentToast(
        'Por favor, acepta los terminos y condiciones'
      );
      return;
    }

    if (fRegister.valid) {
      this.waitMessage.present();
      this.dataService.setUsuarioRegistrado(fRegister.form.value);
      try {
        const info = {
          ...fRegister.form.value,
          code: this.dataService.registerBand.code,
          parentesco: this.dataService.registerBand.parentesco,
        };
        // console.log(info);
        this.userService.createUser(info).subscribe((resp) => {
          if (resp.success) {
            this.toastMessage.presentToast(
              '¡El registro se realizó de manera exitosa!'
            );
            // this.navCtrl.pop();
            this.navCtrl.navigateBack('/confirmed');
            const dataToSend = this.registerO.email;
            this.dataService.setData(dataToSend);
          }
        });
      } catch (e) {
        console.log('sigo');
      }
    } else {
      this.toastMessage.presentToast('Por favor, revisa el formulario.');
    }
    this.waitMessage.dismiss();
  }

  abrirPoliticas() {
    console.log('rti');
    // eslint-disable-next-line max-len
    this.inAppBrows.create(
      'https://cuidame.tech/?page_id=690',
      '_system'
    );
  }
}
