import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Admin } from "../model/admin";
import { Constant } from "../model/constant";
import { DataService } from "./data.service";
import { SharedDataService } from "./shared-data.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends DataService {

    authenticated = true;
    sharedUserData: Admin = new Admin();

    constructor(
        http: HttpClient,
        private _http: HttpClient,
        private sharedData: SharedDataService,
        private dataService: DataService,
        private router: Router,
    ) {
        super(http);

        this.sharedData.userData$.subscribe(
            (userData) => {
                this.sharedUserData._id = userData._id;
            }
        );
    }

    login(data: any) {
        return this._http.post(environment.baseUrl + Constant.LOGIN, data);
        // .pipe(catchError(this.HandleError));
    }

    logout() {
        this.authenticated = false;
        localStorage.clear();
        this.router.navigateByUrl('/');
    }

}