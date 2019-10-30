import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingComponent } from './loading/loading.component';
import { ProductComponent } from './product/product.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent
  ]
})
export class SharedModule { }
