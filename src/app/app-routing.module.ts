import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/service/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScanQrComponent } from './scan-qr/scan-qr.component';
import { AdminComponent } from './views/admin/admin.component';
// import { RegistrationFormComponent } from './user-pages/registration-form/registration-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-pages/login', pathMatch: 'full' },
  { path: 'registration', redirectTo: '/user-pages/registration', pathMatch: 'full' },
  { path: 'submitted', redirectTo: '/user-pages/submitted', pathMatch: 'full' },
  // { path: 'registration-form', component: RegistrationFormComponent },
  // { path: 'registration-form', redirectTo: '/user-pages/registration-form', pathMatch: 'full' },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'scan-qr', component: ScanQrComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  
  { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
  { path: '**', redirectTo: '/error-pages/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
