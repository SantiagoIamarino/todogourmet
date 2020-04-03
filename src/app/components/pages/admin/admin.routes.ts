import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { AdminComponent } from './admin.component';
import { FiltersComponent } from './filters/filters.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AdminGuard } from '../../../guards/admin.guard';
import { ConfigurationComponent } from './configuration/configuration.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { ImportComponent } from './import/import.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { VerifyTokenGuard } from '../../../guards/verify-token.guard';

const AdminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard, VerifyTokenGuard],
        children: [
            { path: 'productos', component: ProductosComponent },
            { path: 'importar', component: ImportComponent },
            { path: 'filtros/:tipo', component: FiltersComponent },
            { path: 'usuarios', component: UsersComponent },
            { path: 'mensajes', component: MensajesComponent },
            { path: 'newsletter', component: NewsletterComponent },
            { path: 'pedidos', component: OrdersComponent },
            { path: 'configuracion', component: ConfigurationComponent },
            { path: '', pathMatch: 'full', redirectTo: 'productos' }
        ]
    }
];

export const ADMIN_ROUTES = RouterModule.forChild( AdminRoutes );
