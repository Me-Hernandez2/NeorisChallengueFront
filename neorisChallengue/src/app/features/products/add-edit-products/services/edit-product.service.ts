import { Injectable } from '@angular/core';
import {CreateProductInterface} from "../models/createProduct.interface";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EditProductService {

  constructor(private http: HttpClient) { }

  editProduct(payload: CreateProductInterface):Observable<CreateProductInterface[]>{
    return this.http.put<CreateProductInterface[]>(environment.apiBase, payload)
  }
}
