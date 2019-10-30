import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PAGES_ROUTES } from './pages.routes';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { TiendaComponent } from './tienda/tienda.component';
import { LoginComponent } from './login/login.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { EncontranosEnComponent } from './encontranos-en/encontranos-en.component';
import { ContactoComponent } from './home/contacto/contacto.component';
import { ProductComponent } from '../shared/product/product.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    TiendaComponent,
    LoginComponent,
    QuienesSomosComponent,
    EncontranosEnComponent,
    ContactoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PAGES_ROUTES,
    SharedModule
  ]
})
export class PagesModule { }
