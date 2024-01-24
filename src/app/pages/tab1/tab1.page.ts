//////////////////////////////// DESCRIPCION ////////////////////////////////
// ESTA PANTALLA SE USA PARA MOSTRAR LA INFORMACIÓN, TANTO DEL USUARIO QUE //
// SE LOGEA, COMO DE UNA PERSONA QUE ESCANEE EL CODIGO.                    //
/////////////////////////////////////////////////////////////////////////////

/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from '../../services/user.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { InfoPaciente, User } from '../../interfaces/index';
import { StorageService } from 'src/app/services/storage.service';
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { menuController } from '@ionic/core';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { ImageModalPage } from 'src/app/components/image-modal/image-modal.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('titleName', { static: true }) nameUser: ElementRef; //Titulo tab1

  isCivilAccesing: boolean;
  infoToShow = ['nombres', 'eps'];

  contacts = [[], [], []];

  localServerUrl = 'http://localhost:3000/';
  productionServerUrl = 'https://api.cuidame.tech/';

  user: User;
  code: string;
  //interfaz
  sto = []; //Guardar arreglos locales

  noEnf: number;
  enfToShow = [];

  noAnt = []; //Primer valor es # ant personales, segundo # ant familiares

  antPToShow = [];
  antFToShow = [];

  noMedAlergias = []; // Primer valor es # de medicamentos, segundo valor # de familiares

  medToShow = [];
  alergiasToShow = [];

  vacunasToShow = [];

  contact = [
    {
      nombre: '',
      telefono: '',
    },
  ];

  contactshow: any[];

  public categories: string[] = [
    'usuario',
    'condición',
    'antecedentes',
    'medAlergias',
    'vacunas',
  ];
  public iconsNames: string[] = [
    'paciente.svg',
    'condicion.svg',
    'antecedentes.svg',
    'medvac.svg',
    'vacunas.svg',
  ];

  imagenNiño = 'uploads/person/avatars/avatar_child.png';
  imagenNiña = 'uploads/person/avatars/avatar_girl.jpg';
  imagenHombre = 'uploads/person/avatars/avatar_man.png';
  imagenMujer = 'uploads/person/avatars/avatar_woman.jpg';

  public imageUrl: string;
  public gender: string;

  public hashcode: string;
  public selectedCategory: string = this.categories[0];
  public modeloPaciente: any[] = [];
  private currentUserId: string; //This is actually the patient ID
  private userID: string; //This is the user Id;

  private infoPaciente: InfoPaciente = {};

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private geolocation: Geolocation,
    public toastMessage: ToastMessage,
    public navCtrl: NavController,
    private storageService: StorageService,
    private menu: MenuController,
    public alertController: AlertController,
    private qrCode: QrCodeService,
    private modalController: ModalController
  ) {
    this.hashcode = storageService.getPersonHashcode();
  }

  async getPacientHashcode() {
    this.hashcode = this.storageService.getPersonHashcode();
    this.gender = this.dataService.getPersonGender();
  }

  async showImageModal(url: string, path: string) {
    

    path = path.replace(/\\/g, '/');

    if (path === '') {
      return;
    }

    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        imageUrl: url + path,
      },
    });

    return await modal.present();
  }

  // ...

  getImageUrlByTipoPersona( localServerUrl: string, tipoPersona: string, imageUrl: string ): string {
    if (imageUrl === null || imageUrl === undefined || imageUrl === '') {
      switch (tipoPersona) {
        case 'niño':
          return `${localServerUrl}${this.imagenNiño}`;
        case 'niña':
          return `${localServerUrl}${this.imagenNiña}`;
        case 'hombre':
          return `${localServerUrl}${this.imagenHombre}`;
        case 'mujer':
          return `${localServerUrl}${this.imagenMujer}`;
        default:
          return '';
      }
    } else {
      return `${localServerUrl}${imageUrl}`
    }

    
  }

  formatDateInModel() {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    for (const item of this.modeloPaciente) {
      if (item[0] === 'fechaNacimiento') {
        const date = new Date(item[1]);
        const day = date.getDate();
        const month = monthNames[date.getMonth()]; // Obtener el nombre del mes
        const year = date.getFullYear();
        item[1] = `${day} de ${month} de ${year}`;
      }
      if (item[0] === 'fechaNacimiento') {
        item[0] = 'Fecha Nacimiento';
      }
      if (item[0] === 'telefono') {
        item[0] = 'Teléfono';
      }
      if (item[0] === 'genero') {
        item[0] = 'Género';
      }
      if (item[0] === 'direccion') {
        item[0] = 'Dirección';
      }
    }
  }

  async ngOnInit() {
    this.getPacientHashcode();

    this.isCivilAccesing = this.dataService.isCivilAccesing; //Para saber si se esta accediendo como una persona normal (civil)

    await this.storageService.init(); //Iniciar servicio storage
    await this.getUser(); //Obtener informacion de usuario para inicio de sesion

    if (!this.user) {
      this.enviarNotificacion(); //Si no hay un usuario, entonces es un escaneo, por lo tanto se envia notificacion
    }

    this.setTab1(); //Configuraciones
    this.infoPaciente[this.selectedCategory] = await this.retrieveInfo();
    this.modeloPaciente = this.infoPaciente[this.selectedCategory];
    console.log("🚀 ~ Tab1Page ~ ngOnInit ~ this.modeloPaciente:", this.modeloPaciente)
    this.formatDateInModel();
    this.imageUrl = this.modeloPaciente[18][1];
  }

  async enviarNotificacion() {
    const resp = await this.qrCode
      .sendNotification(
        this.dataService.getCodeRequest(),
        this.dataService.getScanLocation(),
        this.dataService.verifObjeto
      )
      .toPromise();
    // console.log('codrequest', resp);
    // if(!resp.success){this.notFound = true;}
    this.toastMessage.presentToast(resp.message);
  }

  public async openMenu() {
    await menuController.open();
  }

  setTab1() {
    if (this.user) {
      this.nameUser['el'].innerHTML = `Hola ${this.user.name}`; //Titulo tab1
      this.code = this.hashcode;
      // console.log("🚀 ~ Tab1Page ~ setTab1 ~ this.code:", this.code)
    } else {
      this.code = this.dataService.getCodeRequest();
    }
  }

  async segmentChanged(event: Event) {
    this.selectedCategory = (event as CustomEvent).detail.value;

    if (
      Object.keys(this.infoPaciente).includes(this.selectedCategory) &&
      this.infoPaciente[this.selectedCategory].length !== 0
    ) {
      this.modeloPaciente = this.infoPaciente[this.selectedCategory];
    } else {
      this.infoPaciente[this.selectedCategory] = await this.retrieveInfo();
      this.modeloPaciente = this.infoPaciente[this.selectedCategory];
    }
    // console.log('modelo paciente', this.modeloPaciente);
    // console.log('infoPaciente', this.infoPaciente);
    //Enfermedades condicion

    if (this.selectedCategory === 'condición' && this.enfToShow.length === 0) {
      //Enfermedades
      // console.log('Enfermedades', this.enfToShow);
      for (let i = 0; i < this.noEnf; i++) {
        this.enfToShow.push(this.modeloPaciente.shift());
      }
    }

    if (
      this.selectedCategory === 'antecedentes' &&
      this.antPToShow.length === 0
    ) {
      //Personales
      for (let i = 0; i < this.noAnt[0]; i++) {
        for (let j = 0; j < 3; j++) {
          this.sto.push(this.modeloPaciente.shift());
        }
        this.antPToShow.push(this.sto);
        this.sto = [];
      }

      //Familiares
      for (let i = 0; i < this.noAnt[1]; i++) {
        for (let j = 0; j < 3; j++) {
          //Son 3 campos
          this.sto.push(this.modeloPaciente.shift());
        }
        this.antFToShow.push(this.sto);
        this.sto = [];
      }
    }

    if (
      this.selectedCategory === 'medAlergias' &&
      this.medToShow.length === 0
    ) {
      //Medicamentos
      for (let i = 0; i < this.noMedAlergias[0]; i++) {
        for (let j = 0; j < 3; j++) {
          this.sto.push(this.modeloPaciente.shift());
        }
        this.medToShow.push(this.sto);
        this.sto = [];
      }
      //Alergias
      for (let i = 0; i < this.noMedAlergias[1]; i++) {
        for (let j = 0; j < 2; j++) {
          this.sto.push(this.modeloPaciente.shift());
        }
        this.alergiasToShow.push(this.sto);
        this.sto = [];
      }
    }

    if (
      this.selectedCategory === 'vacunas' &&
      this.vacunasToShow.length === 0
    ) {
      //Vacuans
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      const noVacunas = this.modeloPaciente.length;
      // console.log('modelo pacienasdaste', this.modeloPaciente.length);
      for (let i = 0; i < noVacunas; i++) {
        this.vacunasToShow.push(this.modeloPaciente.shift());
      }
      // console.log('va', this.vacunasToShow);
    }
  }

  async retrieveInfo(): Promise<string[][]> {
    // eslint-disable-next-line prefer-const
    let datosPaciente = [];

    try {
      // TO DO:
      // Check how to send the code from
      let resp = await this.userService
        .retrieveInfo(this.code, this.selectedCategory, this.currentUserId)
        .toPromise();

      if (resp.success) {
        if (resp.message === 'notFound' && this.user) {
          this.navCtrl.navigateRoot('/form1/new');
          return;
        }
        // console.log('DATA', resp.data);
        if (this.selectedCategory === 'usuario') {
          //asignar el id del paciente para las demas consultas
          this.dataService.currentUserId = resp.data[0].id;
          this.currentUserId = resp.data[0].id;
          this.userID = resp.data[0].a_cargo_id;
          this.dataService.setInfoPaciente(this.selectedCategory, resp.data[0]); //Asignar info para edicion
        }
        if (this.selectedCategory === 'condición') {
          this.noEnf = resp.data[resp.data.length - 1]; //Enfermedades cantidad
          this.dataService.setInfoPaciente(this.selectedCategory, resp.data); //Asignar info para edicion
        }
        if (this.selectedCategory === 'antecedentes') {
          this.noAnt[0] = resp.data[resp.data.length - 2]; //Personales
          this.noAnt[1] = resp.data[resp.data.length - 1]; //Familiares
          this.dataService.setInfoPaciente(this.selectedCategory, resp.data); //Asignar info para edicion
        }
        if (this.selectedCategory === 'medAlergias') {
          this.noMedAlergias[0] = resp.data[resp.data.length - 2]; //Medicamentos
          this.noMedAlergias[1] = resp.data[resp.data.length - 1]; //Alergias
          this.dataService.setInfoPaciente(this.selectedCategory, resp.data);
        }
        if (this.selectedCategory === 'vacunas') {
          this.dataService.setInfoPaciente(this.selectedCategory, resp.data); //Asignar info para edicion
        }

        for (const clave in resp.data) {
          if (Object.prototype.hasOwnProperty.call(resp.data, clave)) {
            // this.dataService.setInfoPaciente(this.selectedCategory,resp.data[clave]);
            Object.entries(resp.data[clave]).forEach((claveValor) => {
              datosPaciente.push(claveValor);
            });
          }
        }
        return datosPaciente;
      } else if (this.user) {
        this.toastMessage.presentToast(
          'Tenemos problemas para conectar con nuestros servidores, por favor intente de nuevo mas tarde.'
        );
      }
    } catch (e) {
      // console.log('error trayendo info', e);
    }

    return datosPaciente;
  }

  goEdit() {
    switch (this.selectedCategory) {
      case 'usuario':
        this.navCtrl.navigateForward('/form1/edit');
        break;
      case 'condición':
        this.navCtrl.navigateForward('/form2/edit');
        break;
      case 'antecedentes':
        this.navCtrl.navigateForward('/form3/edit');
        break;
      case 'medAlergias':
        this.navCtrl.navigateForward('/form4/edit');
        break;
      case 'vacunas':
        this.navCtrl.navigateForward('/form5/edit');
        break;
    }
  }

  goHelpPage() {
    this.navCtrl.navigateForward('/help');
  }

  async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
          this.dataService.user = userp;
        } else {
          this.user = null;
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }

  async logOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro?',
      message: '¿Deseas cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        },
        {
          text: 'Cerrar sesión',
          id: 'confirm-button',
          handler: () => {
            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          },
        },
      ],
    });

    await alert.present();
  }

  async testing() {
    // const resp = await this.userService.test().toPromise();
    this.navCtrl.navigateRoot('/access/SHB001A');
  }

  async goMenu() {
    this.navCtrl.navigateRoot('/private/data/all');
  }

  mayus(str: string): string {
    if (str === '' || str === undefined) {
      return 'n/a';
    }

    str = str.replace('_', ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toogleTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }
}
