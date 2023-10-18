import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateProductInterface} from "../../add-edit-products/models/createProduct.interface";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {ProductsInterface} from "../models/showProductsInterface";

@Injectable({
  providedIn: 'root'
})
export class GetProductsService {

  constructor(private http: HttpClient) { }

  getProducts():Observable<ProductsInterface[]>{
    return this.http.get<ProductsInterface[]>(environment.apiBase)
  }
}
