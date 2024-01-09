/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { IonInfiniteScroll, NavController, PopoverController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { Form2, User } from '../../../interfaces/index';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';


  @Component({
    selector: 'app-form2',
  templateUrl: './form2.page.html',
  styleUrls: ['./form2.page.scss'],
})
export class Form2Page implements OnInit {

  title = 'Condición del paciente';
  editFlag: string;
  textNextButton = 'Siguiente';

  noEnf = 1;
  listEnf: number[] = [1];

  formEnf = [
    {
      enfermedad: null
    }
  ];

  // enfermedades = [{ 'name': 'Ántrax' }, { 'name': 'Asma' }, { 'name': 'Cáncer' }, { 'name': 'Clamidia' }, { 'name': 'Culebrilla' }, { 'name': 'Déficit de atención e hiperactividad' }
  //               , { 'name': 'Diabetes' }, { 'name': 'Enfermedades de transmisión sexual (ETS)' }, { 'name': 'Epilepsia' }, { 'name': 'Gonorrhea' }, { 'name': 'Hemofilia' }, { 'name': 'Meningitis' }
  //               , { 'name': 'Neumonía' }, { 'name': 'Paperas' }, { 'name': 'Rabia' }, { 'name': 'Sífilis' }, { 'name': 'Síndrome alcohólico fetal' }, { 'name': 'Síndrome de fatiga crónica (SFC)' }
  //               , { 'name': 'Síndrome de Tourette' }, { 'name': 'Tabaquismo' }, { 'name': 'Tricomoniasis' }, { 'name': 'Tuberculosis (TB)' }, { 'name': 'VIH/Sida' }, { 'name': 'Zika' }];

  user: User;
  womanFlag: boolean;


  form2: Form2 = {
    idPaciente: '',
    enfermedadB: 'no',
    diagEnfermedad: null,
    // codDiagnostico: null,
    discapacidadB: 'no',
    discapacidad: null,
    embarazada: null,
    cicatricesB: 'no',
    // cicatricesLugar: null,
    cicatricesDescripcion: null,
    tatuajesB: 'no',
    // tatuajesLugar: null,
    tatuajesDescripcion: null
  };


  constructor(  private userService: UserService,
                public navCtrl: NavController,
                public toastMessage: ToastMessage,
                private dataService: DataService,
                private storageService: StorageService,
                private popoverController: PopoverController,
                private route: ActivatedRoute,) { }



 async ngOnInit() {
    this.editFlag = this.route.snapshot.paramMap.get('editFlag');
    this.setEdit();
    this.womanFlag = this.dataService.getWomanFlag();
    // this.form2.idPaciente = this.dataService.getForm1()['id'];
    await this.storageService.init();
    await this.getUser();
  }
  public logOut(){
    this.navCtrl.navigateRoot('/initial');
    this.storageService.clear();
  }

  setEdit(){ //La parte visual de la edicion se hace con angular en el documento html
    if (this.editFlag === 'edit'){
      this.title = 'Editar';
      this.form2.enfermedadB = 'si';
      this.form2.discapacidadB = 'si';
      this.form2.tatuajesB = 'si';
      this.form2.cicatricesB = 'si';
      this.textNextButton = 'Guardar';
      const lastIndex = this.dataService.dataPaciente.condición.length-1; //dataPacente es un objeto con toda la informacion del paciente (Paciente, condicion,antecedentes,enferemdades)
      this.noEnf = this.dataService.dataPaciente.condición[lastIndex]; //No enf es la cantidad de enfermedades, devuelto por el backend.
      for (let i = 0; i<this.noEnf; i++ ){

        if (i === 0){
        this.formEnf[0] = this.dataService.dataPaciente.condición[i];
        continue;
        }
        this.listEnf.push(i+1);
        this.formEnf.push(this.dataService.dataPaciente.condición[i]);
      }
      console.log(this.dataService.dataPaciente.condición[this.noEnf]);
      this.form2.discapacidad = this.dataService.dataPaciente.condición[this.noEnf].discapacidad;
      this.form2.cicatricesDescripcion = this.dataService.dataPaciente.condición[this.noEnf].cicatrices;
      this.form2.tatuajesDescripcion = this.dataService.dataPaciente.condición[this.noEnf].tatuajes;
      this.form2.embarazada = this.dataService.dataPaciente.condición[this.noEnf].embarazada;
    }
  }
  

  async onClickNext( fForm2: NgForm ){
    console.log(fForm2.form.value);
    console.log(fForm2.valid);
    // console.log(this.formEnf);
    if(fForm2.valid){
      if(this.editFlag === 'new'){
        const info = {
          ...this.form2,
          form: 2
        };
        this.dataService.setFormEnfermedades(this.formEnf,this.listEnf);
        this.dataService.setFormCondicion(info);
        console.log(info);
        this.navCtrl.navigateForward('/form3/new');
        //  this.userService.createForm(info,this.user.session_token).subscribe( resp => {
        //    if (resp.success){
        //      this.navCtrl.navigateForward('/form3');

        //    }
        //    this.toastMessage.presentToast(resp.message);
        //    console.log(resp);
        //   });
      }else{
        const info = {
          ...this.form2,
          form: 2,      //Este es el numero de formulario para que el servidor sepa a donde va la información, analogo a todos los formularios
          idPaciente: this.dataService.currentUserId,
          enfermedades: this.formEnf,
        };
        const resp = await this.userService.updateInfo(info,this.user.session_token).toPromise(); //Servicio para actualizar informacion
        console.log(resp);
        if (resp.success){
          this.toastMessage.presentToast(resp.message);
          this.navCtrl.navigateRoot('/tab1');
        }
      }
    }else{
      this.toastMessage.presentToast('Por favor, revisa el formulario.');
    }
  }

  anadirEnf(add: boolean){
    if (add){
      this.noEnf += 1;
      this.listEnf.push(this.noEnf);
      this.formEnf.push({
        enfermedad: null
      });

    }
    else {
      this.noEnf -= 1;
      this.listEnf.pop();
      this.formEnf.pop();
    }
  }

  // public selectEnfermedad(selection){
  //   console.log(selection);
  //   this.form2.diagEnfermedad = selection.name;
  //   this.popoverController.dismiss();
  // }

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        console.log('User coming from storage form2',this.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }




}
