import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AdapterService} from "@app/core/services/adapter.service";
import {ApiAdapter} from "@app/core/model/content.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  baseURLForm = new FormGroup({
    url: new FormControl(''),
  });

  adapter: ApiAdapter | null | false = null;

  constructor(private adapterService: AdapterService) {
  }

  ngOnInit(): void {
    this.baseURLForm.get('url')?.valueChanges.subscribe(() => {
      this.check();
    })
  }

  async check() {
    this.adapter = await this.adapterService.findAdapter(this.baseURLForm.get('url')?.value).catch(() => false);
  }
}
