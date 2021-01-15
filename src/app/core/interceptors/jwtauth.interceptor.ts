import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CMS_API_URL, LayoutSettingService} from "@app/core/services/layout-setting.service";
import {catchError, mergeMap} from "rxjs/operators";


@Injectable()
export class JWTAuthInterceptor implements HttpInterceptor {
  constructor(private layoutSettingService: LayoutSettingService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add Bearer for logged in users to request
    if (!request.url.startsWith(CMS_API_URL)) {
      return next.handle(request);
    }

    return this.layoutSettingService.getUser().pipe(
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
            debugger;
            if (error.status === 403) {
              this.layoutSettingService.logout();
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
