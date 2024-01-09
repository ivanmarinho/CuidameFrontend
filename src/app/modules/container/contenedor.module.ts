import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HeaderDashComponent } from './dash/header-dash/header-dash.component';
import { ContainerDashComponent } from './dash/container-dash/container-dash.component';
import { IonicModule } from '@ionic/angular';
import { TabBarDashComponent } from './dash/tab-bar-dash/tab-bar-dash.component';
import { HeaderGreetingComponent } from './dash/header-greeting/header-greeting.component';



@NgModule({
  declarations: [
    HeaderDashComponent,
    HeaderGreetingComponent,
    ContainerDashComponent,
    TabBarDashComponent
  ],
  imports: [CommonModule, RouterModule, IonicModule],
  exports: [],
})
export class ContainerModule {}
