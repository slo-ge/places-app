import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {CmsService} from "@app/core/services/cms.service";
import {Preset} from "@app/core/model/preset";

/**
 * Resolves a single presetId given by query parameter.
 */
@Injectable({providedIn: 'root'})
export class PresetResolver implements Resolve<Preset> {
  constructor(private cmsService: CmsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Preset> | Promise<any> | any {
    const id = route.queryParams.presetId;
    return id ? this.cmsService.getPreset(id) : null;
  }
}
