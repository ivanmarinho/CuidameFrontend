import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjetosMascotasPage } from './objetos-mascotas.page';

const routes: Routes = [
  {
    path: '',
    component: ObjetosMascotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjetosMascotasPageRoutingModule {}
