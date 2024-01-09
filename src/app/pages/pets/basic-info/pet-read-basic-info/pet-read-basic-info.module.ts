import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';
import { TabsPageRoutingModule } from 'src/app/pages/tabs/tabs-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { PetReadBasicInfoPage } from './pet-read-basic-info.page';
import { TabBarPage } from 'src/app/components/tab-bar/tab-bar.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabsPageRoutingModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [
    PetReadBasicInfoPage, TabBarPage
  ],
})
export class PetReadBasicInfoPageModule {}
