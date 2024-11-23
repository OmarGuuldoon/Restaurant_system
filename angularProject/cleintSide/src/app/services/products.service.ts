import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = environment.apiUrl;

  constructor(
    private httpClient : HttpClient
  ) { }

  addProduct(data:any){
    return this.httpClient.post(
      `${this.url}/product/add`,data, {
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }

  updateProduct(data:any){
    return this.httpClient.patch(
      `${this.url}/product/updateProduct`,data, {
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }

  getProduct(){
    return this.httpClient.get(
      `${this.url}/product/get`
    );
  }

  updateProductStatus(data:any){
    return this.httpClient.patch(
      `${this.url}/product/updateStatus`,data, {
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }

  deleteProduct(id:any){
    return this.httpClient.delete(
      `${this.url}/product/delete/${id}`
    )
  }

  getProductById(id:any){
    return this.httpClient.delete(
      `${this.url}/getById/delete/${id}`
    )
  }

  getProductByCategory(id:any){
    return this.httpClient.get(
      `${this.url}/product/category/${id}`
    )
  }
  getById(id:any){
    return this.httpClient.get(
      `${this.url}/product/getById/${id}`
    )
  }



}
