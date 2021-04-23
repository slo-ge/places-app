import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CMS_API_URL, CmsService} from "@app/core/services/cms.service";
import {catchError, finalize, mergeMap, take, tap} from "rxjs/operators";


/**
 * Sets the JWT if it is available,
 * if CMS responds with 403, we do a logout:
 *  - because the session could be expired
 *  - because the token or something else is incorrect
 *
 */
@Injectable()
export class JWTAuthInterceptor implements HttpInterceptor {
  constructor(private cmsService: CmsService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add Bearer for logged in users to request
    if (!request.url.startsWith(CMS_API_URL)) {
      return next.handle(request);
    }

    return this.cmsService.getUser().pipe(
      take(1), // Important, otherwise the subscription will not be closed
      mergeMap(user => {
        if (user) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.jwt}`
            }
          });
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
              this.cmsService.logout();
            } else if(error.status == 401) {
              this.cmsService.logout();
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
