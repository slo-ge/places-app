import {ACFLocation} from "../../core/model/wpObject";
import {LocationService} from "../../core/services/location.service";
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {EMPTY, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class DetailResolver implements Resolve<Observable<ACFLocation>> {
    constructor(private locationService: LocationService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return this.locationService.getPlace(route.paramMap.get('slug')).pipe(
            map(places => {
                if(places?.length > 0) {
                    return places[0];
                }
                this.router.navigate(["/404-not-found"]);
                return EMPTY;
            }),

        );
    }
}
