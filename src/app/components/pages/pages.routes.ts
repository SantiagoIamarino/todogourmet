import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { TiendaComponent } from './tienda/tienda.component';
import { LoginComponent } from './login/login.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { EncontranosEnComponent } from './encontranos-en/encontranos-en.component';
import { CartComponent } from './cart/cart.component';
import { LoginGuard } from '../../guards/login.guard';
import { SurtidoComponent } from './surtido/surtido.component';
import { ProfileComponent } from './profile/profile.component';

const PagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'home/:scrollTo', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'tienda', component: TiendaComponent },
            { path: 'tienda/:filterType/:filterValue', component: TiendaComponent },
            { path: 'carrito', canActivate: [LoginGuard], component: CartComponent },
            { path: 'perfil', canActivate: [LoginGuard], component: ProfileComponent },
            { path: 'surtido', canActivate: [LoginGuard], component: SurtidoComponent },
            { path: 'surtido/:filterType/:filterValue', component: TiendaComponent },
            { path: 'login', component: LoginComponent },
            { path: 'quienes-somos', component: QuienesSomosComponent },
            { path: 'encontranos-en', component: EncontranosEnComponent },
            { path: '', pathMatch: 'full', redirectTo: 'home' },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( PagesRoutes );
