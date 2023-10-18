import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductsInterface} from "../models/showProductsInterface";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeleteProductService {

  constructor(private http: HttpClient) { }

  deleteProduct(id:string):Observable<ProductsInterface[]>{
    return this.http.delete<ProductsInterface[]>(environment.apiBase+`?id=${id}`)
  }
}
