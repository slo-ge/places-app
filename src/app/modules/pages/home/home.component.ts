import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AdapterService} from "@app/core/services/adapter.service";
import {ApiAdapter} from "@app/core/model/content.service";

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
}
