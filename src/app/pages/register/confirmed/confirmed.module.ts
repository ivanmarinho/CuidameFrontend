import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfirmedRoutingModule } from './confirmed-routing.module';
import { ConfirmedPage } from './confirmed.page';



@NgModule({
  declarations: [ConfirmedPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmedRoutingModule,
  ]
})
export class ConfirmedModule { }
