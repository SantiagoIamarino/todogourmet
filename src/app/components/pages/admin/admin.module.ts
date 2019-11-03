import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ADMIN_ROUTES } from './admin.routes';
import { FiltersComponent } from './filters/filters.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FiltersFormComponent } from './filters/filters-form/filters-form.component';




@NgModule({
  declarations: [
    FiltersComponent,
    FiltersFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ADMIN_ROUTES
  ]
})
export class AdminModule { }
