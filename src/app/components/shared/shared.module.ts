import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingComponent } from './loading/loading.component';
import { ProductComponent } from './product/product.component';

// Pipes
import { ValuePipe } from 'src/app/pipes/value.pipe';
import { PrecioBultoPipe } from 'src/app/pipes/precio-bulto.pipe';
import { ImagesPipe } from 'src/app/pipes/images.pipe';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent,
    ValuePipe,
    PrecioBultoPipe,
    ImagesPipe
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
    ValuePipe,
    ImagesPipe
  ]
})
export class SharedModule { }
