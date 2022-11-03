import { ErrorHandler, Injector } from "@angular/core";
import { Router } from "@angular/router";

export class UnExpectedErrorHandler{

    constructor(private injector: Injector) {}

    //we use this way for getting the route cause of a specefic error that is
    //"cannot instantiate cyclic dependency" 
    /*
        problem:
        The problem is that Router can async load some routes. 
        This is why it needs Http. Your Http depends on Router and Router depends on Http. 
        Angular injector is not able to create any of these services.

        solution:
        is using this injector approach
    */
    // public get route():Router{
    //     return this.injector.get(Router);
    // }

    // handleError(error: any): void {
        
    //     this.toastr.error("Something Went Wrong", 'Action Canceled', { timeOut: 4000 });
    //     if(!this.route.url.includes('/dashboard')){
    //         history.back();
    //     }
    // }

}