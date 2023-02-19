import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiAdapter } from "@app/core/model/content.service";
import { EMPTY, lastValueFrom } from "rxjs";
import { AdapterService } from "@app/core/services/adapters/adapter.service";
import { MetaMapperData } from "@app/modules/pages/editor/models";
import { catchError, finalize } from "rxjs/operators";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { HttpErrorResponse } from '@angular/common/http';

/*
const URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
const UrlValidator = Validators.pattern(URL_REGEXP);
*/

@Component({
    selector: 'app-url-meta-properties-input',
    templateUrl: './url-meta-properties-input.component.html',
    styleUrls: ['./url-meta-properties-input.component.scss']
})
export class UrlMetaPropertiesInputComponent {
    @Output()
    meta = new EventEmitter<MetaMapperData>();

    readonly metaPropertiesInputForm = new FormGroup({
        url: new FormControl<string | undefined>('')
    });
    readonly faSearch = faRotate;

    loading = false;
    error: string | null = null;

    constructor(private adapterService: AdapterService) {
    }

    async onSubmit() {
        this.loading = true;
        this.error = '';

        const adapter = new Map([['adapter', ApiAdapter.METADATA]]);
        const contentService = this.adapterService.getService(adapter);
        const url = this.metaPropertiesInputForm.get('url')?.value;
        if (url) {
            const meta = await lastValueFrom(contentService.getMetaMapperData(url).pipe(
                finalize(() => this.loading = false),
                catchError((err: Error) => {
                    if (err instanceof HttpErrorResponse && err.status === 404) {
                        this.error = 'The given Url does not exists.';
                    } else {
                        this.error = 'There was a problem with the inserted Address.';
                    }
                    return EMPTY;
                })
            ));
            if (meta) {
                this.meta.emit(meta);
            } else {
                console.error('did not work wow why not');
            }
        }
        this.loading = false;
    }
}
