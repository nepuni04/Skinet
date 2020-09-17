import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyMaskModule, CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { PhotoWidgetComponent } from './components/photo-widget/photo-widget.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxDropzoneModule } from 'ngx-dropzone';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  decimal: ".",
  precision: 2,
  prefix: "Rs ",
  suffix: "",
  thousands: ","
};

@NgModule({
  declarations: [
    PagerComponent,
    PagingHeaderComponent,
    OrderTotalsComponent,
    TextInputComponent,
    StepperComponent,
    BasketSummaryComponent,
    PhotoWidgetComponent,
  ],
  imports: [
    CommonModule,
    CdkStepperModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CurrencyMaskModule,
    NgxGalleryModule,
    ImageCropperModule,
    NgxDropzoneModule
  ],
  exports: [
    CommonModule,
    CdkStepperModule,
    PaginationModule,
    CarouselModule,
    BsDropdownModule,
    TabsModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule,
    NgxGalleryModule,
    ImageCropperModule,
    NgxDropzoneModule,

    //Components
    PagerComponent,
    PagingHeaderComponent,
    OrderTotalsComponent,
    TextInputComponent,
    StepperComponent,
    BasketSummaryComponent,
    PhotoWidgetComponent
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ]
})
export class SharedModule { }
