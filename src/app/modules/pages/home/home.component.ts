import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AdapterService} from "@app/core/services/adapter.service";
import {ApiAdapter} from "@app/core/model/content.service";

export const PREDEFINED_TEST_URL: { name: string, url: string }[] = [
  {name: 'Any Restaurant', url: 'https://goove.at/detail/pizza-senza-danza'},
  {name: 'A WordPress Blog', url: 'https://www.les-nouveaux-riches.com'},
  {name: 'Techcrunch Blog', url: 'https://techcrunch.com'},
  {name: 'Wired Magazinze Article', url: 'https://www.wired.com/story/job-screening-service-halts-facial-analysis-applicants/'}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  adapterInfoText = {
    [ApiAdapter.WORDPRESS]: 'Select Content from Wordpress',
    [ApiAdapter.METADATA]: 'Found meta data of selected Website'
  };

  baseURLForm = new FormGroup({
    url: new FormControl(''),
  });

  testUrls = PREDEFINED_TEST_URL;
  loading = false;
  adapter: ApiAdapter | null | false = null;
  ApiAdapter = ApiAdapter;

  constructor(private adapterService: AdapterService) {
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

  selectItem(item: { name: string; url: string }) {
    this.baseURLForm.patchValue({url: item.url});
    this.check();
  }
}
