import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BorrarCuentaPageRoutingModule } from './borrar-cuenta-routing.module';

import { BorrarCuentaPage } from './borrar-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrarCuentaPageRoutingModule
  ],
  declarations: [BorrarCuentaPage]
})
export class BorrarCuentaPageModule {}
