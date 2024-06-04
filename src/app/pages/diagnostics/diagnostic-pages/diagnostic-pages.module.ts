import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticCreateComponent } from './diagnostic-create/diagnostic-create.component';
import { DiagnosticPagesRoutingModule } from './diagnostic-pages-routing.module';


//Manejar paginas
@NgModule({
  declarations: [
    DiagnosticCreateComponent,
  ],
  imports: [
    CommonModule,
    DiagnosticPagesRoutingModule,
  ],
})
export class DiagnosticPagesModule { }
