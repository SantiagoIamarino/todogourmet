import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServicesModule } from './services/services.module';
import { AdminModule } from './components/pages/admin/admin.module';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';


import { APP_ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './components/pages/admin/admin.component';
import { ProductosComponent } from './components/pages/admin/productos/productos.component';
import { EditProductComponent } from './components/shared/product/edit-product/edit-product.component';
import { PagesModule } from './components/pages/pages.module';




@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AdminComponent,
    ProductosComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    APP_ROUTES,
    AngularFireModule.initializeApp(environment.firebase, 'todo-gourmet'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServicesModule,
    PagesModule,
    AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
