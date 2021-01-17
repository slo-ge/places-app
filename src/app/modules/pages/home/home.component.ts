import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AdapterService} from "@app/core/services/adapter.service";
import {ApiAdapter} from "@app/core/model/content.service";

export const PREDEFINED_TEST_URL: { name: string, url: string }[] = [
  {name: 'Any Restaurant', url: 'https://goove.at/detail/pizza-senza-danza'},
  {name: 'A WordPress Blog', url: 'https://www.les-nouveaux-riches.com'},
  {name: 'A Spotify Album', url: 'https://open.spotify.com/album/5jQuMxOb3r5BPmSDke93hy'},
  {name: 'A Spotify Playlist', url: 'https://open.spotify.com/playlist/37i9dQZF1DXcTieYAg7jq1'},
  {name: 'A Pinterest Entry', url: 'https://www.pinterest.at/pin/207376757830118362/'},
  {name: 'Techcrunch Blog', url: 'https://techcrunch.com'},
  {name: 'Wired Magazine Article', url: 'https://www.wired.com/story/job-screening-service-halts-facial-analysis-applicants/'},
  {name: 'Medium  Article', url: 'https://medium.com/the-ascent/my-overly-simple-rules-for-a-good-life-16553b9987fd'},
  {name: 'Booking.com hotel', url: 'https://www.willhaben.at/iad/gebrauchtwagen/d/auto/bmw-x5-437396452'},
  {name: 'Etsy  Product', url: 'https://www.etsy.com/de/listing/241172375/kuschelsack-canicula-fur-hunde?ref=finds_l&external=1'},
  {name: 'Ikea  Product', url: 'https://www.ikea.com/at/de/p/landskrona-3er-sofa-mit-recamiere-gunnared-dunkelgrau-holz-s09272666/'},
  {name: 'Ebay  Product', url: 'https://www.ebay.com/itm/FUJIFILM-Fuji-X70-Black-115/373425780807?epid=16025329757&hash=item56f1e93847:g:KYYAAOSwC55f~U14'},
  {name: 'Willhaben Car', url: 'https://www.willhaben.at/iad/gebrauchtwagen/d/auto/bmw-x5-437396452'},
  {name: 'Deliveroo.co.uk Restaurant', url: 'https://deliveroo.co.uk/menu/london/lambeth/out-fry-hercules-road?day=today&postcode=SW1A2AA&time=ASAP'},
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
