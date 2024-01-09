import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitialPageRoutingModule } from './initial-routing.module';

import { InitialPage } from './initial.page';
import { TabsPage } from '../tabs/tabs.page';
import { TabsPageModule } from '../tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitialPageRoutingModule,
    TabsPageModule
  ],
  declarations: [InitialPage]
})
export class InitialPageModule {}
