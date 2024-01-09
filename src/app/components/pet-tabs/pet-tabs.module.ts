import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetTabsPageRoutingModule } from './pet-tabs-routing.module';

import { PetTabsPage } from './pet-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetTabsPageRoutingModule
  ],
  declarations: [PetTabsPage]
})
export class PetTabsPageModule {}
