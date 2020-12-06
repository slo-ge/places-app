import {Component, OnInit} from '@angular/core';
import {WordpressContentService} from "@app/core/services/wordpress-content.service";
import {map} from "rxjs/operators";
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";
import {WpObject} from "@app/core/model/wpObject";
import {EMPTY, Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {decodeHTMLEntities, sanitizeHtml} from "@app/core/utils/html";
import {AdapterService} from "@app/core/services/adapter.service";

const PROXY_URL = 'https://cors-anywhere.herokuapp.com';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  canvas: any;
  setting$: Observable<SimplePreviewCanvasSetting> = EMPTY;

  constructor(private adapterService: AdapterService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.queryParamMap.get('data');
    const contentService = this.adapterService.getService(this.route.snapshot.queryParamMap);
    // TODO: guess data
    this.setting$ = contentService.getPosts().pipe(
      map(items => items.filter(item => String(item.id) == data)[0]),
      map(this.mapWordpressObjectToSimpleSetting)
    );
  }


  mapWordpressObjectToSimpleSetting(wordpressObject: WpObject): SimplePreviewCanvasSetting {
    const imgUrl = wordpressObject._embedded["wp:featuredmedia"]?.[0]?.source_url;
    const proxiedURL = imgUrl ? `${PROXY_URL}/${imgUrl}` : null;
    const description = sanitizeHtml(decodeHTMLEntities(wordpressObject.excerpt.rendered));
    const title = sanitizeHtml(decodeHTMLEntities(wordpressObject.title.rendered));

    return {
      title,
      description,
      image: proxiedURL
    }
  }
}
