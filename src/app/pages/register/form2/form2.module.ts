import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { Form2PageRoutingModule } from './form2-routing.module';

import { Form2Page } from './form2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Form2PageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [Form2Page]
})
export class Form2PageModule {}
