import { Component } from '@angular/core';
import { HttpTrackingService, TrackingEvent } from '@app/core/editor/http-tracking.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
    readonly trackingEvents$: Observable<Array<TrackingEvent & { count: number; date: Date }>>;

    constructor(httpTrackingService: HttpTrackingService) {
        this.trackingEvents$ = httpTrackingService.getAllTrackingEvents().pipe(
            map(events => {
                const map = new Map<string, Array<TrackingEvent>>();
                for (const event of events) {
                    if (!isJsonString(event.trackingDetail)) {
                        continue;
                    }

                    const date = new Date(event.eventDate);
                    const key = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                    if (map.get(key)) {
                        map.set(key, [...map.get(key)!, event]);
                    } else {
                        map.set(key, [event]);
                    }
                }

                return map;
            }),
            map(data => {
                const aggregatedEvents = Array<TrackingEvent  & { count: number; date: Date }>();
                for (const [_key, value] of data.entries()) {
                    const tmpValue = value.reduce((acc, obj) => {
                        const key = obj.trackingDetail; // Create a unique key for each object
                        if (!acc.has(key)) {
                            acc.set(key, { ...obj, count: 1 });
                        } else {
                            const existingObj = acc.get(key);
                            if (existingObj) {
                                existingObj.count++;
                            }
                        }

                        return acc;
                    }, new Map<string, TrackingEvent & { count: number }>());

                    const parts = _key.split("-"); // Split the string into parts based on the hyphen
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1; // Subtract 1 from the month to match the zero-based index
                    const year = parseInt(parts[2], 10);
                    const parsedDate = new Date(year, month, day);

                    for (const eventValues of tmpValue.values()) {
                        aggregatedEvents.push({...eventValues, date: parsedDate});
                    }
                }
                const sortedEvents = [...aggregatedEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
                return sortedEvents;
            })
        );
    }
}
