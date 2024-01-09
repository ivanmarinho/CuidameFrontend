import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchListComponent } from './search-list/search-list.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ImageModalPage } from './image-modal/image-modal.page';
import { MapModalComponent } from './map-modal/map-modal.component';



@NgModule({
  declarations: [SearchListComponent, ImageModalPage, MapModalComponent],
  exports: [SearchListComponent],
  imports: [
    CommonModule,
    IonicModule,
    CommonModule,
    FormsModule,
    IonicModule,
    
  ]
})
export class ComponentsModule { }
