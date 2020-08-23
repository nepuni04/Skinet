import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit, OnDestroy {
  breadcrumbs: any[];
  bcLength: number;
  subscription: Subscription;

  constructor(private bcService: BreadcrumbService) { }

  ngOnInit(): void {
    this.subscription = this.bcService.breadcrumbs$
      .subscribe(data => {
        this.breadcrumbs = data;
        this.bcLength = data.length;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
