import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';
import { WaitMessage } from 'src/app/utils/waitMessage';

@Component({
  selector: 'app-register-object',
  templateUrl: './register-object.page.html',
  styleUrls: ['./register-object.page.scss'],
})
export class RegisterObjectPage implements OnInit {

  user: User;

  nombreObjeto = '';
  descObjeto = '';

  constructor(  private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage,
    private dataService: DataService,
    public waitMessage: WaitMessage,
    private storageService: StorageService,
    private modalCtrl: ModalController) { }

    async ngOnInit() {
      await this.getUser();
      console.log(this.user);
    }
  async agregar(){

    const formObjeto = {
      idUsuario: this.user.id,
      hashcode: this.user.hashcode,
      nombreObjeto:  this.nombreObjeto,
      descObjeto: this.descObjeto,
    };

    try{
      const resp = await this.userService.registerObject(formObjeto,this.user.session_token).toPromise();
        if (resp.success){
          this.toastMessage.presentToast(resp.message);
          this.modalCtrl.dismiss();
        }else{
          //Do something else
        }
    }catch(e){console.log('Error auth band',e);}
  }

  private async getUser(){
    await this.storageService.loadUser().then( (userp) => {
      if(userp){
        this.user = userp;
        console.log('User coming from storage form2',this.user);
      }
    }).catch( (e) => console.log('Error obteniento user storage',e));
  }


}
