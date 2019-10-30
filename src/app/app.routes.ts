import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '**', component: PageNotFoundComponent },
];

export const APP_ROUTES = RouterModule.forRoot( routes, { useHash: true } );
