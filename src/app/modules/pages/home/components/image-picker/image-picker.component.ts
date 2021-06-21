import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {ApiAdapter} from "@app/core/model/content.service";

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent {

  constructor(private router: Router) {
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (_e) => {
        const blob = new Blob(fileInput.target.files, {type: fileInput.target.files[0].type});
        const url = window.URL.createObjectURL(blob);
        this.router.navigate(['editor'], {queryParams: {adapter: ApiAdapter.IMAGE_UPLOAD, blobUrl: url}})
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
}
