import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedPage } from './logged.page';

const routes: Routes = [
  {
    path: '',
    component: LoggedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedPageRoutingModule {}
