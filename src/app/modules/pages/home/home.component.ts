import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  baseURLForm = new FormGroup({
    url: new FormControl(''),
  });

  constructor() { }

  ngOnInit(): void {
  }

}