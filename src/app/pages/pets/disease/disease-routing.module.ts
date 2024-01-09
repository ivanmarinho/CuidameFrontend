import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDiseasePage } from './create-disease/create-disease.page';
import { ReadDiseasePage } from './read-disease/read-disease.page';
import { EditDiseasePage } from './edit-disease/edit-disease.page';

const routes: Routes = [
  { path: 'add', component: CreateDiseasePage },
  { path: 'edit', component: EditDiseasePage},
  { path: '', component: ReadDiseasePage},

  { path: '**', redirectTo: 'show', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiseaseRoutingModule { }
