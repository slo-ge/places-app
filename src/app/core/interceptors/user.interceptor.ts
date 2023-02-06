import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CMS_API_URL } from "@app/core/services/cms.service";
import { mergeMap, take } from "rxjs/operators";
import { CmsAuthService } from "@app/core/services/cms-auth.service";


/**
 * Adds the user to every CMS request
 */
@Injectable()
export class AuthenticatedUserInterceptor implements HttpInterceptor {
    constructor(private authService: CmsAuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.url.startsWith(CMS_API_URL)) {
            return next.handle(request);
        }

        return this.authService.getUser().pipe(
            take(1), // Important, otherwise the subscription will not be closed
            mergeMap(user => {
                if (user && !user.user.isAdmin) {
                    let params = new HttpParams();
                    params = params.append('users.username', user.user.username);
                    return next.handle(request.clone({params}));
                }
                return next.handle(request);
            })
        );
    }
}
