import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrarCuentaPage } from './borrar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: BorrarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrarCuentaPageRoutingModule {}
