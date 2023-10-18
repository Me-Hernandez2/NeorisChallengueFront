import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {CreateProductInterface} from "../models/createProduct.interface";

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {

  constructor(private http: HttpClient) { }

  createProduct(payload: CreateProductInterface):Observable<CreateProductInterface[]>{
      return this.http.post<CreateProductInterface[]>(environment.apiBase, payload)
  }
}
