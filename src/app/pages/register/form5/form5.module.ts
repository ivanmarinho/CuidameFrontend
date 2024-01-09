import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Form5PageRoutingModule } from './form5-routing.module';

import { Form5Page } from './form5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Form5PageRoutingModule
  ],
  declarations: [Form5Page]
})
export class Form5PageModule {}
