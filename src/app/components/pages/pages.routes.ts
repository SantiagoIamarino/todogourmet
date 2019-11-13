import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { TiendaComponent } from './tienda/tienda.component';
import { LoginComponent } from './login/login.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { EncontranosEnComponent } from './encontranos-en/encontranos-en.component';
import { CartComponent } from './cart/cart.component';

const PagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'home/:scrollTo', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'tienda', component: TiendaComponent },
            { path: 'carrito', component: CartComponent },
            { path: 'login', component: LoginComponent },
            { path: 'quienes-somos', component: QuienesSomosComponent },
            { path: 'encontranos-en', component: EncontranosEnComponent },
            { path: '', pathMatch: 'full', redirectTo: 'home' },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( PagesRoutes );
