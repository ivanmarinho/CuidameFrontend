import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PetCreateBasicInfoPage } from './pet-create-basic-info/pet-create-basic-info.page';
import { PetEditBasicInfoPage } from './pet-edit-basic-info/pet-edit-basic-info.page';
import { PetReadBasicInfoPage } from './pet-read-basic-info/pet-read-basic-info.page';
import { AllPetsPage } from './all-pets/all-pets.page';

const routes: Routes = [
  { path: 'show', component: PetReadBasicInfoPage },
  { path: 'addpet', component: PetCreateBasicInfoPage },
  { path: 'editpet', component: PetEditBasicInfoPage},
  { path: 'all', component: AllPetsPage},

  { path: '', redirectTo: 'show', pathMatch: 'full' },
  
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PetsRoutingModule {}
