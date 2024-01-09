import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PetcodePageRoutingModule } from './petcode-routing.module';
import { PetcodePage } from './petcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetcodePageRoutingModule
  ],
  declarations: [PetcodePage]
})
export class PetcodePageModule {}
