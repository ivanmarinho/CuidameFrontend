import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterBandPageRoutingModule } from './register-band-routing.module';

import { RegisterBandPage } from './register-band.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterBandPageRoutingModule
  ],
  declarations: [RegisterBandPage]
})
export class RegisterBandPageModule {}
