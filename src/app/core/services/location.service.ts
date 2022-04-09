import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {ACFLocation, ContentType, RelatedWpObject} from "../model/wpObject";
import {map, shareReplay, take, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";


export interface Params {
    page: number;
}

export interface Info {
    pages: number;
    page: number; // current page
    total: number;
}

const LOCATION_URL = `${environment.apiUrl}/${ContentType.LOCATION}`;

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private info: BehaviorSubject<Info> = new BehaviorSubject(null);

    private readonly paramOptions = {
        _embed: '' // this options embeds the media data
    };

    _cachedPlaces = new Map<string, ACFLocation>();
    _cachedResponse = new Map<string, Observable<any>>();

    constructor(private httpClient: HttpClient) {
    }

    public allLocations(params: any): Observable<ACFLocation[]> {
        params = {...this.paramOptions, ...params};

        // The caching is build this way, because we need to do the transformations in
        // the pipe in the return statement, otherwise the this.nextInfo would not be set
        const key = JSON.stringify(params);
        const request = this._cachedResponse.get(key)
            || this.httpClient.get<ACFLocation[]>(LOCATION_URL, {observe: 'response', params: params})
                .pipe(shareReplay(1));
        this._cachedResponse.set(key, request);

        return request.pipe(
            tap(data => this.nextInfo(data.headers, params.page)),
            map(data => data.body),
            tap(data => data.forEach(place => this._cachedPlaces.set(place.slug, place))) // add to cachedPlaced Map
        );
    }

    public getPlace(slug: string): Observable<ACFLocation[]> {
        if (this._cachedPlaces.has(slug)) {
            return of([this._cachedPlaces.get(slug)]);
        }
        return this.httpClient.get<ACFLocation[]>(LOCATION_URL, {params: {...this.paramOptions, slug: slug}})
    }

    public getPlaceByIds(ids: number[]) {
        const params = {...this.paramOptions, include: ids.join(',')};
        return this.httpClient.get<ACFLocation[]>(LOCATION_URL, {params});
    }

    random = (list: any[]) => {
        const random = Math.floor(Math.random() * list.length);
        return list[random];
    }

    public getRelatedPlaces(place: ACFLocation): Observable<RelatedWpObject[]> {
        const tagId = place.acf.mainTag?.term_id || this.random(place.tags);
        // https://locations.phipluspi.com/wp-json/sections/v1/tag/related/112
        const ENPOINT = 'https://locations.phipluspi.com/wp-json/sections/v1/tag/related'
        return this.httpClient.get<RelatedWpObject[]>(`${ENPOINT}/${tagId}`);
    }

    public getInfo() {
        return this.info.asObservable();
    }

    private nextInfo(headers: HttpHeaders, page) {
        this.info.next({
            total: Number(headers.get('X-WP-Total')),
            pages: Number(headers.get('X-WP-TotalPages')),
            page: Number(page)
        });
    }

    // Use this method anywhere
    private fetchInfo() {
        return this.httpClient.head<any>(LOCATION_URL).pipe(
            take(1),
            tap(data => this.nextInfo(data, 1))
        );
    }
}
