import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Preset } from '@app/core/model/preset';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

// move into cloudflare function
interface _ApiItem {
    Id: number;
    TrackingEvent: string;
    TrackingDetail: string;
    EventDate: string;
}

export interface TrackingEvent {
    id: number;
    trackingEvent: string;
    trackingDetail: string;
    eventDate: string;
}

@Injectable({
    providedIn: 'root',
})
export class HttpTrackingService {
    constructor(private httpClient: HttpClient) {}

    /**
     * Sends internal tracking event to cloudflare pages API,
     * see cloudflare pages [functions] -> [download].ts
     */
    trackDownload(preset: Preset): void {
        const body = new HttpParams()
            .set('trackingEvent', 'download')
            .set('trackingDetail', `{"presetId": "${preset.id}", "presetTitle": "${preset.title}"}`);

        this.httpClient
            .post(`/api/download/${preset.id}`, body.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
            .pipe(take(1))
            .subscribe();
    }

    getAllTrackingEvents(): Observable<Array<TrackingEvent>> {
        return this.httpClient.get<Array<_ApiItem>>('/api/download/list').pipe(
            map(item =>
                item.map(i => ({
                    id: i.Id,
                    trackingEvent: i.TrackingEvent,
                    trackingDetail: i.TrackingDetail,
                    eventDate: i.EventDate,
                }))
            )
        );
    }
}
