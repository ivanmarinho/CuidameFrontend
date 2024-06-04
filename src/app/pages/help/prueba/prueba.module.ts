import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PruebaRoutingModule } from './prueba-routing.module';
import { PruebaPage } from './prueba.page';



@NgModule({
  declarations: [PruebaPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PruebaRoutingModule,
  ]
})
export class PruebaModule { }
