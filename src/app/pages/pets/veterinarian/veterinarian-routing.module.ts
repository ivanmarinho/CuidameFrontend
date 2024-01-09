import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadVeterinarianPage } from './read-veterinarian/read-veterinarian.page';
import { CreateVeterinarianPage } from './create-veterinarian/create-veterinarian.page';
import { EditVeterinarianPage } from './edit-veterinarian/edit-veterinarian.page';

const routes: Routes = [
  { path: 'add', component: CreateVeterinarianPage },
  { path: 'show', component: ReadVeterinarianPage },
  { path: 'edit', component: EditVeterinarianPage},
  { path: '', component: ReadVeterinarianPage},

  { path: '**', redirectTo: 'show', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeterinarianRoutingModule { }
