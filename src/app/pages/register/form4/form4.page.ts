/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { User } from '../../../interfaces/index';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { WaitMessage } from 'src/app/utils/waitMessage';

@Component({
  selector: 'app-form4',
  templateUrl: './form4.page.html',
  styleUrls: ['./form4.page.scss'],
})
export class Form4Page implements OnInit {

  title = 'Medicamentos y alergías' ;
  textNextButton = 'Siguiente';
  editFlag: string;


  user: User;

  noMeds = 1;
  listMed: number[] = [1];
  noAlergias = 1;
  listAlergias: number[] = [1];
  idPaciente: string;


  check = true; //Si falla un formulario envia mensaje de error, pero igualmente se registra la informacion

  form4Med = [
    {
      medicamento: null,
      laboratorio: null,
      formula: null
    }
  ];

  form5Alergia = [
    {
      tipoAlergia: null,
      descripcion: null
    }
  ];


  constructor(private userService: UserService,
              public navCtrl: NavController,
              public toastMessage: ToastMessage,
              private dataService: DataService,
              private storageService: StorageService,
              private route: ActivatedRoute,
              public waitMessage: WaitMessage) { }

  async ngOnInit() {
    this.editFlag = this.route.snapshot.paramMap.get('editFlag');
    this.setEdit();
    await this.storageService.init();
    await this.getUser();
  }

  setEdit(){ //La parte visual de la edicion se hace con angular en el documento html
    if (this.editFlag === 'edit'){

      // console.log('infor a editaaras',this.dataService.dataPaciente.medAlergias);

      this.title = 'Editar';
      this.textNextButton = 'Guardar';
      const lastIndex = this.dataService.dataPaciente.medAlergias.length-1;
      this.noMeds = this.dataService.dataPaciente.medAlergias[lastIndex -1];
      for (let i = 0; i<this.noMeds; i++ ){
        if (i === 0){
        this.form4Med[0] = this.dataService.dataPaciente.medAlergias[i];
        continue;
        }
        this.listMed.push(i+1);
        this.form4Med.push(this.dataService.dataPaciente.medAlergias[i]);
      }

      this.noAlergias = this.dataService.dataPaciente.medAlergias[lastIndex];

      for (let i = this.noMeds; i<this.noAlergias+this.noMeds; i++ ){
        if (i === this.noMeds){
        this.form5Alergia[0] = this.dataService.dataPaciente.medAlergias[i];
        continue;
        }
        this.listAlergias.push(i - this.noMeds + 1);
        this.form5Alergia.push(this.dataService.dataPaciente.medAlergias[i]);
      }

    }
  }
  public logOut(){
    this.navCtrl.navigateRoot('/initial');
    this.storageService.clear();
  }

   async onClickNext( fForm4: NgForm ){

    // console.log(this.form4Med);
    // console.log(this.form5Alergia);
    // console.log(this.noMeds, this.listMed);
    // console.log(this.noAlergias, this.listAlergias);
    // console.log(fForm4.form.value);



    if(fForm4.valid && this.editFlag === 'new'){

      this.dataService.setFormMedAlergia(this.form4Med,this.form5Alergia);
      // console.log('info desde data service',this.dataService.form4Med, this.dataService.form5Alergia);
      this.navCtrl.navigateForward('/form5/new');
      return;
      // this.waitMessage.present();
      // console.log(fForm4.valid);
      // this.dataService.setFormMedAlergia(this.form4Med, this.listMed, this.form5Alergia, this.listAlergias);
      let info = {};

      try{

        //////PACIENTE

        // console.log(this.dataService.getForm1());
        let resp = await this.userService.createForm(this.dataService.getForm1(),this.user.session_token).toPromise();
      if (resp.success){
        this.idPaciente = resp.data; //Asignar id para relacionar los siguiente formularios al mismo paciente
      }else{this.check = false;}
      // console.log('Registro paciente',resp);


        ////CONDICION

      const infoCondicion = {
        ...this.dataService.getFormCondicion(),
        idPaciente: this.idPaciente,
        enfermedades: this.dataService.formEnf

      };
      // console.log(infoCondicion);
      resp = await this.userService.createForm(infoCondicion,this.user.session_token).toPromise();
      // console.log('Registro condicion',resp);
      if (!resp.success){this.check = false;}

      //ANTECEDENTES
        info = {
          idPaciente: this.idPaciente,
          antecedentes: this.dataService.form3Ant,
          form: 3
        };
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        // console.log('Registro antecedente personal',resp);
        if (!resp.success){this.check = false;}

        info = {
          idPaciente: this.idPaciente,
          antecedentesF: this.dataService.form6AntF,
          form: 6
        };
         resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        //  console.log('Registro antecedente familiar',resp);
         if (!resp.success){this.check = false;}


       //MED & ALERGIAS

        info = {
          idPaciente: this.idPaciente,
          medicamentos: this.form4Med,
          form: 4
        };
        // console.log(info);
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        // console.log('Registro medciamentos',resp);
        if (!resp.success){this.check = false;}


         info = {
          idPaciente: this.idPaciente,
          alergias: this.form5Alergia,
          form: 5
        };
        // console.log(info);
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        // console.log('Registro alergias',resp);
        if (!resp.success){this.check = false;}

      if (this.check){this.navCtrl.navigateRoot('/tab1');}
      else{this.toastMessage.presentToast('Hubo un error con el registro de la información');this.check = true;}

      }catch(e){
        // console.log('error al subir',e);
      }
    }
    else if (fForm4.valid && this.editFlag === 'edit'){
      let info = {};
        info = {
        idPaciente: this.dataService.currentUserId,
        medicamentos: this.form4Med,
        form: 4
      };
      let allOk = true;
      let resp = await this.userService.updateInfo(info,this.user.session_token).toPromise();
      if (!resp.success){
        allOk = false;
      }
      info = {
        idPaciente: this.dataService.currentUserId,
        alergias: this.form5Alergia,
        form: 5
      };
      resp = await this.userService.updateInfo(info,this.user.session_token).toPromise();
      if (resp.success && allOk){
        this.navCtrl.navigateRoot('/tab1');
        this.toastMessage.presentToast(resp.message);
      }
    }
    else{
      this.toastMessage.presentToast('Por favor, revisa el formulario.');
    }
    this.waitMessage.dismiss();
  }

  anadirMed(add: boolean){
    if (add){
      this.noMeds += 1;
      this.listMed.push(this.noMeds);
      this.form4Med.push({
        medicamento: null,
        laboratorio: null,
        formula: null
      });
    }
    else {
      this.noMeds -= 1;
      this.listMed.pop();
      this.form4Med.pop();
    }
  }

  anadirAlergia(add: boolean){
    if (add){
      this.noAlergias += 1;
      this.listAlergias.push(this.noAlergias);
      this.form5Alergia.push({
        tipoAlergia: null,
        descripcion: null
      });
    }
    else {
      this.noAlergias -= 1;
      this.listAlergias.pop();
      this.form5Alergia.pop();
    }
  }

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        // this.dataService.user = userp;
        // console.log('User coming from storage',this.user);
        // console.log('User coming from data service',this.dataService.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }

}
