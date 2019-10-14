import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServicesModule } from './services/services.module';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';


import { APP_ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { TiendaComponent } from './components/pages/tienda/tienda.component';
import { LoginComponent } from './components/pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { QuienesSomosComponent } from './components/pages/quienes-somos/quienes-somos.component';
import { AdminComponent } from './components/pages/admin/admin.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    NavbarComponent,
    PageNotFoundComponent,
    TiendaComponent,
    LoginComponent,
    QuienesSomosComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    APP_ROUTES,
    AngularFireModule.initializeApp(environment.firebase, 'todo-gourmet'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
