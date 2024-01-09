import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { User } from '../../../interfaces/index';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { WaitMessage } from 'src/app/utils/waitMessage';

@Component({
  selector: 'app-form5',
  templateUrl: './form5.page.html',
  styleUrls: ['./form5.page.scss'],
})
export class Form5Page implements OnInit {



  editFlag: string;
  title = 'Vacunas' ;
  textNextButton = 'Finalizar';
  check = true;

  user: User;

  idPaciente: string;
  noAlergias: number;
  form5Vacunas = [
    {
      vacuna: null
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

  addVacuna(add: boolean){
    if (add){
      this.form5Vacunas.push({
        vacuna: null
      });
      // this.noEnf += 1;
      // this.listEnf.push(this.noEnf);
      // this.formEnf.push({
      //   enfermedad: null
      // });

    }
    else {
      this.form5Vacunas.pop();
      // this.noEnf -= 1;
      // this.listEnf.pop();
      // this.formEnf.pop();
    }
  }



  async onClickNext( fForm4: NgForm ){


    if(fForm4.valid && this.editFlag === 'new'){
      this.waitMessage.present();
      console.log(fForm4.valid);
      // this.dataService.setFormMedAlergia(this.form4Med, this.listMed, this.form5Alergia, this.listAlergias);
      let info = {};

      try{

        //////PACIENTE

        console.log(this.dataService.getForm1());
        let resp = await this.userService.createForm(this.dataService.getForm1(),this.user.session_token).toPromise();
      if (resp.success){
        this.idPaciente = resp.data; //Asignar id para relacionar los siguiente formularios al mismo paciente
      }else{this.check = false;}
      console.log('Registro paciente',resp);


        ////CONDICION

      const infoCondicion = {
        ...this.dataService.getFormCondicion(),
        idPaciente: this.idPaciente,
        enfermedades: this.dataService.formEnf

      };
      console.log(infoCondicion);
      resp = await this.userService.createForm(infoCondicion,this.user.session_token).toPromise();
      console.log('Registro condicion',resp);
      if (!resp.success){this.check = false;}

      //ANTECEDENTES
        info = {
          idPaciente: this.idPaciente,
          antecedentes: this.dataService.form3Ant,
          form: 3
        };
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        console.log('Registro antecedente personal',resp);
        if (!resp.success){this.check = false;}

        info = {
          idPaciente: this.idPaciente,
          antecedentesF: this.dataService.form6AntF,
          form: 6
        };
         resp = await this.userService.createForm(info,this.user.session_token).toPromise();
         console.log('Registro antecedente familiar',resp);
         if (!resp.success){this.check = false;}


       //MED & ALERGIAS

        info = {
          idPaciente: this.idPaciente,
          medicamentos: this.dataService.form4Med,
          form: 4
        };
        console.log(info);
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        console.log('Registro medciamentos',resp);
        if (!resp.success){this.check = false;}


         info = {
          idPaciente: this.idPaciente,
          alergias: this.dataService.form5Alergia,
          form: 5
        };
        console.log(info);
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        console.log('Registro alergias',resp);
        if (!resp.success){this.check = false;}

        //VACUNAS

        info = {
          vacunas: this.form5Vacunas,
          idPaciente: this.idPaciente,
          form: 7
        };
        console.log('INFOVACUNAS',info);
        resp = await this.userService.createForm(info,this.user.session_token).toPromise();
        console.log('Registro vacunas',resp);
        if (!resp.success){this.check = false;}

      if (this.check){this.navCtrl.navigateRoot('/tab1');}
      else{this.toastMessage.presentToast('Hubo un error con el registro de la información');this.check = true;}

      }catch(e){
        console.log('error al subir',e);
      }
    }
    else if (fForm4.valid && this.editFlag === 'edit'){
      console.log('form5vacunas',this.form5Vacunas);
      const info = {
        vacunas: this.form5Vacunas,
        idPaciente: this.dataService.currentUserId,
        form: 7
      };
      const resp = await this.userService.updateInfo(info,this.user.session_token).toPromise();
      if (resp.success){
        this.navCtrl.navigateRoot('/tab1');
        this.toastMessage.presentToast(resp.message);
      }
    }
    else{
      this.toastMessage.presentToast('Por favor, revisa el formulario.');
    }
    this.waitMessage.dismiss();
  }

  setEdit(){ //La parte visual de la edicion se hace con angular en el documento html
    if (this.editFlag === 'edit'){
      this.title = 'Editar';
      this.textNextButton = 'Guardar';
      console.log('info edit',this.dataService.dataPaciente.vacunas);
      this.form5Vacunas = this.dataService.dataPaciente.vacunas; //Lenar campos
    }
  }

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
