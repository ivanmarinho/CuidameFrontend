import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactusRoutingModule } from './contactus-routing.module';
import { ContactusPage } from './contactus.page';



@NgModule({
  declarations: [ContactusPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactusRoutingModule,
  ]
})
export class ContactusModule { }
