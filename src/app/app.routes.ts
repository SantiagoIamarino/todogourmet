import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { HomeComponent } from './components/pages/home/home.component';
import { TiendaComponent } from './components/pages/tienda/tienda.component';
import { LoginComponent } from './components/pages/login/login.component';
import { QuienesSomosComponent } from './components/pages/quienes-somos/quienes-somos.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { EncontranosEnComponent } from './components/pages/encontranos-en/encontranos-en.component';


const routes: Routes = [
    { path: 'home/:scrollTo', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'tienda', component: TiendaComponent },
    { path: 'login', component: LoginComponent },
    { path: 'quienes-somos', component: QuienesSomosComponent },
    { path: 'encontranos-en', component: EncontranosEnComponent },
    { path: 'admin', component: AdminComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', component: PageNotFoundComponent },
];

export const APP_ROUTES = RouterModule.forRoot( routes, { useHash: true } );
