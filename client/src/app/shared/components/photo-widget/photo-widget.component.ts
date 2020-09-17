import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-photo-widget',
  templateUrl: './photo-widget.component.html',
  styleUrls: ['./photo-widget.component.scss']
})
export class PhotoWidgetComponent implements OnInit {
  files: File[] = [];
  croppedImage: any = '';
  @Output() addFile = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  onSelect(event) {
    this.files = [];
    this.files.push(...event.addedFiles);
  }

  onUpload() {
    console.log(base64ToFile(this.croppedImage));
    this.addFile.emit(base64ToFile(this.croppedImage));
  }
}
