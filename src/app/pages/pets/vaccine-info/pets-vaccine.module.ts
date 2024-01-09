import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PetCreateVaccineInfoPage } from './pet-create-vaccine-info/pet-create-vaccine-info.page';
import { PetEditVaccineInfoPage } from './pet-edit-vaccine-info/pet-edit-vaccine-info.page';
import { PetsVaccineRoutingModule } from './pets-vaccine-routing.module';
import { PetReadVaccineInfoPage } from './pet-read-vaccine-info/pet-read-vaccine-info.page';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    PetCreateVaccineInfoPage,
    PetEditVaccineInfoPage,
    PetReadVaccineInfoPage
  ],
  imports: [
    CommonModule,
    PetsVaccineRoutingModule,
    FormsModule,
    IonicModule,
    RouterModule,
  ],
})
export class PetsVaccineModule {}
