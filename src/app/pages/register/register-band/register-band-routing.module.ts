import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterBandPage } from './register-band.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterBandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterBandPageRoutingModule {}
