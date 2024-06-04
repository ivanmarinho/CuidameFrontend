import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagnosticCreateComponent } from './diagnostic-create/diagnostic-create.component';

const routes: Routes = [
  { path: 'create', component: DiagnosticCreateComponent },

  { path: '**', redirectTo: 'create', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticPagesRoutingModule { }
