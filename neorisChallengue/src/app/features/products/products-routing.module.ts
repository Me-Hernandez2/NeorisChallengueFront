import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductsComponent} from "./products/products.component";
import {AddEditProductsComponent} from "./add-edit-products/add-edit-products.component";

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {path: 'edit/:id', component: AddEditProductsComponent},
  {path: 'create', component: AddEditProductsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
}
