import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeterinarianRoutingModule } from './veterinarian-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReadVeterinarianPage } from './read-veterinarian/read-veterinarian.page';
import { EditVeterinarianPage } from './edit-veterinarian/edit-veterinarian.page';
import { CreateVeterinarianPage } from './create-veterinarian/create-veterinarian.page';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    ReadVeterinarianPage,
    EditVeterinarianPage,
    CreateVeterinarianPage,
  ],
  imports: [
    CommonModule,
    VeterinarianRoutingModule,
    FormsModule,
    RouterModule,
    IonicModule,
  ]
})
export class VeterinarianModule { }
