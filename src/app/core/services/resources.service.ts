import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toAbsoluteCMSUrl } from '@app/core/editor/utils';
import { Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackgroundImage } from '@app/core/model/preset';

interface ResourceRequest {
    file: File;
    fileName: string;
    tags?: string[];
    alternativeText?: string;
    isPresetImage?: boolean;
}

interface IResourceService {
    uploadResource(resource: ResourceRequest): Observable<InternalResource>;
}

type InternalImageResource = BackgroundImage;
type InternalResource = {
    createdAt: String;
    updatedAt: String;
};
type StrapiResource = BackgroundImage;

@Injectable({
    providedIn: 'root',
})
export class ResourcesService implements IResourceService {
    private static readonly PREST_IMAGE_MARKER = 'static-image';
    private static readonly RESOURCE_ENDPOINT = toAbsoluteCMSUrl('/upload');

    constructor(private httpClient: HttpClient) {}

    public uploadResource({
        file,
        fileName,
        alternativeText,
        tags,
        isPresetImage,
    }: ResourceRequest): Observable<InternalResource> {
        // Add file
        const formData = new FormData();
        formData.append('files', file, fileName);

        // Append to strapi resource caption
        tags = tags ? tags : [];
        if (isPresetImage) {
            tags.push(ResourcesService.PREST_IMAGE_MARKER);
        }

        // Add strapi file info
        const fileInfo = {
            alternativeText,
            caption: (tags || []).join(','),
            name: fileName,
        };
        formData.append('fileInfo', JSON.stringify(fileInfo));

        return this.httpClient
            .post<StrapiResource>(ResourcesService.RESOURCE_ENDPOINT, formData)
            .pipe(take(1), map(this.mapToResourceResponse));
    }

    /**
     * static images can be used in templates
     */
    public getStaticImages(additionalParameter: string = '') {
        const url = `${ResourcesService.RESOURCE_ENDPOINT}/files?_limit=1000&_start=0&_sort=updated_at:DESC&caption=${ResourcesService.PREST_IMAGE_MARKER}${additionalParameter}`;
        return this.httpClient.get<InternalImageResource[]>(url);
    }

    // TODO: map to internal response
    private mapToResourceResponse(strapiResponse: StrapiResource): InternalResource {
        return { createdAt: strapiResponse.created_at, updatedAt: strapiResponse.updated_at };
    }
}
