import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResetPassRoutingModule } from './reset-pass-routing.module';
import { ResetPassPage } from './reset-pass.page';

@NgModule({
  declarations: [ResetPassPage],
  imports: [CommonModule, FormsModule, IonicModule, ResetPassRoutingModule],
})
export class ResetPassModule {}
