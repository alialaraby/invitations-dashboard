import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError } from 'rxjs/operators';
import { BadRequestError } from "../app-error/bad-request-error";
import { NotFoundError } from "../app-error/not-found-error";
import { UnAuthorizedError } from "../app-error/unauthorized-error";
import { AppError } from "../app-error/app-error";
import { DuplicateItemError } from "../app-error/duplicate-item-error";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient) { }

    public getAll(url: string, pageIndex: number = 0, pageSize: number = 10): Observable<Object> {
        return this.http.post(environment.baseUrl + url, { pageIndex, pageSize })
            .pipe(catchError(this.handleError));
    }

    public getById(url: string, _id: string): Observable<Object> {
        return this.http.post(environment.baseUrl + url, { _id })
            .pipe(catchError(this.handleError));
    }

    public add(url: string, item: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, item)
            .pipe(catchError(this.handleError));
    }

    public update(url: string, item: any) {
        return this.http.post(environment.baseUrl + url, item)
            .pipe(catchError(this.handleError));
    }

    public delete(url: string, data: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, data)
            .pipe(catchError(this.handleError));
    }

    public approveReject(url: string, data: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, data)
            .pipe(catchError(this.handleError));
    }

    public activateBoat(url: string, data: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, data)
            .pipe(catchError(this.handleError));
    }

    public getCorporateMembers(url: string, _id: string, pageIndex: number = 0, pageSize: number = 10): Observable<Object> {
        return this.http.post(environment.baseUrl + url, { _id, pageIndex, pageSize })
            .pipe(catchError(this.handleError));
    }

    public resetPassword(url: string, data: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, data)
            .pipe(catchError(this.handleError));
    }

    protected handleError(error: Response) {

        switch (error.status) {
            case 400:
                return throwError(new BadRequestError(error));
            case 409:
                return throwError(new DuplicateItemError(error));
            case 404:
                return throwError(new NotFoundError(error));
            case 401:
                return throwError(new UnAuthorizedError(error));
            default:
                return throwError(new AppError(error));
        }
    }
}