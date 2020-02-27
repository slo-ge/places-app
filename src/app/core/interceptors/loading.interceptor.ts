import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {LoadingService} from "../services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loading: LoadingService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loading.startLoading();
        return next.handle(req).pipe(
            finalize(() => this.loading.stopLoading())
        );
    }
}

