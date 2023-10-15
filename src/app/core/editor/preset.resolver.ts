import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CmsService } from '@app/core/services/cms.service';
import { Preset } from '@app/core/model/preset';

export const presetResolver: Observable<Preset> | Promise<any> | any = (
    cmsService: CmsService,
    route: ActivatedRouteSnapshot
) => (route.queryParams?.presetId ? cmsService.getPreset(route.queryParams.presetId) : null);
