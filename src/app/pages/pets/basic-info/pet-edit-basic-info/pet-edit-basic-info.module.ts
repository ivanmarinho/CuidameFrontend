import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { PetEditBasicInfoPage } from './pet-edit-basic-info.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetEditBasicInfoPageModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [
    PetEditBasicInfoPage,
  ],
})
export class PetEditBasicInfoPageModule {}
