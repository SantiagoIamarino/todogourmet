import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingComponent } from './loading/loading.component';
import { ProductComponent } from './product/product.component';
import { ValuePipe } from 'src/app/pipes/value.pipe';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent,
    ValuePipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent,
    ValuePipe
  ]
})
export class SharedModule { }
