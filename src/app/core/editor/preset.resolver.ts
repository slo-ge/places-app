import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { CmsService } from '@app/core/services/cms.service';
import { Preset } from '@app/core/model/preset';
import { inject } from '@angular/core';

export const presetResolver: ResolveFn<Preset | null> = (route: ActivatedRouteSnapshot) =>
    route.queryParams?.presetId ? inject(CmsService).getPreset(route.queryParams.presetId) : null;
