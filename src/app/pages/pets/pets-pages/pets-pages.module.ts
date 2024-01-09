import { ManagementPage } from './management/management.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetsPagesRoutingModule } from './pets-pages-routing.module';
import { PetCareOptionsPage } from './pet-care-options/pet-care-options.page';
import { GreetingComponent } from 'src/app/components/greeting/greeting.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VeterinariansPage } from './veterinarians/veterinarians.page';


@NgModule({
  declarations: [
    ManagementPage,
    PetCareOptionsPage,
    GreetingComponent,
    VeterinariansPage,
  ],
  imports: [
    CommonModule,
    PetsPagesRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class PetsPagesModule { }
