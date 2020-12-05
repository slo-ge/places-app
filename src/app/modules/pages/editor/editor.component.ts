import {Component, OnInit} from '@angular/core';
import {WordpressContentService} from "@app/core/services/wordpress-content.service";
import {map} from "rxjs/operators";
import {fabric} from 'fabric';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  canvas: any;

  constructor(private wordpressService: WordpressContentService) {
  }

  ngOnInit(): void {
    this.wordpressService.getPosts().pipe(
      map(items => items.filter(item => item.id = 13260)[0])
    ).subscribe(data => {
      this.canvas = new fabric.Canvas('myCanvas');
      const imgUrl = data._embedded["wp:featuredmedia"][0].source_url;
      const proxiedURL = `${PROXY_URL}/${imgUrl}`;

      fabric.Image.fromURL(proxiedURL, (myImg) => {
        const img1 = myImg.set({left: 0, top: 0}) as any;
        img1.scaleToWidth(this.canvas.width);
        this.canvas.add(img1);
        const text = new fabric.Textbox(
          data.title.rendered,
          {fontSize: 40, top: img1.lineCoords.bl.y + 30, width: this.canvas.width}
        ) as any;

        this.canvas.add(text);
        this.canvas.add(new fabric.Textbox(data.excerpt.rendered, {
          fontSize: 18,
          width: this.canvas.width,
          top: text.lineCoords.bl.y + 30
        }));
      }, {crossOrigin: "*"});
    });
  }

  download() {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL();
    link.click();
  }
}
