import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { DataService } from '../service/data.service';
import { Admin } from '../model/admin';
import { SharedDataService } from '../service/shared-data.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

    sharedUserData: Admin = new Admin();

    constructor(
        private sharedData: SharedDataService,
    ) {
        this.sharedData.userData$.subscribe(
            (userData) => {
              this.sharedUserData._id = userData._id;
              this.sharedUserData.accessToken = userData.accessToken;
            }
        );
    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(httpRequest.clone({ setHeaders: { Authorization: `Bearer ${this.sharedUserData.accessToken}` } }));
    }
}