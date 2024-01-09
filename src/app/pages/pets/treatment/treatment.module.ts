import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentRoutingModule } from './treatment-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateTreatmentPage } from './create-treatment/create-treatment.page';
import { EditTreatmentPage } from './edit-treatment/edit-treatment.page';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    CreateTreatmentPage,
    EditTreatmentPage
  ],
  imports: [
    CommonModule,
    TreatmentRoutingModule,
    FormsModule,
    IonicModule,
    RouterModule,
  ]
})
export class TreatmentModule { }
