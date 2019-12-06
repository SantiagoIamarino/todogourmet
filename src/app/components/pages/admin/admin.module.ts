import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ADMIN_ROUTES } from './admin.routes';
import { FiltersComponent } from './filters/filters.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FiltersFormComponent } from './filters/filters-form/filters-form.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AdminComponent } from './admin.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { ImportComponent } from './import/import.component';



@NgModule({
  declarations: [
    AdminComponent,
    FiltersComponent,
    FiltersFormComponent,
    MensajesComponent,
    ConfigurationComponent,
    OrdersComponent,
    UsersComponent,
    ImportComponent
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
