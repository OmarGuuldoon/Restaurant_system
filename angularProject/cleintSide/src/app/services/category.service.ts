import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url =environment.apiUrl;


  constructor(
    private httpClient : HttpClient
  ) { }

  addCategory(data:any){
    return  this.httpClient.post(
      `${this.url}/categories/addCategory`,data,{
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }
  updateCategory(data:any){
    return this.httpClient.patch(
      `${this.url}/categories/updateCategory`,data,{
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }

  getCategories(){
    return this.httpClient.get(
      `${this.url}/categories/categories`
    )
  }

  deleteCategory(id:any){
    return this.httpClient.delete(
      `${this.url}/categories/deleteCategory/${id}`
    )
  }
}
