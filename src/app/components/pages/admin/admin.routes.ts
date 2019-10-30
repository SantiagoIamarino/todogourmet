import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { AdminComponent } from './admin.component';
import { FiltersComponent } from './filters/filters.component';

const AdminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: 'productos', component: ProductosComponent },
            { path: 'filtros/:tipo', component: FiltersComponent },
            { path: '', pathMatch: 'full', redirectTo: 'productos' }
        ]
    }
];

export const ADMIN_ROUTES = RouterModule.forChild( AdminRoutes );
