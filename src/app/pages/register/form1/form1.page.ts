/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Paciente } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from '../../../interfaces/index';


@Component({
  selector: 'app-form1',
  templateUrl: './form1.page.html',
  styleUrls: ['./form1.page.scss'],
})
export class Form1Page implements OnInit {

  editFlag: string;
  title ='Datos paciente';
  textNextButton = 'Siguiente';

  // code: string;

  user: User;
  name: string;
  flagGeneroOtros: boolean;



  tiposID = [
    {
      valor: 'cedula_ciudadania',
      etiqueta: 'Cédula de ciudadanía'
    },
    {
      valor: 'cedula_extranjeria',
      etiqueta: 'Cedula de extranjería'
    },
    {
      valor: 'tarjeta_extranjeria',
      etiqueta: 'Tarjeta de extranjería'
    },
    {
      valor: 'tarjeta_identidad',
      etiqueta: 'Tarjeta de identidad'
    },
    {
      valor: 'pasaporte',
      etiqueta: 'Pasaporte'
    },
  ];

  generos = [
    {
      valor: 'femenino',
      etiqueta: 'Femenino'
    },
    {
      valor: 'masculino',
      etiqueta: 'Masculino'
    },
    {
      valor: 'otro',
      etiqueta: 'Otro'
    }
  ];


  // newPacient = {
  // id: '',
  // code: 'SHB01A',
  // nombres: 'Juniorrrr',
  // apellidos: 'Hernandez',
  // tipoID: 'cedula_ciudadania',
  // numeroID: '123123123',
  // edad: '22',
  // genero: 'masculino',
  // direccion: 'Diagonal 192',
  // ciudad: 'Floridablanca',
  // departamento: 'Santander',
  // rh: 'o+',
  // eps: 'Sura',
  // prepagada: 'Na',
  // arl: '',
  // seguroFunerario: 'San Padre',
  // telefono: '301311292',

  // };

  newPacient = {
  id: '',
  code: '',
  nombre: '',
  apellido: '',
  tipoID: '',
  numeroID: '',
  fechaNacimiento: '',
  genero: '',
  direccion: null,
  ciudad: null,
  departamento: null,
  rh: null,
  eps: null,
  prepagada: null,
  arl: null,
  seguroFunerario: null,
  telefono: null,

  };


  constructor(  private userService: UserService,
                public navCtrl: NavController,
                public toastMessage: ToastMessage,
                private dataService: DataService,
                private storageService: StorageService,
                private route: ActivatedRoute,
                public alertController: AlertController
                ) { }

  async ngOnInit() {
    this.editFlag = this.route.snapshot.paramMap.get('editFlag');
    this.setEdit();
    this.setUsuarioPaciente();
    await this.storageService.init(); //Await para darle tiempo a que se inicie el servicio antes de obtener el usuario (LoadUser)
    await this.getUser();
    this.newPacient.code = this.user.hashcode;  //Se obtiene el codig de pulsera del dataservice,
                                                      // que lo obtuvo del storage que lo obtuvo del inicio de sesion

  }

  setUsuarioPaciente(){ //Funcion que se ejecuta si el usuario es la persona que usará la banda
    if (this.dataService.getUsuarioPaciente()){

    this.newPacient.nombre = this.dataService.getUsuarioRegistrado()['name'];
    this.newPacient.apellido = this.dataService.getUsuarioRegistrado()['lastname'];
    this.newPacient.telefono = this.dataService.getUsuarioRegistrado()['phone'];
    this.newPacient.tipoID = this.dataService.getUsuarioRegistrado()['typeID'];
    this.newPacient.numeroID = this.dataService.getUsuarioRegistrado()['numberID'];
    }
  }
  setEdit(){ //La parte visual de la edicion se hace con angular en el documento html
    if (this.editFlag === 'edit'){
      this.title = 'Editar';
      this.textNextButton = 'Guardar';
      this.newPacient.nombre = this.dataService.dataPaciente.usuario.nombre;
      this.newPacient.apellido = this.dataService.dataPaciente.usuario.apellido;
      this.newPacient.tipoID = this.dataService.dataPaciente.usuario['Tipo de identificación'];
      this.newPacient.numeroID = this.dataService.dataPaciente.usuario['Número de identificación'];
      this.newPacient.telefono = this.dataService.dataPaciente.usuario.telefono;
      this.newPacient.fechaNacimiento = this.dataService.dataPaciente.usuario.fechaNacimiento;
      this.newPacient.genero = this.dataService.dataPaciente.usuario.genero;
      this.newPacient.direccion = this.dataService.dataPaciente.usuario.direccion;
      this.newPacient.ciudad = this.dataService.dataPaciente.usuario.ciudad;
      this.newPacient.departamento = this.dataService.dataPaciente.usuario.departamento;
      this.newPacient.rh = this.dataService.dataPaciente.usuario.rh;
      this.newPacient.eps = this.dataService.dataPaciente.usuario.eps;
      this.newPacient.prepagada = this.dataService.dataPaciente.usuario.prepagada;
      this.newPacient.arl = this.dataService.dataPaciente.usuario.arl;
      this.newPacient.seguroFunerario = this.dataService.dataPaciente.usuario['Seguro funerario'];
      console.log(this.newPacient);
    }
  }


  public async logOut(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro?',
      message: 'Tu sesión se cerrará y los cambios no se guardarán. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'Cerrar sesión',
          id: 'confirm-button',
          handler: () => {
            this.navCtrl.navigateRoot('/initial');
            this.storageService.clear();
          }
        }
      ]
    });

    await alert.present();
  }

  //Codigo para logica campo "Embarazada"

  recoverGender(event){
    console.log(this.newPacient);
    if (event.detail.value === 'femenino'){
      this.dataService.setWomanFlag(true);
      console.log('form1');
    }
    if (event.detail.value === 'masculino'){
      this.dataService.setWomanFlag(false);
    }
    if (event.detail.value === 'otro'){
     this.flagGeneroOtros = true;
    }else{this.flagGeneroOtros = false;}
  }

  //Boton siguiente formulario

 async onClickNext( fLogin: NgForm ){

    if(fLogin.valid && this.editFlag === 'new'){
      const info = {
        // code: this.code,
        ...fLogin.form.value,
        form: 1,
        aCargoId: this.user.id
      };
      this.dataService.setForm1(info);
      console.log('info data service',this.dataService.infoFormPaciente);
      this.navCtrl.navigateForward('/form2/new');
        //  this.userService.createForm(info,this.user.session_token).subscribe( resp => {
        //    if (resp.success){
        //      this.newPacient.id = resp.data; //Asignar id para relacionar los siguiente formularios al mismo paciente
        //      this.dataService.setForm1(this.newPacient);
        //      this.navCtrl.navigateForward('/form2');
        //    }
        //    this.toastMessage.presentToast(resp.message);
        //    console.log(resp);
        //   });

    } else if(fLogin.valid && this.editFlag === 'edit'){
      console.log('editando');
      const info = {
        // code: this.code,
        ...fLogin.form.value,
        form: 1,
        aCargoId: this.user.id,
        idPaciente: this.dataService.currentUserId
      };
      const resp = await this.userService.updateInfo(info,this.user.session_token).toPromise();
      this.toastMessage.presentToast(resp.message);
      if (resp.success){
        this.navCtrl.navigateRoot('/tab1');
      }
    }
    else{
      this.toastMessage.presentToast('Por favor, revisa el formulario.');
    }
  }

//obtener usuario guardado en el almacenamiento del dispositivo

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        // this.dataService.user = userp;
        console.log('User coming from storage',this.user);
        // console.log('User coming from data service',this.dataService.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }



}
