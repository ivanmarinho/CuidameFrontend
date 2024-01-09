import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewPasswordPage } from './new-password.page';
import { NewPasswordRoutingModule } from './new-password-routing.module';



@NgModule({
  declarations: [NewPasswordPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPasswordRoutingModule
  ]
})
export class NewPasswordModule { }
