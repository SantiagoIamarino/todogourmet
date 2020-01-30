import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingComponent } from './loading/loading.component';
import { ProductComponent } from './product/product.component';

// Directives
import { ClickStopPropagationDirective } from 'src/app/directives/click-stop-propagation.directive';

// Pipes
import { ValuePipe } from 'src/app/pipes/value.pipe';
import { PrecioBultoPipe } from 'src/app/pipes/precio-bulto.pipe';
import { ImagesPipe } from 'src/app/pipes/images.pipe';
import { ProductOneLinePipe } from '../../pipes/product-one-line.pipe';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { UserHoursPipe } from '../../pipes/user-hours.pipe';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent,
    ValuePipe,
    PrecioBultoPipe,
    ImagesPipe,
    ProductOneLinePipe,
    FechaPipe,
    ClickStopPropagationDirective,
    UserHoursPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
    ProductComponent,
    ValuePipe,
    PrecioBultoPipe,
    ImagesPipe,
    ProductOneLinePipe,
    FechaPipe,
    UserHoursPipe
  ]
})
export class SharedModule { }
