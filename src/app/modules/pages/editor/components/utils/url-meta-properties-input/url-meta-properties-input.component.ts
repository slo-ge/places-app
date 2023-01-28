import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ApiAdapter} from "@app/core/model/content.service";
import {lastValueFrom} from "rxjs";
import {AdapterService} from "@app/core/services/adapters/adapter.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {finalize} from "rxjs/operators";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-url-meta-properties-input',
  templateUrl: './url-meta-properties-input.component.html',
  styleUrls: ['./url-meta-properties-input.component.scss']
})
export class UrlMetaPropertiesInputComponent {
  @Output()
  meta = new EventEmitter<MetaMapperData>();

  readonly metaPropertiesInputForm = new FormGroup({
    url: new FormControl<string | undefined>(''),
  });
  readonly faSearch = faSearch;

  loading = false;

  constructor(private adapterService: AdapterService) {
  }

  async onSubmit() {
    this.loading = true;
    const adapter = new Map([['adapter', ApiAdapter.METADATA]]);
    const contentService = this.adapterService.getService(adapter);
    const url = this.metaPropertiesInputForm.get('url')?.value;
    if (url) {
      const meta = await lastValueFrom(contentService.getMetaMapperData(url).pipe(finalize(() => this.loading = false)));
      if (meta) {
        this.meta.emit(meta);
      } else {
        console.error('did not work wow why not');
      }
    }
    this.loading = false;
  }
}
