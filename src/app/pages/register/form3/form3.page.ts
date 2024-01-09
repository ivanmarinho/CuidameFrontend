/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { ToastMessage } from 'src/app/utils/toastMessage';
import {  User } from '../../../interfaces/index';
import { DataService } from 'src/app/services/data.service';
import { format, parseISO } from 'date-fns';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form3',
  templateUrl: './form3.page.html',
  styleUrls: ['./form3.page.scss'],
})
export class Form3Page implements OnInit {

  title= 'Antecedentes';
  textNextButton = 'Siguiente';
  editFlag: string;

  user: User;

  antPBoolean = 'no';
  antFBoolean = 'no';

  noAntP = 1;
  listAntP: number[] = [1];
  noAntFam = 1;
  listAntFam: number[] = [1];
  id = '';
  dateValue = '';


  form3Ant = [
    {
      tipoAntecedente: null,
      descripcionAntecedente: null,
      fechaAntecedente: null
    }
  ];

  form6AntF = [
    {
      tipoAntecedenteF: null,
      parentescoF: null,
      descripcionAntecedenteF: null
    }
  ];

  constructor( private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage,
    private dataService: DataService,
    private storageService: StorageService,
    private route: ActivatedRoute,  ) { }

  async ngOnInit() {
    this.editFlag = this.route.snapshot.paramMap.get('editFlag');
    this.setEdit();
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
      this.textNextButton = 'Guardar';
      this.antFBoolean ='si';
      this.antPBoolean = 'si';
      const lastIndex = this.dataService.dataPaciente.antecedentes.length-1;
      this.noAntP = this.dataService.dataPaciente.antecedentes[lastIndex - 1];
      console.log(this.listAntP);
      for (let i = 0; i<this.noAntP; i++ ){
        if (i === 0){
        this.form3Ant[0] = this.dataService.dataPaciente.antecedentes[i];
        continue;
        }
        console.log('hola',i);
        this.listAntP.push(i+1);
        this.form3Ant.push(this.dataService.dataPaciente.antecedentes[i]);
      }
      this.noAntFam = this.dataService.dataPaciente.antecedentes[lastIndex];
      console.log(this.dataService.dataPaciente);
      for (let i = this.noAntP; i<this.noAntFam+this.noAntP; i++ ){
        if (i === this.noAntP){
        this.form6AntF[0] = this.dataService.dataPaciente.antecedentes[i];
        continue;
        }

        this.listAntFam.push(i - this.noAntP + 1);
        this.form6AntF.push(this.dataService.dataPaciente.antecedentes[i]);
        console.log('form6antf',this.form6AntF);
      }
    }
  }

  async onClickNext( fForm3: NgForm ){
    console.log(this.form3Ant);
    console.log(this.form6AntF);

    let info = {};

    try{
      if(fForm3.valid){
        if (this.editFlag === 'new'){
          this.dataService.setFormAntecedentes(this.form3Ant, this.listAntP, this.form6AntF, this.listAntFam);
          this.navCtrl.navigateForward('/form4/new');
        }
        else{ //CASO QUE ESTE EDITANDO
          let allOk = true;
          info = {
            idPaciente: this.dataService.currentUserId,
            antecedentes: this.form3Ant,
            form: 3
          };
          let resp = await this.userService.updateInfo(info,this.user.session_token).toPromise();
          if (!resp.success){
            allOk = false;
          }
          info = {
            idPaciente: this.dataService.currentUserId,
            antecedentesF: this.form6AntF,
            form: 6
          };
          resp = await this.userService.updateInfo(info,this.user.session_token).toPromise();
          if (resp.success && allOk){
            this.navCtrl.navigateRoot('/tab1');
            this.toastMessage.presentToast(resp.message);
          }
        }
      }else{
        this.toastMessage.presentToast('Por favor, revisa el formulario.');
      }
    }catch(e){
      console.log('sigo',e);
    }


  }




  anadirAntP(add: boolean){
    if (add){
      this.noAntP += 1;
      this.listAntP.push(this.noAntP);
      this.form3Ant.push({
        tipoAntecedente: null,
        descripcionAntecedente: null,
        fechaAntecedente: null
      });

    }
    else {
      this.noAntP -= 1;
      this.listAntP.pop();
      this.form3Ant.pop();
    }
    // console.log(this.noAntP);
    // console.log(this.listAntP);
    // console.log(this.form3Ant);
  }

  anadirAntFam(add: boolean){
    if (add){
      this.noAntFam += 1;
      this.listAntFam.push(this.noAntFam);
      this.form6AntF.push({
        tipoAntecedenteF: null,
        parentescoF: null,
        descripcionAntecedenteF: null
      });
    }
    else {
      this.noAntFam -= 1;
      this.listAntFam.pop();
      this.form6AntF.pop();
    }
  }


  formatDate(value: string) {
    let date = '';
    date = format(parseISO(value), 'dd MMMM yyyy');
    return date;
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
