import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {ACFLocation} from "../model/location";
import {map, tap} from "rxjs/operators";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2/locations';
export const ACF_URL = 'https://locations.phipluspi.com/wp-json/acf/v3/locations';

// https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/

export interface Params {
    page: number;
}

export interface Info {
    pages: number;
    page: number; // current page
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private info: BehaviorSubject<Info> = new BehaviorSubject(null);

    private readonly paramOptions = {
        _embed: '' // this options embeds the media data
    };

    constructor(private httpClient: HttpClient) {
    }

    public allLocations(params: any): Observable<ACFLocation[]> {
        params = {...this.paramOptions, ...params};

        return this.httpClient.get<ACFLocation[]>(BASE_URL, {observe: 'response', params: params}).pipe(
            tap(data => this.nextInfo(data.headers, params.page)),
            map(data => data.body)
        );
    }

    public getPlace(slug: string): Observable<ACFLocation[]>{
        return this.httpClient.get<ACFLocation[]>(BASE_URL, {params: {slug: slug}})
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
}
