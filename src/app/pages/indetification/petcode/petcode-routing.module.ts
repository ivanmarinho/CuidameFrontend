import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetcodePage } from './petcode.page';

const routes: Routes = [
  {
    path: '',
    component: PetcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetcodePageRoutingModule {}
