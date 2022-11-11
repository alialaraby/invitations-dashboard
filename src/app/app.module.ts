import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { JWTInterceptor } from './core/interceptors/jwt-interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { EmptyListComponent } from './shared/empty-list/empty-list.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { AdminComponent } from './views/admin/admin.component';
import { ScanQrComponent } from './scan-qr/scan-qr.component';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DashboardManualComponent } from './dashboard-manual/dashboard-manual.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    AdminComponent,
    EmptyListComponent,
    ScanQrComponent,
    DashboardManualComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    NgxScannerQrcodeModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    // ZXingScannerModule
  ],
  providers: [
    ThemeService,
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
