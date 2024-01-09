import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPage } from './management/management.page';
import { PetCareOptionsPage } from './pet-care-options/pet-care-options.page';
import { VeterinariansPage } from './veterinarians/veterinarians.page';

const routes: Routes = [
  { path: 'manage', component: ManagementPage },
  { path: 'care', component: PetCareOptionsPage},
  { path: 'veterinarians', component: VeterinariansPage},

  { path: '**', redirectTo: 'manage', pathMatch: 'full' },







];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetsPagesRoutingModule { }
