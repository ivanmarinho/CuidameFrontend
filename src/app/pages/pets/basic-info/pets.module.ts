import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PetsRoutingModule } from './pets-routing.module';
import { PetCreateBasicInfoPage } from './pet-create-basic-info/pet-create-basic-info.page';
import { PetReadBasicInfoPage } from './pet-read-basic-info/pet-read-basic-info.page';
import { PetEditBasicInfoPage } from './pet-edit-basic-info/pet-edit-basic-info.page';
import { IonicModule } from '@ionic/angular';
import { AllPetsPage } from './all-pets/all-pets.page';
import { FilterPetsPipe } from 'src/app/utils/filter-pets.pipe';

@NgModule({
  declarations: [
    PetCreateBasicInfoPage,
    PetReadBasicInfoPage,
    PetEditBasicInfoPage,
    AllPetsPage,
    FilterPetsPipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    PetsRoutingModule,
    FormsModule,
    RouterModule,
  ],
})
export class PetsModule {}
