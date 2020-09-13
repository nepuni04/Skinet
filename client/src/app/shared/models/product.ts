export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productType: string;
  productBrand: string;
}

export interface IProductToCreate {
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productTypeId: number;
  productBrandId: number;
}

export class ProductFormValues implements IProductToCreate {
  name = "";
  description = "";
  price = 0;
  pictureUrl = "";
  productTypeId: number;
  productBrandId: number;

  constructor(init?: ProductFormValues) {
    Object.assign(this, init);
  }
}
