import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products/products.component';
import { ShowProductsComponent } from './show-products/show-products.component';
import { SearchProductsComponent } from './search-products/search-products.component';
import { AddEditProductsComponent } from './add-edit-products/add-edit-products.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ShowProductsComponent,
    SearchProductsComponent,
    AddEditProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
