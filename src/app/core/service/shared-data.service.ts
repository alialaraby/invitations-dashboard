import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Admin } from "../model/admin";
import { AdminRoles } from "../model/enums";

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {

    userData = new BehaviorSubject<Admin>(new Admin());
    userData$ = this.userData.asObservable();

    authenticated = new BehaviorSubject<boolean>(false);
    authenticated$ = this.authenticated.asObservable();

    constructor() {
        if (localStorage.getItem('accessToken')) {
            this.setuserData(
                new Admin(
                    localStorage.getItem('_id'), 
                    localStorage.getItem('accessToken'),
                    localStorage.getItem('fullName'),
                    localStorage.getItem('role') as AdminRoles,
                    JSON.parse(localStorage.getItem('isSuperAdmin')),
                    JSON.parse(localStorage.getItem('isAdmin')),
                    JSON.parse(localStorage.getItem('isCorporateAdmin')),
                    JSON.parse(localStorage.getItem('isAnalystAdmin')),
                )
            );
            this.setauthenticated(true);
        } else {
            this.setauthenticated(false);
        }
    }

    setuserData(userData: Admin) {
        this.userData.next(userData);
    }
    setauthenticated(authenticated: boolean) {
        this.authenticated.next(authenticated);
    }

}