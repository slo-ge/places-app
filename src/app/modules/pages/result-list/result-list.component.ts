import {Component, OnInit} from '@angular/core';
import {EMPTY, Observable} from "rxjs";
import {Post} from "@app/core/model/wpObject";
import {ActivatedRoute} from "@angular/router";
import {AdapterService} from "@app/core/services/adapter.service";
import {faPhotoVideo} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {
  posts$: Observable<Post[]> = EMPTY;
  faPhotoVideo = faPhotoVideo;
  constructor(private adapterService: AdapterService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const service = this.adapterService.getService(this.route.snapshot.queryParamMap as any);
    this.posts$ = service.getPosts();
  }
}
