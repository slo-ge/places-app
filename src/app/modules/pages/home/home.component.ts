import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup, UntypedFormControl} from "@angular/forms";
import {AdapterService} from "@app/core/services/adapters/adapter.service";
import {ApiAdapter} from "@app/core/model/content.service";
import {faCheckCircle, faSearch} from "@fortawesome/free-solid-svg-icons";
import {EMPTY, Observable, of} from "rxjs";
import {CmsService, UrlItem} from "@app/core/services/cms.service";
import {catchError, map} from "rxjs/operators";
import {FALLBACK_TEST_URL} from "@app/core/utils/fallback";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  adapterInfoText = {
    [ApiAdapter.WORDPRESS]: 'Found Wordpress Blog, start with selecting a blog post.',
    [ApiAdapter.METADATA]: 'Website meta data available. Start generating beautiful thumbnails.',
    [ApiAdapter.LOREM_IPSUM]: 'Using placeholder infos, because no URL is inserted.',
    [ApiAdapter.STATIC]: 'Static Adapter',
    [ApiAdapter.IMAGE_UPLOAD]: 'Placeholder'
  };

  baseURLForm = new FormGroup({
    url: new UntypedFormControl(''),
    presetId: new UntypedFormControl('')
  });

  testUrls$: Observable<UrlItem[]> = EMPTY;
  loading = false;
  adapter: ApiAdapter | null | false = null;
  ApiAdapter = ApiAdapter;
  faSearch = faSearch;
  faCheckCircle = faCheckCircle;

  constructor(private adapterService: AdapterService, private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.testUrls$ = this.cmsService.getSettings().pipe(
      map(data => data.ExampleUrls),
      catchError(e => {
        console.error(e);
        return of(FALLBACK_TEST_URL);
      })
    )
  }

  @HostListener('document:keydown.enter', ['$event'])
  enterHandler() {
    this.check();
  }

  async check() {
    this.loading = true;
    this.adapter = await this.adapterService.findAdapter(this.baseURLForm.get('url')?.value).catch(() => false);
    this.loading = false;
  }

  selectItem(item: UrlItem) {
    this.baseURLForm.patchValue({url: item.url, presetId: item.presetId});
    this.check();
  }
}
