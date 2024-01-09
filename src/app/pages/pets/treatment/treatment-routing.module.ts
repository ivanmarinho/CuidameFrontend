import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTreatmentPage } from './create-treatment/create-treatment.page';
import { EditTreatmentPage } from './edit-treatment/edit-treatment.page';

const routes: Routes = [
  { path: 'add', component: CreateTreatmentPage },
  { path: 'edit', component: EditTreatmentPage},

  { path: '**', redirectTo: 'initial', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreatmentRoutingModule { }
