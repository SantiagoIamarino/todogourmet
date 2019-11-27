import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { PAGES_ROUTES } from './pages.routes';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { TiendaComponent } from './tienda/tienda.component';
import { LoginComponent } from './login/login.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { EncontranosEnComponent } from './encontranos-en/encontranos-en.component';
import { ContactoComponent } from './home/contacto/contacto.component';
import { CartComponent } from './cart/cart.component';
import { SurtidoComponent } from './surtido/surtido.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    TiendaComponent,
    LoginComponent,
    QuienesSomosComponent,
    EncontranosEnComponent,
    ContactoComponent,
    CartComponent,
    SurtidoComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PAGES_ROUTES,
    SharedModule
  ]
})
export class PagesModule { }
