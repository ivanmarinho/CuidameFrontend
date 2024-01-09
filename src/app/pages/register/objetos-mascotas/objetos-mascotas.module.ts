import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjetosMascotasPageRoutingModule } from './objetos-mascotas-routing.module';

import { ObjetosMascotasPage } from './objetos-mascotas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObjetosMascotasPageRoutingModule
  ],
  declarations: [ObjetosMascotasPage]
})
export class ObjetosMascotasPageModule {}
