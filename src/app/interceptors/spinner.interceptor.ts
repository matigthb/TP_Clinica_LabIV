import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SpinnerService } from "../services/spinner.service";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor{

    constructor(private spinner : SpinnerService){

    }

    intercept(req : HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>>{
        this.spinner.show();
        return next.handle(req).pipe(
            finalize(() => this.spinner.hide()));
    }
}
