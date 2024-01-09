import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Form5Page } from './form5.page';

const routes: Routes = [
  {
    path: '',
    component: Form5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Form5PageRoutingModule {}
