import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterObjectPage } from './register-object.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterObjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterObjectPageRoutingModule {}
