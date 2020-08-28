import { Injectable } from '@angular/core';
import { NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) { }

  busy(): void {
    this.busyRequestCount++;
    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      bdColor: 'rgba(255,255,255,0.7)',
      color: '#394daf'
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
