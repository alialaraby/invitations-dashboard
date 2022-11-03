import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { TripTypes } from "../model/enums";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class TripService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    public getTrips(url: string, types: TripTypes[], pageIndex: number = 0, pageSize: number = 10, categoryId?: string): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {types, pageIndex, pageSize, categoryId})
            .pipe(catchError(this.handleError));
    }

}