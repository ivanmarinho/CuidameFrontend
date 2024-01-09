import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterObjectPageRoutingModule } from './register-object-routing.module';

import { RegisterObjectPage } from './register-object.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterObjectPageRoutingModule
  ],
  declarations: [RegisterObjectPage]
})
export class RegisterObjectPageModule {}
