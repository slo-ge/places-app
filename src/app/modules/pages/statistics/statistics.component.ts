import { Component } from '@angular/core';
import { HttpTrackingService, TrackingEvent } from '@app/core/editor/http-tracking.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


function isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
    readonly trackingEvents$: Observable<Map<string, Array<TrackingEvent>>>;

    constructor(httpTrackingService: HttpTrackingService) {
        this.trackingEvents$ = httpTrackingService.getAllTrackingEvents().pipe(
            map(events => {
                const map = new Map<string, Array<TrackingEvent>>();
                for (const event of events) {
                    if (!isJsonString(event.trackingDetail)) {
                        continue;
                    }

                    const date = new Date(event.eventDate);
                    const key = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
                    if (map.get(key)) {
                        map.set(key, [...map.get(key)!, event]);
                    } else {
                        map.set(key, [event]);
                    }
                }
                return map;
            })
        );
    }
}
