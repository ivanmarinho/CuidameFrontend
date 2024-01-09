import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PetCreateVaccineInfoPage } from './pet-create-vaccine-info/pet-create-vaccine-info.page';
import { PetEditVaccineInfoPage } from './pet-edit-vaccine-info/pet-edit-vaccine-info.page';
import { PetReadBasicInfoPage } from '../basic-info/pet-read-basic-info/pet-read-basic-info.page';
import { PetReadVaccineInfoPage } from './pet-read-vaccine-info/pet-read-vaccine-info.page';

const routes: Routes = [
  { path: 'add', component: PetCreateVaccineInfoPage },
  { path: 'show', component: PetReadVaccineInfoPage },
  { path: 'edit', component: PetEditVaccineInfoPage},
  { path: '', component: PetReadBasicInfoPage},

  { path: '**', redirectTo: 'show', pathMatch: 'full' },
  
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PetsVaccineRoutingModule {}
