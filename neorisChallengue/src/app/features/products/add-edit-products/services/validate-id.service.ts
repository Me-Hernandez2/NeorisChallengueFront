import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductsInterface} from "../../show-products/models/showProductsInterface";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ValidateIdService {

  constructor(private http: HttpClient) { }

  validateIdProducts(id:string):Observable<boolean>{
    return this.http.get<boolean>(environment.apiBase+`/verification?id=${id}`)
  }
}
