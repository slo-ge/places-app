import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {ACFLocation, ContentType} from "../model/wpObject";
import {map, take, tap} from "rxjs/operators";
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

    cachedPlaces = new Map<string, ACFLocation>();

    constructor(private httpClient: HttpClient) {
    }

    public allLocations(params: any): Observable<ACFLocation[]> {
        params = {...this.paramOptions, ...params};

        return this.httpClient.get<ACFLocation[]>(LOCATION_URL, {observe: 'response', params: params}).pipe(
            tap(data => this.nextInfo(data.headers, params.page)),
            map(data => data.body),
            tap(data => data.forEach(place => this.cachedPlaces.set(place.slug, place))) // add to cachedPlaced Map
        );
    }

    public getPlace(slug: string): Observable<ACFLocation[]> {
        if (this.cachedPlaces.has(slug)) {
            return of([this.cachedPlaces.get(slug)]);
        }
        return this.httpClient.get<ACFLocation[]>(LOCATION_URL, {params: {...this.paramOptions, slug: slug}})
    }

    public getPlaceByIds(ids: number[]) {
        const params = {...this.paramOptions, include: ids.join(',')};
        return this.httpClient.get<ACFLocation[]>(LOCATION_URL, {params});
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
