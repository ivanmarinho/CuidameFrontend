import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage-angular';
import { PetCreateBasicInfoPage } from './pet-create-basic-info.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicStorageModule.forRoot(),
    ImageCropperModule,

  ],
  declarations: [
    PetCreateBasicInfoPage
  ],
})
export class PetCreateBasicInfoPageModule {}
