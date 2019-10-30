import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ADMIN_ROUTES } from './admin.routes';
import { FiltersComponent } from './filters/filters.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    FiltersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ADMIN_ROUTES
  ]
})
export class AdminModule { }
