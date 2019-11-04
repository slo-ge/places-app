import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Tag} from "../model/tags";
import {map, take} from "rxjs/operators";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2/tags';

@Injectable({
    providedIn: 'root'
})
export class TaxonomyService {


    private _tags$: BehaviorSubject<Tag[]> = new BehaviorSubject([]);

    constructor(private httpClient: HttpClient) {
        this.fetchTags()
            .pipe(take(1))
            .subscribe(data => this._tags$.next(data))
    }


    private fetchTags(): Observable<Tag[]> {
        const params: any = {
            per_page: 100
        };

        return this.httpClient.get<Tag[]>(BASE_URL, {params});
    }

    public getTags(): Observable<Tag[]> {
        return this._tags$.asObservable();
    }

    public getNamesFromId(ids: number[]): Observable<Tag[]> {
        return this._tags$.pipe(
            map(data => data.filter(tag => ids.includes(tag.id)))
        );
    }

    public getTagFrom(id: string): Observable<Tag> {
        return this._tags$.pipe(
            map(tags =>{
                return tags.find(tag => tag.id === Number(id));
            } )
        )
    }
}
