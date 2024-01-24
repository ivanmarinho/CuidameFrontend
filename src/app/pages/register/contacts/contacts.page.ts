import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import {  User } from '../../../interfaces/index';
import { ToastMessage } from '../../../utils/toastMessage';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

user: User;



contacts = [
    {
      nombre: '',
      telefono: ''
    },
    {
      nombre: '',
      telefono: ''
    },
    {
      nombre: '',
      telefono: ''
    }
  ];



  constructor(private storageService: StorageService,
              private userService: UserService,
              private toastMessage: ToastMessage,
              public navCtrl: NavController,) { }

  async ngOnInit() {
    await this.getUser();
    // console.log(this.user);
    this.fillContacts();
  }

  // anadirEnf(add: boolean){
  //   if (add){
  //     this.noContacts += 1;
  //     this.listContacts.push(this.noContacts);
  //     this.formContacts.push({
  //      nombre: 'Contacto',
  //      telefono: '3110231232'
  //     });

  //   }
  //   else {
  //     this.noContacts -= 1;
  //     this.listContacts.pop();
  //     this.formContacts.pop();
  //   }
  // }

  async fillContacts(){

    const resp = await this.userService.retrieveInfo(this.user.hashcode,'contacts',this.user.id).toPromise();
    // console.log(resp);
    this.contacts[0].nombre = resp.data.nombre1;
    this.contacts[1].nombre = resp.data.nombre2;
    this.contacts[2].nombre = resp.data.nombre3;
    this.contacts[0].telefono = resp.data.telefono1;
    this.contacts[1].telefono = resp.data.telefono2;
    this.contacts[2].telefono = resp.data.telefono3;
  }

  async guardar(){
    const formContacts = {
      idUsuario: this.user.id,
      nombre1: this.contacts[0].nombre,
      telefono1: this.contacts[0].telefono,
      nombre2: this.contacts[1].nombre,
      telefono2: this.contacts[1].telefono,
      nombre3: this.contacts[2].nombre,
      telefono3: this.contacts[2].telefono
    };
    const resp = await this.userService.registerContacts(formContacts,this.user.session_token).toPromise();
    this.toastMessage.presentToast(resp.message);
    this.navCtrl.navigateRoot('/private/data/all');
    // console.log(resp);


  }

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        // console.log('User coming from storage form2',this.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }



}
