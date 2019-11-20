import { Component, OnInit } from '@angular/core';
import {PageService} from "../../core/services/page.service";
import {WpObject} from "../../core/model/wpObject";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [':host{padding: 10px; display: block;}']
})
export class HomeComponent implements OnInit {

  constructor(private pageService: PageService) { }

  homePage$: Observable<WpObject>;

  ngOnInit() {
    this.homePage$ = this.pageService.getPageBy('home');
  }

}
