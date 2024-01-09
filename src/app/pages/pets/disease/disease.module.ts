import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiseaseRoutingModule } from './disease-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReadDiseasePage } from './read-disease/read-disease.page';
import { CreateDiseasePage } from './create-disease/create-disease.page';
import { EditDiseasePage } from './edit-disease/edit-disease.page';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    ReadDiseasePage,
    CreateDiseasePage,
    EditDiseasePage
  ],
  imports: [
    CommonModule,
    IonicModule,
    DiseaseRoutingModule,
    FormsModule,
    RouterModule,
  ]
})
export class DiseaseModule { }
