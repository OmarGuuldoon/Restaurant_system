import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { application } from 'express';

@Injectable({
  providedIn: 'root'  
})
export class UsersService {
  url = environment.apiUrl;

  constructor(
    private httpClient: HttpClient 
  ) { 
    console.log('HttpClient injected:', httpClient);
  }

  signup(data: any) {
    return this.httpClient.post(
      `${this.url}/auth/signup`, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }
  forgotPassword(data:any) {
    return this.httpClient.post(
      `${this.url}/auth/forgotPassword/`,data, {
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }
  userLogin(data:any) {
    return this.httpClient.post(
      `${this.url}/auth/login/`,data,{
        headers :new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }
  checkToken(){
    return this.httpClient.get(
       `${this.url}/auth/checkToken`
    )
  }

  changePassword(data:any){
    return this.httpClient.post(
      `${this.url}/auth/changePassword`,data, {
        headers : new HttpHeaders().set('Content-Type','application/json')
      }
    )
  }
}
