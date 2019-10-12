import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {ACFLocation} from "../model/location";
import {map, tap} from "rxjs/operators";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2/locations';
export const ACF_URL = 'https://locations.phipluspi.com/wp-json/acf/v3/locations';

// https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
const pagination = '?page=2&per_page=1';

export interface Params {
    page: number;
}

export interface Info {
    pages: number;
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private info: BehaviorSubject<Info> = new BehaviorSubject(null);

    constructor(private httpClient: HttpClient) {
    }

    public allLocations(params: any): Observable<ACFLocation[]> {
        return this.httpClient.get<ACFLocation[]>(BASE_URL, {observe: 'response', params: params}).pipe(
            tap(data => this.nextInfo(data.headers)),
            map(data => data.body)
        );
    }

    public allLocationsByGeo(pos: { lat: number, lng: number }): Observable<ACFLocation[]> {
        return this.httpClient.get<ACFLocation[]>(
            `${BASE_URL}?geo_location={"lat":"${pos.lat}","lng":"${pos.lng}","radius":"50"}`
        );
    }

    public getInfo() {
        return this.info.asObservable();
    }

    private nextInfo(headers: HttpHeaders) {
        this.info.next({
            total: Number(headers.get('X-WP-Total')),
            pages: Number(headers.get('X-WP-TotalPages'))
        });
    }

}
