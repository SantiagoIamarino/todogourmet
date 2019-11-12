import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { AdminComponent } from './admin.component';
import { FiltersComponent } from './filters/filters.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AdminGuard } from '../../../guards/admin.guard';

const AdminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        // canActivate: [AdminGuard],
        children: [
            { path: 'productos', component: ProductosComponent },
            { path: 'filtros/:tipo', component: FiltersComponent },
            { path: 'mensajes', component: MensajesComponent },
            { path: '', pathMatch: 'full', redirectTo: 'productos' }
        ]
    }
];

export const ADMIN_ROUTES = RouterModule.forChild( AdminRoutes );
