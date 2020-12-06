import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ContentService} from "../model/content.service";
import {ContentType, Page, Post, WpObject} from "@app/core/model/wpObject";



@Injectable({
    providedIn: 'root'
})
export class WordpressContentService implements ContentService {

    private readonly params = {
        _embed: ''
    };

    constructor(private httpClient: HttpClient) {
    }

    public getPageBy(slug: string, url: string): Observable<WpObject> {
        return this.getBySlug<Page>(slug, ContentType.PAGE, url);
    }

    public getPostBy(slug: string, url: string): Observable<Post> {
        return this.getBySlug<Post>(slug, ContentType.POST, url);
    }

    public getPosts(url: string): Observable<Post[]> {
        return this.httpClient.get<Post[]>(`${url}/${ContentType.POST}`, {params: this.params});
    }

    private getBySlug<T>(slug: string, contentType: ContentType, url: string): Observable<T> {
        return this.httpClient.get<T[]>(
            `${url}/${contentType}`,
            {params: {...this.params, slug: slug}}
        ).pipe(map(data => data[0]));
    }
}
