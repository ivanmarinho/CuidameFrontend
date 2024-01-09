
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { ReadHistoryPage } from './read-history/read-history.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    ReadHistoryPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    HistoryRoutingModule,

  ],

})
export class HistoryModule { }
