import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BadRequestError } from "../app-error/bad-request-error";
import { DuplicateItemError } from "../app-error/duplicate-item-error";
import { NotFoundError } from "../app-error/not-found-error";
import { UnAuthorizedError } from "../app-error/unauthorized-error";
import { ResponseActionType } from "../model/enums";

@Injectable({
    providedIn: 'root'
})
export class ResponseHandlerService {

    constructor(private toastr: ToastrService, private router: Router) { }

    public HandelError(error: HttpErrorResponse) {
        if (error instanceof BadRequestError) {
            this.toastr.error('Can`t Add Item, Check Your Data', 'Failed', { timeOut: 4000 });
        } else if (error instanceof NotFoundError) {
            this.toastr.error(error?.OriginalError?.error?.message || 'Item Not Found', 'Not Found', { timeOut: 4000 });
        } else if (error instanceof DuplicateItemError) {
            this.toastr.error(error?.OriginalError?.error?.message || 'Item Already Exists', 'Failed', { timeOut: 4000 });
        } else if (error instanceof UnAuthorizedError) {
            this.toastr.error('Unauthorized to Take That Action', 'Failed', { timeOut: 4000 });
            this.router.navigate(['/']);
        } else {
            // if (error.OriginalError && error.OriginalError.status && error.OriginalError.status === 409) {
            //     this.toastr.error('Template Already Created', 'Duplicate', { timeOut: 4000 });
            // } else {
            // }
            this.toastr.error('Something Went Wrong', 'Failed', { timeOut: 4000 });
        }
    } 

    public HandelCustomError(message: any) {
        this.toastr.error(message, 'Failed', { timeOut: 4000 });
    }

    public HandleSuccess(response: any, action: number) {
        let actionType: string;
        if (action === ResponseActionType.Added) {
            actionType = 'Added';
        } else if (action === ResponseActionType.Updated) {
            actionType = 'Updated'
        } else if (action === ResponseActionType.Sent) {
            actionType = 'Sent'
        } else if (action === ResponseActionType.Done) {
            actionType = 'Done'
        } else {
            actionType = 'Deleted'
        }

        if (response == null) {
            this.toastr.success('Item ' + actionType, actionType, { timeOut: 4000 });
        } else {
            this.toastr.success('Item ' + actionType, actionType, { timeOut: 4000 });
        }
    }

    public HandleCancel() {
        this.toastr.warning('Action is cancelled', 'Cancel', { timeOut: 4000 });
    }

    public HandleEmptyContent() {
        this.toastr.success('No Content Found', 'No Content', { timeOut: 4000 });
    }
}