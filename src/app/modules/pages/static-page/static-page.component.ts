import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CmsService } from "@app/core/services/cms.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';
import { CHANGELOG_MD } from '@app/modules/pages/static-page/changelog.md';

@Component({
    selector: 'app-result-list',
    templateUrl: './static-page.component.html',
    styleUrls: ['./static-page.component.scss']
})
export class StaticPageComponent implements OnInit, AfterViewInit {
    @ViewChild("mdRef")
    mdRef!: ElementRef<HTMLDivElement>;

    imprintText$!: Observable<string>;

    constructor(private cmsService: CmsService, @Inject(DOCUMENT) private document: Document, private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.imprintText$ = this.cmsService.getSettings().pipe(map(value => value.Imprint));

    }

    ngAfterViewInit() {
        const s = this.document.createElement<"script">("script");
        s.type = 'text/javascript';
        s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        const __this = this; //to store the current instance to call
                             //afterScriptAdded function on onload event of
                             //script.
        s.onload = function () {__this.afterScriptAdded(); };
        this.elementRef.nativeElement.appendChild(s);
    }

    afterScriptAdded() {
        // @ts-ignore
        this.mdRef.nativeElement.innerHTML = marked.parse(CHANGELOG_MD)
    }
}

