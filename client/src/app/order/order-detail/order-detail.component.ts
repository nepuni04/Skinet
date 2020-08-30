import { OrderService } from './../order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/models/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;

  constructor(private bcService: BreadcrumbService,
    private orderService: OrderService,
    private route: ActivatedRoute) {
    this.bcService.set("@orderDetail", "");
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id");
    this.orderService.getOrderById(id).subscribe(
      order => {
        this.order = order;
        const title = `Order #${order.id} - ${order.status}`;
        this.bcService.set("@orderDetail", title);
      },
      error => console.log(error)
    );
  }

}
