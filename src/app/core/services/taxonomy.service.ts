import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, ReplaySubject} from "rxjs";
import {ACFMeta, Tag} from "../model/tags";
import {filter, map, take, tap} from "rxjs/operators";
import {MetaData} from "@places/core/services/seo.service";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2/tags';
export const META_BASE_URL = 'https://locations.phipluspi.com/wp-json/acf/v3/tags';

@Injectable({
    providedIn: 'root'
})
export class TaxonomyService {
    private _tags$: ReplaySubject<Tag[]> = new ReplaySubject();
    private _tagCache: Tag[] = [];

    constructor(private httpClient: HttpClient) {
        this.fetchTags()
            .pipe(take(1), tap(ts => this._tagCache = ts))
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

    public getTagFromId(id: string): Observable<Tag> {
        return this._tags$.pipe(
            map(tags => tags.find(tag => tag.id === Number(id)))
        );
    }

    public getTagFromString(slug: string): Observable<Tag> {
        return this._tags$.pipe(
            map(tags => tags.find(tag => tag.slug === slug))
        );
    }

    public getTagFromCacheBySlug(slug) {
        return this._tagCache.find(tag => tag.slug === slug)
    }

    public getMetaForTag(id: string | number): Observable<MetaData> {
        return this.httpClient.get<ACFMeta>(`${META_BASE_URL}/${id}`).pipe(
            filter(data => data !== null),
            map(data => ({
                title: data.acf.seoTitle,
                description: data.acf.seoDescription,
                imageUrl: data.acf.seoImage
            }))
        );
    }
}
